document.addEventListener('DOMContentLoaded', function() {
    const driverId = localStorage.getItem('userId');
    const documentId = localStorage.getItem('documentId');
    const role = localStorage.getItem('role');

    if (!driverId || !documentId || role !== 'driver') {
        window.location.href = 'index.html';
        return;
    }

    // Загрузка имени водителя
    document.getElementById('driverName').textContent = localStorage.getItem('driverName') || 'Водитель';

    let currentPage = 1;
    const pageSize = 10;

    // Функция для показа индикатора загрузки
    function showLoading() {
        document.getElementById('loadingOverlay').style.display = 'flex';
    }

    // Функция для скрытия индикатора загрузки
    function hideLoading() {
        document.getElementById('loadingOverlay').style.display = 'none';
    }

    // Функция загрузки заказов
    async function loadOrders(page) {
        try {
            showLoading();
            const response = await fetch(`http://0.0.0.0:8000/api/puty-list/orders?page=${page}&size=${pageSize}`);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            const ordersContainer = document.getElementById('ordersContainer');
            ordersContainer.innerHTML = '';

            if (data.line && data.line.length > 0) {
                data.line.forEach(order => {
                    const card = createOrderCard(order);
                    ordersContainer.appendChild(card);
                });
                updatePagination(page, data.line.length < pageSize);
            } else {
                ordersContainer.innerHTML = '<p style="text-align: center; color: #666;">Нет доступных заказов</p>';
                updatePagination(page, true);
            }
        } catch (error) {
            console.error('Ошибка при загрузке заказов:', error);
            document.getElementById('ordersContainer').innerHTML = 
                '<p style="text-align: center; color: red;">Ошибка при загрузке данных</p>';
        } finally {
            hideLoading();
        }
    }

    // Функция создания карточки заказа
    function createOrderCard(order) {
        const card = document.createElement('div');
        card.className = 'order-card';
        
        card.innerHTML = `
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
                    <span class="label">Заказчик:</span>
                    <span class="value">${order.name_company}</span>
                </p>
                <p>
                    <span class="label">Стоимость:</span>
                    <span class="value">${order.total_price} руб.</span>
                </p>
            </div>
            <div class="card-actions">
                <button class="action-btn" onclick="showOrderDetails(${order.puty_list_id})" style="display: flex;">
                    <i class="fas fa-info-circle"></i> Подробнее
                </button>
            <button class="take-load-btn" onclick="takeLoad(${order.puty_list_id})">
                Взять груз
            </button>
            </div>
        `;
        
        return card;
    }

    // Функция обновления пагинации
    function updatePagination(currentPage, isLastPage) {
        const pagination = document.getElementById('pagination');
        pagination.innerHTML = '';

        // Кнопка "Предыдущая"
        const prevButton = document.createElement('button');
        prevButton.textContent = 'Предыдущая';
        prevButton.disabled = currentPage === 1;
        prevButton.onclick = () => loadOrders(currentPage - 1);
        pagination.appendChild(prevButton);

        // Текущая страница
        const currentButton = document.createElement('button');
        currentButton.textContent = currentPage;
        currentButton.classList.add('active');
        pagination.appendChild(currentButton);

        // Кнопка "Следующая"
        const nextButton = document.createElement('button');
        nextButton.textContent = 'Следующая';
        nextButton.disabled = isLastPage;
        nextButton.onclick = () => loadOrders(currentPage + 1);
        pagination.appendChild(nextButton);
    }

    // Функция для взятия груза
    window.takeLoad = async function(putyListId) {
        try {
            showLoading();
            const response = await fetch('http://0.0.0.0:8000/api/puty-list/take-load', {
                method: 'PATCH',
                headers: {
                    'puty_list_id': putyListId,
                    'driver_id': driverId
                }
            });

            if (!response.ok) {
                throw new Error('Ошибка при взятии груза');
            }

            // Создаем и показываем кастомное уведомление
            const notification = document.createElement('div');
            notification.className = 'notification success';
            notification.innerHTML = `
                <div class="notification-icon">
                    <i class="fas fa-check-circle"></i>
                </div>
                <div class="notification-content">
                    <h4>Груз успешно взят!</h4>
                    <p>Заказ добавлен в раздел "Мои грузы" со статусом "Не доставлен"</p>
                </div>
                <button class="notification-close">
                    <i class="fas fa-times"></i>
                </button>
            `;
            document.body.appendChild(notification);

            // Добавляем стили для уведомления
            const notificationStyles = document.createElement('style');
            notificationStyles.textContent = `
                .notification {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    display: flex;
                    align-items: center;
                    padding: 15px;
                    background: white;
                    border-radius: 8px;
                    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
                    z-index: 1000;
                    transform: translateX(100%);
                    opacity: 0;
                    transition: all 0.3s ease;
                }

                .notification.show {
                    transform: translateX(0);
                    opacity: 1;
                }

                .notification.success {
                    border-left: 4px solid #2ecc71;
                }

                .notification-icon {
                    margin-right: 15px;
                    font-size: 24px;
                    color: #2ecc71;
                }

                .notification-content {
                    flex: 1;
                }

                .notification-content h4 {
                    margin: 0 0 5px 0;
                    color: #2c3e50;
                    font-size: 16px;
                }

                .notification-content p {
                    margin: 0;
                    color: #7f8c8d;
                    font-size: 14px;
                }

                .notification-close {
                    background: none;
                    border: none;
                    color: #95a5a6;
                    cursor: pointer;
                    padding: 0;
                    margin-left: 10px;
                    font-size: 16px;
                    transition: color 0.3s ease;
                }

                .notification-close:hover {
                    color: #2c3e50;
                }
            `;
            document.head.appendChild(notificationStyles);

            // Показываем уведомление
            setTimeout(() => {
                notification.classList.add('show');
            }, 100);

            // Закрываем уведомление через 5 секунд
            setTimeout(() => {
                notification.classList.remove('show');
                setTimeout(() => {
                    notification.remove();
                }, 300);
            }, 5000);

            // Обработчик закрытия уведомления
            notification.querySelector('.notification-close').onclick = () => {
                notification.classList.remove('show');
                setTimeout(() => {
                    notification.remove();
                }, 300);
            };
            
            // Закрываем модальное окно, если оно открыто
            const modal = document.querySelector('.modal');
            if (modal) {
                modal.classList.remove('show');
                setTimeout(() => {
                    modal.remove();
                }, 300);
            }
            
            // Обновляем список заказов
            await loadOrders(currentPage);
            
        } catch (error) {
            console.error('Ошибка:', error);
            // Показываем уведомление об ошибке
            const notification = document.createElement('div');
            notification.className = 'notification error';
            notification.innerHTML = `
                <div class="notification-icon">
                    <i class="fas fa-exclamation-circle"></i>
                </div>
                <div class="notification-content">
                    <h4>Ошибка!</h4>
                    <p>${error.message}</p>
                </div>
                <button class="notification-close">
                    <i class="fas fa-times"></i>
                </button>
            `;
            document.body.appendChild(notification);

            // Добавляем стили для уведомления об ошибке
            const errorStyles = document.createElement('style');
            errorStyles.textContent = `
                .notification.error {
                    border-left: 4px solid #e74c3c;
                }
                .notification.error .notification-icon {
                    color: #e74c3c;
                }
            `;
            document.head.appendChild(errorStyles);

            // Показываем уведомление
            setTimeout(() => {
                notification.classList.add('show');
            }, 100);

            // Закрываем уведомление через 5 секунд
            setTimeout(() => {
                notification.classList.remove('show');
                setTimeout(() => {
                    notification.remove();
                }, 300);
            }, 5000);

            // Обработчик закрытия уведомления
            notification.querySelector('.notification-close').onclick = () => {
                notification.classList.remove('show');
                setTimeout(() => {
                    notification.remove();
                }, 300);
            };
        } finally {
            hideLoading();
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

    // Добавляем стили для модального окна
    const modalStyles = document.createElement('style');
    modalStyles.textContent = `
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

        .order-info p {
            margin: 0;
            display: flex;
            flex-direction: column;
            gap: 5px;
            word-break: break-word;
        }

        .label {
            color: #7f8c8d;
            font-size: 14px;
        }

        .value {
            color: #2c3e50;
            font-weight: 500;
            word-break: break-word;
        }

        .card-actions {
            display: flex;
            flex-direction: column;
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
            width: 100%;
            height: 32px;
            font-size: 14px;
        }

        .action-btn:hover {
            background-color: #c0392b;
        }

        .action-btn i {
            font-size: 14px;
        }

        .take-load-btn {
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
            width: 100%;
            height: 32px;
            font-size: 14px;
            margin-top: 10px;
        }

        .take-load-btn:hover {
            background-color: #c0392b;
        }

        #ordersContainer {
            display: flex;
            flex-wrap: wrap;
            gap: 20px;
            padding: 20px;
            justify-content: flex-start;
        }

        .search-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            margin: 20px 0;
            padding: 0 20px;
            gap: 10px;
            background: white;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            padding: 20px;
            margin: 20px;
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
            flex-wrap: wrap;
            justify-content: center;
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
    document.head.appendChild(modalStyles);

    // Создаем и добавляем поисковую строку
    const searchContainer = document.createElement('div');
    searchContainer.className = 'search-container';
    searchContainer.innerHTML = `
        <div class="search-header">
            <h2>Поиск заказов</h2>
            <div class="search-input-wrapper">
                <input type="text" class="search-input" placeholder="Введите для поиска..." id="orderSearch">
                <i class="fas fa-search search-icon"></i>
            </div>
        </div>
        <div class="search-options">
            <div class="search-option active" data-type="number">
                <i class="fas fa-hashtag"></i>
                По номеру
            </div>
            <div class="search-option" data-type="departure">
                <i class="fas fa-truck-loading"></i>
                По городу отправления
            </div>
            <div class="search-option" data-type="arrival">
                <i class="fas fa-truck"></i>
                По городу прибытия
            </div>
        </div>
    `;
    document.getElementById('ordersContainer').parentNode.insertBefore(searchContainer, document.getElementById('ordersContainer'));

    // Добавляем стили для поиска
    const searchStyles = document.createElement('style');
    searchStyles.textContent = `
        .search-container {
            background: white;
            border-radius: 8px;
            padding: 20px;
            margin: 20px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .search-header {
            margin-bottom: 20px;
        }

        .search-header h2 {
            color: #2c3e50;
            margin-bottom: 15px;
            font-size: 1.5em;
        }

        .search-input-wrapper {
            position: relative;
            max-width: 500px;
        }

        .search-input {
            width: 100%;
            padding: 12px 15px 12px 40px;
            border: 2px solid #e74c3c;
            border-radius: 8px;
            font-size: 16px;
            outline: none;
            transition: all 0.3s ease;
        }

        .search-input:focus {
            border-color: #c0392b;
            box-shadow: 0 0 0 3px rgba(231, 76, 60, 0.2);
        }

        .search-icon {
            position: absolute;
            left: 15px;
            top: 50%;
            transform: translateY(-50%);
            color: #7f8c8d;
            font-size: 16px;
        }

        .search-options {
            display: flex;
            gap: 15px;
            flex-wrap: wrap;
        }

        .search-option {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 10px 15px;
            background-color: #f8f9fa;
            color: #2c3e50;
            border: 2px solid #e9ecef;
            border-radius: 6px;
            cursor: pointer;
            transition: all 0.3s ease;
            font-size: 14px;
        }

        .search-option:hover {
            background-color: #e9ecef;
            border-color: #dee2e6;
        }

        .search-option.active {
            background-color: #e74c3c;
            color: white;
            border-color: #c0392b;
        }

        .search-option i {
            font-size: 14px;
        }
    `;
    document.head.appendChild(searchStyles);

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
                    searchText = card.querySelector('p:nth-child(1) .value').textContent.toLowerCase();
                    break;
                case 'arrival':
                    searchText = card.querySelector('p:nth-child(2) .value').textContent.toLowerCase();
                    break;
            }
            
            if (searchText.includes(searchTerm)) {
                card.style.display = 'flex';
            } else {
                card.style.display = 'none';
            }
        });
    });

    // Обработчики навигации
    document.querySelector('.menu li:first-child').addEventListener('click', () => {
        window.location.href = 'driver.html';
    });

    document.querySelector('.menu li:nth-child(2)').addEventListener('click', () => {
        window.location.href = 'driver_order.html';
    });

    // Обработчик выхода
    document.getElementById('logoutBtn').addEventListener('click', () => {
        localStorage.clear();
        window.location.href = 'index.html';
    });

    // Загрузка заказов при запуске
    loadOrders(currentPage);
}); 