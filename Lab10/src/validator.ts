// ===== ТИПИ ТА ІНТЕРФЕЙСИ =====

// Інтерфейс даних форми реєстрації
export interface RegisterFormData {
  fullname: string;
  email: string;
  password: string;
  about: string;
  gender: 'male' | 'female';
  country: string;
  birthdate: string;
  consent: boolean; // Додаткове поле (персоналізація)
}

// Інтерфейс даних форми авторизації
export interface LoginFormData {
  username: string;
  password: string;
  remember: boolean;
  subscribe: 'yes' | 'no';
}

// Інтерфейс збережених даних користувача в LocalStorage
export interface StoredUserData extends RegisterFormData {
  registeredAt: string;
}

// Інтерфейс поточної сесії
export interface CurrentSession extends StoredUserData {
  remember: boolean;
  subscribe: 'yes' | 'no';
  loginAt: string;
}

// Union-тип для результату валідації
export type ValidationResult = 'valid' | 'invalid';

// Union-тип для дозволених email доменів
export type AllowedEmailDomain = 'gmail.com' | 'ukr.net' | 'i.ua' | 'outlook.com';

// Union-тип для вікових категорій
export type AgeCategory = 'teen' | 'adult' | 'senior';

// Union-тип для типу повідомлення про помилку
export type ErrorMessageType = {
  field: string;
  message: string;
};

// ===== КЛАСИ ПОМИЛОК =====

export class ValidationException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationException';
  }
}

// export class InvalidFieldError extends ValidationException {
//   constructor(field: string, reason: string) {
//     super(`Invalid field "${field}": ${reason}`);
//     this.name = 'InvalidFieldError';
//   }
// }

// ===== ФУНКЦІЇ ВАЛІДАЦІЇ ОКРЕМИХ ПОЛІВ =====

/**
 * Валідує ім'я користувача
 * Правила:
 * - Мінімум 2 символи
 * - Тільки літери (латиниця або кирилиця) та пробіли
 * - Має починатися з великої літери (персоналізація)
 */
export function validateName(name: string): boolean {
  if (typeof name !== 'string') {
    return false;
  }

  const trimmedName = name.trim();

  // Перевірка мінімальної довжини
  if (trimmedName.length < 2) {
    return false;
  }

  // Перевірка на літери (кирилиця та латиниця) та пробіли
  const namePattern = /^[А-ЯA-ZІЇЄҐа-яa-zіїєґ\s]+$/;
  if (!namePattern.test(trimmedName)) {
    return false;
  }

  // Персоналізація: перевірка, що ім'я починається з великої літери
  const firstChar = trimmedName.charAt(0);
  if (firstChar !== firstChar.toUpperCase()) {
    return false;
  }

  return true;
}

/**
 * Валідує вік користувача
 * Правила:
 * - Число від 1 до 120
 */
export function validateAge(age: number): boolean {
  if (typeof age !== 'number' || !Number.isFinite(age)) {
    return false;
  }

  return age >= 1 && age <= 125;
}

/**
 * Валідує email адресу
 * Правила:
 * - Має містити символ @
 * - Після @ повинна бути крапка
 * - Email дозволений тільки з доменів gmail.com, ukr.net, i.ua, outlook.com (персоналізація)
 */
export function validateEmail(email: string): boolean {
  if (typeof email !== 'string') {
    return false;
  }

  const trimmedEmail = email.trim().toLowerCase();

  // Базова перевірка на наявність @ та крапки після @
  if (!trimmedEmail.includes('@')) {
    return false;
  }

  const atIndex = trimmedEmail.indexOf('@');
  const domainPart = trimmedEmail.substring(atIndex + 1);

  if (!domainPart.includes('.')) {
    return false;
  }

  // Персоналізація: перевірка дозволених доменів
  const allowedDomains: AllowedEmailDomain[] = [
    'gmail.com',
    'ukr.net',
    'i.ua',
    'outlook.com'
  ];

  return allowedDomains.some(domain => trimmedEmail.endsWith(domain));
}

/**
 * Валідує пароль
 * Правила:
 * - Мінімум 6 символів
 * - Має містити хоча б одну цифру (персоналізація)
 */
export function validatePassword(password: string): boolean {
  if (typeof password !== 'string') {
    return false;
  }

  if (password.length < 6) {
    return false;
  }

  // Персоналізація: перевірка наявності цифри
  const hasDigit = /\d/.test(password);
  return hasDigit;
}

/**
 * Валідує логін (username)
 * Правила:
 * - Мінімум 3 символи
 * - Тільки латинські літери, цифри та підкреслення
 */
export function validateUsername(username: string): boolean {
  if (typeof username !== 'string') {
    return false;
  }

  const trimmedUsername = username.trim();

  if (trimmedUsername.length < 3) {
    return false;
  }

  // Тільки латиниця, цифри та підкреслення
  const usernamePattern = /^[a-zA-Z0-9_]+$/;
  return usernamePattern.test(trimmedUsername);
}

