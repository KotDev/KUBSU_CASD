from pydantic import BaseModel, Field, field_validator, model_validator
from datetime import datetime, date
from decimal import Decimal
from typing import Optional, List

from enum import Enum
# Перечисление StatusEnum
class StatusEnum(str, Enum):
    NOT_DELIVERED = 'Не доставлен'
    IN_TRANSIT = 'В пути'
    DELIVERED = 'Доставлен'
    CANCELLED = 'Отменен'

class CategorySchema(BaseModel):
    category_id: int
    category_name: str

# Модель Passport
class PassportSchema(BaseModel):
    number_passport: str = Field(..., min_length=6, max_length=6, pattern=r'^\d{6}$')
    serial_passport: str = Field(..., min_length=4, max_length=4, pattern=r'^\d{4}$')
    get_date: date
    birthday: date

    @field_validator('get_date', 'birthday')
    def validate_dates(cls, value):
        if value > date.today():
            raise ValueError("Date cannot be in the future")
        return value

# Модель Snils
class SnilsSchema(BaseModel):
    number_snils: str = Field(..., min_length=11, max_length=11, pattern=r'^\d{11}$')
    get_date: date

    @field_validator('get_date')
    def validate_date(cls, value):
        if value > date.today():
            raise ValueError("SNILS issue date cannot be in the future")
        return value

# Модель Inn
class InnSchema(BaseModel):
    number_inn: str = Field(..., min_length=10, max_length=12, pattern=r'^\d{10,12}$')
    get_date: date

    @field_validator('get_date')
    def validate_date(cls, value):
        if value > date.today():
            raise ValueError("INN issue date cannot be in the future")
        return value

# Модель DriverLicense
class DriverLicenseSchema(BaseModel):
    number_driverlicense: str = Field(..., min_length=4, max_length=4, pattern=r'^\d{4}$')
    seria_driverlicense: str = Field(..., min_length=6, max_length=6, pattern=r'^\d{6}$')
    get_date: date
    categoryes: Optional[List[CategorySchema]] = None

# Модель Documents
class DocumentsSchema(BaseModel):
    document_id: int
    number_passport: Optional[str] = None
    number_snils: Optional[str] = None
    number_inn: Optional[str] = None
    number_driverlicense: Optional[str] = None

    passport_data: Optional[PassportSchema] = None
    snils_data: Optional[SnilsSchema] = None
    inn_data: Optional[InnSchema] = None
    driver_license_data: Optional[DriverLicenseSchema] = None


# Модель Region
class RegionSchema(BaseModel):
    region_id: int
    region_name: str = Field(..., min_length=2, max_length=60)

# Модель City
class CitySchema(BaseModel):
    city_id: int
    city_name: str = Field(..., min_length=2, max_length=60)
    region_id: int
    region: Optional[RegionSchema] = None

    @field_validator('region_id')
    def validate_positive_number(cls, value):
        if value <= 0:
            raise ValueError("Region ID must be positive")
        return value

# Модель Car
class CarSchema(BaseModel):
    car_id: int
    car_name: str = Field(..., min_length=1, max_length=60)
    number_car: str = Field(..., pattern=r'^[A-Z]\d{3}[A-Z]{2}\d\d$')
    serial_number_car: int

    @field_validator('serial_number_car')
    def validate_positive_number(cls, value):
        if value <= 0:
            raise ValueError("Serial number must be positive")
        return value

# Модель Driver
class DriverSchema(BaseModel):
    driver_id: int
    name: str = Field(..., min_length=1, max_length=30)
    mid_name: str = Field(..., min_length=1, max_length=30)
    last_name: Optional[str] = Field(None, min_length=1, max_length=30)
    documents_id: int = Field(..., init=False)
    date_register: datetime = Field(default_factory=datetime.now)
    car_id: Optional[int] = None
    documents: Optional[DocumentsSchema] = None
    car: Optional[CarSchema] = None

    @field_validator('car_id')
    def validate_positive_number(cls, value):
        if value is not None and value <= 0:
            raise ValueError("Car ID must be positive")
        return value

# Модель Cargo
class CargoSchema(BaseModel):
    cargo_id: int
    cargo_name: str = Field(..., min_length=1, max_length=90)
    weight: int = Field(..., gt=0)
    length: float = Field(..., gt=0)
    width: float = Field(..., gt=0)
    height: float = Field(..., gt=0)
    date_register_cargo: datetime = Field(default_factory=datetime.now)

# Модель Customer
class CustomerSchema(BaseModel):
    customer_id: int
    name_company: str = Field(..., min_length=1, max_length=60)
    date_register: datetime = Field(default_factory=datetime.now)
    documents_id: int = Field(..., init=False)
    documents: Optional[DriverSchema] = None

