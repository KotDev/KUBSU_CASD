document.addEventListener('DOMContentLoaded', function() {
    const driverId = localStorage.getItem('userId');
    const documentId = localStorage.getItem('documentId');
    const role = localStorage.getItem('role');

    if (!driverId || !documentId || role !== 'driver') {
        window.location.href = 'index.html';
        return;
    }

    // Функции для показа/скрытия индикатора загрузки
    function showLoading() {
        const loadingOverlay = document.getElementById('loadingOverlay');
        if (loadingOverlay) {
            loadingOverlay.style.display = 'flex';
        }
    }

    function hideLoading() {
        const loadingOverlay = document.getElementById('loadingOverlay');
        if (loadingOverlay) {
            loadingOverlay.style.display = 'none';
        }
    }

    // Функция для показа уведомлений
    function showToast({ type = 'info', title, message, duration = 5000 }) {
        const toastContainer = document.getElementById('toastContainer');
        if (!toastContainer) {
            console.error('Toast container not found');
            return;
        }
        
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        let icon;
        switch(type) {
            case 'success':
                icon = 'check-circle';
                break;
            case 'error':
                icon = 'exclamation-circle';
                break;
            case 'warning':
                icon = 'exclamation-triangle';
                break;
            default:
                icon = 'info-circle';
        }
        
        toast.innerHTML = `
            <div class="toast-icon">
                <i class="fas fa-${icon}"></i>
            </div>
            <div class="toast-content">
                <div class="toast-title">${title}</div>
                <div class="toast-message">${message}</div>
            </div>
            <button class="toast-close" onclick="this.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        toastContainer.appendChild(toast);
        
        // Добавляем анимацию появления
        setTimeout(() => toast.classList.add('show'), 10);
        
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, duration);
    }

    // Загрузка имени водителя в сайдбар
    document.getElementById('driverName').textContent = localStorage.getItem('driverName') || 'Водитель';

    async function loadOrders(status = 'В пути') {
        try {
            showLoading();
            console.log('Загрузка заказов со статусом:', status);

            const ordersContainer = document.getElementById('ordersContainer');
            console.log('Orders container found:', ordersContainer);
            if (!ordersContainer) {
                console.error('Orders container not found in DOM');
                return;
            }

            const response = await fetch(`http://0.0.0.0:8000/api/puty-list/driver?status=${encodeURIComponent(status)}`, {
                headers: {
                    'driver_id': localStorage.getItem('userId')
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log('Полученные данные:', data);

            ordersContainer.innerHTML = '';

            if (data && data.line && Array.isArray(data.line)) {
                console.log('Количество заказов:', data.line.length);
                if (data.line.length > 0) {
                    data.line.forEach((order, index) => {
                        console.log(`Обработка заказа ${index + 1}:`, order);
                        const card = createOrderCard(order);
                        console.log('Созданная карточка:', card.outerHTML);
                        ordersContainer.appendChild(card);
                        console.log('Карточка добавлена, текущее содержимое контейнера:', ordersContainer.innerHTML);
                    });
                } else {
                    ordersContainer.innerHTML = '<p style="text-align: center; color: #666;">Нет доступных заказов</p>';
                }
            } else {
                console.error('Неверный формат данных:', data);
                ordersContainer.innerHTML = '<p style="text-align: center; color: #666;">Нет доступных заказов</p>';
            }

            // Обновляем активную кнопку фильтра
            document.querySelectorAll('.filter-btn').forEach(btn => {
                btn.classList.toggle('active', btn.dataset.status === status);
            });

        } catch (error) {
            console.error('Ошибка при загрузке заказов:', error);
            document.getElementById('ordersContainer').innerHTML = 
                '<p style="text-align: center; color: red;">Ошибка при загрузке данных</p>';
            
            showToast({
                type: 'error',
                title: 'Ошибка загрузки',
                message: 'Не удалось загрузить список заказов',
                duration: 5000
            });
        } finally {
            hideLoading();
        }
    }

    function createOrderCard(order) {
        console.log('Создание карточки для заказа:', order);
        console.log('Текущий статус заказа:', order.status);
        console.log('Тип статуса:', typeof order.status);

        const card = document.createElement('div');
        card.className = 'order-card info-card';
        
        // Определяем, какие кнопки показывать в зависимости от статуса
        let statusButton = '';
        
        // Нормализуем статус (убираем лишние пробелы и приводим к нижнему регистру)
        const normalizedStatus = order.status.trim().toLowerCase();
        console.log('Нормализованный статус:', normalizedStatus);
        
        if (normalizedStatus === 'не доставлен') {
            statusButton = `
                <button class="action-btn" onclick="startDelivery(${order.puty_list_id})" style="display: flex;">
                    <i class="fas fa-truck"></i> В путь
                </button>
            `;
        } else if (normalizedStatus === 'в пути') {
            statusButton = `
                <button class="action-btn" onclick="completeDelivery(${order.puty_list_id})" style="display: flex;">
                    <i class="fas fa-check-circle"></i> Завершить
                </button>
            `;
        } else if (normalizedStatus === 'доставлен') {
            statusButton = `
                <button class="action-btn" disabled style="display: flex; opacity: 0.7; cursor: not-allowed;">
                    <i class="fas fa-check-circle"></i> Доставлено
                </button>
            `;
        }

        console.log('Сгенерированная кнопка статуса:', statusButton);

        card.innerHTML = `
            <h3>Заказ №${order.puty_list_id}</h3>
            <div class="order-info">
                <div class="info-row">
                    <span>Откуда:</span>
                    <span>${order.departure_city_name}</span>
                </div>
                <div class="info-row">
                    <span>Куда:</span>
                    <span>${order.arrival_city_name}</span>
                </div>
                <div class="info-row">
                    <span>Груз:</span>
                    <span>${order.cargo_name}</span>
                </div>
                <div class="info-row">
                    <span>Статус:</span>
                    <span class="status-badge ${normalizedStatus.replace(' ', '-')}">
                        ${order.status}
                    </span>
                </div>
                <div class="info-row">
                    <span>Стоимость:</span>
                    <span>${order.total_price} руб.</span>
                </div>
            </div>
            <div class="card-actions">
                <button class="action-btn" onclick="showOrderDetails(${order.puty_list_id})" style="display: flex;">
                    <i class="fas fa-info-circle"></i> Подробнее
                </button>
                ${statusButton}
            </div>
            <button class="contract-btn driver" onclick="generateContract(${order.puty_list_id})" style="display: flex;">
                <i class="fas fa-file-contract"></i> Скачать договор
            </button>
        `;
        
        return card;
    }

    // Обработчики фильтров
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const status = this.dataset.status;
            console.log('Выбран статус:', status);
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            loadOrders(status);
        });
    });

    // Обработчик для возврата в профиль
    document.querySelector('.menu li:first-child').addEventListener('click', function() {
        window.location.href = 'driver.html';
    });

    // Обработчик выхода
    document.getElementById('logoutBtn').addEventListener('click', () => {
        localStorage.clear();
        window.location.href = 'index.html';
    });

    // Обработчик перехода к поиску заказов
    document.querySelector('.menu li:nth-child(3)').addEventListener('click', () => {
        window.location.href = 'orders.html';
    });

    // Делаем функции глобально доступными
    window.showLoading = showLoading;
    window.hideLoading = hideLoading;
    window.showToast = showToast;
    window.loadOrders = loadOrders;

    // Загрузка заказов при запуске
    loadOrders('В пути');

    // Добавляем стили для поисковой строки
    const searchStyles = document.createElement('style');
    searchStyles.textContent = `
        .search-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            margin: 20px 0;
            padding: 0 20px;
            gap: 10px;
        }

        .search-input {
            width: 100%;
            max-width: 400px;
            padding: 10px 15px;
            border: 2px solid #e74c3c;
            border-radius: 8px;
            font-size: 16px;
            outline: none;
            transition: border-color 0.3s ease;
        }

        .search-input:focus {
            border-color: #c0392b;
        }

        .search-input::placeholder {
            color: #95a5a6;
        }

        .search-options {
            display: flex;
            gap: 10px;
            margin-top: 10px;
        }

        .search-option {
            padding: 8px 15px;
            background-color: #e74c3c;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            transition: all 0.3s ease;
        }

        .search-option:hover {
            background-color: #c0392b;
        }

        .search-option.active {
            background-color: #c0392b;
            color: white;
        }
    `;
    document.head.appendChild(searchStyles);

    // Создаем и добавляем поисковую строку
    const searchContainer = document.createElement('div');
    searchContainer.className = 'search-container';
    searchContainer.innerHTML = `
        <input type="text" class="search-input" placeholder="Поиск..." id="orderSearch">
        <div class="search-options">
            <div class="search-option active" data-type="number">По номеру</div>
            <div class="search-option" data-type="departure">По городу отправления</div>
            <div class="search-option" data-type="arrival">По городу прибытия</div>
        </div>
    `;
    document.getElementById('ordersContainer').parentNode.insertBefore(searchContainer, document.getElementById('ordersContainer'));

    // Добавляем обработчики поиска
    const searchInput = document.getElementById('orderSearch');
    let searchType = 'number';

    // Обработчик изменения типа поиска
    document.querySelectorAll('.search-option').forEach(option => {
        option.addEventListener('click', function() {
            document.querySelectorAll('.search-option').forEach(opt => opt.classList.remove('active'));
            this.classList.add('active');
            searchType = this.dataset.type;
            searchInput.value = '';
            document.querySelectorAll('.order-card').forEach(card => card.style.display = 'flex');
        });
    });

    // Обработчик поиска
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        const cards = document.querySelectorAll('.order-card');
        
        cards.forEach(card => {
            let searchText = '';
            switch(searchType) {
                case 'number':
                    searchText = card.querySelector('h3').textContent.toLowerCase();
                    break;
                case 'departure':
                    searchText = card.querySelector('.info-row:nth-child(1) span:last-child').textContent.toLowerCase();
                    break;
                case 'arrival':
                    searchText = card.querySelector('.info-row:nth-child(2) span:last-child').textContent.toLowerCase();
                    break;
            }
            
            if (searchText.includes(searchTerm)) {
                card.style.display = 'flex';
            } else {
                card.style.display = 'none';
            }
        });
    });
});

