from django.contrib import admin
from .models import *

# Удаляем автоматическую регистрацию
# for model in [model for model in locals().values() if isinstance(model, type) and issubclass(model, models.Model)]:
#     admin.site.register(model)

@admin.register(Car)
class CarAdmin(admin.ModelAdmin):
    list_display = ('car_name', 'number_car', 'serial_number_car')
    search_fields = ('car_name', 'number_car')
    list_filter = ('serial_number_car',)

@admin.register(Cargo)
class CargoAdmin(admin.ModelAdmin):
    list_display = ('cargo_name', 'weight', 'length', 'width', 'height', 'date_register_cargo')
    search_fields = ('cargo_name',)
    list_filter = ('date_register_cargo',)

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('category_name',)
    search_fields = ('category_name',)

@admin.register(City)
class CityAdmin(admin.ModelAdmin):
    list_display = ('city_name', 'region')
    search_fields = ('city_name',)
    list_filter = ('region',)

@admin.register(Customer)
class CustomerAdmin(admin.ModelAdmin):
    list_display = ('name_company', 'date_register')
    search_fields = ('name_company',)
    date_hierarchy = 'date_register'

@admin.register(Driver)
class DriverAdmin(admin.ModelAdmin):
    list_display = ('last_name', 'name', 'mid_name', 'date_register', 'car')
    search_fields = ('last_name', 'name', 'mid_name')
    list_filter = ('date_register',)
    date_hierarchy = 'date_register'

@admin.register(PutyList)
class PutyListAdmin(admin.ModelAdmin):
    list_display = ('cargo', 'send_city', 'arrival_city', 'date_sending', 'date_arrival', 'status')
    search_fields = ('cargo__cargo_name', 'send_city__city_name', 'arrival_city__city_name')
    list_filter = ('status', 'date_sending', 'date_arrival')
    date_hierarchy = 'date_sending'

@admin.register(Region)
class RegionAdmin(admin.ModelAdmin):
    list_display = ('region_name',)
    search_fields = ('region_name',)

@admin.register(Documents)
class DocumentsAdmin(admin.ModelAdmin):
    list_display = ('document_id', 'number_passport', 'number_snils', 'number_inn', 'number_driverlicense')
    search_fields = ('number_passport__number_passport', 'number_snils__number_snils', 'number_inn__number_inn', 'number_driverlicense__number_driverlicense')

@admin.register(Driverlicense)
class DriverlicenseAdmin(admin.ModelAdmin):
    list_display = ('seria_driverlicense', 'number_driverlicense', 'get_date')
    search_fields = ('seria_driverlicense', 'number_driverlicense')
    date_hierarchy = 'get_date'

@admin.register(Inn)
class InnAdmin(admin.ModelAdmin):
    list_display = ('number_inn', 'get_date')
    search_fields = ('number_inn',)
    date_hierarchy = 'get_date'

@admin.register(Passport)
class PassportAdmin(admin.ModelAdmin):
    list_display = ('serial_passport', 'number_passport', 'get_date', 'birthday')
    search_fields = ('serial_passport', 'number_passport')
    date_hierarchy = 'get_date'

@admin.register(Snils)
class SnilsAdmin(admin.ModelAdmin):
    list_display = ('number_snils', 'get_date')
    search_fields = ('number_snils',)
    date_hierarchy = 'get_date'


@admin.register(Route)
class RouteAdmin(admin.ModelAdmin):
    list_display = ('order', 'vehicle', 'start_time', 'end_time', 'status')
    search_fields = ('order__cargo__name', 'vehicle__model')
    list_filter = ('status', 'start_time', 'end_time')
    date_hierarchy = 'start_time'
