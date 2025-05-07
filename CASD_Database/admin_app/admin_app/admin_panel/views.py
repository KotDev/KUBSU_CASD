from django.shortcuts import render, redirect, get_object_or_404
from django.contrib import messages
from django.utils import timezone
from .models import PutyList, Driver, Customer, Car, Cargo, City, Documents, Category, Passport, Inn, Snils, Driverlicense, CategoryDriverlicense
from decimal import Decimal
from datetime import datetime
from django.db import connection
from django.core.paginator import Paginator

def index(request):
    orders_count = PutyList.objects.filter(status='В пути').count()
    drivers_count = Driver.objects.count()
    customers_count = Customer.objects.count()
    vehicles_count = Car.objects.count()
    
    return render(request, 'admin_panel/index.html', {
        'orders_count': orders_count,
        'drivers_count': drivers_count,
        'customers_count': customers_count,
        'vehicles_count': vehicles_count,
    })

def orders(request):
    # Получаем все заказы
    orders_list = PutyList.objects.all()
    
    # Создаем пагинатор с 10 заказами на страницу
    paginator = Paginator(orders_list, 10)
    
    # Получаем номер страницы из GET-параметра
    page_number = request.GET.get('page')
    
    # Получаем объект страницы
    page_obj = paginator.get_page(page_number)
    
    # Получаем общее количество заказов
    total_orders = orders_list.count()
    
    return render(request, 'admin_panel/orders.html', {
        'orders': page_obj,
        'total_orders': total_orders
    })

def order_create(request):
    if request.method == 'POST':
        # Здесь будет логика создания заказа
        messages.success(request, 'Заказ успешно создан')
        return redirect('admin_panel:orders')
    return render(request, 'admin_panel/order_create.html')

def order_detail(request, order_id):
    order = get_object_or_404(PutyList.objects.select_related(
        'cargo',
        'customer',
        'driver',
        'send_city',
        'arrival_city'
    ), puty_list_id=order_id)
    return render(request, 'admin_panel/order_detail.html', {'order': order})

def order_edit(request, order_id):
    order = get_object_or_404(PutyList.objects.select_related(
        'cargo',
        'customer',
        'driver',
        'send_city',
        'arrival_city'
    ), puty_list_id=order_id)
    
    if request.method == 'POST':
        try:
            # Обновляем основные поля
            order.status = request.POST.get('status')
            
            # Преобразуем даты с учетом часового пояса
            date_sending_str = request.POST.get('date_sending')
            if date_sending_str:
                naive_date = datetime.strptime(date_sending_str, '%Y-%m-%dT%H:%M')
                order.date_sending = timezone.make_aware(naive_date)
            
            date_arrival_str = request.POST.get('date_arrival')
            if date_arrival_str:
                naive_date = datetime.strptime(date_arrival_str, '%Y-%m-%dT%H:%M')
                order.date_arrival = timezone.make_aware(naive_date)
            
            # Обновляем числовые поля
            all_km = request.POST.get('all_km')
            if all_km:
                order.all_km = float(all_km)
            
            price_km = request.POST.get('price_km')
            if price_km:
                order.price_km = Decimal(price_km)
            
            # Обновляем связанные поля
            cargo_id = request.POST.get('cargo')
            if cargo_id:
                order.cargo_id = int(cargo_id)
            
            customer_id = request.POST.get('customer')
            if customer_id:
                order.customer_id = int(customer_id)
            
            driver_id = request.POST.get('driver')
            if driver_id:
                order.driver_id = int(driver_id)
            
            send_city_id = request.POST.get('send_city')
            if send_city_id:
                order.send_city_id = int(send_city_id)
            
            arrival_city_id = request.POST.get('arrival_city')
            if arrival_city_id:
                order.arrival_city_id = int(arrival_city_id)
            
            # Обновляем дату изменения
            order.date_update_putylist = timezone.now()
            
            # Сохраняем изменения
            order.save(update_fields=[
                'status',
                'date_sending',
                'date_arrival',
                'all_km',
                'price_km',
                'cargo_id',
                'customer_id',
                'driver_id',
                'send_city_id',
                'arrival_city_id',
                'date_update_putylist'
            ])
            
            messages.success(request, 'Заказ успешно обновлен')
            return redirect('admin_panel:order_detail', order_id=order.puty_list_id)
            
        except Exception as e:
            messages.error(request, f'Ошибка при обновлении заказа: {str(e)}')
            # В случае ошибки возвращаемся на страницу редактирования с текущими данными
            return render(request, 'admin_panel/order_edit.html', {
                'order': order,
                'cargos': Cargo.objects.all(),
                'customers': Customer.objects.all(),
                'drivers': Driver.objects.all(),
                'cities': City.objects.all()
            })
    
    # Получаем все необходимые данные для выпадающих списков
    cargos = Cargo.objects.all()
    customers = Customer.objects.all()
    drivers = Driver.objects.all()
    cities = City.objects.all()
    
    return render(request, 'admin_panel/order_edit.html', {
        'order': order,
        'cargos': cargos,
        'customers': customers,
        'drivers': drivers,
        'cities': cities
    })

