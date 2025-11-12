// ===== ДЕМОНСТРАЦІЯ РОБОТИ ВАЛІДАТОРА =====

import {
  RegisterFormData,
  LoginFormData,
  validateName,
  validateAge,
  validateEmail,
  validatePassword,
  validateUsername,
  validateBirthdate,
  validateRegisterForm,
  validateLoginForm,
  validateField,
  formatName,
  formatEmail,
  getAgeCategory,
  ValidationResult,
  FieldName
} from './validator.js';

console.log('='.repeat(60));
console.log('ДЕМОНСТРАЦІЯ МОДУЛЯ ВАЛІДАЦІЇ ФОРМ (TypeScript)');
console.log('='.repeat(60));

// ===== 1. ТЕСТУВАННЯ ОКРЕМИХ ВАЛІДАТОРІВ =====

console.log('\n📋 1. ТЕСТУВАННЯ ОКРЕМИХ ВАЛІДАТОРІВ\n');

// Валідація імені
console.log('--- validateName ---');
console.log('validateName("Іван Петренко"):', validateName('Іван Петренко')); // true
console.log('validateName("john"):', validateName('john')); // false (не з великої)
console.log('validateName("А"):', validateName('А')); // false (менше 2 символів)
console.log('validateName("John123"):', validateName('John123')); // false (цифри)

// Валідація віку
console.log('\n--- validateAge ---');
console.log('validateAge(25):', validateAge(25)); // true
console.log('validateAge(0):', validateAge(0)); // false
console.log('validateAge(150):', validateAge(150)); // false
console.log('validateAge(120):', validateAge(120)); // true

// Валідація email
console.log('\n--- validateEmail ---');
console.log('validateEmail("user@gmail.com"):', validateEmail('user@gmail.com')); // true
console.log('validateEmail("user@ukr.net"):', validateEmail('user@ukr.net')); // true
console.log('validateEmail("user@yahoo.com"):', validateEmail('user@yahoo.com')); // false (не дозволений домен)
console.log('validateEmail("usergmail.com"):', validateEmail('usergmail.com')); // false (немає @)
console.log('validateEmail("user@gmail"):', validateEmail('user@gmail')); // false (немає крапки після @)

// Валідація пароля
console.log('\n--- validatePassword ---');
console.log('validatePassword("pass123"):', validatePassword('pass123')); // true
console.log('validatePassword("pass"):', validatePassword('pass')); // false (немає цифри)
console.log('validatePassword("12345"):', validatePassword('12345')); // false (менше 6)
console.log('validatePassword("Password1"):', validatePassword('Password1')); // true

// Валідація username
console.log('\n--- validateUsername ---');
console.log('validateUsername("john_doe"):', validateUsername('john_doe')); // true
console.log('validateUsername("ab"):', validateUsername('ab')); // false (менше 3)
console.log('validateUsername("user-name"):', validateUsername('user-name')); // false (дефіс не дозволено)
console.log('validateUsername("user123"):', validateUsername('user123')); // true

// Валідація дати народження
console.log('\n--- validateBirthdate ---');
const today = new Date();
const validDate = new Date(today.getFullYear() - 20, today.getMonth(), today.getDate());
const invalidDate = new Date(today.getFullYear() - 10, today.getMonth(), today.getDate());

console.log('validateBirthdate("2000-01-01"):', validateBirthdate('2000-01-01')); // true
console.log('validateBirthdate(20 років тому):', validateBirthdate(validDate.toISOString().split('T')[0])); // true
console.log('validateBirthdate(10 років тому):', validateBirthdate(invalidDate.toISOString().split('T')[0])); // false

// ===== 2. ФУНКЦІЇ ФОРМАТУВАННЯ =====

console.log('\n📋 2. ФУНКЦІЇ ФОРМАТУВАННЯ\n');

console.log('formatName("іван петренко"):', formatName('іван петренко')); // "Іван Петренко"
console.log('formatName("JOHN DOE"):', formatName('JOHN DOE')); // "John Doe"
console.log('formatEmail("  User@Gmail.COM  "):', formatEmail('  User@Gmail.COM  ')); // "user@gmail.com"

// ===== 3. ВІКОВІ КАТЕГОРІЇ =====

console.log('\n📋 3. ВІКОВІ КАТЕГОРІЇ\n');

console.log('getAgeCategory(8):', getAgeCategory(8)); // "child"
console.log('getAgeCategory(15):', getAgeCategory(15)); // "teen"
console.log('getAgeCategory(30):', getAgeCategory(30)); // "adult"
console.log('getAgeCategory(65):', getAgeCategory(65)); // "senior"

// ===== 4. ВАЛІДАЦІЯ ОКРЕМОГО ПОЛЯ (union-тип) =====

console.log('\n📋 4. ФУНКЦІЯ validateField З UNION-ТИПОМ\n');

