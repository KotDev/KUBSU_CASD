# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Make sure each ForeignKey and OneToOneField has `on_delete` set to the desired behavior
#   * Remove `managed = False` lines if you wish to allow Django to create, modify, and delete the table
# Feel free to rename the models, but don't rename db_table values or field names.
from django.db import models
from django.utils.translation import gettext_lazy as _


class Car(models.Model):
    car_id = models.AutoField(primary_key=True)
    car_name = models.CharField(_('Название автомобиля'), max_length=60)
    number_car = models.CharField(_('Гос. номер'), max_length=9)
    serial_number_car = models.IntegerField(_('Серийный номер'))

    class Meta:
        managed = False
        db_table = 'car'
        verbose_name = _('Автомобиль')
        verbose_name_plural = _('Автомобили')

    def __str__(self):
        return f"{self.car_name} ({self.number_car})"


class Cargo(models.Model):
    cargo_id = models.AutoField(primary_key=True)
    cargo_name = models.CharField(_('Название груза'), max_length=90)
    date_register_cargo = models.DateTimeField(_('Дата регистрации'))
    weight = models.IntegerField(_('Вес'))
    length = models.FloatField(_('Длина'))
    width = models.FloatField(_('Ширина'))
    height = models.FloatField(_('Высота'))

    class Meta:
        managed = False
        db_table = 'cargo'
        verbose_name = _('Груз')
        verbose_name_plural = _('Грузы')

    def __str__(self):
        return self.cargo_name


class Category(models.Model):
    category_id = models.AutoField(primary_key=True)
    category_name = models.CharField(_('Категория'), unique=True, max_length=3)

    class Meta:
        managed = False
        db_table = 'category'
        verbose_name = _('Категория')
        verbose_name_plural = _('Категории')

    def __str__(self):
        return self.category_name


class CategoryDriverlicense(models.Model):
    id_category_driverlicense = models.AutoField(primary_key=True)
    categoryes = models.ForeignKey(Category, models.DO_NOTHING)
    numbers_driverlicense = models.ForeignKey('Driverlicense', models.DO_NOTHING, db_column='numbers_driverlicense')

    class Meta:
        managed = False
        db_table = 'category_driverlicense'


class City(models.Model):
    city_id = models.AutoField(primary_key=True)
    city_name = models.CharField(_('Город'), unique=True, max_length=60)
    region = models.ForeignKey('Region', models.DO_NOTHING, verbose_name=_('Регион'))

    class Meta:
        managed = False
        db_table = 'city'
        verbose_name = _('Город')
        verbose_name_plural = _('Города')

    def __str__(self):
        return self.city_name


class Customer(models.Model):
    customer_id = models.AutoField(primary_key=True)
    name_company = models.CharField(_('Название компании'), max_length=60)
    date_register = models.DateTimeField(_('Дата регистрации'))
    documents = models.OneToOneField('Documents', models.DO_NOTHING, verbose_name=_('Документы'))

    class Meta:
        managed = False
        db_table = 'customer'
        verbose_name = _('Заказчик')
        verbose_name_plural = _('Заказчики')

    def __str__(self):
        return self.name_company


class Documents(models.Model):
    document_id = models.AutoField(primary_key=True)
    number_passport = models.OneToOneField('Passport', models.DO_NOTHING, db_column='number_passport', blank=True, null=True, verbose_name=_('Паспорт'))
    number_snils = models.OneToOneField('Snils', models.DO_NOTHING, db_column='number_snils', blank=True, null=True, verbose_name=_('СНИЛС'))
    number_inn = models.OneToOneField('Inn', models.DO_NOTHING, db_column='number_inn', blank=True, null=True, verbose_name=_('ИНН'))
    number_driverlicense = models.OneToOneField('Driverlicense', models.DO_NOTHING, db_column='number_driverlicense', blank=True, null=True, verbose_name=_('Водительское удостоверение'))

    class Meta:
        managed = False
        db_table = 'documents'
        verbose_name = _('Документ')
        verbose_name_plural = _('Документы')


class Driver(models.Model):
    driver_id = models.AutoField(primary_key=True)
    name = models.CharField(_('Имя'), max_length=30)
    mid_name = models.CharField(_('Отчество'), max_length=30)
    last_name = models.CharField(_('Фамилия'), max_length=30, blank=True, null=True)
    documents = models.OneToOneField(Documents, models.DO_NOTHING, verbose_name=_('Документы'))
    date_register = models.DateTimeField(_('Дата регистрации'))
    car = models.OneToOneField(Car, models.DO_NOTHING, blank=True, null=True, verbose_name=_('Автомобиль'))

    class Meta:
        managed = False
        db_table = 'driver'
        verbose_name = _('Водитель')
        verbose_name_plural = _('Водители')

    def __str__(self):
        return f"{self.last_name} {self.name} {self.mid_name}"