def order_delete(request, order_id):
    order = get_object_or_404(PutyList, puty_list_id=order_id)
    if request.method == 'POST':
        try:
            # Используем raw SQL для удаления заказа
            with connection.cursor() as cursor:
                cursor.execute("DELETE FROM puty_list WHERE puty_list_id = %s", [order_id])
            
            messages.success(request, 'Заказ успешно удален')
            return redirect('admin_panel:orders')
        except Exception as e:
            messages.error(request, f'Ошибка при удалении заказа: {str(e)}')
            return redirect('admin_panel:order_detail', order_id=order_id)
    return render(request, 'admin_panel/order_delete.html', {'order': order})

def drivers(request):
    drivers = Driver.objects.all()
    return render(request, 'admin_panel/drivers.html', {'drivers': drivers})

def driver_detail(request, driver_id):
    driver = get_object_or_404(Driver.objects.select_related(
        'documents',
        'car'
    ), driver_id=driver_id)
    return render(request, 'admin_panel/driver_detail.html', {'driver': driver})

def driver_edit(request, driver_id):
    driver = get_object_or_404(Driver.objects.select_related(
        'documents',
        'car'
    ), driver_id=driver_id)
    
    # Получаем связанные документы
    passport = Passport.objects.filter(documents=driver.documents).first()
    driver_license = Driverlicense.objects.filter(documents=driver.documents).first()
    
    # Получаем существующие категории для водительского удостоверения
    existing_categories = []
    if driver_license:
        existing_categories = CategoryDriverlicense.objects.filter(
            numbers_driverlicense=driver_license
        ).values_list('categoryes_id', flat=True)
    
    cars = Car.objects.all()
    categories = Category.objects.all()
    
    if request.method == 'POST':
        try:
            # Обновляем основные поля
            driver.name = request.POST.get('name')
            driver.mid_name = request.POST.get('mid_name')
            driver.last_name = request.POST.get('last_name')
            
            # Обновляем связанные поля
            car_id = request.POST.get('car')
            if car_id:
                driver.car_id = int(car_id)
            else:
                driver.car_id = None
            
            # Обновляем документы
            if not driver.documents:
                driver.documents = Documents.objects.create()
            
            # Обновляем паспортные данные
            if not passport:
                passport = Passport.objects.create(
                    documents=driver.documents,
                    serial_passport=request.POST.get('serial_passport'),
                    number_passport=request.POST.get('number_passport'),
                    get_date=datetime.strptime(request.POST.get('passport_get_date'), '%Y-%m-%d').date(),
                    birthday=datetime.strptime(request.POST.get('passport_birthday'), '%Y-%m-%d').date()
                )
            else:
                passport.serial_passport = request.POST.get('serial_passport')
                passport.number_passport = request.POST.get('number_passport')
                passport.get_date = datetime.strptime(request.POST.get('passport_get_date'), '%Y-%m-%d').date()
                passport.birthday = datetime.strptime(request.POST.get('passport_birthday'), '%Y-%m-%d').date()
                passport.save()
            
            # Обновляем данные водительского удостоверения
            if not driver_license:
                driver_license = Driverlicense.objects.create(
                    documents=driver.documents,
                    seria_driverlicense=request.POST.get('seria_driverlicense'),
                    number_driverlicense=request.POST.get('number_driverlicense'),
                    get_date=datetime.strptime(request.POST.get('driverlicense_get_date'), '%Y-%m-%d').date()
                )
            else:
                driver_license.seria_driverlicense = request.POST.get('seria_driverlicense')
                driver_license.number_driverlicense = request.POST.get('number_driverlicense')
                driver_license.get_date = datetime.strptime(request.POST.get('driverlicense_get_date'), '%Y-%m-%d').date()
                driver_license.save()
            
            # Обновляем категории водительского удостоверения
            selected_categories = request.POST.getlist('license_categories')
            if selected_categories:
                # Удаляем старые категории
                CategoryDriverlicense.objects.filter(numbers_driverlicense=driver_license).delete()
                
                # Добавляем новые категории
                for category_id in selected_categories:
                    category = Category.objects.get(category_id=category_id)
                    CategoryDriverlicense.objects.create(
                        numbers_driverlicense=driver_license,
                        categoryes_id=category.category_id
                    )
            
            # Сохраняем изменения
            driver.save()
            
            messages.success(request, 'Данные водителя успешно обновлены')
            return redirect('admin_panel:driver_detail', driver_id=driver.driver_id)
            
        except Exception as e:
            messages.error(request, f'Ошибка при обновлении данных водителя: {str(e)}')
    
    return render(request, 'admin_panel/driver_edit.html', {
        'driver': driver,
        'passport': passport,
        'driver_license': driver_license,
        'cars': cars,
        'categories': categories,
        'existing_categories': existing_categories
    })

