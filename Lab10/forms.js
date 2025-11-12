// ===== ВАЛІДАЦІЯ ФОРМ З LOCALSTORAGE =====

// Перевірка, на якій сторінці ми знаходимося
const isLoginPage = document.querySelector('body').innerHTML.includes('Форма авторизації');
const isRegisterPage = document.querySelector('body').innerHTML.includes('Форма реєстрації');

// Отримання елементів форми
const form = document.querySelector('form');

// ===== ФУНКЦІЇ ВАЛІДАЦІЇ =====

// Валідація імені (мінімум 2 символи, тільки літери та пробіли)
function validateName(input) {
  const value = input.value.trim();
  const namePattern = /^[А-Яа-яA-Za-zіІїЇєЄґҐ\s]{2,}$/;
  
  if (!value) {
    showError(input, "Ім'я не може бути порожнім");
    return false;
  } else if (!namePattern.test(value)) {
    showError(input, "Ім'я має містити мінімум 2 літери");
    return false;
  } else {
    showSuccess(input);
    return true;
  }
}

// Валідація email
function validateEmail(input) {
  const value = input.value.trim();
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!value) {
    showError(input, "Email не може бути порожнім");
    return false;
  } else if (!emailPattern.test(value)) {
    showError(input, "Введіть коректний Email");
    return false;
  } else {
    showSuccess(input);
    return true;
  }
}

// Валідація пароля (мінімум 6 символів)
function validatePassword(input) {
  const value = input.value;
  
  if (!value) {
    showError(input, "Пароль не може бути порожнім");
    return false;
  } else if (value.length < 6) {
    showError(input, "Пароль має містити мінімум 6 символів");
    return false;
  } else {
    showSuccess(input);
    return true;
  }
}

// Валідація логіна (мінімум 3 символи)
function validateUsername(input) {
  const value = input.value.trim();
  
  if (!value) {
    showError(input, "Логін не може бути порожнім");
    return false;
  } else if (value.length < 3) {
    showError(input, "Логін має містити мінімум 3 символи");
    return false;
  } else {
    showSuccess(input);
    return true;
  }
}

// Валідація дати народження (має бути більше 14 років)
function validateBirthdate(input) {
  const value = input.value;
  
  if (!value) {
    showError(input, "Оберіть дату народження");
    return false;
  }
  
  const birthDate = new Date(value);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  if (age < 14) {
    showError(input, "Вам має бути мінімум 14 років");
    return false;
  } else {
    showSuccess(input);
    return true;
  }
}

// ===== ВІДОБРАЖЕННЯ ПОМИЛОК ТА УСПІХУ =====

function showError(input, message) {
  // Видаляємо попередні класи
  input.classList.remove('valid');
  input.classList.add('invalid');
  
  // Встановлюємо CustomValidity для вбудованих повідомлень браузера
  input.setCustomValidity(message);
  
  // Шукаємо або створюємо елемент для помилки
  let errorDiv = input.parentElement.querySelector('.error-message');
  if (!errorDiv) {
    errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.setAttribute('aria-live', 'polite');
    errorDiv.style.color = '#ef4444';
    errorDiv.style.fontSize = '0.85rem';
    errorDiv.style.marginTop = '0.3rem';
    input.parentElement.appendChild(errorDiv);
  }
  
  errorDiv.textContent = message;
  errorDiv.style.display = 'block';
  
  // Зв'язуємо помилку з полем для доступності
  if (!input.hasAttribute('aria-describedby')) {
    errorDiv.id = `error-${input.id}`;
    input.setAttribute('aria-describedby', errorDiv.id);
  }
}

function showSuccess(input) {
  input.classList.remove('invalid');
  input.classList.add('valid');
  input.setCustomValidity('');
  
  // Ховаємо повідомлення про помилку
  const errorDiv = input.parentElement.querySelector('.error-message');
  if (errorDiv) {
    errorDiv.style.display = 'none';
  }
}