// Обновленная функция генерации договора
window.generateContract = async function(putyListId) {
    try {
        const response = await fetch('http://0.0.0.0:8000/api/puty-list/report-order', {
            method: 'GET',
            headers: {
                'puty_list_id': String(putyListId),
                'Content-Type': 'application/json',
                'Accept': 'application/pdf'
            }
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Ошибка генерации договора: ${response.status} - ${errorText}`);
        }

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `report_${putyListId}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove();
    } catch (error) {
        console.error('Ошибка:', error);
        alert('Ошибка при генерации договора: ' + error.message);
    }
};

// Функция обновления статуса
async function updateOrderStatus(putyListId, newStatus) {
    try {
        showLoading();
        const numericPutyListId = parseInt(putyListId, 10);
        
        console.log('Обновление статуса:', {
            putyListId: numericPutyListId,
            newStatus: newStatus
        });
        
        // Проверяем корректность статуса
        if (newStatus !== 'В пути' && newStatus !== 'Доставлен') {
            throw new Error('Некорректный статус заказа');
        }
        
        const response = await fetch(`http://0.0.0.0:8000/api/puty-list/update-status/?status=${newStatus}`, {
            method: 'PATCH',
            headers: {
                'puty_list_id': numericPutyListId.toString(),
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ status: newStatus })
        });

        console.log('Ответ сервера:', {
            status: response.status,
            ok: response.ok
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Ошибка ответа:', errorText);
            throw new Error(`Ошибка при обновлении статуса: ${errorText}`);
        }

        // Показываем кастомное уведомление в зависимости от нового статуса
        if (newStatus === 'В пути') {
            showToast({
                type: 'success',
                title: 'Доставка начата',
                message: `Заказ №${numericPutyListId} успешно начат. Время начала: ${new Date().toLocaleTimeString()}`,
                duration: 5000
            });
        } else if (newStatus === 'Доставлен') {
        showToast({
            type: 'success',
                title: 'Доставка завершена',
                message: `Заказ №${numericPutyListId} успешно доставлен. Время завершения: ${new Date().toLocaleTimeString()}`,
                duration: 5000
            });
        }

        // Получаем текущий активный фильтр
        const activeFilter = document.querySelector('.filter-btn.active')?.dataset.status || 'В пути';
        
        // Перезагружаем список заказов с текущим фильтром
        await window.loadOrders(activeFilter);

    } catch (error) {
        console.error('Ошибка:', error);
        showToast({
            type: 'error',
            title: 'Ошибка',
            message: error.message || 'Не удалось обновить статус заказа',
            duration: 5000
        });
    } finally {
        hideLoading();
    }
}

// Функция для начала доставки
window.startDelivery = async function(putyListId) {
    console.log('Начало доставки для заказа:', putyListId);
    if (confirm('Вы уверены, что хотите начать доставку?')) {
        await updateOrderStatus(putyListId, 'В пути');
    }
};

// Функция для завершения доставки
window.completeDelivery = async function(putyListId) {
    console.log('Завершение доставки для заказа:', putyListId);
    if (confirm('Вы уверены, что хотите завершить доставку?')) {
        await updateOrderStatus(putyListId, 'Доставлен');
    }
};

// Функция для отображения подробной информации о заказе
window.showOrderDetails = async function(putyListId) {
    try {
        showLoading();
        const response = await fetch(`http://0.0.0.0:8000/api/puty-list/info`, {
            method: 'GET',
            headers: {
                'puty_list_id': putyListId.toString()
            }
        });

        if (!response.ok) {
            throw new Error('Ошибка при загрузке информации о заказе');
        }

        const orderDetails = await response.json();
        console.log('Детали заказа:', orderDetails);

        // Проверяем наличие необходимых данных
        if (!orderDetails || typeof orderDetails !== 'object') {
            throw new Error('Неверный формат данных заказа');
        }

        // Создаем модальное окно
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2>Детали заказа №${putyListId}</h2>
                    <button class="close-btn">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="details-grid">
                        <div class="detail-item">
                            <span class="detail-label">Дата отправки:</span>
                            <span class="detail-value">${orderDetails.date_sending ? new Date(orderDetails.date_sending).toLocaleString() : 'Не указана'}</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">Дата прибытия:</span>
                            <span class="detail-value">${orderDetails.date_arrival ? new Date(orderDetails.date_arrival).toLocaleString() : 'Не указана'}</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">Город отправления:</span>
                            <span class="detail-value">${orderDetails.departure_city_name || 'Не указан'}</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">Город назначения:</span>
                            <span class="detail-value">${orderDetails.arrival_city_name || 'Не указан'}</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">Название груза:</span>
                            <span class="detail-value">${orderDetails.cargo_name || 'Не указан'}</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">Компания:</span>
                            <span class="detail-value">${orderDetails.name_company || 'Не указана'}</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">Расстояние:</span>
                            <span class="detail-value">${orderDetails.all_km ? orderDetails.all_km + ' км' : 'Не указано'}</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">Цена за км:</span>
                            <span class="detail-value">${orderDetails.price_km ? orderDetails.price_km + ' руб.' : 'Не указана'}</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">Цена за кг:</span>
                            <span class="detail-value">${orderDetails.price_kg ? orderDetails.price_kg + ' руб.' : 'Не указана'}</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">Вес груза:</span>
                            <span class="detail-value">${orderDetails.weight ? orderDetails.weight + ' кг' : 'Не указан'}</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">Габариты (В×Ш×Д):</span>
                            <span class="detail-value">${orderDetails.height && orderDetails.width && orderDetails.length 
                                ? `${orderDetails.height}×${orderDetails.width}×${orderDetails.length} м` 
                                : 'Не указаны'}</span>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Добавляем модальное окно в DOM
        document.body.appendChild(modal);

        // Добавляем класс show после небольшой задержки для анимации
        setTimeout(() => {
            modal.classList.add('show');
        }, 10);

        // Добавляем обработчики событий
        const closeBtn = modal.querySelector('.close-btn');
        closeBtn.onclick = () => {
            modal.classList.remove('show');
            setTimeout(() => {
                modal.remove();
            }, 300);
        };

        // Закрытие по клику вне модального окна
        window.onclick = (event) => {
            if (event.target === modal) {
                modal.classList.remove('show');
                setTimeout(() => {
                    modal.remove();
                }, 300);
            }
        };

    } catch (error) {
        console.error('Ошибка:', error);
        showToast({
            type: 'error',
            title: 'Ошибка',
            message: error.message || 'Не удалось загрузить информацию о заказе',
            duration: 5000
        });
    } finally {
        hideLoading();
    }
};

// Добавляем стили для статусов
const styleSheet = document.createElement('style');
styleSheet.textContent = `
    .order-card {
        display: flex;
        flex-direction: column;
        background: white;
        border-radius: 8px;
        padding: 20px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        margin: 10px;
        width: calc(100% - 20px);
        min-width: 300px;
        max-width: 400px;
        height: fit-content;
    }

    .order-info {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 15px;
        margin-bottom: 15px;
    }

    .info-row {
        display: flex;
        flex-direction: column;
        gap: 5px;
        word-break: break-word;
    }

    .info-row span:first-child {
        color: #7f8c8d;
        font-size: 14px;
    }

    .info-row span:last-child {
        color: #2c3e50;
        font-weight: 500;
        word-break: break-word;
    }

    .status-badge {
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 14px;
        font-weight: 500;
    }

    .status-badge.в-пути {
        background-color: #3498db;
        color: white;
    }

    .status-badge.доставлен {
        background-color: #2ecc71;
        color: white;
    }

    .status-badge.не-доставлен {
        background-color: #e74c3c;
        color: white;
    }

    .card-actions {
        display: flex;
        flex-direction: row;
        gap: 10px;
        margin-top: 15px;
        width: 100%;
    }

    .action-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        padding: 6px 12px;
        background-color: #e74c3c;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        transition: background-color 0.3s ease;
        flex: 1;
        height: 32px;
        font-size: 14px;
    }

    .action-btn:hover {
        background-color: #c0392b;
    }

    .action-btn:disabled {
        background-color: #95a5a6;
        cursor: not-allowed;
    }

    .action-btn i {
        font-size: 14px;
    }

    .contract-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        padding: 6px 12px;
        background-color: #3498db;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        transition: background-color 0.3s ease;
        width: 100%;
        height: 32px;
        font-size: 14px;
        margin-top: 10px;
    }

    .contract-btn:hover {
        background-color: #2980b9;
    }

    #ordersContainer {
        display: flex;
        flex-wrap: wrap;
        gap: 20px;
        padding: 20px;
        justify-content: center;
    }

    .modal {
        position: fixed;
        z-index: 1000;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0,0,0,0.5);
        opacity: 0;
        visibility: hidden;
        transition: opacity 0.3s ease, visibility 0.3s ease;
    }

    .modal.show {
        opacity: 1;
        visibility: visible;
    }

    .modal-content {
        background-color: #fefefe;
        margin: 5% auto;
        padding: 20px;
        border-radius: 8px;
        width: 80%;
        max-width: 800px;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        transform: translateY(-20px);
        transition: transform 0.3s ease;
    }

    .modal.show .modal-content {
        transform: translateY(0);
    }

    .modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
        padding-bottom: 10px;
        border-bottom: 1px solid #eee;
    }

    .modal-header h2 {
        margin: 0;
        color: #2c3e50;
    }

    .close-btn {
        background: none;
        border: none;
        font-size: 24px;
        cursor: pointer;
        color: #95a5a6;
        transition: color 0.3s ease;
    }

    .close-btn:hover {
        color: #2c3e50;
    }

    .details-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 15px;
    }

    .detail-item {
        display: flex;
        flex-direction: column;
        gap: 5px;
    }

    .detail-label {
        color: #7f8c8d;
        font-size: 14px;
    }

    .detail-value {
        color: #2c3e50;
        font-weight: 500;
    }
`;
document.head.appendChild(styleSheet); 

// Добавляем стили для уведомлений
const toastStyles = document.createElement('style');
toastStyles.textContent = `
    #toastContainer {
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 1000;
    }

    .toast {
        background: white;
        border-radius: 8px;
        padding: 15px;
        margin-bottom: 10px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        display: flex;
        align-items: center;
        min-width: 300px;
        max-width: 400px;
        opacity: 0;
        transform: translateX(100%);
        transition: all 0.3s ease;
    }

    .toast.show {
        opacity: 1;
        transform: translateX(0);
    }

    .toast-icon {
        margin-right: 15px;
        font-size: 20px;
    }

    .toast.success .toast-icon {
        color: #2ecc71;
    }

    .toast.error .toast-icon {
        color: #e74c3c;
    }

    .toast.warning .toast-icon {
        color: #f39c12;
    }

    .toast.info .toast-icon {
        color: #3498db;
    }

    .toast-content {
        flex: 1;
    }

    .toast-title {
        font-weight: bold;
        margin-bottom: 5px;
        color: #2c3e50;
    }

    .toast-message {
        color: #7f8c8d;
        font-size: 14px;
    }

    .toast-close {
        background: none;
        border: none;
        color: #95a5a6;
        cursor: pointer;
        padding: 0;
        font-size: 16px;
        margin-left: 10px;
        transition: color 0.3s ease;
    }

    .toast-close:hover {
        color: #2c3e50;
    }
`;
document.head.appendChild(toastStyles);

// Обновляем стили для модального окна
const modalStyles = document.createElement('style');
modalStyles.textContent = `
    .modal {
        position: fixed;
        z-index: 1000;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0,0,0,0.5);
        opacity: 0;
        visibility: hidden;
        transition: opacity 0.3s ease, visibility 0.3s ease;
    }

    .modal.show {
        opacity: 1;
        visibility: visible;
    }

    .modal-content {
        background-color: #fefefe;
        margin: 5% auto;
        padding: 20px;
        border-radius: 8px;
        width: 80%;
        max-width: 800px;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        transform: translateY(-20px);
        transition: transform 0.3s ease;
    }

    .modal.show .modal-content {
        transform: translateY(0);
    }

    .modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
        padding-bottom: 10px;
        border-bottom: 1px solid #eee;
    }

    .modal-header h2 {
        margin: 0;
        color: #2c3e50;
    }

    .close-btn {
        background: none;
        border: none;
        font-size: 24px;
        cursor: pointer;
        color: #95a5a6;
        transition: color 0.3s ease;
    }

    .close-btn:hover {
        color: #2c3e50;
    }

    .details-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 15px;
    }

    .detail-item {
        display: flex;
        flex-direction: column;
        gap: 5px;
    }

    .detail-label {
        color: #7f8c8d;
        font-size: 14px;
    }

    .detail-value {
        color: #2c3e50;
        font-weight: 500;
    }

    .status-badge {
        display: inline-block;
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 14px;
        font-weight: 500;
    }

    .status-badge.в-пути {
        background-color: #3498db;
        color: white;
    }

    .status-badge.доставлен {
        background-color: #2ecc71;
        color: white;
    }

    .status-badge.не-доставлен {
        background-color: #e74c3c;
        color: white;
    }
`;
document.head.appendChild(modalStyles); 