def driver_delete(request, driver_id):
    driver = get_object_or_404(Driver, driver_id=driver_id)
    if request.method == 'POST':
        driver.delete()
        messages.success(request, 'Водитель успешно удален')
        return redirect('admin_panel:drivers')
    return render(request, 'admin_panel/driver_delete.html', {'driver': driver})

def customers(request):
    customers = Customer.objects.all()
    return render(request, 'admin_panel/customers.html', {'customers': customers})

def customer_detail(request, customer_id):
    # Получаем заказчика с актуальными данными
    customer = get_object_or_404(Customer.objects.select_related(
        'documents'
    ), customer_id=customer_id)
    
    # Получаем связанные документы
    inn = Inn.objects.filter(documents=customer.documents).first()
    snils = Snils.objects.filter(documents=customer.documents).first()
    
    print("Customer detail data:")
    print("Customer:", customer.name_company)
    print("INN:", inn.number_inn if inn else "None")
    print("SNILS:", snils.number_snils if snils else "None")
    
    return render(request, 'admin_panel/customer_detail.html', {
        'customer': customer,
        'inn': inn,
        'snils': snils
    })

def customer_edit(request, customer_id):
    customer = get_object_or_404(Customer.objects.select_related(
        'documents'
    ), customer_id=customer_id)
    
    # Получаем связанные документы
    inn = Inn.objects.filter(number_inn=customer.documents.number_inn).first() if customer.documents.number_inn else None
    snils = Snils.objects.filter(number_snils=customer.documents.number_snils).first() if customer.documents.number_snils else None
    
    if request.method == 'POST':
        try:
            print("POST data:", request.POST)
            
            # Обновляем основные поля
            customer.name_company = request.POST.get('name_company')
            
            # Обновляем документы
            if not customer.documents:
                customer.documents = Documents.objects.create()
            
            # Обновляем ИНН
            inn_number = request.POST.get('number_inn')
            inn_date = request.POST.get('inn_get_date')
            print("INN data:", inn_number, inn_date)
            
            if inn_date:
                inn_date = timezone.make_aware(datetime.strptime(inn_date, '%Y-%m-%d'))
            
            # Удаляем старый ИНН, если он существует
            if inn:
                inn.delete()
            
            # Создаем новый ИНН
            new_inn = Inn.objects.create(
                number_inn=inn_number,
                get_date=inn_date
            )
            
            # Обновляем ссылку в Documents
            customer.documents.number_inn = new_inn
            
            # Обновляем СНИЛС
            snils_number = request.POST.get('number_snils')
            snils_date = request.POST.get('snils_get_date')
            print("SNILS data:", snils_number, snils_date)
            
            if snils_date:
                snils_date = timezone.make_aware(datetime.strptime(snils_date, '%Y-%m-%d'))
            
            # Удаляем старый СНИЛС, если он существует
            if snils:
                snils.delete()
            
            # Создаем новый СНИЛС
            new_snils = Snils.objects.create(
                number_snils=snils_number,
                get_date=snils_date
            )
            
            # Обновляем ссылку в Documents
            customer.documents.number_snils = new_snils
            
            # Сохраняем изменения
            customer.documents.save()
            customer.save()
            
            # Получаем обновленные данные
            customer.refresh_from_db()
            inn = Inn.objects.filter(number_inn=customer.documents.number_inn).first() if customer.documents.number_inn else None
            snils = Snils.objects.filter(number_snils=customer.documents.number_snils).first() if customer.documents.number_snils else None
            
            print("After update:")
            print("INN:", inn.number_inn if inn else "None")
            print("SNILS:", snils.number_snils if snils else "None")
            
            messages.success(request, 'Данные заказчика успешно обновлены')
            return redirect('admin_panel:customer_detail', customer_id=customer.customer_id)
            
        except Exception as e:
            print("Error:", str(e))
            messages.error(request, f'Ошибка при обновлении данных заказчика: {str(e)}')
    
    return render(request, 'admin_panel/customer_edit.html', {
        'customer': customer,
        'inn': inn,
        'snils': snils
    })