function clearErrors() {
  const inputs = form.querySelectorAll('input, textarea, select');
  inputs.forEach(input => {
    input.classList.remove('invalid', 'valid');
    input.setCustomValidity('');
    const errorDiv = input.parentElement.querySelector('.error-message');
    if (errorDiv) {
      errorDiv.style.display = 'none';
    }
  });
}

// ===== ВАЛІДАЦІЯ В РЕАЛЬНОМУ ЧАСІ =====

function setupRealtimeValidation() {
  // Для полів введення тексту
  const fullnameInput = document.getElementById('fullname');
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const usernameInput = document.getElementById('username');
  const birthdateInput = document.getElementById('birthdate');
  
  // Валідація при введенні (input event)
  if (fullnameInput) {
    fullnameInput.addEventListener('input', () => validateName(fullnameInput));
    fullnameInput.addEventListener('blur', () => validateName(fullnameInput));
  }
  
  if (emailInput) {
    emailInput.addEventListener('input', () => validateEmail(emailInput));
    emailInput.addEventListener('blur', () => validateEmail(emailInput));
  }
  
  if (passwordInput) {
    passwordInput.addEventListener('input', () => validatePassword(passwordInput));
    passwordInput.addEventListener('blur', () => validatePassword(passwordInput));
  }
  
  if (usernameInput) {
    usernameInput.addEventListener('input', () => validateUsername(usernameInput));
    usernameInput.addEventListener('blur', () => validateUsername(usernameInput));
  }
  
  if (birthdateInput) {
    birthdateInput.addEventListener('change', () => validateBirthdate(birthdateInput));
  }
}

// ===== РОБОТА З LOCALSTORAGE =====

function saveToLocalStorage(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error('Помилка збереження в LocalStorage:', error);
    return false;
  }
}

function loadFromLocalStorage(key) {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Помилка читання з LocalStorage:', error);
    return null;
  }
}

function clearLocalStorage(key) {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error('Помилка очищення LocalStorage:', error);
    return false;
  }
}

// ===== ОБРОБКА РЕЄСТРАЦІЇ =====

function handleRegistration(event) {
  event.preventDefault();
  clearErrors();
  
  const fullnameInput = document.getElementById('fullname');
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const aboutInput = document.getElementById('about');
  const genderInputs = document.getElementsByName('gender');
  const countryInput = document.getElementById('country');
  const birthdateInput = document.getElementById('birthdate');
  
  // Валідація всіх полів
  const isNameValid = validateName(fullnameInput);
  const isEmailValid = validateEmail(emailInput);
  const isPasswordValid = validatePassword(passwordInput);
  const isBirthdateValid = birthdateInput.value ? validateBirthdate(birthdateInput) : true;
  
  if (isNameValid && isEmailValid && isPasswordValid && isBirthdateValid) {
    // Збираємо дані форми
    let selectedGender = 'male';
    for (const radio of genderInputs) {
      if (radio.checked) {
        selectedGender = radio.value;
        break;
      }
    }
    
    const userData = {
      fullname: fullnameInput.value.trim(),
      email: emailInput.value.trim(),
      password: passwordInput.value, // В реальному проекті треба хешувати паролі
      about: aboutInput.value.trim(),
      gender: selectedGender,
      country: countryInput.value,
      birthdate: birthdateInput.value,
      registeredAt: new Date().toISOString()
    };
    
    // Зберігаємо в LocalStorage
    if (saveToLocalStorage('registeredUser', userData)) {
      // Показуємо блок привітання
      showWelcomeBlock(userData, 'registration');
    } else {
      alert('Помилка збереження даних. Спробуйте ще раз.');
    }
  } else {
    // Фокусуємося на першому невалідному полі
    const firstInvalid = form.querySelector('.invalid');
    if (firstInvalid) {
      firstInvalid.focus();
    }
  }
}

// ===== ОБРОБКА АВТОРИЗАЦІЇ =====

