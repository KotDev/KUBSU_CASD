document.addEventListener('DOMContentLoaded', function() {
    // Проверка авторизации
    const userId = localStorage.getItem('userId');
    const documentId = localStorage.getItem('documentId');
    const role = localStorage.getItem('role');

    if (!userId || !documentId || !role || role !== 'driver') {
        window.location.href = 'index.html';
        return;
    }

    // Элементы интерфейса
    const menuItems = document.querySelectorAll('.menu li');
    const sections = document.querySelectorAll('.main-content > div');
    const logoutBtn = document.getElementById('logoutBtn');

    // Модальные окна
    const passportModal = document.getElementById('passportModal');
    const licenseModal = document.getElementById('licenseModal');
    const carModal = document.getElementById('carModal');
    const editCarModal = document.getElementById('editCarModal');
    const documentDetailsModal = document.getElementById('documentDetailsModal');
    const closeModalButtons = document.querySelectorAll('.close-modal');

    // Формы
    const passportForm = document.getElementById('passportForm');
    const licenseForm = document.getElementById('licenseForm');
    const carForm = document.getElementById('carForm');
    const editCarForm = document.getElementById('editCarForm');
    const editDocumentForm = document.getElementById('editDocumentForm');

    // Кнопки
    const createPassportBtn = document.getElementById('createPassportBtn');
    const createLicenseBtn = document.getElementById('createLicenseBtn');
    const createCarBtn = document.getElementById('createCarBtn');
    const editDocumentBtn = document.getElementById('editDocumentBtn');

    // Переменные для хранения данных
    let currentDocumentType = '';
    let currentDocumentData = null;
    let currentCarData = null;
    let driverData = null

    // В начале файла, после объявления других переменных
    const editDriverModal = document.getElementById('editDriverModal');
    const editDriverForm = document.getElementById('editDriverForm');
    const editDriverBtn = document.getElementById('editDriverBtn');

    // Инициализация
    loadDriverData();
    setupEventListeners();

    // Загрузка данных водителя
    async function loadDriverData() {
        try {
            const loadingOverlay = document.querySelector('.loading-overlay');
            
            // Загрузка основной информации
            const driverResponse = await fetch('http://0.0.0.0:8000/api/drivers/me/', {
                headers: {
                    'driver_id': userId
                }
            });

            if (!driverResponse.ok) {
                throw new Error('Ошибка загрузки данных водителя');
            }

            driverData = await driverResponse.json();
            displayDriverInfo(driverData);

            // Загрузка документов
            const documentsResponse = await fetch('http://0.0.0.0:8000/api/drivers/me/documents', {
                headers: {
                    'document_id': documentId,
                    'driver_id': userId
                }
            });

            if (!documentsResponse.ok) {
                throw new Error('Ошибка загрузки документов');
            }

            const documentsData = await documentsResponse.json();
            await processDocuments(documentsData);

            // После обновления данных переназначаем обработчики событий
            setupDocumentClickHandlers();

            // Скрываем оверлей загрузки
            loadingOverlay.classList.add('hide');

            // Запускаем анимации
            animateElements();

        } catch (error) {
            console.error('Ошибка:', error);
            alert(error.message);
        }
    }

    // Отображение основной информации о водителе
    function displayDriverInfo(data) {
        document.getElementById('userId').textContent = userId;
        document.getElementById('driverName').textContent = data.name || 'Не указано';
        document.getElementById('driverMidName').textContent = data.mid_name || 'Не указано';
        document.getElementById('driverLastName').textContent = data.last_name || 'Не указано';

        const fullName = `${data.last_name || ''} ${data.name || ''} ${data.mid_name || ''}`.trim();
        document.getElementById('driverFullName').textContent = fullName || 'Водитель';
    }

    // Обработка документов
    async function processDocuments(data) {
        try {
        // Паспорт
        if (!data.number_passport) {
            createPassportBtn.style.display = 'block';
            document.getElementById('passportContent').innerHTML = '<p>Паспорт не зарегистрирован</p>';
        } else {
            createPassportBtn.style.display = 'none';
            const passportResponse = await fetch('http://0.0.0.0:8000/api/drivers/me/document/passport', {
                headers: {
                    'number_passport': data.number_passport,
                    'driver_id': userId
                }
            });

            if (passportResponse.ok) {
                const passportData = await passportResponse.json();
                displayPassportInfo(passportData);
                localStorage.setItem('passportNumber', data.number_passport);
            } else {
                document.getElementById('passportContent').innerHTML = '<p>Ошибка загрузки данных паспорта</p>';
            }
        }

        // Водительское удостоверение
        if (!data.number_driverlicense) {
            createLicenseBtn.style.display = 'block';
            document.getElementById('licenseContent').innerHTML = '<p>Водительское удостоверение не зарегистрировано</p>';
        } else {
            createLicenseBtn.style.display = 'none';
            const licenseResponse = await fetch('http://0.0.0.0:8000/api/drivers/me/document/driver-license', {
                headers: {
                    'number_driverlicense': data.number_driverlicense,
                    'driver_id': userId
                }
            });

            if (licenseResponse.ok) {
                const licenseData = await licenseResponse.json();
                displayLicenseInfo(licenseData);
                localStorage.setItem('licenseNumber', data.number_driverlicense);
            } else {
                document.getElementById('licenseContent').innerHTML = '<p>Ошибка загрузки данных водительского удостоверения</p>';
            }
        }

        // Автомобиль
        if (!driverData?.car_id) {
            createCarBtn.style.display = 'block';
            document.getElementById('carContent').innerHTML = '<p>Автомобиль не зарегистрирован</p>';
        } else {
            createCarBtn.style.display = 'none';
            await loadCarInfo(driverData.car_id);
            localStorage.setItem('carId', driverData.car_id);
            }

            // После обновления контента переназначаем обработчики
            setupDocumentClickHandlers();
        } catch (error) {
            console.error('Ошибка:', error);
            alert(error.message);
        }
    }

    // Отображение информации о паспорте
    function displayPassportInfo(data) {
        displayDocumentInfo('passport', data);
    }

    // Отображение информации о водительском удостоверении
    function displayLicenseInfo(data) {
        displayDocumentInfo('license', data);
    }

    // Загрузка информации об автомобиле
    async function loadCarInfo(carId) {
        try {
            const response = await fetch('http://0.0.0.0:8000/api/driver-car/get', {
                headers: {
                    'car_id': carId,
                    'driver_id': userId
                }
            });

            if (!response.ok) {
                throw new Error('Ошибка загрузки данных автомобиля');
            }

            const carData = await response.json();
            displayCarInfo(carData);
            currentCarData = carData;
        } catch (error) {
            console.error('Ошибка:', error);
            document.getElementById('carContent').innerHTML = `<p>Ошибка загрузки данных автомобиля: ${error.message}</p>`;
        }
    }

    // Отображение информации об автомобиле
    function displayCarInfo(data) {
        displayDocumentInfo('car', data);
    }


    document.querySelector('.menu li:nth-child(2)').addEventListener('click', function() {
        window.location.href = 'driver_order.html';
    });

    document.querySelector('.menu li:nth-child(3)').addEventListener('click', () => {
        window.location.href = 'orders.html';
    });

    // Настройка обработчиков событий
    function setupEventListeners() {
        // Меню
        menuItems.forEach(item => {
            item.addEventListener('click', function() {
                const sectionName = this.dataset.section;
                if (sectionName === 'orders') {
                    window.location.href = 'driver_order.html';
                    return;
                }
                // Остальной код для других разделов...
            });
        });
    

        // Выход
        logoutBtn.addEventListener('click', function() {
            localStorage.clear();
            window.location.href = 'index.html';
        });

        // Закрытие модальных окон
        closeModalButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                closeModal();
            });
        });

        // Клик вне модального окна
        window.addEventListener('click', function(event) {
            const modal = document.getElementById('documentDetailsModal');
            if (event.target === modal) {
                closeModal();
            }
        });

        // Создание паспорта
        createPassportBtn.addEventListener('click', function() {
            passportModal.style.display = 'block';
        });

        // Создание водительского удостоверения
        createLicenseBtn.addEventListener('click', function() {
            licenseModal.style.display = 'block';
        });

        // Регистрация автомобиля
        createCarBtn.addEventListener('click', function() {
            carModal.style.display = 'block';
        });

        // Форма создания паспорта
        passportForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            try {
                const serialPassport = document.getElementById('passportSerial').value.trim();
                const numberPassport = document.getElementById('passportNumber').value.trim();
                const getDate = document.getElementById('passportIssueDate').value;
                const birthday = document.getElementById('passportBirthDate').value;

                // Валидация серии паспорта
                if (!/^\d{4}$/.test(serialPassport)) {
                    throw new Error('Серия паспорта должна состоять из 4 цифр');
                }

                // Валидация номера паспорта
                if (!/^\d{6}$/.test(numberPassport)) {
                    throw new Error('Номер паспорта должен состоять из 6 цифр');
                }

                // Валидация дат
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                const issueDate = new Date(getDate);
                const birthDate = new Date(birthday);

                if (issueDate > today) {
                    throw new Error('Дата выдачи не может быть в будущем');
                }

                if (birthDate > today) {
                    throw new Error('Дата рождения не может быть в будущем');
                }

            const passportData = {
                    serial_passport: serialPassport,
                    number_passport: numberPassport,
                    get_date: getDate,
                    birthday: birthday,
                document_id: parseInt(documentId)
            };

                const response = await fetch('http://0.0.0.0:8000/api/drivers/me/document/passport/create', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(passportData)
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.detail || 'Ошибка создания паспорта');
                }

                const result = await response.json();
                passportModal.style.display = 'none';
                passportForm.reset();
                await loadDriverData();

            } catch (error) {
                console.error('Ошибка:', error);
                alert(error.message);
            }
        });

        // Форма создания водительского удостоверения
        licenseForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            try {
                const seriaLicense = document.getElementById('licenseSeria').value.trim();
                const numberLicense = document.getElementById('licenseNumber').value.trim();
                const getDate = document.getElementById('licenseIssueDate').value;

                // Валидация серии водительского удостоверения
                if (!/^\d{6}$/.test(seriaLicense)) {
                    throw new Error('Серия водительского удостоверения должна состоять из 6 цифр');
                }

                // Валидация номера водительского удостоверения
                if (!/^\d{4}$/.test(numberLicense)) {
                    throw new Error('Номер водительского удостоверения должен состоять из 4 цифр');
                }

                // Валидация даты выдачи
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                const issueDate = new Date(getDate);

                if (issueDate > today) {
                    throw new Error('Дата выдачи не может быть в будущем');
                }

            const licenseData = {
                    seria_driverlicense: seriaLicense,
                    number_driverlicense: numberLicense,
                    get_date: getDate,
                document_id: parseInt(documentId)
            };

                const response = await fetch('http://0.0.0.0:8000/api/drivers/me/document/driver-license/create', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(licenseData)
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.detail || 'Ошибка создания водительского удостоверения');
                }

                const result = await response.json();
                licenseModal.style.display = 'none';
                licenseForm.reset();
                await loadDriverData();

            } catch (error) {
                console.error('Ошибка:', error);
                alert(error.message);
            }
        });

        // Форма регистрации автомобиля
        carForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            try {
                const carName = document.getElementById('carBrand').value.trim();
                const carNumber = document.getElementById('carNumber').value.trim().toUpperCase();
                const serialNumber = document.getElementById('carSerial').value.trim();

                // Валидация названия автомобиля
                if (carName.length < 1 || carName.length > 60) {
                    throw new Error('Название автомобиля должно быть от 1 до 60 символов');
                }

                // Валидация номера автомобиля
                if (!/^[A-Z]\d{3}[A-Z]{2}\d{2}$/.test(carNumber)) {
                    throw new Error('Неверный формат номера автомобиля. Пример: A123BC45');
                }

                // Валидация серийного номера
                const serialNumberInt = parseInt(serialNumber);
                if (isNaN(serialNumberInt)) {
                    throw new Error('Серийный номер должен быть числом');
                }

            const carData = {
                    car_name: carName,
                    number_car: carNumber,
                    serial_number_car: serialNumberInt
                };

                const response = await fetch('http://0.0.0.0:8000/api/driver-car/create', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'driver_id': userId
                    },
                    body: JSON.stringify(carData)
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.detail || 'Ошибка регистрации автомобиля');
                }

                const result = await response.json();
                carModal.style.display = 'none';
                carForm.reset();
                await loadDriverData();

            } catch (error) {
                console.error('Ошибка:', error);
                alert(error.message);
            }
        });

        // В функции setupEventListeners добавим обработчики для редактирования водителя
        editDriverBtn.addEventListener('click', function() {
            // Заполняем форму текущими данными
            document.getElementById('editDriverName').value = driverData.name || '';
            document.getElementById('editDriverMidName').value = driverData.mid_name || '';
            document.getElementById('editDriverLastName').value = driverData.last_name || '';
            editDriverModal.style.display = 'block';
        });

        // Обработчик отправки формы редактирования водителя
        editDriverForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            const updatedDriverData = {
                name: document.getElementById('editDriverName').value.trim(),
                mid_name: document.getElementById('editDriverMidName').value.trim(),
                last_name: document.getElementById('editDriverLastName').value.trim()
            };

            try {
                // Валидация
                if (!updatedDriverData.name || !updatedDriverData.mid_name || !updatedDriverData.last_name) {
                    throw new Error('Все поля должны быть заполнены');
                }

                // PUT запрос для обновления данных
                const putResponse = await fetch('http://0.0.0.0:8000/api/drivers/me/', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'driver_id': userId
                    },
                    body: JSON.stringify(updatedDriverData)
                });

                if (!putResponse.ok) {
                    const errorData = await putResponse.json();
                    throw new Error(errorData.detail || 'Ошибка обновления данных');
                }

                // GET запрос для получения обновленных данных
                const getResponse = await fetch('http://0.0.0.0:8000/api/drivers/me/', {
                    headers: {
                        'driver_id': userId
                    }
                });

                if (!getResponse.ok) {
                    throw new Error('Ошибка получения обновленных данных');
                }

                // Обновляем данные на странице
                driverData = await getResponse.json();
                displayDriverInfo(driverData);
                
                // Закрываем модальное окно
                editDriverModal.style.display = 'none';
                editDriverForm.reset();

                // Показываем сообщение об успехе
                alert('Данные успешно обновлены');

            } catch (error) {
                console.error('Ошибка:', error);
                alert(error.message);
            }
        });

        // Добавляем обработчик для закрытия модального окна
        editDriverModal.querySelector('.close-modal').addEventListener('click', function() {
            editDriverModal.style.display = 'none';
            editDriverForm.reset();
        });
    }

    // Функция настройки обработчиков событий документов
    function setupDocumentClickHandlers() {
        console.log('Настройка обработчиков событий');
        
        document.querySelectorAll('.document-item').forEach(item => {
            console.log('Найден элемент документа:', item);
            
            item.addEventListener('click', async function(e) {
                console.log('Клик по документу');
                if (e.target.closest('button')) {
                    console.log('Клик по кнопке, пропускаем');
                    return;
                }

                const documentType = this.getAttribute('data-type');
                console.log('Тип документа:', documentType);
                currentDocumentType = documentType;

                // Сбрасываем состояние модального окна перед показом новых данных
                const documentDetailsContent = document.getElementById('documentDetailsContent');
                const editFormContainer = document.getElementById('editFormContainer');
                const closeModalBtn = document.querySelector('.close-modal');

                if (documentDetailsContent) {
                    documentDetailsContent.style.display = 'block';
                }
                if (editFormContainer) {
                    editFormContainer.innerHTML = '';
                }
                if (closeModalBtn) {
                    closeModalBtn.style.display = 'block';
                }

                try {
                    const modalTitle = document.getElementById('documentDetailsTitle');
                    const detailsContent = document.getElementById('documentDetailsContent');
                    const modal = document.getElementById('documentDetailsModal');

                    if (!modalTitle || !detailsContent || !modal) {
                        console.error('Не найдены необходимые элементы модального окна');
                        return;
                    }

                    modalTitle.textContent = documentType === 'passport' ? 'Паспортные данные' :
                    documentType === 'license' ? 'Водительское удостоверение' :
                    'Данные автомобиля';

                    if (documentType === 'passport') {
                        const passportNumber = localStorage.getItem('passportNumber');
                        console.log('Номер паспорта:', passportNumber);
                        
                        const response = await fetch('http://0.0.0.0:8000/api/drivers/me/document/passport', {
                            headers: {
                                'number_passport': passportNumber,
                                'driver_id': userId
                            }
                        });

                        if (!response.ok) {
                            throw new Error('Ошибка загрузки данных паспорта');
                        }

                        const passportData = await response.json();
                        console.log('Данные паспорта:', passportData);

                        detailsContent.innerHTML = `
                            <div class="document-details">
                                <p><strong>Серия/Номер:</strong> ${passportData.serial_passport || 'Не указано'}/${passportData.number_passport || 'Не указано'}</p>
                                <p><strong>Дата выдачи:</strong> ${passportData.get_date || 'Не указана'}</p>
                                <p><strong>Дата рождения:</strong> ${passportData.birthday || 'Не указана'}</p>
                                <button class="action-btn edit-btn" onclick="startEdit()">
                                    <i class="fas fa-edit"></i> Изменить
                                </button>
                            </div>
                        `;
                    } else if (documentType === 'license') {
                        const licenseNumber = localStorage.getItem('licenseNumber');
                        console.log('Номер лицензии:', licenseNumber);
                        
                        const response = await fetch('http://0.0.0.0:8000/api/drivers/me/document/driver-license', {
                            headers: {
                                'number_driverlicense': licenseNumber,
                                'driver_id': userId
                            }
                        });

                        if (!response.ok) {
                            throw new Error('Ошибка загрузки данных водительского удостоверения');
                        }

                        const licenseData = await response.json();
                        console.log('Данные лицензии:', licenseData);

                        detailsContent.innerHTML = `
                            <div class="document-details">
                                <p><strong>Серия/Номер:</strong> ${licenseData.seria_driverlicense || 'Не указано'}/${licenseData.number_driverlicense || 'Не указано'}</p>
                                <p><strong>Дата выдачи:</strong> ${licenseData.get_date || 'Не указана'}</p>
                                <div class="categories-list">
                                    <strong>Категории:</strong>
                                    ${licenseData.categoryes?.map(cat => `
                                        <span class="category-badge">${cat.category_name}</span>
                                    `).join('') || 'Нет категорий'}
                                </div>
                                <button class="action-btn edit-btn" onclick="startEdit()">
                                    <i class="fas fa-edit"></i> Изменить
                                </button>
                            </div>
                        `;
                    } else if (documentType === 'car') {
                        const carId = localStorage.getItem('carId');
                        console.log('ID автомобиля:', carId);
                        
                        const response = await fetch('http://0.0.0.0:8000/api/driver-car/get', {
                            headers: {
                                'car_id': carId,
                                'driver_id': userId
                            }
                        });

                        if (!response.ok) {
                            throw new Error('Ошибка загрузки данных автомобиля');
                        }

                        const carData = await response.json();
                        console.log('Данные автомобиля:', carData);

                        detailsContent.innerHTML = `
                            <div class="document-details">
                                <p><strong>Марка:</strong> ${carData.car_name || 'Не указана'}</p>
                                <p><strong>Гос. номер:</strong> ${carData.number_car || 'Не указан'}</p>
                                <p><strong>Серийный номер:</strong> ${carData.serial_number_car || 'Не указан'}</p>
                                <button class="action-btn edit-btn" onclick="startEdit()">
                                    <i class="fas fa-edit"></i> Изменить
                                </button>
                            </div>
                        `;
                    }

                // Показываем модальное окно
                    modal.style.display = 'block';

                } catch (error) {
                    console.error('Ошибка:', error);
                    alert(error.message);
                }
            });
        });
    }

    // Функция для анимации появления элементов
    function animateElements() {
        // Анимация информационной карточки
        setTimeout(() => {
            document.querySelector('.info-card').classList.add('animate');
        }, 200);

        // Анимация секций документов
        document.querySelectorAll('.document-section').forEach((section, index) => {
            setTimeout(() => {
                section.classList.add('animate');
            }, 600 + (index * 200));
        });

        // Анимация кнопок действий
        setTimeout(() => {
            document.querySelectorAll('.action-btn').forEach((btn, index) => {
                setTimeout(() => {
                    btn.classList.add('show');
                }, 1000 + (index * 100));
            });
        }, 1200);
    }

    // Обновленная функция отображения документов
    function displayDocumentInfo(type, data) {
        const contentId = type === 'passport' ? 'passportContent' :
                         type === 'license' ? 'licenseContent' :
                         'carContent';
        
        const content = document.getElementById(contentId);
        if (!content) return;

        let html = `<div class="document-item" data-type="${type}">`;
        
        if (type === 'passport') {
            html += `
                <p><strong>Серия/Номер:</strong> ${data.serial_passport || 'Не указано'}/${data.number_passport || 'Не указано'}</p>
                <p><strong>Дата выдачи:</strong> ${data.get_date || 'Не указана'}</p>
                <p><strong>Дата рождения:</strong> ${data.birthday || 'Не указана'}</p>
            `;
        } else if (type === 'license') {
            html += `
                <p><strong>Серия/Номер:</strong> ${data.seria_driverlicense || 'Не указано'}/${data.number_driverlicense || 'Не указано'}</p>
                <p><strong>Дата выдачи:</strong> ${data.get_date || 'Не указана'}</p>
                <div class="categories-list">
                    <strong>Категории:</strong>
                    ${data.categoryes?.map(cat => `
                        <span class="category-badge">${cat.category_name}</span>
                    `).join('') || 'Нет категорий'}
                </div>
            `;
        } else if (type === 'car') {
            html += `
                <p><strong>Марка:</strong> ${data.car_name || 'Не указана'}</p>
                <p><strong>Гос. номер:</strong> ${data.number_car || 'Не указан'}</p>
                <p><strong>Серийный номер:</strong> ${data.serial_number_car || 'Не указан'}</p>
            `;
        }

        html += '</div>';
        content.innerHTML = html;

        // Анимируем появление документа
        setTimeout(() => {
            const documentItem = content.querySelector('.document-item');
            if (documentItem) {
                documentItem.classList.add('show');
            }
        }, 100);
    }

    // Функция начала редактирования
    window.startEdit = async function() {
        const documentDetailsContent = document.getElementById('documentDetailsContent');
        const editFormContainer = document.getElementById('editFormContainer');
        const closeModalBtn = document.querySelector('.close-modal');

        try {
            // Скрываем крестик и содержимое
            if (closeModalBtn) closeModalBtn.style.display = 'none';
            if (documentDetailsContent) documentDetailsContent.style.display = 'none';

            // Очищаем контейнер формы перед добавлением новой
            if (editFormContainer) {
                editFormContainer.innerHTML = `
                    <form id="editDocumentForm">
                        <div id="editFormFields"></div>
                    </form>
                `;

            const editFormFields = document.getElementById('editFormFields');

            if (currentDocumentType === 'passport') {
                    const passportNumber = localStorage.getItem('passportNumber');
                    const response = await fetch('http://0.0.0.0:8000/api/drivers/me/document/passport', {
                    headers: {
                            'number_passport': passportNumber,
                        'driver_id': userId
                    }
                    });

                    if (!response.ok) {
                        throw new Error('Ошибка загрузки данных паспорта');
                    }

                    const passportData = await response.json();
                    const today = new Date().toISOString().split('T')[0];

                    editFormFields.innerHTML = `
                        <div class="form-group">
                            <label for="editPassportSerial">Серия (4 цифры):</label>
                            <input type="text" id="editPassportSerial" 
                                   value="${passportData.serial_passport}" 
                                   pattern="\\d{4}" 
                                   maxlength="4" 
                                   required>
                        </div>
                        <div class="form-group">
                            <label for="editPassportIssueDate">Дата выдачи:</label>
                            <input type="date" id="editPassportIssueDate" 
                                   value="${passportData.get_date}"
                                   max="${today}" 
                                   required>
                        </div>
                        <div class="form-group">
                            <label for="editPassportBirthDate">Дата рождения:</label>
                            <input type="date" id="editPassportBirthDate" 
                                   value="${passportData.birthday}"
                                   max="${today}" 
                                   required>
                        </div>
                        <div class="button-group">
                            <button type="submit" class="action-btn submit-btn">Сохранить</button>
                        </div>
                    `;
                } else if (currentDocumentType === 'license') {
                    const licenseNumber = localStorage.getItem('licenseNumber');
                    if (!licenseNumber) {
                        throw new Error('Номер лицензии не найден');
                    }

                    // Загружаем данные водительского удостоверения
                    const response = await fetch('http://0.0.0.0:8000/api/drivers/me/document/driver-license', {
                        headers: {
                            'number_driverlicense': licenseNumber,
                            'driver_id': userId
                        }
                    });

                    if (!response.ok) {
                        throw new Error('Ошибка загрузки данных водительского удостоверения');
                    }

                    const licenseData = await response.json();
                    console.log('Текущие данные водительского удостоверения:', licenseData);

                    // Загружаем доступные категории
                    const availableCategoriesResponse = await fetch('http://0.0.0.0:8000/api/drivers/me/driver-license/not-category', {
                        headers: {
                            'number_driverlicense': licenseNumber
                        }
                    });

                    if (!availableCategoriesResponse.ok) {
                        throw new Error('Ошибка загрузки доступных категорий');
                    }

                    const availableCategories = await availableCategoriesResponse.json();
                    console.log('Доступные категории:', availableCategories);

                    // Получаем текущую дату для ограничения
                    const today = new Date().toISOString().split('T')[0];

                    editFormFields.innerHTML = `
                        <div class="form-group">
                            <label for="editLicenseSeria">Серия (6 цифр):</label>
                            <input type="text" id="editLicenseSeria" 
                                   value="${licenseData.seria_driverlicense || ''}" 
                                   pattern="\\d{6}"
                                   maxlength="6"
                                   required>
                            <small class="form-text">Введите 6 цифр</small>
                        </div>
                        <div class="form-group">
                            <label for="editLicenseDate">Дата выдачи:</label>
                            <input type="date" id="editLicenseDate" 
                                   value="${licenseData.get_date || ''}"
                                   max="${today}"
                                   required>
                            <small class="form-text">Дата не может быть в будущем</small>
                        </div>
                        <div class="categories-container">
                            <div class="category-area" id="availableCategories">
                                <h4>Доступные категории</h4>
                                ${availableCategories.map(cat => `
                                    <div class="category-card" draggable="true" data-category-id="${cat.category_id}">
                                        ${cat.category_name}
                                    </div>
                                `).join('')}
                            </div>
                            <div class="category-area" id="assignedCategories">
                                <h4>Назначенные категории</h4>
                                ${licenseData.categoryes?.map(cat => `
                                    <div class="category-card" draggable="true" data-category-id="${cat.category_id}">
                                        ${cat.category_name}
                                    </div>
                                `).join('') || ''}
                            </div>
                        </div>
                        <div class="button-group">
                            <button type="submit" class="action-btn submit-btn">Сохранить</button>
                        </div>
                    `;

                    // Инициализация drag and drop
                    setupDragAndDrop();
                } else if (currentDocumentType === 'car') {
                    const carId = localStorage.getItem('carId');
                    const response = await fetch('http://0.0.0.0:8000/api/driver-car/get', {
                        headers: {
                            'car_id': carId,
                            'driver_id': userId
                        }
                    });

                    if (!response.ok) {
                        throw new Error('Ошибка загрузки данных автомобиля');
                    }

                    const carData = await response.json();

                    editFormFields.innerHTML = `
                        <div class="form-group">
                            <label for="editCarBrand">Марка (от 1 до 60 символов):</label>
                            <input type="text" id="editCarBrand" 
                                   value="${carData.car_name || ''}" 
                                   maxlength="60"
                                   required>
                        </div>
                        <div class="form-group">
                            <label for="editCarNumber">Гос. номер (формат: A123BC45):</label>
                            <input type="text" id="editCarNumber" 
                                   value="${carData.number_car || ''}" 
                                   pattern="[A-Z]\\d{3}[A-Z]{2}\\d{2}"
                                   placeholder="A123BC45"
                                   required>
                        </div>
                        <div class="form-group">
                            <label for="editCarSerial">Серийный номер (только цифры):</label>
                            <input type="number" id="editCarSerial" 
                                   value="${carData.serial_number_car || ''}" 
                                   required>
                        </div>
                        <div class="button-group">
                            <button type="submit" class="action-btn submit-btn">Сохранить</button>
                        </div>
                    `;
                }
            }
        } catch (error) {
                    console.error('Ошибка:', error);
            alert(error.message);
        }
    };

    // Функция закрытия модального окна
    function closeModal() {
        const modal = document.getElementById('documentDetailsModal');
        const documentDetailsContent = document.getElementById('documentDetailsContent');
        const editFormContainer = document.getElementById('editFormContainer');
        const closeModalBtn = document.querySelector('.close-modal');

        if (modal) {
            modal.style.display = 'none';
        }

        // Сбрасываем состояние модального окна
        if (documentDetailsContent) {
            documentDetailsContent.style.display = 'block';
        }
        if (editFormContainer) {
            editFormContainer.innerHTML = '';
        }
        if (closeModalBtn) {
            closeModalBtn.style.display = 'block';
        }
    }

    // Инициализация анимаций при загрузке страницы
    setTimeout(() => {
        document.querySelector('.animated-menu').style.opacity = '1';
    }, 100);

    setTimeout(() => {
        document.querySelector('.animated-container').style.opacity = '1';
    }, 200);

    document.querySelectorAll('.document-card').forEach((card, index) => {
        setTimeout(() => {
            card.style.opacity = '1';
        }, 300 + (index * 100));
    });

    // Функция для настройки drag and drop
    function setupDragAndDrop() {
        const categoryCards = document.querySelectorAll('.category-card');
        const dropAreas = document.querySelectorAll('.category-area');

        categoryCards.forEach(card => {
            card.addEventListener('dragstart', function(e) {
                e.target.classList.add('dragging');
            });

            card.addEventListener('dragend', function(e) {
                e.target.classList.remove('dragging');
            });
        });

        dropAreas.forEach(area => {
            area.addEventListener('dragover', function(e) {
                e.preventDefault();
                const draggingCard = document.querySelector('.dragging');
                if (draggingCard) {
                    this.appendChild(draggingCard);
                }
            });

            area.addEventListener('drop', async function(e) {
            e.preventDefault();
                const card = document.querySelector('.dragging');
                if (!card) return; // Проверяем наличие перетаскиваемой карточки

                const categoryId = card.dataset.categoryId;
                const licenseNumber = localStorage.getItem('licenseNumber');
                const isAssigning = this.id === 'assignedCategories';

                try {
                    if (isAssigning) {
                        // Добавление категории (POST запрос)
                        const response = await fetch('http://0.0.0.0:8000/api/drivers/me/document/driver-license/add-category', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'number_driverlicense': licenseNumber
                            },
                            body: JSON.stringify({
                                category_id: parseInt(categoryId),
                                number_driverlicense: licenseNumber
                            })
                        });

                        if (!response.ok) {
                            throw new Error('Ошибка добавления категории');
                        }
                    } else {
                        // Удаление категории (DELETE запрос)
                        const response = await fetch('http://0.0.0.0:8000/api/drivers/me/document/driver-license/delete-category', {
                            method: 'DELETE',
                            headers: {
                                'category_id': categoryId,
                                'number_driverlicense': licenseNumber
                            }
                        });

                        if (!response.ok) {
                            throw new Error('Ошибка удаления категории');
                        }
                    }

                    // Обновляем отображение
                    card.classList.remove('dragging');
                } catch (error) {
                    console.error('Ошибка:', error);
                    alert(error.message);
                    // Возвращаем карточку на исходное место
                    const originalArea = isAssigning ? 'availableCategories' : 'assignedCategories';
                    const originalContainer = document.getElementById(originalArea);
                    if (originalContainer) {
                        originalContainer.appendChild(card);
                    }
                }
            });
        });
    }

    // Добавим стили для подсказок
    const style = document.createElement('style');
    style.textContent += `
        .form-text {
            font-size: 0.8em;
            color: #666;
            margin-top: 4px;
        }

        input:invalid {
            border-color: #dc3545;
        }

        input:invalid + .form-text {
            color: #dc3545;
        }

        input[type="date"]:invalid + .form-text {
            color: #dc3545;
        }
    `;
    document.head.appendChild(style);

    // Обновляем обработчик формы
    document.addEventListener('submit', async function(e) {
        if (e.target.id === 'editDocumentForm') {
            e.preventDefault();
            console.log('Отправка формы, тип документа:', currentDocumentType);

            try {
            if (currentDocumentType === 'passport') {
                    const passportSerial = document.getElementById('editPassportSerial').value;
                    const passportIssueDate = document.getElementById('editPassportIssueDate').value;
                    const passportBirthDate = document.getElementById('editPassportBirthDate').value;

                    // Валидация
                    if (!/^\d{4}$/.test(passportSerial)) {
                        throw new Error('Серия паспорта должна состоять из 4 цифр');
                    }

                    // Проверка дат
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    const issueDate = new Date(passportIssueDate);
                    const birthDate = new Date(passportBirthDate);

                    if (issueDate > today) {
                        throw new Error('Дата выдачи не может быть в будущем');
                    }
                    if (birthDate > today) {
                        throw new Error('Дата рождения не может быть в будущем');
                    }

                const passportData = {
                        serial_passport: passportSerial,
                        get_date: passportIssueDate,
                        birthday: passportBirthDate
                    };

                    console.log('Отправка данных паспорта:', passportData);

                    const response = await fetch('http://0.0.0.0:8000/api/drivers/me/document/passport', {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                            'number_passport': localStorage.getItem('passportNumber'),
                            'driver_id': userId
                        },
                        body: JSON.stringify(passportData)
                    });

                    if (!response.ok) {
                        const errorData = await response.json();
                        throw new Error(errorData.detail || 'Ошибка обновления паспорта');
                    }

                } else if (currentDocumentType === 'license') {
                    const licenseSeria = document.getElementById('editLicenseSeria').value;
                    const licenseDate = document.getElementById('editLicenseDate').value;

                    // Валидация
                    if (!/^\d{6}$/.test(licenseSeria)) {
                        throw new Error('Серия должна состоять из 6 цифр');
                    }

                    // Проверка даты
                    const selectedDate = new Date(licenseDate);
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);

                    if (selectedDate > today) {
                        throw new Error('Дата выдачи не может быть в будущем');
                    }

                    const licenseData = {
                        seria_driverlicense: licenseSeria,
                        get_date: licenseDate
                    };

                    console.log('Отправка данных лицензии:', licenseData);

                    const response = await fetch('http://0.0.0.0:8000/api/drivers/me/document/driver-license', {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                            'number_driverlicense': localStorage.getItem('licenseNumber')
                        },
                        body: JSON.stringify(licenseData)
                    });

                    if (!response.ok) {
                        const errorData = await response.json();
                        throw new Error(errorData.detail || 'Ошибка обновления водительского удостоверения');
                    }

                } else if (currentDocumentType === 'car') {
                    const carBrand = document.getElementById('editCarBrand').value.trim();
                    const carNumber = document.getElementById('editCarNumber').value.toUpperCase();
                    const serialNumber = document.getElementById('editCarSerial').value;

                    // Валидация
                    if (!carBrand) {
                        throw new Error('Название автомобиля не может быть пустым');
                    }
                    if (carBrand.length > 60) {
                        throw new Error('Название автомобиля не может быть длиннее 60 символов');
                    }

                    const carNumberRegex = /^[A-Z]\d{3}[A-Z]{2}\d{2}$/;
                    if (!carNumberRegex.test(carNumber)) {
                        throw new Error('Неверный формат номера автомобиля. Пример: A123BC45');
                    }

                    const serialNumberInt = parseInt(serialNumber);
                    if (isNaN(serialNumberInt) || serialNumberInt <= 0) {
                        throw new Error('Серийный номер должен быть положительным числом');
                    }

            const carData = {
                        car_name: carBrand,
                        number_car: carNumber,
                        serial_number_car: serialNumberInt
                    };

                    console.log('Отправка данных автомобиля:', carData);

                const response = await fetch('http://0.0.0.0:8000/api/driver-car/update', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                            'car_id': localStorage.getItem('carId'),
                        'driver_id': userId
                    },
                    body: JSON.stringify(carData)
                });

                if (!response.ok) {
                        const errorData = await response.json();
                        throw new Error(errorData.detail || 'Ошибка обновления данных автомобиля');
                    }
                }

                // Закрываем модальное окно и обновляем данные
                closeModal();

                // Обновляем данные и переназначаем обработчики
                await loadDriverData();
                setupDocumentClickHandlers();

                console.log('Данные успешно обновлены');

            } catch (error) {
                console.error('Ошибка:', error);
                alert(error.message);
            }
    }
});
});
