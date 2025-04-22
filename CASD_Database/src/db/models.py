from dataclasses import dataclass, field
from datetime import datetime, date
from typing import Optional, List
from decimal import Decimal
import re
from enum import Enum

class StatusEnum(str, Enum):
    NOT_DELIVERED = 'Не доставлен'
    IN_TRANSIT = 'В пути'
    DELIVERED = 'Доставлен'
    CANCELLED = 'Отменен'

def validate_string(value: str, field_name: str, min_len: int, max_len: int, pattern: str = None):
    if not isinstance(value, str):
        raise ValueError(f"{field_name} must be a string")
    if len(value) < min_len or len(value) > max_len:
        raise ValueError(f"{field_name} length must be between {min_len} and {max_len} characters")
    if pattern and not re.fullmatch(pattern, value):
        raise ValueError(f"{field_name} has invalid format")

def validate_date_range(date_from: date, date_to: date, field_name: str):
    if date_from > date_to:
        raise ValueError(f"{field_name}: start date cannot be after end date")

def validate_positive_number(value, field_name: str):
    if value <= 0:
        raise ValueError(f"{field_name} must be positive")

@dataclass
class Category:
    category_id: int
    category_name: str



@dataclass
class Passport:
    number_passport: str
    serial_passport: str
    get_date: date
    birthday: date

    def __post_init__(self):
        validate_string(self.number_passport, "Passport number", 6, 6, r'^\d{6}$')
        validate_string(self.serial_passport, "Passport serial", 4, 4, r'^\d{4}$')
        print(self.get_date)
        if self.get_date > date.today():
            raise ValueError("Passport issue date cannot be in the future")
        if self.birthday > date.today():
            raise ValueError("Birthday cannot be in the future")

@dataclass
class Snils:
    number_snils: str
    get_date: date

    def __post_init__(self):
        validate_string(self.number_snils, "SNILS number", 11, 11, r'^\d{11}$')
        if self.get_date > date.today():
            raise ValueError("SNILS issue date cannot be in the future")

@dataclass
class Inn:
    number_inn: str
    get_date: date

    def __post_init__(self):
        validate_string(self.number_inn, "INN number", 10, 12, r'^\d{10,12}$')
        if self.get_date > date.today():
            raise ValueError("INN issue date cannot be in the future")

@dataclass
class DriverLicense:
    number_driverlicense: str
    seria_driverlicense: str
    get_date: date
    categoryes: Optional[List[Category]] = None

    def __post_init__(self):
        validate_string(self.number_driverlicense, "Driver license number", 4, 4, r'^\d{4}$')
        validate_string(self.seria_driverlicense, "Driver license serial", 6, 6, r'^\d{6}$')

@dataclass
class Documents:
    document_id: int
    number_passport: Optional[str] = None
    number_snils: Optional[str] = None
    number_inn: Optional[str] = None
    number_driverlicense: Optional[str] = None

    passport_data: Optional[Passport] = None
    snils_data: Optional[Snils] = None
    inn_data: Optional[Inn] = None
    driver_license_data: Optional[DriverLicense] = None


@dataclass
class Region:
    region_id: int
    region_name: str

    def __post_init__(self):
        validate_string(self.region_name, "Region name", 2, 60)

@dataclass
class City:
    city_id: int
    city_name: str
    region_id: int
    region: Optional[Region] = None

    def __post_init__(self):
        validate_string(self.city_name, "City name", 2, 60)
        validate_positive_number(self.region_id, "Region ID")

@dataclass
class Car:
    car_id: int
    car_name: str
    number_car: str
    serial_number_car: int

    def __post_init__(self):
        validate_string(self.car_name, "Car name", 1, 60)
        validate_string(self.number_car, "Car number", min_len=7, max_len=8,
                       pattern=r'^[A-Z]\d{3}[A-Z]{2}\d\d$')
        validate_positive_number(self.serial_number_car, "Serial number")

@dataclass
class Driver:
    driver_id: int
    name: str
    mid_name: str
    documents_id: int
    last_name: Optional[str] = None
    date_register: datetime = field(default_factory=datetime.now)
    car_id: Optional[int] = None
    documents: Optional[Documents] = None
    car: Optional[Car] = None

    def __post_init__(self):
        validate_string(self.name, "Name", 1, 30)
        validate_string(self.mid_name, "Middle name", 1, 30)
        if self.last_name:
            validate_string(self.last_name, "Last name", 1, 30)
        if self.car_id:
            validate_positive_number(self.car_id, "Car ID")

@dataclass
class Cargo:
    cargo_id: int
    cargo_name: str
    weight: int = field(metadata={'units': 'kg'})
    length: float = field(metadata={'units': 'm'})
    width: float = field(metadata={'units': 'm'})
    height: float = field(metadata={'units': 'm'})
    date_register_cargo: datetime = field(default_factory=datetime.now)

    def __post_init__(self):
        validate_string(self.cargo_name, "Cargo name", 1, 90)
        validate_positive_number(self.weight, "Weight")
        validate_positive_number(self.length, "Length")
        validate_positive_number(self.width, "Width")
        validate_positive_number(self.height, "Height")

@dataclass
class Customer:
    customer_id: int
    name_company: str
    documents_id: int
    date_register: datetime = field(default_factory=datetime.now)
    documents: Optional[Documents] = None

    def __post_init__(self):
        validate_string(self.name_company, "Company name", 1, 60)

@dataclass
class PutyList:
    puty_list_id: int
    date_sending: datetime
    date_arrival: datetime
    cargo_id: int
    driver_id: int
    customer_id: int
    send_city_id: int
    arrival_city_id: int
    all_price: Decimal = field(init=False)
    price_kg: Decimal = field(default=Decimal('0.00'))
    price_km: Decimal = field(default=Decimal('0.00'))
    all_km: float = field(default=0.0)  # Исправлено на float
    status: StatusEnum = field(default=StatusEnum.NOT_DELIVERED)
    date_register_putylist: datetime = field(default_factory=datetime.now)
    date_update_putylist: datetime = field(default_factory=datetime.now)

    cargo: Optional[Cargo] = None
    driver: Optional[Driver] = None
    customer: Optional[Customer] = None
    send_city: Optional[City] = None
    arrival_city: Optional[City] = None

    def __post_init__(self):
        validate_date_range(self.date_sending, self.date_arrival, "Delivery dates")
        validate_positive_number(self.price_kg, "Price per kg")
        validate_positive_number(self.price_km, "Price per km")
        validate_positive_number(self.all_km, "Distance")
        validate_positive_number(self.cargo_id, "Cargo ID")
        validate_positive_number(self.driver_id, "Driver ID")
        validate_positive_number(self.customer_id, "Customer ID")
        validate_positive_number(self.send_city_id, "Sender city ID")
        validate_positive_number(self.arrival_city_id, "Arrival city ID")

        # Автоматический расчет полной цены
        object.__setattr__(self, 'all_price', self.price_km * Decimal(str(self.all_km)))

@dataclass
class CategoryDriverLicense:
    id_category_driverlicense: int
    categoryes_id: int
    numbers_driverlicense: str

    def __post_init__(self):
        validate_positive_number(self.categoryes_id, "Category ID")
        validate_string(self.numbers_driverlicense, "Driver license number", 4, 4, r'^\d{4}$')

@dataclass
class DriverLicenseWithCategories:
    license: DriverLicense
    categories: List[Category]

    def __post_init__(self):
        if not self.categories:
            raise ValueError("At least one category must be provided")