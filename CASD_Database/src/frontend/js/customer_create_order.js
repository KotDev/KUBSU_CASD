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
    document.getElementById('customerName').textContent = companyName || 'Компания';

    let selectedCargo = null;
    let cities = {};
    let cargos = [];

    // Функции для показа/скрытия загрузки
    function showLoading() {
        document.getElementById('loadingOverlay').style.display = 'flex';
    }

    function hideLoading() {
        document.getElementById('loadingOverlay').style.display = 'none';
    }

    // Загрузка регионов
    async function loadRegions() {
        try {
            const response = await fetch('http://0.0.0.0:8000/api/city/regions');
            if (!response.ok) throw new Error('Ошибка загрузки регионов');
            
            const data = await response.json();
            const regions = data.regions;

            const regionSelects = [document.getElementById('regionFrom'), document.getElementById('regionTo')];
            
            regionSelects.forEach(select => {
                select.innerHTML = '<option value="">Выберите регион</option>';
                regions.forEach(region => {
                    const option = document.createElement('option');
                    option.value = region.region_id;
                    option.textContent = region.region_name;
                    select.appendChild(option);
                });
            });
        } catch (error) {
            console.error('Ошибка:', error);
            alert('Ошибка при загрузке регионов');
        }
    }

    // Загрузка городов для региона
    async function loadCities(regionId, targetSelect) {
        try {
            const response = await fetch(`http://0.0.0.0:8000/api/city/for-region?region_id=${regionId}`);
            if (!response.ok) throw new Error('Ошибка загрузки городов');
            
            const data = await response.json();
            cities[targetSelect.id] = data.cities;

            targetSelect.innerHTML = '<option value="">Выберите город</option>';
            data.cities.forEach(city => {
                const option = document.createElement('option');
                option.value = city.city_id;
                option.textContent = city.city_name;
                targetSelect.appendChild(option);
            });
            
            targetSelect.disabled = false;
        } catch (error) {
            console.error('Ошибка:', error);
            alert('Ошибка при загрузке городов');
        }
    }

    // Загрузка грузов
    async function loadCargos() {
        try {
            const response = await fetch('http://0.0.0.0:8000/api/cargo/get-all');
            if (!response.ok) throw new Error('Ошибка загрузки грузов');
            
            const data = await response.json();
            cargos = data.cargos;
            updateCargoList();
        } catch (error) {
            console.error('Ошибка:', error);
            alert('Ошибка при загрузке грузов');
        }
    }

    // Обновление списка грузов
    function updateCargoList(searchTerm = '') {
        const cargoList = document.getElementById('cargoList');
        const filteredCargos = searchTerm ? 
            cargos.filter(cargo => 
                cargo.cargo_name.toLowerCase().includes(searchTerm.toLowerCase())
            ) : cargos;

        cargoList.innerHTML = filteredCargos.length ? 
            filteredCargos.map(cargo => `
                <div class="cargo-item ${selectedCargo?.cargo_id === cargo.cargo_id ? 'selected' : ''}"
                     data-cargo-id="${cargo.cargo_id}">
                    <div class="cargo-name">${cargo.cargo_name}</div>
                    <div class="cargo-details">
                        Вес: ${cargo.weight} кг, 
                        Размеры: ${cargo.length}x${cargo.width}x${cargo.height} см
                    </div>
                </div>
            `).join('') :
            '<div class="loading-text">Нет подходящих грузов</div>';

        // Добавляем обработчики для выбора груза
        document.querySelectorAll('.cargo-item').forEach(item => {
            item.addEventListener('click', () => {
                const cargoId = parseInt(item.dataset.cargoId);
                selectedCargo = cargos.find(c => c.cargo_id === cargoId);
                updateCargoList(searchTerm);
                calculateTotal();
            });
        });
    }

    // Расчет стоимости
    function calculateTotal() {
        const distance = parseFloat(document.getElementById('distance').textContent);
        const priceKm = parseFloat(document.getElementById('priceKm').value) || 0;
        const priceKg = parseFloat(document.getElementById('priceKg').value) || 0;
        
        if (selectedCargo) {
            const total = (distance * priceKm) + (selectedCargo.weight * priceKg);
            document.getElementById('totalPrice').textContent = `${total.toFixed(2)} руб.`;
        }
    }

    // Обработчики событий
    document.getElementById('regionFrom').addEventListener('change', function() {
        const citySelect = document.getElementById('cityFrom');
        if (this.value) {
            loadCities(this.value, citySelect);
        } else {
            citySelect.innerHTML = '<option value="">Сначала выберите регион</option>';
            citySelect.disabled = true;
        }
    });

    document.getElementById('regionTo').addEventListener('change', function() {
        const citySelect = document.getElementById('cityTo');
        if (this.value) {
            loadCities(this.value, citySelect);
        } else {
            citySelect.innerHTML = '<option value="">Сначала выберите регион</option>';
            citySelect.disabled = true;
        }
    });

    document.getElementById('cargoSearch').addEventListener('input', function() {
        updateCargoList(this.value);
    });

    ['priceKm', 'priceKg'].forEach(id => {
        document.getElementById(id).addEventListener('input', calculateTotal);
    });

    // Обработка отправки формы
    document.getElementById('createOrderForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        
        if (!selectedCargo) {
            showToast({
                type: 'error',
                title: 'Ошибка',
                message: 'Пожалуйста, выберите груз',
                duration: 5000
            });
            return;
        }

        // Получаем значения дат
        const dateSendingInput = document.getElementById('dateSending');
        const dateArrivalInput = document.getElementById('dateArrival');
        
        // Преобразуем в объекты Date
        const dateSending = new Date(dateSendingInput.value);
        const dateArrival = new Date(dateArrivalInput.value);
        const now = new Date();

        // Валидация даты отправки
        if (dateSending < now) {
            showToast({
                type: 'error',
                title: 'Ошибка',
                message: 'Дата отправки не может быть меньше текущей даты',
                duration: 5000
            });
            return;
        }

        // Валидация даты прибытия
        if (dateArrival <= dateSending) {
            showToast({
                type: 'error',
                title: 'Ошибка',
                message: 'Дата прибытия должна быть позже даты отправки',
                duration: 5000
            });
            return;
        }

        // Преобразуем даты в формат без часового пояса
        const formattedDateSending = dateSendingInput.value.replace('T', ' ');
        const formattedDateArrival = dateArrivalInput.value.replace('T', ' ');

        const formData = {
            date_sending: formattedDateSending,
            date_arrival: formattedDateArrival,
            cargo_id: selectedCargo.cargo_id,
            customer_id: parseInt(customerId),
            send_city_id: parseInt(document.getElementById('cityFrom').value),
            arrival_city_id: parseInt(document.getElementById('cityTo').value),
            all_km: parseFloat(document.getElementById('distance').textContent),
            price_km: parseFloat(document.getElementById('priceKm').value),
            price_kg: parseFloat(document.getElementById('priceKg').value)
        };

        try {
            showLoading();
            const response = await fetch('http://0.0.0.0:8000/api/puty-list/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) throw new Error('Ошибка при создании заказа');

            // Показываем кастомное уведомление
            showToast({
                type: 'success',
                title: 'Успех!',
                message: 'Заказ успешно создан. Водитель в поиске заказа.',
                duration: 5000
            });

            // Переходим на страницу заказов через 2 секунды
            setTimeout(() => {
                window.location.href = 'customer_order.html';
            }, 2000);
        } catch (error) {
            console.error('Ошибка:', error);
            showToast({
                type: 'error',
                title: 'Ошибка',
                message: 'Ошибка при создании заказа: ' + error.message,
                duration: 5000
            });
        } finally {
            hideLoading();
        }
    });

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

    // Создаем контейнер для уведомлений
    const toastContainer = document.createElement('div');
    toastContainer.id = 'toastContainer';
    document.body.appendChild(toastContainer);

    // Навигация
    document.querySelector('.menu li[data-section="profile"]').addEventListener('click', () => {
        window.location.href = 'customer.html';
    });

    document.querySelector('.menu li[data-section="orders"]').addEventListener('click', () => {
        window.location.href = 'customer_order.html';
    });

    document.getElementById('logoutBtn').addEventListener('click', () => {
        localStorage.clear();
        window.location.href = 'index.html';
    });

    // Инициализация
    loadRegions();
    loadCargos();
}); 