class Driverlicense(models.Model):
    number_driverlicense = models.CharField(primary_key=True, max_length=4)
    seria_driverlicense = models.CharField(_('Серия'), unique=True, max_length=6)
    get_date = models.DateField(_('Дата получения'))

    class Meta:
        managed = False
        db_table = 'driverlicense'
        verbose_name = _('Водительское удостоверение')
        verbose_name_plural = _('Водительские удостоверения')

    def __str__(self):
        return f"{self.seria_driverlicense} {self.number_driverlicense}"


class Inn(models.Model):
    number_inn = models.CharField(primary_key=True, max_length=12)
    get_date = models.DateField(_('Дата получения'))

    class Meta:
        managed = False
        db_table = 'inn'
        verbose_name = _('ИНН')
        verbose_name_plural = _('ИНН')

    def __str__(self):
        return self.number_inn


class Passport(models.Model):
    number_passport = models.CharField(primary_key=True, max_length=6)
    serial_passport = models.CharField(_('Серия'), unique=True, max_length=4)
    get_date = models.DateField(_('Дата получения'))
    birthday = models.DateField(_('Дата рождения'))

    class Meta:
        managed = False
        db_table = 'passport'
        verbose_name = _('Паспорт')
        verbose_name_plural = _('Паспорта')

    def __str__(self):
        return f"{self.serial_passport} {self.number_passport}"


class PutyList(models.Model):
    STATUS_CHOICES = [
        ('pending', _('Ожидает')),
        ('in_progress', _('В процессе')),
        ('completed', _('Завершен')),
        ('cancelled', _('Отменен')),
    ]

    puty_list_id = models.AutoField(primary_key=True)
    date_sending = models.DateTimeField(_('Дата отправления'))
    date_arrival = models.DateTimeField(_('Дата прибытия'))
    price_kg = models.DecimalField(_('Цена за кг'), max_digits=10, decimal_places=2)
    price_km = models.DecimalField(_('Цена за км'), max_digits=10, decimal_places=2)
    all_km = models.FloatField(_('Общее расстояние'))
    all_price = models.DecimalField(_('Общая цена'), max_digits=10, decimal_places=2, blank=True, null=True)
    status = models.CharField(_('Статус'), max_length=20, choices=STATUS_CHOICES, default='pending')
    date_register_putylist = models.DateTimeField(_('Дата регистрации'))
    date_update_putylist = models.DateTimeField(_('Дата обновления'))
    cargo = models.ForeignKey(Cargo, models.DO_NOTHING, verbose_name=_('Груз'))
    driver = models.ForeignKey(Driver, models.DO_NOTHING, blank=True, null=True, verbose_name=_('Водитель'))
    customer = models.ForeignKey(Customer, models.DO_NOTHING, verbose_name=_('Заказчик'))
    send_city = models.ForeignKey(City, models.DO_NOTHING, verbose_name=_('Город отправления'))
    arrival_city = models.ForeignKey(City, models.DO_NOTHING, related_name='putylist_arrival_city_set', verbose_name=_('Город прибытия'))

    class Meta:
        managed = False
        db_table = 'puty_list'
        verbose_name = _('Путевой лист')
        verbose_name_plural = _('Путевые листы')

    def __str__(self):
        return f"{self.cargo.cargo_name} - {self.send_city.city_name} → {self.arrival_city.city_name}"


class Region(models.Model):
    region_id = models.AutoField(primary_key=True)
    region_name = models.CharField(_('Регион'), unique=True, max_length=60)

    class Meta:
        managed = False
        db_table = 'region'
        verbose_name = _('Регион')
        verbose_name_plural = _('Регионы')

    def __str__(self):
        return self.region_name


class Snils(models.Model):
    number_snils = models.CharField(primary_key=True, max_length=11)
    get_date = models.DateField(_('Дата получения'))

    class Meta:
        managed = False
        db_table = 'snils'
        verbose_name = _('СНИЛС')
        verbose_name_plural = _('СНИЛС')

    def __str__(self):
        return self.number_snils



class Route(models.Model):
    order = models.ForeignKey(PutyList, on_delete=models.CASCADE, verbose_name=_('Заказ'))
    vehicle = models.ForeignKey(Car, on_delete=models.CASCADE, verbose_name=_('Транспортное средство'))
    start_time = models.DateTimeField(_('Время начала'))
    end_time = models.DateTimeField(_('Время окончания'), null=True, blank=True)
    status = models.CharField(_('Статус'), max_length=20, choices=PutyList.STATUS_CHOICES, default='pending')

    class Meta:
        verbose_name = _('Маршрут')
        verbose_name_plural = _('Маршруты')

    def __str__(self):
        return f"{self.order} - {self.vehicle}"
