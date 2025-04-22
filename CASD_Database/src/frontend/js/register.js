document.addEventListener('DOMContentLoaded', function() {
    const roleToggle = document.getElementById('roleToggle');
    const driverForm = document.getElementById('driverForm');
    const customerForm = document.getElementById('customerForm');
    const authForm = document.getElementById('authForm');
    const body = document.body;
    const backgroundAnimation = document.getElementById('backgroundAnimation');
    const loginButton = document.getElementById('loginButton');
    const registerButton = document.getElementById('registerButton');
    const formTitle = document.getElementById('formTitle');
    let currentRole = 'driver';

    // Инициализация - показываем форму регистрации водителя
    showRegistrationForm();

    // Переключение между ролями
    roleToggle.addEventListener('change', function() {
        currentRole = this.checked ? 'customer' : 'driver';
        updateTheme();
        // Обновляем текст ошибки, если он есть
        const errorElement = document.getElementById('errorMessage');
        if (errorElement.style.display === 'block') {
            errorElement.style.display = 'none';
        }
    });

    // Кнопка перехода к авторизации
    loginButton.addEventListener('click', showAuthForm);

    // Кнопка перехода к регистрации
    registerButton.addEventListener('click', showRegistrationForm);

    // Обработка отправки формы регистрации водителя
    driverForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        await handleRegistration({
            register_driver: {
                name: document.getElementById('driverName').value,
                mid_name: document.getElementById('driverMidName').value,
                last_name: document.getElementById('driverLastName').value
            },
            register_customer: null
        }, 'driver');
    });

    // Обработка отправки формы регистрации заказчика
    customerForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        await handleRegistration({
            register_driver: null,
            register_customer: {
                name_company: document.getElementById('companyName').value
            }
        }, 'customer');
    });

    // Обработка отправки формы авторизации
    authForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        const id = document.getElementById('authId').value;

        try {
            const response = await fetch('http://0.0.0.0:8000/api/auth/authorize', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: parseInt(id),
                    role: currentRole
                })
            });

            if (!response.ok) {
                if (response.status === 404) {
                    throw new Error('Пользователь не найден');
                }
                throw new Error(`Ошибка сервера: ${response.status}`);
            }

            const result = await response.json();
            // Сохраняем данные в localStorage
            localStorage.setItem('userId', result.id);
            localStorage.setItem('documentId', result.document_id);
            localStorage.setItem('role', currentRole);
            // Перенаправляем в зависимости от роли
            window.location.href = currentRole === 'driver' ? 'driver.html' : 'customer.html';
        } catch (error) {
            showError(error.message);
        }
    });

    function showRegistrationForm() {
        authForm.classList.remove('active');
        driverForm.classList.remove('active');
        customerForm.classList.remove('active');

        if (currentRole === 'driver') {
            driverForm.classList.add('active');
        } else {
            customerForm.classList.add('active');
        }

        loginButton.style.display = 'block';
        registerButton.style.display = 'none';
        roleToggle.parentElement.style.display = 'block';
        updateTheme();
    }

    function showAuthForm() {
        authForm.classList.add('active');
        driverForm.classList.remove('active');
        customerForm.classList.remove('active');
        loginButton.style.display = 'none';
        registerButton.style.display = 'block';
        roleToggle.parentElement.style.display = 'block'; // Оставляем переключатель видимым
        updateTheme();
    }

    function updateTheme() {
        // Очищаем все темы
        body.classList.remove('driver-theme', 'customer-theme');

        // Устанавливаем новую тему
        body.classList.add(currentRole === 'driver' ? 'driver-theme' : 'customer-theme');

        // Обновляем активную форму регистрации, если мы на экране регистрации
        if (!authForm.classList.contains('active')) {
            driverForm.classList.remove('active');
            customerForm.classList.remove('active');
            if (currentRole === 'driver') {
                driverForm.classList.add('active');
            } else {
                customerForm.classList.add('active');
            }
        }

        // Обновляем анимацию фона
        backgroundAnimation.innerHTML = '';
        if (currentRole === 'driver') {
            createTrucks();
        } else {
            createBuildings();
        }
    }

    function showError(message) {
        const errorElement = document.getElementById('errorMessage');
        errorElement.textContent = message;
        errorElement.style.display = 'block';
        setTimeout(() => {
            errorElement.style.display = 'none';
        }, 5000);
    }

    // Создаем анимацию для водителей (фуры)
    function createTrucks() {
        for (let i = 0; i < 3; i++) {
            const truck = document.createElement('div');
            truck.innerHTML = `
                <svg class="truck-svg" viewBox="0 0 240 120" style="animation-delay: ${i * 5}s;">
                    <rect x="20" y="40" width="120" height="40" fill="#d9232e"/>
                    <rect x="140" y="50" width="40" height="30" fill="#b71c1c"/>
                    <circle cx="45" cy="80" r="10" fill="#333"/>
                    <circle cx="145" cy="80" r="10" fill="#333"/>
                    <rect x="20" y="40" width="120" height="40" fill="gray"/>
                    <rect x="140" y="50" width="40" height="30" fill="white"/>
                </svg>
            `;
            backgroundAnimation.appendChild(truck);
        }
    }

    // Создаем анимацию для заказчиков (здания и облака)
    function createBuildings() {
        // Создаем контейнер для облаков
        const cloudsContainer = document.createElement('div');
        cloudsContainer.style.position = 'absolute';
        cloudsContainer.style.top = '0';
        cloudsContainer.style.left = '0';
        cloudsContainer.style.width = '100%';
        cloudsContainer.style.height = '30%';
        cloudsContainer.style.overflow = 'hidden';

        // Создаем 5 облаков с равномерным распределением
        for (let i = 0; i < 5; i++) {
            const cloud = document.createElement('div');
            cloud.className = 'cloud';
            cloud.style.width = `${80 + Math.random() * 40}px`;
            cloud.style.height = `${50 + Math.random() * 30}px`;
            cloud.style.left = `${i * 20}%`;
            cloud.style.top = `${10 + Math.random() * 10}%`;
            cloud.style.animationDuration = `${40 + Math.random() * 20}s`;
            cloud.style.animationDelay = `${Math.random() * 5}s`;
            cloudsContainer.appendChild(cloud);
        }
        backgroundAnimation.appendChild(cloudsContainer);

        // Создаем контейнер для зданий
        const buildingContainer = document.createElement('div');
        buildingContainer.className = 'building-container';

        // Позиции зданий (равномерно распределены)
        const positions = [5, 20, 35, 65, 80];
        positions.forEach(pos => {
            const building = document.createElement('div');
            const height = 180 + Math.random() * 70;
            building.innerHTML = `
                <svg class="building-svg" viewBox="0 0 100 ${height}" style="left: ${pos}%; height: ${height}px;">
                    <rect x="5" y="30" width="90" height="${height - 30}" fill="#0b0b64"/>
                    ${generateWindows(15, 40, 20, 20, 10, height - 50)}
                </svg>
            `;
            buildingContainer.appendChild(building);
        });

        backgroundAnimation.appendChild(buildingContainer);
    }

    function generateWindows(startX, startY, width, height, padding, maxHeight) {
        let windows = '';
        const rows = Math.floor(maxHeight / (height + padding));

        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < 3; col++) {
                const x = startX + col * (width + padding);
                const y = startY + row * (height + padding);
                windows += `<rect x="${x}" y="${y}" width="${width}" height="${height}" fill="#1e88e5" opacity="0.8"/>`;
            }
        }
        return windows;
    }


    async function handleRegistration(data, role) {
        try {
            const response = await fetch('http://0.0.0.0:8000/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                throw new Error(`Ошибка сервера: ${response.status}`);
            }

            const result = await response.json();
            // Сохраняем данные в localStorage
            localStorage.setItem('userId', result.id);
            localStorage.setItem('documentId', result.document_id);
            localStorage.setItem('role', role);

            // Перенаправляем на соответствующую страницу
            window.location.href = role === 'driver' ? 'driver.html' : 'customer.html';
        } catch (error) {
            showError(error.message);
        }
    }
});