const fieldTests: Array<{ field: FieldName; value: string | number | boolean }> = [
  { field: 'fullname', value: 'Іван Петренко' },
  { field: 'fullname', value: 'ivan' },
  { field: 'email', value: 'user@gmail.com' },
  { field: 'email', value: 'user@yahoo.com' },
  { field: 'password', value: 'pass123' },
  { field: 'password', value: 'short' },
  { field: 'username', value: 'john_doe' },
  { field: 'username', value: 'ab' },
  { field: 'consent', value: true },
  { field: 'consent', value: false }
];

fieldTests.forEach(test => {
  const result: ValidationResult = validateField(test.field, test.value);
  console.log(`validateField("${test.field}", "${test.value}"):`, result);
});

// ===== 5. ВАЛІДАЦІЯ ПОВНОЇ ФОРМИ РЕЄСТРАЦІЇ =====

console.log('\n📋 5. ВАЛІДАЦІЯ ФОРМИ РЕЄСТРАЦІЇ\n');

const validRegisterData: RegisterFormData = {
  fullname: 'Іван Петренко',
  email: 'ivan@gmail.com',
  password: 'secure123',
  about: 'Цікавлюсь програмуванням',
  gender: 'male',
  country: 'ua',
  birthdate: '2000-05-15',
  consent: true
};

const invalidRegisterData: RegisterFormData = {
  fullname: 'ivan', // Не з великої літери
  email: 'ivan@yahoo.com', // Недозволений домен
  password: 'short', // Менше 6 символів
  about: '',
  gender: 'male',
  country: 'ua',
  birthdate: '2015-01-01', // Менше 14 років
  consent: false
};

console.log('--- Валідна форма ---');
const validErrors = validateRegisterForm(validRegisterData);
console.log('Помилки:', validErrors.length === 0 ? 'Немає помилок ✅' : validErrors);

console.log('\n--- Невалідна форма ---');
const invalidErrors = validateRegisterForm(invalidRegisterData);
console.log('Помилки:');
invalidErrors.forEach((error, index) => {
  console.log(`  ${index + 1}. ${error}`);
});

// ===== 6. ВАЛІДАЦІЯ ФОРМИ АВТОРИЗАЦІЇ =====

console.log('\n📋 6. ВАЛІДАЦІЯ ФОРМИ АВТОРИЗАЦІЇ\n');

const validLoginData: LoginFormData = {
  username: 'john_doe',
  password: 'pass123',
  remember: true,
  subscribe: 'yes'
};

const invalidLoginData: LoginFormData = {
  username: 'ab', // Менше 3 символів
  password: 'short', // Менше 6 символів та немає цифри
  remember: false,
  subscribe: 'no'
};

console.log('--- Валідна форма ---');
const validLoginErrors = validateLoginForm(validLoginData);
console.log('Помилки:', validLoginErrors.length === 0 ? 'Немає помилок ✅' : validLoginErrors);

console.log('\n--- Невалідна форма ---');
const invalidLoginErrors = validateLoginForm(invalidLoginData);
console.log('Помилки:');
invalidLoginErrors.forEach((error, index) => {
  console.log(`  ${index + 1}. ${error}`);
});

// ===== 7. ДЕМОНСТРАЦІЯ ОБРОБКИ ПОМИЛОК =====

console.log('\n📋 7. ОБРОБКА ПОМИЛОК\n');

try {
  // @ts-expect-error - тестуємо runtime помилку
  validateName(123);
} catch (error) {
  console.log('Спіймана помилка (validateName з числом):', (error as Error).message);
}

try {
  // @ts-expect-error - тестуємо runtime помилку
  validateEmail(['not', 'a', 'string']);
} catch (error) {
  console.log('Спіймана помилка (validateEmail з масивом):', (error as Error).message);
}

// ===== 8. ПРИКЛАД РЕАЛЬНОГО ВИКОРИСТАННЯ =====

console.log('\n📋 8. ПРИКЛАД РЕАЛЬНОГО ВИКОРИСТАННЯ\n');

function processRegistration(rawData: any): void {
  console.log('Отримано сирі дані:', rawData);

  // Форматуємо дані
  const formattedData: RegisterFormData = {
    fullname: formatName(rawData.fullname),
    email: formatEmail(rawData.email),
    password: rawData.password,
    about: rawData.about.trim(),
    gender: rawData.gender,
    country: rawData.country,
    birthdate: rawData.birthdate,
    consent: Boolean(rawData.consent)
  };

  console.log('Відформатовані дані:', formattedData);

  // Валідуємо
  const errors = validateRegisterForm(formattedData);

  if (errors.length === 0) {
    console.log('✅ Реєстрація успішна!');
    console.log('Користувача можна зберегти в базі даних');
  } else {
    console.log('❌ Помилки валідації:');
    errors.forEach((error, index) => {
      console.log(`  ${index + 1}. ${error}`);
    });
  }
}

const userData = {
  fullname: '  марія іваненко  ',
  email: '  Maria@GMAIL.COM  ',
  password: 'secure789',
  about: 'Студентка  ',
  gender: 'female',
  country: 'ua',
  birthdate: '2005-03-20',
  consent: true
};

processRegistration(userData);

console.log('\n' + '='.repeat(60));
console.log('ДЕМОНСТРАЦІЮ ЗАВЕРШЕНО');
console.log('='.repeat(60));