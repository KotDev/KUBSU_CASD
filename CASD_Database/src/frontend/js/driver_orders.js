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