# Модель PutyList
class PutyListSchema(BaseModel):
    puty_list_id: int
    date_sending: datetime
    date_arrival: datetime
    cargo_id: int = Field(..., gt=0)
    driver_id: int = Field(..., gt=0)
    customer_id: int = Field(..., gt=0)
    send_city_id: int = Field(..., gt=0)
    arrival_city_id: int = Field(..., gt=0)
    all_price: Decimal = Field(init=False)
    price_kg: Decimal = Field(default=Decimal('0.00'))
    price_km: Decimal = Field(default=Decimal('0.00'))
    all_km: float = Field(default=0.0, ge=0)
    status: StatusEnum = Field(default=StatusEnum.NOT_DELIVERED)
    date_register_putylist: datetime = Field(default_factory=datetime.now)
    date_update_putylist: datetime = Field(default_factory=datetime.now)

    cargo: Optional[CargoSchema] = None
    driver: Optional[DriverSchema] = None
    customer: Optional[CustomerSchema] = None
    send_city: Optional[CitySchema] = None
    arrival_city: Optional[CitySchema] = None

    @model_validator(mode='after')
    def calculate_all_price(self):
        self.all_price = self.price_km * Decimal(str(self.all_km))
        return self

class RegisterDriver(BaseModel):
    name: str = Field(..., min_length=1, max_length=30)
    mid_name: str = Field(..., min_length=1, max_length=30)
    last_name: Optional[str] = Field(None, min_length=1, max_length=30)

class RegisterCustomer(BaseModel):
    name_company: str = Field(..., min_length=1, max_length=60)

class Register(BaseModel):
    register_driver: RegisterDriver | None
    register_customer: RegisterCustomer | None

    @model_validator(mode='after')
    def valid_registration(self):
        print(self.register_driver, self.register_customer)
        if self.register_driver is None and self.register_customer is None:
            raise ValueError("schemas register is none")
        elif self.register_driver is not None and self.register_customer is not None:
            raise ValueError("schema register driver and customer should not exist together")
        return self

class Authorize(BaseModel):
    id: int
    role: str

    @field_validator("role")
    def valid_role(cls, role):
        if role != "driver" and role != "customer":
            raise ValueError("role is not valid")
        return role

class DriverInfo(BaseModel):
    id: int
    name: str = Field(..., min_length=1, max_length=30)
    mid_name: str = Field(..., min_length=1, max_length=30)
    last_name: Optional[str] = Field(None, min_length=1, max_length=30)
    document_id: int | None
    number_passport: str | None
    number_driver_license: str | None
    car_id: int | None

class CustomerInfoSchema(BaseModel):
    id: int
    name_company: str = Field(..., min_length=1, max_length=60)
    documents_id: int
    number_snils: str | None
    number_inn: str | None


class User(BaseModel):
    id: int
    role: str
    document_id: int

class CreateOrUpdateCarSchema(BaseModel):
    car_name: str = Field(..., min_length=1, max_length=60)
    number_car: str = Field(..., pattern=r'^[A-Z]\d{3}[A-Z]{2}\d\d$')
    serial_number_car: int

    @field_validator('serial_number_car')
    def validate_positive_number(cls, value):
        if value <= 0:
            raise ValueError("Serial number must be positive")
        return value

class DriverUpdateSchema(BaseModel):
    name: str = Field(..., min_length=1, max_length=30)
    mid_name: str = Field(..., min_length=1, max_length=30)
    last_name: Optional[str] = Field(None, min_length=1, max_length=30)

class UpdatePassportSchema(BaseModel):
    serial_passport: str = Field(..., min_length=4, max_length=4, pattern=r'^\d{4}$')
    get_date: date
    birthday: date

    @field_validator('get_date', 'birthday')
    def validate_dates(cls, value):
        if value > date.today():
            raise ValueError("Date cannot be in the future")
        return value

class UpdateDriverLicense(BaseModel):
    seria_driverlicense: str = Field(..., min_length=6, max_length=6, pattern=r'^\d{6}$')
    get_date: date

class CreateCategoryDriverLicenseSchema(BaseModel):
    category_id: int
    number_driverlicense: str

class CreatePassportSchema(BaseModel):
    number_passport: str = Field(..., min_length=6, max_length=6, pattern=r'^\d{6}$')
    serial_passport: str = Field(..., min_length=4, max_length=4, pattern=r'^\d{4}$')
    get_date: date
    birthday: date
    document_id: int

    @field_validator('get_date', 'birthday')
    def validate_dates(cls, value):
        if value > date.today():
            raise ValueError("Date cannot be in the future")
        return value

class CreateDriverLicenseSchema(BaseModel):
    number_driverlicense: str = Field(..., min_length=4, max_length=4, pattern=r'^\d{4}$')
    seria_driverlicense: str = Field(..., min_length=6, max_length=6, pattern=r'^\d{6}$')
    get_date: date
    document_id: int

class CreateSnilsSchema(BaseModel):
    number_snils: str = Field(..., min_length=11, max_length=11, pattern=r'^\d{11}$')
    get_date: date
    document_id: int

    @field_validator('get_date')
    def validate_date(cls, value):
        if value > date.today():
            raise ValueError("SNILS issue date cannot be in the future")
        return value

class CreateInnSchema(BaseModel):
    number_inn: str = Field(..., min_length=10, max_length=12, pattern=r'^\d{10,12}$')
    get_date: date
    document_id: int

    @field_validator('get_date')
    def validate_date(cls, value):
        if value > date.today():
            raise ValueError("INN issue date cannot be in the future")
        return value