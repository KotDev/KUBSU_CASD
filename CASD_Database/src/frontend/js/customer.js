// driver.js и customer.js будут почти идентичны
document.addEventListener('DOMContentLoaded', function() {
    // Проверяем, авторизован ли пользователь
    const userId = localStorage.getItem('userId');
    const documentId = localStorage.getItem('documentId');
    const role = localStorage.getItem('role');

    if (!userId || !documentId || !role) {
        window.location.href = 'index.html';
        return;
    }

    // Проверяем, что пользователь на правильной странице
    if ((role === 'driver' && !document.body.classList.contains('driver-theme')) ||
        (role === 'customer' && !document.body.classList.contains('customer-theme'))) {
        window.location.href = role === 'driver' ? 'driver.html' : 'customer.html';
        return;
    }

    // Отображаем информацию о пользователе
    document.getElementById('userId').textContent = userId;
    document.getElementById('documentId').textContent = documentId;

    // Обработка выхода
    document.getElementById('logoutBtn').addEventListener('click', function() {
        localStorage.clear();
        window.location.href = 'index.html';
    });
});