function handleLogin(event) {
  event.preventDefault();
  clearErrors();
  
  const usernameInput = document.getElementById('username');
  const passwordInput = document.getElementById('password');
  const rememberCheckbox = document.querySelector('input[name="remember"]');
  const subscribeRadios = document.getElementsByName('subscribe');
  
  // Валідація полів
  const isUsernameValid = validateUsername(usernameInput);
  const isPasswordValid = validatePassword(passwordInput);
  
  if (isUsernameValid && isPasswordValid) {
    // ПЕРЕВІРКА ДАНИХ З LOCALSTORAGE
    const registeredUser = loadFromLocalStorage('registeredUser');
    
    if (!registeredUser) {
      // Немає зареєстрованих користувачів
      showError(usernameInput, 'Користувача не знайдено. Спочатку зареєструйтесь!');
      setTimeout(() => {
        if (confirm('Користувача не знайдено. Перейти до реєстрації?')) {
          window.location.href = 'register.html';
        }
      }, 500);
      return;
    }
    
    // Перевірка логіна (можна використати email або fullname)
    const enteredUsername = usernameInput.value.trim().toLowerCase();
    const enteredPassword = passwordInput.value;
    
    const isUsernameMatch = 
      registeredUser.email.toLowerCase() === enteredUsername ||
      registeredUser.fullname.toLowerCase() === enteredUsername;
    
    const isPasswordMatch = registeredUser.password === enteredPassword;
    
    if (!isUsernameMatch) {
      showError(usernameInput, 'Невірний логін або email');
      return;
    }
    
    if (!isPasswordMatch) {
      showError(passwordInput, 'Невірний пароль');
      return;
    }
    
    // Якщо все вірно - авторизація успішна
    let selectedSubscribe = 'yes';
    for (const radio of subscribeRadios) {
      if (radio.checked) {
        selectedSubscribe = radio.value;
        break;
      }
    }
    
    const loginData = {
      ...registeredUser, // Беремо всі дані користувача
      remember: rememberCheckbox.checked,
      subscribe: selectedSubscribe,
      loginAt: new Date().toISOString()
    };
    
    // Зберігаємо факт входу
    if (saveToLocalStorage('currentUser', loginData)) {
      showWelcomeBlock(loginData, 'login');
    } else {
      alert('Помилка збереження даних. Спробуйте ще раз.');
    }
  } else {
    const firstInvalid = form.querySelector('.invalid');
    if (firstInvalid) {
      firstInvalid.focus();
    }
  }
}

// ===== БЛОК ПРИВІТАННЯ =====

function showWelcomeBlock(data, source = 'registration') {
  // Ховаємо форму
  form.style.display = 'none';
  
  // Ховаємо заголовок форми
  const formTitle = document.querySelector('body.form-page > h2');
  if (formTitle) {
    formTitle.style.display = 'none';
  }
  
  // Створюємо блок привітання
  const welcomeBlock = document.createElement('div');
  welcomeBlock.id = 'welcomeBlock';
  welcomeBlock.className = 'welcome-block';
  welcomeBlock.style.cssText = `
    background: var(--bg2);
    border-radius: var(--radius);
    padding: 30px;
    max-width: 500px;
    text-align: center;
    box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.4);
    border: 1px solid rgba(255, 255, 255, 0.1);
    animation: fadeInScale 0.4s ease;
  `;
  
  const displayName = data.fullname || data.username || 'Користувач';
  const displayEmail = data.email || '';
  
  const successMessage = source === 'registration' 
    ? 'Ви успішно зареєструвалися!' 
    : 'Ви успішно увійшли в систему!';
  
  welcomeBlock.innerHTML = `
    <h2 style="color: var(--accent2); margin-bottom: 1rem;">Вітаємо! 👋</h2>
    <p style="font-size: 1.2rem; margin-bottom: 0.5rem;"><strong>${displayName}</strong></p>
    ${displayEmail ? `<p style="color: var(--muted); margin-bottom: 1rem;">${displayEmail}</p>` : ''}
    <p style="margin-bottom: 2rem; color: #22c55e; font-weight: 500;">${successMessage}</p>
    <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
      <button id="homeBtn" style="
        background: linear-gradient(90deg, var(--accent), var(--accent2));
        color: #fff;
        font-weight: 600;
        font-size: 1rem;
        border: none;
        border-radius: 0.6rem;
        padding: 0.9rem 2rem;
        cursor: pointer;
        transition: transform 0.2s ease;
      ">🏠 На головну</button>
      <button id="logoutBtn" style="
        background: linear-gradient(90deg, #ef4444, #dc2626);
        color: #fff;
        font-weight: 600;
        font-size: 1rem;
        border: none;
        border-radius: 0.6rem;
        padding: 0.9rem 2rem;
        cursor: pointer;
        transition: transform 0.2s ease;
      ">🚪 Вийти</button>
    </div>
  `;
  
  // Вставляємо після заголовка або на початок body
  if (formTitle) {
    formTitle.parentElement.insertBefore(welcomeBlock, formTitle.nextSibling);
  } else {
    document.body.insertBefore(welcomeBlock, document.body.firstChild);
  }
  
  // Обробники кнопок
  document.getElementById('homeBtn').addEventListener('click', () => {
    window.location.href = 'index1.html';
  });
  
  document.getElementById('logoutBtn').addEventListener('click', handleLogout);
}

