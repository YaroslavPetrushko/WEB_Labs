// ===== ІНТЕГРАЦІЯ ВАЛІДАТОРА З HTML ФОРМАМИ =====
import { validateRegisterForm, validateLoginForm, validateNameWithMessage, validateEmailWithMessage, validatePasswordWithMessage, validateUsernameWithMessage, validateBirthdateWithMessage, formatName, formatEmail, saveToLocalStorage, loadFromLocalStorage, clearLocalStorage } from './validator.js';
// ===== ВИЗНАЧЕННЯ ТИПУ СТОРІНКИ =====
function getPageType() {
    const bodyHTML = document.body.innerHTML;
    if (bodyHTML.includes('Форма авторизації')) {
        return 'login';
    }
    else if (bodyHTML.includes('Форма реєстрації')) {
        return 'register';
    }
    return 'unknown';
}
// ===== ГЛОБАЛЬНІ ЗМІННІ =====
const isLoginPage = getPageType() === 'login';
const isRegisterPage = getPageType() === 'register';
const form = document.querySelector('form');
// ===== ВІДОБРАЖЕННЯ ПОМИЛОК У UI =====
function showError(input, message) {
    input.classList.remove('valid');
    input.classList.add('invalid');
    input.setCustomValidity(message);
    let errorDiv = input.parentElement?.querySelector('.error-message');
    if (!errorDiv) {
        errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.setAttribute('aria-live', 'polite');
        errorDiv.style.color = '#ef4444';
        errorDiv.style.fontSize = '0.85rem';
        errorDiv.style.marginTop = '0.3rem';
        input.parentElement?.appendChild(errorDiv);
    }
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
    if (!input.hasAttribute('aria-describedby')) {
        errorDiv.id = `error-${input.id}`;
        input.setAttribute('aria-describedby', errorDiv.id);
    }
}
function showSuccess(input) {
    input.classList.remove('invalid');
    input.classList.add('valid');
    input.setCustomValidity('');
    const errorDiv = input.parentElement?.querySelector('.error-message');
    if (errorDiv) {
        errorDiv.style.display = 'none';
    }
}
function clearErrors() {
    if (!form)
        return;
    const inputs = form.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
        input.classList.remove('invalid', 'valid');
        input.setCustomValidity('');
        const errorDiv = input.parentElement?.querySelector('.error-message');
        if (errorDiv) {
            errorDiv.style.display = 'none';
        }
    });
}
// ===== ВАЛІДАЦІЯ В РЕАЛЬНОМУ ЧАСІ =====
function setupRealtimeValidation() {
    const fullnameInput = document.getElementById('fullname');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const usernameInput = document.getElementById('username');
    const birthdateInput = document.getElementById('birthdate');
    if (fullnameInput) {
        const validateFullname = () => {
            const error = validateNameWithMessage(fullnameInput.value);
            if (error) {
                showError(fullnameInput, error.message);
            }
            else {
                showSuccess(fullnameInput);
            }
        };
        fullnameInput.addEventListener('input', validateFullname);
        fullnameInput.addEventListener('blur', validateFullname);
    }
    if (emailInput) {
        const validateEmailField = () => {
            const error = validateEmailWithMessage(emailInput.value);
            if (error) {
                showError(emailInput, error.message);
            }
            else {
                showSuccess(emailInput);
            }
        };
        emailInput.addEventListener('input', validateEmailField);
        emailInput.addEventListener('blur', validateEmailField);
    }
    if (passwordInput) {
        const validatePasswordField = () => {
            const error = validatePasswordWithMessage(passwordInput.value);
            if (error) {
                showError(passwordInput, error.message);
            }
            else {
                showSuccess(passwordInput);
            }
        };
        passwordInput.addEventListener('input', validatePasswordField);
        passwordInput.addEventListener('blur', validatePasswordField);
    }
    if (usernameInput) {
        const validateUsernameField = () => {
            const error = validateUsernameWithMessage(usernameInput.value);
            if (error) {
                showError(usernameInput, error.message);
            }
            else {
                showSuccess(usernameInput);
            }
        };
        usernameInput.addEventListener('input', validateUsernameField);
        usernameInput.addEventListener('blur', validateUsernameField);
    }
    if (birthdateInput) {
        const validateBirthdateField = () => {
            const error = validateBirthdateWithMessage(birthdateInput.value);
            if (error) {
                showError(birthdateInput, error.message);
            }
            else {
                showSuccess(birthdateInput);
            }
        };
        birthdateInput.addEventListener('change', validateBirthdateField);
    }
}
// ===== ОБРОБКА ФОРМИ РЕЄСТРАЦІЇ =====
function handleRegistration(event) {
    event.preventDefault();
    if (!form)
        return;
    clearErrors();
    const fullnameInput = document.getElementById('fullname');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const aboutInput = document.getElementById('about');
    const genderInputs = document.getElementsByName('gender');
    const countryInput = document.getElementById('country');
    const birthdateInput = document.getElementById('birthdate');
    // Отримуємо вибрану стать
    let selectedGender = 'male';
    for (const radio of Array.from(genderInputs)) {
        if (radio.checked) {
            selectedGender = radio.value;
            break;
        }
    }
    // Формуємо дані форми
    const formData = {
        fullname: fullnameInput.value,
        email: emailInput.value,
        password: passwordInput.value,
        about: aboutInput.value.trim(),
        gender: selectedGender,
        country: countryInput.value,
        birthdate: birthdateInput.value,
        consent: true
    };
    // Валідуємо форму
    const errors = validateRegisterForm(formData);
    if (errors.length === 0) {
        const userData = {
            fullname: formatName(formData.fullname),
            email: formatEmail(formData.email),
            password: formData.password,
            about: formData.about,
            gender: formData.gender,
            country: formData.country,
            birthdate: formData.birthdate,
            registeredAt: new Date().toISOString(),
            consent: formData.consent
        };
        if (saveToLocalStorage('registeredUser', userData)) {
            showWelcomeBlock(userData, 'registration');
        }
        else {
            alert('Помилка збереження даних. Спробуйте ще раз.');
        }
    }
    else {
        errors.forEach(error => {
            const input = document.getElementById(error.field);
            if (input) {
                showError(input, error.message);
            }
        });
        const firstInvalid = form.querySelector('.invalid');
        firstInvalid?.focus();
    }
}
// ===== ОБРОБКА ФОРМИ АВТОРИЗАЦІЇ =====
function handleLogin(event) {
    event.preventDefault();
    if (!form)
        return;
    clearErrors();
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const rememberCheckbox = document.querySelector('input[name="remember"]');
    const subscribeRadios = document.getElementsByName('subscribe');
    let selectedSubscribe = 'yes';
    for (const radio of Array.from(subscribeRadios)) {
        if (radio.checked) {
            selectedSubscribe = radio.value;
            break;
        }
    }
    const formData = {
        username: usernameInput.value,
        password: passwordInput.value,
        remember: rememberCheckbox.checked,
        subscribe: selectedSubscribe
    };
    const errors = validateLoginForm(formData);
    if (errors.length > 0) {
        errors.forEach(error => {
            const input = document.getElementById(error.field);
            if (input) {
                showError(input, error.message);
            }
        });
        const firstInvalid = form.querySelector('.invalid');
        firstInvalid?.focus();
        return;
    }
    // ПЕРЕВІРКА ДАНИХ З LOCALSTORAGE
    const registeredUser = loadFromLocalStorage('registeredUser');
    if (!registeredUser) {
        showError(usernameInput, 'Користувача не знайдено. Спочатку зареєструйтесь!');
        setTimeout(() => {
            if (confirm('Користувача не знайдено. Перейти до реєстрації?')) {
                window.location.href = 'register.html';
            }
        }, 500);
        return;
    }
    const enteredUsername = usernameInput.value.trim().toLowerCase();
    const enteredPassword = passwordInput.value;
    const isUsernameMatch = registeredUser.email.toLowerCase() === enteredUsername ||
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
    const loginData = {
        ...registeredUser,
        remember: formData.remember,
        subscribe: formData.subscribe,
        loginAt: new Date().toISOString()
    };
    if (saveToLocalStorage('currentUser', loginData)) {
        showWelcomeBlock(loginData, 'login');
    }
    else {
        alert('Помилка збереження даних. Спробуйте ще раз.');
    }
}
// ===== БЛОК ПРИВІТАННЯ =====
function showWelcomeBlock(data, source = 'registration') {
    if (!form)
        return;
    form.style.display = 'none';
    const formTitle = document.querySelector('body.form-page > h2');
    if (formTitle) {
        formTitle.style.display = 'none';
    }
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
    const displayName = data.fullname || 'Користувач';
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
    if (formTitle) {
        formTitle.parentElement?.insertBefore(welcomeBlock, formTitle.nextSibling);
    }
    else {
        document.body.insertBefore(welcomeBlock, document.body.firstChild);
    }
    document.getElementById('homeBtn')?.addEventListener('click', () => {
        window.location.href = 'index1.html';
    });
    document.getElementById('logoutBtn')?.addEventListener('click', handleLogout);
}
function handleLogout() {
    clearLocalStorage('currentUser');
    const welcomeBlock = document.getElementById('welcomeBlock');
    if (welcomeBlock) {
        welcomeBlock.remove();
    }
    const formTitle = document.querySelector('body.form-page > h2');
    if (formTitle) {
        formTitle.style.display = 'block';
    }
    if (form) {
        form.style.display = 'flex';
        form.reset();
        clearErrors();
    }
}
// ===== ПЕРЕВІРКА ПРИ ЗАВАНТАЖЕННІ СТОРІНКИ =====
function checkExistingUser() {
    const currentUser = loadFromLocalStorage('currentUser');
    if (currentUser) {
        if (isRegisterPage) {
            showWelcomeBlock(currentUser, 'registration');
        }
        else if (isLoginPage) {
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
    addValidationStyles();
    checkExistingUser();
    setupRealtimeValidation();
    if (form) {
        form.addEventListener('submit', (event) => {
            if (isRegisterPage) {
                handleRegistration(event);
            }
            else if (isLoginPage) {
                handleLogin(event);
            }
        });
        const resetButton = form.querySelector('button[type="reset"]');
        if (resetButton) {
            resetButton.addEventListener('click', () => {
                setTimeout(clearErrors, 50);
            });
        }
    }
});
console.log('✅ TypeScript система валідації форм завантажена успішно!');
//# sourceMappingURL=index.js.map