def customer_delete(request, customer_id):
    customer = get_object_or_404(Customer, customer_id=customer_id)
    if request.method == 'POST':
        customer.delete()
        messages.success(request, 'Заказчик успешно удален')
        return redirect('admin_panel:customers')
    return render(request, 'admin_panel/customer_delete.html', {'customer': customer})

def vehicles(request):
    vehicles = Car.objects.all()
    return render(request, 'admin_panel/vehicles.html', {'vehicles': vehicles})

def vehicle_detail(request, vehicle_id):
    vehicle = get_object_or_404(Car, car_id=vehicle_id)
    return render(request, 'admin_panel/vehicle_detail.html', {'vehicle': vehicle})

def vehicle_edit(request, vehicle_id):
    vehicle = get_object_or_404(Car, car_id=vehicle_id)
    
    if request.method == 'POST':
        try:
            # Обновляем основные поля
            vehicle.car_name = request.POST.get('car_name')
            vehicle.number_car = request.POST.get('number_car')
            vehicle.serial_number_car = request.POST.get('serial_number_car')
            
            # Сохраняем изменения
            vehicle.save()
            
            # Получаем обновленные данные
            vehicle.refresh_from_db()
            
            messages.success(request, 'Данные транспорта успешно обновлены')
            return redirect('admin_panel:vehicle_detail', vehicle_id=vehicle.car_id)
            
        except Exception as e:
            messages.error(request, f'Ошибка при обновлении данных транспорта: {str(e)}')
    
    return render(request, 'admin_panel/vehicle_edit.html', {'vehicle': vehicle})

def vehicle_delete(request, vehicle_id):
    vehicle = get_object_or_404(Car, car_id=vehicle_id)
    if request.method == 'POST':
        try:
            # Используем raw SQL для удаления транспортного средства
            with connection.cursor() as cursor:
                cursor.execute("DELETE FROM car WHERE car_id = %s", [vehicle_id])
            
            messages.success(request, 'Транспортное средство успешно удалено')
            return redirect('admin_panel:vehicles')
        except Exception as e:
            messages.error(request, f'Ошибка при удалении транспортного средства: {str(e)}')
            return redirect('admin_panel:vehicle_detail', vehicle_id=vehicle_id)
    return render(request, 'admin_panel/vehicle_delete.html', {'vehicle': vehicle})

def vehicle_create(request):
    if request.method == 'POST':
        try:
            car_name = request.POST.get('car_name')
            number_car = request.POST.get('number_car')
            serial_number_car = request.POST.get('serial_number_car')
            
            # Создаем новое транспортное средство
            vehicle = Car.objects.create(
                car_name=car_name,
                number_car=number_car,
                serial_number_car=serial_number_car
            )
            
            messages.success(request, 'Транспортное средство успешно создано')
            return redirect('admin_panel:vehicle_detail', vehicle_id=vehicle.car_id)
            
        except Exception as e:
            messages.error(request, f'Ошибка при создании транспортного средства: {str(e)}')
    
    return render(request, 'admin_panel/vehicle_edit.html', {'vehicle': None})
