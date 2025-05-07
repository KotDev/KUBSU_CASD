document.addEventListener('DOMContentLoaded', function() {
    // ... остальной код ...

    // Обработчик для возврата в профиль
    document.querySelector('.menu li:first-child').addEventListener('click', function() {
        window.location.href = 'driver.html';
    });

    // ... остальной код ...
}); 