document.addEventListener('DOMContentLoaded', function() {
    const customerId = localStorage.getItem('userId');
    const documentId = localStorage.getItem('documentId');
    const role = localStorage.getItem('role');
    const companyName = localStorage.getItem('companyName');

    if (!customerId || !documentId || role !== 'customer') {
        window.location.href = 'index.html';
        return;
    }

    // Загрузка имени компании
    const customerNameElement = document.getElementById('customerName');
    if (companyName) {
        customerNameElement.textContent = companyName;
    } else {
        // Если нет в localStorage, загружаем с сервера
        fetch('http://0.0.0.0:8000/api/customer/me/', {
            headers: { 'customer_id': customerId }
        })
        .then(response => response.json())
        .then(data => {
            const name = data.name_company;
            localStorage.setItem('companyName', name); // Сохраняем в localStorage
            customerNameElement.textContent = name;
        })
        .catch(error => {
            console.error('Ошибка загрузки данных компании:', error);
            customerNameElement.textContent = 'Компания';
        });
    }

    let currentPutyListId = null;

    // Функция для показа индикатора загрузки
    function showLoading() {
        document.getElementById('loadingOverlay').style.display = 'flex';
    }

    // Функция для скрытия индикатора загрузки
    function hideLoading() {
        document.getElementById('loadingOverlay').style.display = 'none';
    }

    // Функция загрузки заказов
    async function loadOrders(status = 'В пути') {
        try {
            showLoading();
            const response = await fetch(`http://0.0.0.0:8000/api/puty-list/customer/?status=${status}`, {
                headers: {
                    'customer_id': customerId
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            const ordersContainer = document.getElementById('ordersContainer');
            ordersContainer.innerHTML = '';

            if (data.line && Array.isArray(data.line)) {
                // Фильтруем заказы по статусу на стороне клиента
                const filteredOrders = data.line.filter(order => order.status === status);
                
                if (filteredOrders.length > 0) {
                    filteredOrders.forEach(order => {
                        const card = createOrderCard(order);
                        ordersContainer.appendChild(card);
                    });
                } else {
                    ordersContainer.innerHTML = '<p style="text-align: center; color: #666;">Нет заказов с выбранным статусом</p>';
                    showToast({
                        type: 'info',
                        title: 'Нет заказов',
                        message: `Заказы со статусом "${status}" отсутствуют`,
                        duration: 4000
                    });
                }
            } else {
                ordersContainer.innerHTML = '<p style="text-align: center; color: #666;">Нет доступных заказов</p>';
            }
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

    // Функция создания карточки заказа
    function createOrderCard(order) {
        const card = document.createElement('div');
        card.className = 'order-card info-card';
        
        card.innerHTML = `
            <div class="card-content">
                <h3>Заказ №${order.puty_list_id}</h3>
                <div class="order-info">
                    <div class="info-row">
                        <span class="label">Откуда:</span>
                        <span class="value">${order.departure_city_name}</span>
                    </div>
                    <div class="info-row">
                        <span class="label">Куда:</span>
                        <span class="value">${order.arrival_city_name}</span>
                    </div>
                    <div class="info-row">
                        <span class="label">Груз:</span>
                        <span class="value">${order.cargo_name}</span>
                    </div>
                    <div class="info-row">
                        <span class="label">Статус:</span>
                        <span class="value">${order.status}</span>
                    </div>
                    <div class="info-row">
                        <span class="label">Стоимость:</span>
                        <span class="value">${order.total_price} руб.</span>
                    </div>
                </div>
            </div>
            <div class="card-actions">
                <button class="action-btn" onclick="showOrderDetails(${order.puty_list_id})">
                    Подробнее
                </button>
                <button class="action-btn" onclick="generateContract(${order.puty_list_id})">
                    Договор
                </button>
            </div>
        `;
        
        return card;
    }

    // Функция показа подробной информации
    window.showOrderDetails = async function(putyListId) {
        try {
            showLoading();
            currentPutyListId = putyListId;
            
            const response = await fetch('http://0.0.0.0:8000/api/puty-list/info', {
                headers: {
                    'puty_list_id': putyListId
                }
            });

            if (!response.ok) {
                throw new Error('Ошибка получения данных');
            }

            const data = await response.json();
            
            // Заполняем данные в модальном окне
            document.getElementById('detailDeparture').textContent = data.departure_city_name;
            document.getElementById('detailArrival').textContent = data.arrival_city_name;
            document.getElementById('detailDateSending').textContent = new Date(data.date_sending).toLocaleDateString();
            document.getElementById('detailDateArrival').textContent = new Date(data.date_arrival).toLocaleDateString();
            document.getElementById('detailDistance').textContent = data.all_km;
            document.getElementById('detailCargoName').textContent = data.cargo_name;
            document.getElementById('detailWeight').textContent = data.weight;
            document.getElementById('detailDimensions').textContent = 
                `${data.length}x${data.width}x${data.height} см`;
            document.getElementById('detailPriceKm').textContent = data.price_km;
            document.getElementById('detailPriceKg').textContent = data.price_kg;
            document.getElementById('detailTotalPrice').textContent = data.total_price;

            // Обновляем обработчик кнопки договора
            const contractButton = document.getElementById('contractButton');
            contractButton.onclick = () => generateContract(putyListId);

            // Показываем модальное окно
            document.getElementById('orderModal').style.display = 'block';
        } catch (error) {
            console.error('Ошибка:', error);
            alert('Ошибка при получении подробной информации');
        } finally {
            hideLoading();
        }
    };

    // Функция для создания уведомлений
    function showToast({ type = 'info', title, message, duration = 5000 }) {
        const toastContainer = document.getElementById('toastContainer');
        
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
        `;
        
        toastContainer.appendChild(toast);
        
        // Анимация удаления
        setTimeout(() => {
            toast.classList.add('hiding');
            setTimeout(() => {
                toast.remove();
            }, 300);
        }, duration);
    }

    // Обновленная функция генерации договора
    window.generateContract = async function(putyListId) {
        try {
            showLoading();
            const response = await fetch('http://0.0.0.0:8000/api/puty-list/report-order', {
                headers: {
                    'customer_id': customerId,
                    'puty_list_id': putyListId
                }
            });

            if (response.status === 404) {
                showToast({
                    type: 'warning',
                    title: 'Договор недоступен',
                    message: 'Водитель ещё не назначен на этот заказ. Договор будет доступен после назначения водителя.',
                    duration: 6000
                });
                return;
            }

            if (!response.ok) {
                throw new Error('Ошибка при генерации договора');
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `contract_${putyListId}.pdf`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            a.remove();

            showToast({
                type: 'success',
                title: 'Успех!',
                message: 'Договор успешно сформирован и скачан',
                duration: 4000
            });
        } catch (error) {
            console.error('Ошибка:', error);
            showToast({
                type: 'error',
                title: 'Ошибка',
                message: 'Не удалось сгенерировать договор. Попробуйте позже.',
                duration: 5000
            });
        } finally {
            hideLoading();
        }
    };

    // Обработчики фильтров
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const status = this.dataset.status;
            console.log('Выбран статус:', status); // Для отладки
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            loadOrders(status);
        });
    });

    // Обработчики навигации
    document.querySelector('.menu li[data-section="profile"]').addEventListener('click', function() {
        window.location.href = 'customer.html';
    });

    document.querySelector('.menu li[data-section="create-order"]').addEventListener('click', function() {
        window.location.href = 'customer_create_order.html';
    });

    // Обработчик выхода
    document.getElementById('logoutBtn').addEventListener('click', () => {
        localStorage.clear();
        window.location.href = 'index.html';
    });

    // Обработчики модального окна
    document.querySelector('.close-btn').addEventListener('click', () => {
        document.getElementById('orderModal').style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        const modal = document.getElementById('orderModal');
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });

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
            border: 2px solid #3498db;
            border-radius: 8px;
            font-size: 16px;
            outline: none;
            transition: all 0.3s ease;
        }

        .search-input:focus {
            border-color: #2980b9;
            box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.2);
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
            background-color: #3498db;
            color: white;
            border-color: #2980b9;
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

    // Добавляем стили для карточек
    const cardStyles = document.createElement('style');
    cardStyles.textContent = `
        .order-card {
            display: flex;
            flex-direction: column;
            background: white;
            border-radius: 8px;
            padding: 20px;
            margin: 10px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            width: calc(100% - 20px);
            max-width: 400px;
            min-width: 300px;
        }

        .card-content {
            flex: 1;
        }

        .order-card h3 {
            color: #2c3e50;
            margin-bottom: 15px;
            font-size: 1.2em;
        }

        .order-info {
            display: flex;
            flex-direction: column;
            gap: 10px;
        }

        .info-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .label {
            color: #7f8c8d;
            font-weight: 500;
        }

        .value {
            color: #2c3e50;
            font-weight: 600;
        }

        .card-actions {
            display: flex;
            flex-direction: column;
            gap: 10px;
            margin-top: 15px;
        }

        .action-btn {
            padding: 10px 15px;
            background-color: #3498db;
            color: white;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-size: 14px;
            transition: all 0.3s ease;
            width: 100%;
        }

        .action-btn:hover {
            background-color: #2980b9;
        }

        #ordersContainer {
            display: flex;
            flex-wrap: wrap;
            gap: 20px;
            padding: 20px;
            justify-content: flex-start;
        }
    `;
    document.head.appendChild(cardStyles);

    // При загрузке страницы загружаем заказы со статусом "В пути"
    loadOrders('В пути');
}); 