function handleLogout() {
  // Очищаємо тільки поточну сесію, але залишаємо дані реєстрації
  clearLocalStorage('currentUser');
  
  // Якщо хочете повністю видалити користувача:
  // clearLocalStorage('registeredUser');
  
  // Видаляємо блок привітання
  const welcomeBlock = document.getElementById('welcomeBlock');
  if (welcomeBlock) {
    welcomeBlock.remove();
  }
  
  // Показуємо заголовок форми
  const formTitle = document.querySelector('body.form-page > h2');
  if (formTitle) {
    formTitle.style.display = 'block';
  }
  
  // Показуємо форму знову
  form.style.display = 'flex';
  form.reset();
  clearErrors();
}

// ===== ПЕРЕВІРКА ПРИ ЗАВАНТАЖЕННІ СТОРІНКИ =====

function checkExistingUser() {
  const currentUser = loadFromLocalStorage('currentUser');
  
  // Якщо користувач вже увійшов - показуємо привітання
  if (currentUser) {
    if (isRegisterPage) {
      showWelcomeBlock(currentUser, 'registration');
    } else if (isLoginPage) {
      showWelcomeBlock(currentUser, 'login');
    }
  }
}

// ===== СТИЛІ ДЛЯ ВАЛІДНИХ/НЕВАЛІДНИХ ПОЛІВ =====

function addValidationStyles() {
  const style = document.createElement('style');
  style.textContent = `
    input.valid, textarea.valid, select.valid {
      border-color: #22c55e !important;
      box-shadow: 0 0 0.5rem rgba(34, 197, 94, 0.3) !important;
    }
    
    input.invalid, textarea.invalid, select.invalid {
      border-color: #ef4444 !important;
      box-shadow: 0 0 0.5rem rgba(239, 68, 68, 0.3) !important;
    }
    
    @keyframes fadeInScale {
      from {
        opacity: 0;
        transform: scale(0.9);
      }
      to {
        opacity: 1;
        transform: scale(1);
      }
    }
  `;
  document.head.appendChild(style);
}

// ===== ІНІЦІАЛІЗАЦІЯ =====

document.addEventListener('DOMContentLoaded', () => {
  // Додаємо стилі
  addValidationStyles();
  
  // Перевіряємо, чи є вже авторизований користувач
  checkExistingUser();
  
  // Налаштовуємо валідацію в реальному часі
  setupRealtimeValidation();
  
  // Обробник сабміту форми
  if (form) {
    form.addEventListener('submit', (event) => {
      if (isRegisterPage) {
        handleRegistration(event);
      } else if (isLoginPage) {
        handleLogin(event);
      }
    });
    
    // Обробник кнопки очистити
    const resetButton = form.querySelector('button[type="reset"]');
    if (resetButton) {
      resetButton.addEventListener('click', () => {
        setTimeout(clearErrors, 50);
      });
    }
  }
});

console.log('✅ Система валідації форм завантажена успішно!');