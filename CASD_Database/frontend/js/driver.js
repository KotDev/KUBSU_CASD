document.querySelectorAll('.menu li').forEach(item => {
    item.addEventListener('click', function() {
        const sectionName = this.dataset.section;
        if (sectionName === 'orders') {
            window.location.href = 'driver_order.html';
            return;
        }
        // ... остальной код для других разделов
        document.querySelectorAll('.menu li').forEach(i => i.classList.remove('active'));
        this.classList.add('active');
        
        document.querySelectorAll('.main-content > div').forEach(section => {
            section.style.display = 'none';
        });
        document.getElementById(sectionName + 'Section').style.display = 'block';
    });
}); 