/**
 * Валідує дату народження та повертає вікову категорію
 * Правила:
 * - Мінімум 14 років
 * - Категорії: teen (14-17), adult (18-59), senior (60+)
 */
export function validateBirthdate(birthdate: string): boolean {
  if (typeof birthdate !== 'string' || !birthdate) {
    return false;
  }

  const birthDate = new Date(birthdate);
  const today = new Date();

  // Перевірка на коректність дати
  if (isNaN(birthDate.getTime())) {
    return false;
  }

  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  return age >= 14;
}

/**
 * Визначає вікову категорію на основі віку
 */
export function getAgeCategory(age: number): AgeCategory {
  if (age < 18) return 'teen';
  if (age < 60) return 'adult';
  return 'senior';
}

/**
 * Валідує згоду користувача (consent checkbox)
 */
export function validateConsent(consent: boolean): boolean {
  return consent === true;
}

// ===== ФУНКЦІЇ ФОРМАТУВАННЯ ДАНИХ =====

/**
 * Форматує ім'я до Title Case (кожне слово з великої літери)
 */
export function formatName(name: string): string {
  if (typeof name !== 'string') {
    return name;
  }

  return name
    .trim()
    .split(/\s+/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

/**
 * Форматує email (знижує регістр та обрізає пробіли)
 */
export function formatEmail(email: string): string {
  if (typeof email !== 'string') {
    return email;
  }

  return email.trim().toLowerCase();
}

/**
 * Обрізає пробіли з рядка
 */
export function trimString(value: string): string {
  if (typeof value !== 'string') {
    throw new ValidationException('Value must be a string');
  }

  return value.trim();
}

// ===== ФУНКЦІЇ ДЕТАЛЬНОЇ ВАЛІДАЦІЇ З ПОВІДОМЛЕННЯМИ =====

/**
 * Валідує ім'я з детальним повідомленням про помилку
 */
export function validateNameWithMessage(name: string): ErrorMessageType | null {
  const trimmedName = name.trim();

  if (!trimmedName) {
    return { field: 'fullname', message: "Ім'я не може бути порожнім" };
  }

  if (trimmedName.length < 2) {
    return { field: 'fullname', message: "Ім'я має містити мінімум 2 літери" };
  }

  const namePattern = /^[А-ЯA-ZІЇЄҐа-яa-zіїєґ\s]+$/;
  if (!namePattern.test(trimmedName)) {
    return { field: 'fullname', message: "Ім'я має містити тільки літери" };
  }

  const firstChar = trimmedName.charAt(0);
  if (firstChar !== firstChar.toUpperCase()) {
    return { field: 'fullname', message: "Ім'я має починатися з великої літери" };
  }

  return null;
}

/**
 * Валідує email з детальним повідомленням про помилку
 */
export function validateEmailWithMessage(email: string): ErrorMessageType | null {
  const trimmedEmail = email.trim();

  if (!trimmedEmail) {
    return { field: 'email', message: "Email не може бути порожнім" };
  }

  if (!trimmedEmail.includes('@')) {
    return { field: 'email', message: "Email має містити символ @" };
  }

  const atIndex = trimmedEmail.indexOf('@');
  const domainPart = trimmedEmail.substring(atIndex + 1);

  if (!domainPart.includes('.')) {
    return { field: 'email', message: "Email має містити крапку після @" };
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(trimmedEmail)) {
    return { field: 'email', message: "Введіть коректний Email" };
  }

  const allowedDomains: AllowedEmailDomain[] = ['gmail.com', 'ukr.net', 'i.ua', 'outlook.com'];
  const isAllowedDomain = allowedDomains.some(domain => trimmedEmail.toLowerCase().endsWith(domain));

  if (!isAllowedDomain) {
    return { field: 'email', message: "Email дозволений тільки з доменів: gmail.com, ukr.net, i.ua, outlook.com" };
  }

  return null;
}

/**
 * Валідує пароль з детальним повідомленням про помилку
 */
export function validatePasswordWithMessage(password: string): ErrorMessageType | null {
  if (!password) {
    return { field: 'password', message: "Пароль не може бути порожнім" };
  }

  if (password.length < 6) {
    return { field: 'password', message: "Пароль має містити мінімум 6 символів" };
  }

    if (/\d/.test(password) === false) {
    return { field: 'password', message: "Пароль має містити мінімум одну цифру" };
  }


  return null;
}

/**
 * Валідує username з детальним повідомленням про помилку
 */
export function validateUsernameWithMessage(username: string): ErrorMessageType | null {
  const trimmedUsername = username.trim();

  if (!trimmedUsername) {
    return { field: 'username', message: "Логін не може бути порожнім" };
  }

  if (trimmedUsername.length < 3) {
    return { field: 'username', message: "Логін має містити мінімум 3 символи" };
  }

  const usernamePattern = /^[a-zA-Z0-9_]+$/;
  if (!usernamePattern.test(trimmedUsername)) {
    return { field: 'username', message: "Логін має містити тільки латинські літери, цифри та підкреслення" };
  }

  return null;
}

/**
 * Валідує дату народження з детальним повідомленням про помилку
 */
export function validateBirthdateWithMessage(birthdate: string): ErrorMessageType | null {
  if (!birthdate || birthdate.trim() === '') {
    return { field: 'birthdate', message: "Оберіть дату народження" };
  }

  const birthDate = new Date(birthdate);
  const today = new Date();

  if (isNaN(birthDate.getTime())) {
    return { field: 'birthdate', message: "Некоректна дата народження" };
  }

  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  if (age < 14) {
    return { field: 'birthdate', message: "Вам має бути мінімум 14 років" };
  }

  return null;
}


// ===== ОСНОВНА ФУНКЦІЯ ВАЛІДАЦІЇ ФОРМИ РЕЄСТРАЦІЇ =====

/**
 * Валідує всю форму реєстрації та повертає масив помилок
 * Якщо помилок немає - повертає порожній масив
 */
export function validateRegisterForm(data: RegisterFormData): ErrorMessageType[] {
  const errors: ErrorMessageType[] = [];

  const nameError = validateNameWithMessage(data.fullname);
  if (nameError) errors.push(nameError);

  const emailError = validateEmailWithMessage(data.email);
  if (emailError) errors.push(emailError);

  const passwordError = validatePasswordWithMessage(data.password);
  if (passwordError) errors.push(passwordError);

  const birthdateError = validateBirthdateWithMessage(data.birthdate);
  if (birthdateError) errors.push(birthdateError);

  return errors;
}

// ===== ОСНОВНА ФУНКЦІЯ ВАЛІДАЦІЇ ФОРМИ АВТОРИЗАЦІЇ =====

/**
 * Валідує форму авторизації та повертає масив помилок
 */
export function validateLoginForm(data: LoginFormData): ErrorMessageType[] {
  const errors: ErrorMessageType[] = [];

  const usernameError = validateUsernameWithMessage(data.username);
  if (usernameError) errors.push(usernameError);

  const passwordError = validatePasswordWithMessage(data.password);
  if (passwordError) errors.push(passwordError);

  return errors;
}

// ===== ФУНКЦІЯ ВАЛІДАЦІЇ ОКРЕМОГО ПОЛЯ (з union-типом) =====

export type FieldName = 
  | 'fullname' 
  | 'email' 
  | 'password' 
  | 'username' 
  | 'birthdate' 
  | 'consent';

export type FieldValue = string | number | boolean;

/**
 * Валідує окреме поле форми
 * Повертає ValidationResult ('valid' або 'invalid')
 */
export function validateField(
  fieldName: FieldName, 
  value: FieldValue
): ValidationResult {
  try {
    switch (fieldName) {
      case 'fullname':
        return validateName(String(value)) ? 'valid' : 'invalid';
      
      case 'email':
        return validateEmail(String(value)) ? 'valid' : 'invalid';
      
      case 'password':
        return validatePassword(String(value)) ? 'valid' : 'invalid';
      
      case 'username':
        return validateUsername(String(value)) ? 'valid' : 'invalid';
      
      case 'birthdate':
        return validateBirthdate(String(value)) ? 'valid' : 'invalid';
      
      case 'consent':
        return validateConsent(Boolean(value)) ? 'valid' : 'invalid';
      
      default:
        // Exhaustive check
        const _exhaustive: never = fieldName;
        throw new ValidationException(_exhaustive);
    }
  } catch (error) {
    if (error instanceof ValidationException) {
      return 'invalid';
    }
    throw error;
  }
}

// ===== РОБОТА З LOCALSTORAGE =====

export function saveToLocalStorage(key: string, data: StoredUserData | CurrentSession): boolean {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error('Помилка збереження в LocalStorage:', error);
    return false;
  }
}

export function loadFromLocalStorage<T>(key: string): T | null {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Помилка читання з LocalStorage:', error);
    return null;
  }
}

export function clearLocalStorage(key: string): boolean {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error('Помилка очищення LocalStorage:', error);
    return false;
  }
}


// ===== ЕКСПОРТ ЗА ЗАМОВЧУВАННЯМ =====

export default {
  validateName,
  validateAge,
  validateEmail,
  validatePassword,
  validateUsername,
  validateBirthdate,
  validateConsent,
  validateRegisterForm,
  validateLoginForm,
  validateField,
  formatName,
  formatEmail,
  trimString,
  getAgeCategory
};