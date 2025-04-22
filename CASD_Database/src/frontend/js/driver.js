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

    // Инициализация
    loadDriverData();
    setupEventListeners();

    // Загрузка данных водителя
    async function loadDriverData() {
        try {
            // Загрузка основной информации
            const driverResponse = await fetch('http://0.0.0.0:8000/api/drivers/me/', {
                headers: {
                    'driver_id': userId
                }
            });

            if (!driverResponse.ok) {
                throw new Error('Ошибка загрузки данных водителя');
            }

            const driverData = await driverResponse.json();
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
            processDocuments(documentsData);

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
    function processDocuments(data) {
        // Паспорт
        if (!data.number_passport || !data.passport_data) {
            createPassportBtn.style.display = 'block';
            document.getElementById('passportContent').innerHTML = '<p>Паспорт не зарегистрирован</p>';
        } else {
            createPassportBtn.style.display = 'none';
            displayPassportInfo(data.passport_data);
            localStorage.setItem('passportNumber', data.passport_data.number_passport);
        }

        // Водительское удостоверение
        if (!data.number_driverlicense || !data.driver_license_data) {
            createLicenseBtn.style.display = 'block';
            document.getElementById('licenseContent').innerHTML = '<p>Водительское удостоверение не зарегистрировано</p>';
        } else {
            createLicenseBtn.style.display = 'none';
            displayLicenseInfo(data.driver_license_data);
            localStorage.setItem('licenseNumber', data.driver_license_data.number_driverlicense);
        }

        // Автомобиль
        if (!data.car_id) {
            createCarBtn.style.display = 'block';
            document.getElementById('carContent').innerHTML = '<p>Автомобиль не зарегистрирован</p>';
        } else {
            createCarBtn.style.display = 'none';
            loadCarInfo(data.car_id);
            localStorage.setItem('carId', data.car_id);
        }
    }

    // Отображение информации о паспорте
    function displayPassportInfo(data) {
        const passportContent = document.getElementById('passportContent');
        passportContent.innerHTML = `
            <div class="document-item" data-type="passport">
                <p><strong>Серия/Номер:</strong> ${data.serial_passport || 'Не указано'}/${data.number_passport || 'Не указано'}</p>
                <p><strong>Дата выдачи:</strong> ${data.get_date || 'Не указана'}</p>
                <p><strong>Дата рождения:</strong> ${data.birthday || 'Не указана'}</p>
            </div>
        `;
    }

    // Отображение информации о водительском удостоверении
    function displayLicenseInfo(data) {
        const categories = data.categoryes ? data.categoryes.map(c => c.category_name).join(', ') : '';
        const licenseContent = document.getElementById('licenseContent');

        licenseContent.innerHTML = `
            <div class="document-item" data-type="license">
                <p><strong>Серия/Номер:</strong> ${data.seria_driverlicense || 'Не указано'}/${data.number_driverlicense || 'Не указано'}</p>
                <p><strong>Дата выдачи:</strong> ${data.get_date || 'Не указана'}</p>
                ${categories ? `<p><strong>Категории:</strong> ${categories}</p>` : ''}
            </div>
        `;
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
        const carContent = document.getElementById('carContent');
        carContent.innerHTML = `
            <div class="document-item" data-type="car">
                <p><strong>Марка:</strong> ${data.car_name || data.brand || 'Не указана'}</p>
                <p><strong>Гос. номер:</strong> ${data.number_car || data.number || 'Не указан'}</p>
                <p><strong>Серийный номер:</strong> ${data.serial_number_car || 'Не указан'}</p>
                ${data.year ? `<p><strong>Год выпуска:</strong> ${data.year}</p>` : ''}
                <button id="editCarBtn" class="action-btn" style="margin-top: 10px;">
                    <i class="fas fa-edit"></i> Изменить
                </button>
            </div>
        `;
    }

    // Настройка обработчиков событий
    function setupEventListeners() {
        // Меню
        menuItems.forEach(item => {
            item.addEventListener('click', function() {
                const sectionId = this.getAttribute('data-section');

                // Обновление активного пункта меню
                menuItems.forEach(i => i.classList.remove('active'));
                this.classList.add('active');

                // Показ соответствующего раздела
                sections.forEach(section => {
                    if (section.id === `${sectionId}Section`) {
                        section.style.display = 'block';
                    } else {
                        section.style.display = 'none';
                    }
                });
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
                const modal = this.closest('.modal');
                modal.style.display = 'none';
            });
        });

        // Клик вне модального окна
        window.addEventListener('click', function(event) {
            if (event.target.classList.contains('modal')) {
                event.target.style.display = 'none';
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

            const passportData = {
                serial_passport: document.getElementById('passportSerial').value,
                number_passport: document.getElementById('passportNumber').value,
                get_date: document.getElementById('passportIssueDate').value,
                birthday: document.getElementById('passportBirthDate').value,
                document_id: parseInt(documentId)
            };
             JSON.stringify(passportData)
            try {
                const response = await fetch('http://0.0.0.0:8000/api/drivers/me/document/passport/create', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(passportData)
                });

                if (!response.ok) {
                    throw new Error('Ошибка создания паспорта');
                }

                const result = await response.json();
                passportModal.style.display = 'none';
                passportForm.reset();
                loadDriverData(); // Обновляем данные

            } catch (error) {
                console.error('Ошибка:', error);
                alert(error.message);
            }
        });

        // Форма создания водительского удостоверения
        licenseForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            const licenseData = {
                seria_driverlicense: document.getElementById('licenseSeria').value,
                number_driverlicense: document.getElementById('licenseNumber').value,
                get_date: document.getElementById('licenseIssueDate').value,
                document_id: parseInt(documentId)
            };

            try {
                const response = await fetch('http://0.0.0.0:8000/api/drivers/me/document/driver-license/create', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(licenseData)
                });

                if (!response.ok) {
                    throw new Error('Ошибка создания водительского удостоверения');
                }

                const result = await response.json();
                licenseModal.style.display = 'none';
                licenseForm.reset();
                loadDriverData(); // Обновляем данные

            } catch (error) {
                console.error('Ошибка:', error);
                alert(error.message);
            }
        });

        // Форма регистрации автомобиля
        carForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            const carData = {
                brand: document.getElementById('carBrand').value,
                model: document.getElementById('carModel').value,
                number: document.getElementById('carNumber').value,
                year: parseInt(document.getElementById('carYear').value),
                driver_id: parseInt(userId)
            };

            try {
                const response = await fetch('http://0.0.0.0:8000/api/driver-car/create', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(carData)
                });

                if (!response.ok) {
                    throw new Error('Ошибка регистрации автомобиля');
                }

                const result = await response.json();
                carModal.style.display = 'none';
                carForm.reset();
                loadDriverData(); // Обновляем данные

            } catch (error) {
                console.error('Ошибка:', error);
                alert(error.message);
            }
        });

        // Обработка кликов на документах для показа подробной информации
        document.addEventListener('click', function(e) {
            if (e.target.closest('.document-item')) {
                const documentItem = e.target.closest('.document-item');
                const documentType = documentItem.getAttribute('data-type');
                currentDocumentType = documentType;

                // Заголовок модального окна
                document.getElementById('documentDetailsTitle').textContent =
                    documentType === 'passport' ? 'Паспортные данные' :
                    documentType === 'license' ? 'Водительское удостоверение' :
                    'Данные автомобиля';

                // Содержимое модального окна
                const detailsContent = document.getElementById('documentDetailsContent');
                detailsContent.innerHTML = documentItem.innerHTML;

                // Показываем кнопку "Изменить" только для паспорта
                editDocumentBtn.style.display = documentType === 'passport' ? 'block' : 'none';

                // Скрываем форму редактирования
                document.getElementById('documentEditForm').style.display = 'none';

                // Показываем модальное окно
                documentDetailsModal.style.display = 'block';
            }
        });

        // Кнопка "Изменить" в модальном окне с деталями
        editDocumentBtn.addEventListener('click', function() {
            // Скрываем содержимое и кнопку
            document.getElementById('documentDetailsContent').style.display = 'none';
            this.style.display = 'none';

            // Показываем форму редактирования
            const editForm = document.getElementById('documentEditForm');
            editForm.style.display = 'block';

            // Заполняем форму текущими значениями
            const editFormFields = document.getElementById('editFormFields');
            editFormFields.innerHTML = '';

            if (currentDocumentType === 'passport') {
                // Загружаем текущие данные паспорта
                fetch('http://0.0.0.0:8000/api/drivers/me/document/passport', {
                    headers: {
                        'number_passport': localStorage.getItem('passportNumber'),
                        'driver_id': userId
                    }
                })
                .then(response => {
                    if (!response.ok) throw new Error('Ошибка загрузки данных паспорта');
                    return response.json();
                })
                .then(passportData => {
                    editFormFields.innerHTML = `
                        <div class="form-group">
                            <label for="editPassportSerial">Серия:</label>
                            <input type="text" id="editPassportSerial" value="${passportData.serial_passport || ''}" required>
                        </div>
                        <div class="form-group">
                            <label for="editPassportNumber">Номер:</label>
                            <input type="text" id="editPassportNumber" value="${passportData.number_passport || ''}" readonly>
                        </div>
                        <div class="form-group">
                            <label for="editPassportIssueDate">Дата выдачи:</label>
                            <input type="date" id="editPassportIssueDate" value="${passportData.get_date || ''}" required>
                        </div>
                        <div class="form-group">
                            <label for="editPassportBirthDate">Дата рождения:</label>
                            <input type="date" id="editPassportBirthDate" value="${passportData.birthday || ''}" required>
                        </div>
                    `;
                })
                .catch(error => {
                    console.error('Ошибка:', error);
                    alert('Не удалось загрузить данные паспорта для редактирования');
                });
            }
        });

        // Форма редактирования документа
        editDocumentForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            if (currentDocumentType === 'passport') {
                const passportData = {
                    serial_passport: document.getElementById('editPassportSerial').value,
                    number_passport: document.getElementById('editPassportNumber').value,
                    get_date: document.getElementById('editPassportIssueDate').value,
                    birthday: document.getElementById('editPassportBirthDate').value
                };

                try {
                    const response = await fetch('http://0.0.0.0:8000/api/drivers/me/document/passport', {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                            'number_passport': passportData.number_passport,
                            'driver_id': userId
                        },
                        body: JSON.stringify(passportData)
                    });

                    if (!response.ok) {
                        throw new Error('Ошибка обновления паспорта');
                    }

                    const result = await response.json();
                    documentDetailsModal.style.display = 'none';
                    editDocumentForm.reset();
                    loadDriverData(); // Обновляем данные

                } catch (error) {
                    console.error('Ошибка:', error);
                    alert(error.message);
                }
            }
        });

        // Кнопка редактирования автомобиля
        document.addEventListener('click', function(e) {
            if (e.target.closest('#editCarBtn')) {
                if (currentCarData) {
                    // Заполняем форму данными автомобиля
                    document.getElementById('editCarBrand').value = currentCarData.car_name || currentCarData.brand || '';
                    document.getElementById('editCarNumber').value = currentCarData.number_car || currentCarData.number || '';
                    document.getElementById('editCarSerial').value = currentCarData.serial_number_car || '';
                    document.getElementById('editCarYear').value = currentCarData.year || '';

                    // Показываем модальное окно редактирования
                    editCarModal.style.display = 'block';
                }
            }
        });

        // Форма редактирования автомобиля
        editCarForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            const carData = {
                car_name: document.getElementById('editCarBrand').value,
                number_car: document.getElementById('editCarNumber').value,
                serial_number_car: document.getElementById('editCarSerial').value,
                year: parseInt(document.getElementById('editCarYear').value) || null,
                car_id: currentCarData.car_id
            };

            try {
                const response = await fetch('http://0.0.0.0:8000/api/driver-car/update', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'car_id': currentCarData.car_id,
                        'driver_id': userId
                    },
                    body: JSON.stringify(carData)
                });

                if (!response.ok) {
                    throw new Error('Ошибка обновления данных автомобиля');
                }

                const result = await response.json();
                editCarModal.style.display = 'none';
                loadDriverData(); // Обновляем данные
            } catch (error) {
                console.error('Ошибка:', error);
                alert(error.message);
            }
        });
    }
});