// Асинхронна функція для завантаження даних з data.json
async function loadProfileData() {
    // Отримуємо елементи DOM
    const loadingStatus = document.getElementById('loading-status');
    const profileData = document.getElementById('profile-data');
    const errorMessage = document.getElementById('error-message');

    try {
        // Показуємо статус завантаження
        if (loadingStatus) {
            loadingStatus.style.display = 'block';
            loadingStatus.textContent = 'Loading...';
        }

        // Виконуємо GET-запит до data.json
        const response = await fetch('data.json');

        // Перевіряємо статус відповіді
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        // Парсимо JSON у JavaScript-об'єкт
        const data = await response.json();

        // Відображаємо дані на сторінці
        displayProfileData(data);

        // Приховуємо статус завантаження та показуємо дані
        if (loadingStatus) {
            loadingStatus.style.display = 'none';
        }
        if (profileData) {
            profileData.style.display = 'block';
        }

        console.log('Data been succesfully loaded:', data);

    } catch (error) {
        // Обробляємо помилку (мережеву або парсингу)
        console.error('Loading data error:', error);

        // Показуємо повідомлення про помилку
        if (loadingStatus) {
            loadingStatus.style.display = 'none';
        }
        if (errorMessage) {
            errorMessage.style.display = 'block';
            errorMessage.innerHTML = `<strong>Error:</strong> ${error.message}. Data Not Found.`;
        }
    }
}

// Функція для відображення даних на сторінці
function displayProfileData(data) {
    // Відображаємо особисту інформацію
    displayPersonalInfo(data.personalInfo);

    // Відображаємо навички
    displaySkills(data.skills);

    // Відображаємо проєкти
    displayProjects(data.projects);

    // Відображаємо контакти
    displayContacts(data.contacts);
}

// Відображення особистої інформації
function displayPersonalInfo(info) {
    const infoList = document.getElementById('info-list');
    if (!infoList) return;

    infoList.innerHTML = '';

    const infoItems = [
        { label: 'Name', value: info.name },
        { label: 'Age', value: `${info.age} років` },
        { label: 'Location', value: info.location },
        { label: 'Speciality', value: info.occupation },
        { label: 'Bio', value: info.bio }
    ];

    infoItems.forEach(item => {
        const li = document.createElement('li');
        li.innerHTML = `<strong>${item.label}:</strong> ${item.value}`;
        infoList.appendChild(li);
    });
}

// Відображення навичок
function displaySkills(skills) {
    const skillsList = document.getElementById('skills-list');
    if (!skillsList) return;

    skillsList.innerHTML = '';

    skills.forEach(skillGroup => {
        const li = document.createElement('li');
        li.innerHTML = `<strong>${skillGroup.category}:</strong> ${skillGroup.items.join(', ')}`;
        skillsList.appendChild(li);
    });
}

// Відображення проєктів
function displayProjects(projects) {
    const projectsList = document.getElementById('projects-list');
    if (!projectsList) return;

    projectsList.innerHTML = '';

    projects.forEach(project => {
        const li = document.createElement('li');
        li.innerHTML = `
            <strong>${project.icon} ${project.title}</strong> (${project.status})<br>
            <em>${project.description}</em>
        `;
        projectsList.appendChild(li);
    });
}

// Відображення контактів
function displayContacts(contacts) {
    const contactsList = document.getElementById('contacts-list');
    if (!contactsList) return;

    contactsList.innerHTML = '';

    contacts.forEach(contact => {
        const li = document.createElement('li');
        
        if (contact.link) {
            li.innerHTML = `<strong>${contact.type}:</strong> <a href="${contact.link}" target="_blank">${contact.value}</a>`;
        } else {
            li.innerHTML = `<strong>${contact.type}:</strong> ${contact.value}`;
        }
        
        contactsList.appendChild(li);
    });
}

// Запускаємо завантаження даних при завантаженні сторінки
// Перевіряємо, чи ми на сторінці about.html
if (document.getElementById('profile-data')) {
    // Викликаємо функцію після завантаження DOM
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', loadProfileData);
    } else {
        loadProfileData();
    }
}

// Експортуємо функцію для можливого використання в інших місцях
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { loadProfileData };
}