document.addEventListener('DOMContentLoaded', function() {
    const customerId = localStorage.getItem('userId');
    const documentId = localStorage.getItem('documentId');
    const role = localStorage.getItem('role');
    const companyName = localStorage.getItem('companyName');

    if (!customerId || !documentId || role !== 'customer') {
        window.location.href = 'index.html';
        return;
    }

    // Загрузка имени компании во все места, где оно отображается
    const companyNameElements = [
        document.getElementById('customerName'),
        document.getElementById('companyName'),
        document.getElementById('companyNameInfo')
    ];

    companyNameElements.forEach(element => {
        if (element) {
            element.textContent = companyName || 'Компания';
        }
    });

    // Функция для показа модального окна
    function showModal(modalId) {
        console.log('Открытие модального окна:', modalId);
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'block';
        } else {
            console.error('Модальное окно не найдено:', modalId);
        }
    }

    // Функция для скрытия модального окна
    function hideModal(modalId) {
        console.log('Закрытие модального окна:', modalId);
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'none';
        }
    }

    // Загрузка данных заказчика
    async function loadCustomerData() {
        try {
            // Загрузка основной информации
            const customerResponse = await fetch('http://0.0.0.0:8000/api/customer/me/', {
                headers: { 'customer_id': customerId }
            });

            if (!customerResponse.ok) throw new Error('Ошибка загрузки данных заказчика');
            const customerData = await customerResponse.json();
            
            // Безопасное обновление элементов
            const updateElement = (id, value) => {
                const element = document.getElementById(id);
                if (element) {
                    element.textContent = value;
                }
            };

            // Обновляем информацию
            updateElement('customerId', customerData.id);
            updateElement('companyName', customerData.name_company);
            updateElement('companyNameInfo', customerData.name_company);
            
            // Сохраняем название компании в localStorage
            localStorage.setItem('companyName', customerData.name_company);

            // Загрузка документов
            const documentsResponse = await fetch('http://0.0.0.0:8000/api/customer/me/documents', {
                headers: { 'document_id': documentId }
            });

            if (!documentsResponse.ok) throw new Error('Ошибка загрузки документов');
            const documentsData = await documentsResponse.json();

            // Обновляем информацию о документах
            updateElement('snilsNumber', documentsData.number_snils || 'Не указан');
            updateElement('snilsDate', documentsData.snils_data?.get_date || 'Не указана');
            updateElement('innNumber', documentsData.number_inn || 'Не указан');
            updateElement('innDate', documentsData.inn_data?.get_date || 'Не указана');

            // Обновляем видимость кнопок
            const createSnilsBtn = document.getElementById('createSnilsBtn');
            const createInnBtn = document.getElementById('createInnBtn');

            if (createSnilsBtn) {
                createSnilsBtn.style.display = documentsData.number_snils ? 'none' : 'block';
            }
            if (createInnBtn) {
                createInnBtn.style.display = documentsData.number_inn ? 'none' : 'block';
            }

        } catch (error) {
            console.error('Ошибка:', error);
            showToast({
                type: 'error',
                title: 'Ошибка загрузки',
                message: 'Не удалось загрузить данные профиля',
                duration: 5000
            });
        }
    }

    // Настройка обработчиков событий для кнопок создания документов
    const createSnilsBtn = document.getElementById('createSnilsBtn');
    const createInnBtn = document.getElementById('createInnBtn');

    if (createSnilsBtn) {
        createSnilsBtn.addEventListener('click', () => {
            console.log('Клик по кнопке СНИЛС');
            showModal('snilsModal');
        });
    }

    if (createInnBtn) {
        createInnBtn.addEventListener('click', () => {
            console.log('Клик по кнопке ИНН');
            showModal('innModal');
        });
    }

    // Настройка закрытия модальных окон
    document.querySelectorAll('.close-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const modal = this.closest('.modal');
            if (modal) {
                hideModal(modal.id);
            }
        });
    });

    // Закрытие модального окна при клике вне его
    window.addEventListener('click', function(event) {
        if (event.target.classList.contains('modal')) {
            hideModal(event.target.id);
        }
    });

    // Обработчики меню
    document.querySelectorAll('.menu li').forEach(item => {
        item.addEventListener('click', function() {
            const section = this.dataset.section;
            if (section === 'create-order') {
                window.location.href = 'customer_create_order.html';
            } else if (section === 'orders') {
                window.location.href = 'customer_order.html';
            } else {
                // Переключение на профиль
                document.querySelectorAll('.menu li').forEach(i => i.classList.remove('active'));
                this.classList.add('active');
                document.querySelectorAll('.main-content > div').forEach(section => {
                    section.style.display = 'none';
                });
                document.getElementById('profileSection').style.display = 'block';
            }
        });
    });

    // Обработчик выхода
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.clear();
            window.location.href = 'index.html';
        });
    }

    // Загрузка данных при запуске
    loadCustomerData();

    // Обработка отправки формы СНИЛС
    const snilsForm = document.getElementById('snilsForm');
    if (snilsForm) {
        snilsForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            try {
                const response = await fetch('http://0.0.0.0:8000/api/customer/me/document/snils/create', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        number_snils: document.getElementById('snilsNumberInput').value,
                        get_date: document.getElementById('snilsDateInput').value,
                        document_id: parseInt(documentId)
                    })
                });

                if (!response.ok) throw new Error('Ошибка при создании СНИЛС');

                hideModal('snilsModal');
                this.reset();
                await loadCustomerData();
                alert('СНИЛС успешно зарегистрирован');
            } catch (error) {
                alert('Ошибка: ' + error.message);
            }
        });
    }

    // Обработка отправки формы ИНН
    const innForm = document.getElementById('innForm');
    if (innForm) {
        innForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            try {
                const response = await fetch('http://0.0.0.0:8000/api/customer/me/document/inn/create', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        number_inn: document.getElementById('innNumberInput').value,
                        get_date: document.getElementById('innDateInput').value,
                        document_id: parseInt(documentId)
                    })
                });

                if (!response.ok) throw new Error('Ошибка при создании ИНН');

                hideModal('innModal');
                this.reset();
                await loadCustomerData();
                alert('ИНН успешно зарегистрирован');
            } catch (error) {
                alert('Ошибка: ' + error.message);
            }
        });
    }

    // Функция загрузки заказов
    async function loadOrders(status = 'В пути') {
        try {
            const response = await fetch('http://0.0.0.0:8000/api/puty-list/customer/', {
                headers: {
                    'customer_id': customerId
                }
            });

            if (!response.ok) {
                throw new Error('Ошибка загрузки данных');
            }

            const data = await response.json();

            const ordersContainer = document.getElementById('ordersContent');
            ordersContainer.innerHTML = `
                <div class="filters">
                    <button class="filter-btn ${status === 'В пути' ? 'active' : ''}" data-status="В пути">В пути</button>
                    <button class="filter-btn ${status === 'Доставлен' ? 'active' : ''}" data-status="Доставлен">Доставлено</button>
                    <button class="filter-btn ${status === 'Не доставлен' ? 'active' : ''}" data-status="Не доставлен">Не доставлено</button>
                </div>
                <div class="orders-container">
                    ${data.line && Array.isArray(data.line) ? 
                        data.line
                            .filter(order => order.status === status)
                            .map(order => createOrderCard(order))
                            .join('') : 
                        '<p style="text-align: center; color: #666;">Нет доступных заказов</p>'
                    }
                </div>
            `;

            // Добавляем обработчики для новых фильтров
            document.querySelectorAll('.filter-btn').forEach(btn => {
                btn.addEventListener('click', function() {
                    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                    this.classList.add('active');
                    loadOrders(this.dataset.status);
                });
            });
        } catch (error) {
            console.error('Ошибка:', error);
            const ordersContainer = document.getElementById('ordersContent');
            if (ordersContainer) {
                ordersContainer.innerHTML = '<p style="text-align: center; color: red;">Ошибка при загрузке данных</p>';
            }
        }
    }

    // Функция создания карточки заказа
    function createOrderCard(order) {
        return `
            <div class="order-card">
                <h3>Заказ №${order.puty_list_id}</h3>
                <div class="order-info">
                    <p>
                        <span class="label">Откуда:</span>
                        <span class="value">${order.departure_city_name}</span>
                    </p>
                    <p>
                        <span class="label">Куда:</span>
                        <span class="value">${order.arrival_city_name}</span>
                    </p>
                    <p>
                        <span class="label">Груз:</span>
                        <span class="value">${order.cargo_name}</span>
                    </p>
                    <p>
                        <span class="label">Стоимость:</span>
                        <span class="value">${order.total_price} руб.</span>
                    </p>
                </div>
                <button class="contract-btn customer" onclick="generateContract(${order.puty_list_id})">
                    Договор
                </button>
            </div>
        `;
    }

    // Функция генерации договора
    async function generateContract(putyListId) {
        try {
            const response = await fetch(`http://0.0.0.0:8000/api/puty_list/report/${putyListId}`, {
                headers: {
                    'customer_id': customerId
                }
            });

            if (!response.ok) throw new Error('Ошибка генерации договора');

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `contract_${putyListId}.pdf`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            a.remove();
        } catch (error) {
            console.error('Ошибка:', error);
            alert('Ошибка при генерации договора');
        }
    }
});