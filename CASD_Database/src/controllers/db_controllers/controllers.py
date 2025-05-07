import dataclasses
from typing import List

from asyncpg import PostgresError

from CASD_Database.src.db.database import DB, AsyncSession, get_db
from fastapi import Depends, HTTPException
from CASD_Database.src.db.models import (Passport,
                                         PutyList,
                                         Snils,
                                         Inn,
                                         Driver,
                                         Documents,
                                         City,
                                         Cargo,
                                         Category,
                                         Customer,
                                         Car,
                                         DriverLicense,
                                         Region)
from CASD_Database.src.pydantic_models import (RegisterDriver,
                                               RegisterCustomer,
                                               CreateOrUpdateCarSchema,
                                               CategorySchema,
                                               CreatePassportSchema,
                                               CreateDriverLicenseSchema,
                                               CreateSnilsSchema,
                                               CreateInnSchema,
                                               PutyListLineElement,
                                               PutyListsLine,
                                               PutyListReport,
                                               PutyListInfo, CreatePutyListSchema)

def query_update_on_id(model, id, type, type_id, **kwargs):
    fields = {f.name for f in dataclasses.fields(model)}
    valid_updates = {k: v for k, v in kwargs.items() if k in fields}
    if not valid_updates:
        raise ValueError("No valid fields to update")

    set_clause = ", ".join([f"{k} = ${i + 2}" for i, k in enumerate(valid_updates.keys())])
    query: str = f"UPDATE {type} SET {set_clause} WHERE {type_id} = $1"
    params = [id, *valid_updates.values()]
    return query, params


class PassportController:
    def __init__(self, db: DB):
        self.db = db

    async def get(self, number_passport: str):
        async with AsyncSession(db=self.db) as session:
            record = await session.fetchrow("SELECT * FROM passport WHERE number_passport = $1", number_passport)
            if record is not None:
                data = AsyncSession.record_to_dataclass(record, Passport)
                return data
        raise HTTPException(detail="Passport is None", status_code=404)

    async def update_passport(self, number_passport, **kwargs):
        async with AsyncSession(db=self.db) as session:
            query, params = query_update_on_id(Passport, number_passport, "passport", "number_passport", **kwargs)
            await session.execute(query, *params)

    async def exists(self, number_passport: str):
        async with AsyncSession(db=self.db) as session:
            record = await session.fetchrow("SELECT * FROM passport WHERE number_passport = $1", number_passport)
            print(record)
            if record is not None:
                data = AsyncSession.record_to_dataclass(record, Passport)
                return data

    async def create_passport(self, schema: CreatePassportSchema ):
        async with AsyncSession(db=self.db) as session:
            record = await session.fetchrow('''INSERT INTO passport (number_passport, serial_passport, get_date, birthday) VALUES ($1, $2, $3, $4)
                                                     RETURNING number_passport''',
                                            schema.number_passport,
                                            schema.serial_passport,
                                            schema.get_date,
                                            schema.birthday)
            passport_id = record["number_passport"]
            await session.execute('''UPDATE documents SET number_passport = $1 WHERE document_id = $2''',
                                    passport_id, schema.document_id)



class SnilsController:
    def __init__(self, db: DB):
        self.db = db

    async def get(self, number_snils: str):
        async with AsyncSession(db=self.db) as session:
            record = await session.fetchrow("SELECT * FROM snils WHERE number_snils = $1", number_snils)
            if record is not None:
                data = AsyncSession.record_to_dataclass(record, Snils)
                return data
            raise HTTPException(detail="This not in db", status_code=404)


    async def exists(self, number_snils: str):
        async with AsyncSession(db=self.db) as session:
            record = await session.fetchrow("SELECT number_snils FROM documents WHERE number_snils = $1", number_snils)
            if record is not None:
                data = AsyncSession.record_to_dataclass(record, Snils)
                return data

    async def create_snils(self, schema: CreateSnilsSchema):
        async with AsyncSession(db=self.db) as session:
            record = await session.fetchrow('''INSERT INTO snils (number_snils, get_date) VALUES ($1, $2)
                                                     RETURNING number_snils''',
                                            schema.number_snils,
                                            schema.get_date)
            number_snils = record["number_snils"]
            await session.execute('''UPDATE documents SET number_snils = $1 WHERE document_id = $2''',
                                    number_snils, schema.document_id)


class InnController:
    def __init__(self, db: DB):
        self.db = db

    async def get(self, number_inn):
        async with AsyncSession(db=self.db) as session:
            record = await session.fetchrow("SELECT * FROM inn WHERE number_inn = $1", number_inn)
            if record is not None:
                data = AsyncSession.record_to_dataclass(record, Inn)
                return data
            raise HTTPException(detail="This Inn not in db", status_code=404)

    async def update_inn(self, number_inn, **kwargs):
        async with AsyncSession(db=self.db) as session:
            query, params = query_update_on_id(Inn, number_inn, "inn", "number_inn", **kwargs)
            try:
                await session.execute(query, *params)
            except PostgresError:
                return HTTPException(detail="This inn is exists", status_code=400)

    async def create_inn(self, schema: CreateInnSchema):
        async with AsyncSession(db=self.db) as session:
            record = await session.fetchrow('''INSERT INTO inn (number_inn, get_date) VALUES ($1, $2)
                                                     RETURNING number_inn''',
                                            schema.number_inn,
                                            schema.get_date)
            number_inn = record["number_inn"]
            await session.execute('''UPDATE documents SET number_inn = $1 WHERE document_id = $2''',
                                    number_inn, schema.document_id)

    async def exists(self, number_inn: str):
        async with AsyncSession(db=self.db) as session:
            record = await session.fetchrow("SELECT number_inn FROM documents WHERE number_inn = $1", number_inn)
            if record is not None:
                data = AsyncSession.record_to_dataclass(record, Inn)
                return data

class DriverLicenseController:
    def __init__(self, db: DB):
        self.db = db

    async def get(self, number_diver_license: str):
        async with AsyncSession(db=self.db) as session:
            record = await session.fetchrow("SELECT * FROM driverlicense WHERE number_driverlicense = $1", number_diver_license)
            if record is not None:
                data = AsyncSession.record_to_dataclass(record, DriverLicense)
                return data
            raise HTTPException(detail="This DriverLicense not in db", status_code=404)

    async def exists(self, number_driverlicense: str):
        async with AsyncSession(db=self.db) as session:
            record = await session.fetchrow("SELECT number_driverlicense FROM documents WHERE number_driverlicense = $1", number_driverlicense)
            if record is not None:
                data = AsyncSession.record_to_dataclass(record, DriverLicense)
                return data

    async def get_all_info_driver_license(self, driver_license_id):
        async with AsyncSession(db=self.db) as session:
            driver_license_data: DriverLicense = await self.get(driver_license_id)
            if driver_license_data is not None:
                record = await session.fetch('''SELECT * FROM category c 
                                       JOIN category_driverlicense cd ON c.category_id = cd.categoryes_id 
                                        WHERE numbers_driverlicense = $1''',
                                             driver_license_data.number_driverlicense)
                if record:
                    categoryes = [AsyncSession.record_to_dataclass(rec, Category) for rec in record]
                else:
                    categoryes = None
                driver_license_data.categoryes = categoryes
                return driver_license_data
            raise HTTPException(detail="This DriverLicense not in db", status_code=400)

    async def create_category_for_driver_license(self, category_id, number_driverlicense):
        async with AsyncSession(db=self.db) as session:
            await session.fetchrow('''INSERT INTO category_driverlicense 
                                                (categoryes_id, numbers_driverlicense)  
                                                VALUES ($1, $2)''', category_id, number_driverlicense)


    async def update_driver_license(self, number_driver_license, **kwargs):
        async with AsyncSession(db=self.db) as session:
            query, params = query_update_on_id(DriverLicense, number_driver_license, "driverlicense", "number_driverlicense", **kwargs)
            await session.execute(query, *params)

    async def create_driver_license(self, schema: CreateDriverLicenseSchema):
        async with AsyncSession(db=self.db) as session:
            record = await session.fetchrow('''INSERT INTO driverlicense (number_driverlicense, seria_driverlicense, get_date)
                                               VALUES ($1, $2, $3)
                                               RETURNING number_driverlicense''', schema.number_driverlicense,
                                                                             schema.seria_driverlicense,
                                                                             schema.get_date)
            number_driverlicense = record["number_driverlicense"]
            await session.execute('''UPDATE documents SET number_driverlicense = $1 WHERE document_id = $2''',
                                  number_driverlicense, schema.document_id)


class DocumentController:
    def __init__(self, db: DB):
        self.db = db

    async def get(self, document_id):
        async with AsyncSession(db=self.db) as session:
            record = await session.fetchrow("SELECT * FROM documents WHERE document_id = $1", document_id)
            if record is not None:
                data = AsyncSession.record_to_dataclass(record, Documents)
                return data
            raise HTTPException(detail="This document not in db", status_code=404)


    async def create_documents(self):
        async with AsyncSession(db=self.db) as session:
            record = await session.fetchrow('''INSERT INTO documents 
                                                (number_passport, number_snils, number_inn, number_driverlicense)  
                                                VALUES (NULL, NULL, NULL, NULL)
                                                RETURNING document_id''')
        return record["document_id"]

    async def get_all_info_document_driver(self, document_id: int):
        async with AsyncSession(db=self.db) as session:
            record = await session.fetchrow('''SELECT * FROM documents d 
                                               LEFT JOIN passport p ON p.number_passport = d.number_passport 
                                               LEFT JOIN driverlicense dr ON dr.number_driverlicense = d.number_driverlicense
                                               WHERE d.document_id = $1''', document_id)
            print(record)
            if record is not None:
                documents: Documents = AsyncSession.record_to_dataclass(record, Documents)
                print(documents)
                if documents.number_passport is not None:
                    passport: Passport = AsyncSession.record_to_dataclass(record, Passport)
                    documents.passport_data = passport
                if documents.number_driverlicense is not None:
                    driver_license: DriverLicense = AsyncSession.record_to_dataclass(record, DriverLicense)
                    record_driver_license = await session.fetch('''SELECT * FROM category c 
                                                                   JOIN category_driverlicense cd ON c.category_id = cd.categoryes_id 
                                                                   WHERE numbers_driverlicense = $1''',
                                                                driver_license.number_driverlicense)
                    if record_driver_license:
                        categoryes = [AsyncSession.record_to_dataclass(rec, Category) for rec in record_driver_license]
                    else:
                        categoryes = None
                    driver_license.categoryes = categoryes
                    documents.driver_license_data = driver_license
                return documents
            raise HTTPException(detail="Ths document in not db", status_code=404)


    async def get_all_info_document_customer(self, document_id):
        async with AsyncSession(db=self.db) as session:
            record = await session.fetchrow('''SELECT * FROM documents d 
                                               LEFT JOIN snils s ON s.number_snils = d.number_snils
                                               LEFT JOIN inn i ON i.number_inn = d.number_inn
                                               WHERE d.document_id = $1''', document_id)
            print(record)
            if record is not None:
                documents: Documents = AsyncSession.record_to_dataclass(record, Documents)
                if documents.number_inn is not None:
                    inn: Inn = AsyncSession.record_to_dataclass(record, Inn)
                    documents.inn_data = inn
                if documents.number_snils is not None:
                    snils: Snils = AsyncSession.record_to_dataclass(record, Snils)
                    documents.snils_data = snils
                return documents
            record = await session.fetchrow('''SELECT * FROM documents d 
                                                           WHERE d.document_id = $1''', document_id)
            if record is not None:
                documents: Documents = AsyncSession.record_to_dataclass(record, Documents)
                return documents
            raise HTTPException(detail="Ths document in not db", status_code=404)






class CategoryController:
    def __init__(self, db: DB):
        self.db = db

    async def get(self, category_id):
        async with AsyncSession(db=self.db) as session:
            record = await session.fetchrow("SELECT * FROM category WHERE category_id = $1", category_id)
            if record is not None:
                data = AsyncSession.record_to_dataclass(record, Category)
                return data
            raise HTTPException(detail="This category not in db", status_code=404)

    async def get_categoryes_driver_license(self, number_driver_license):
        async with AsyncSession(db=self.db) as session:
            record_driver_license = await session.fetch('''SELECT * FROM category c 
                                                           JOIN category_driverlicense cd ON c.category_id = cd.categoryes_id 
                                                           WHERE numbers_driverlicense = $1''',
                                                        number_driver_license)
            categoryes = list()
            if record_driver_license:
                categoryes_model: List[Category] = [AsyncSession.record_to_dataclass(cat, Category) for cat in record_driver_license]
                categoryes = [CategorySchema(category_id=cat.category_id,
                                             category_name=cat.category_name,
                                            ) for cat in categoryes_model]
            return categoryes

    async def get_not_categoryes_driver_license(self, number_driver_license):
        async with AsyncSession(db=self.db) as session:
            print(number_driver_license)
            record_driver_license = await session.fetch('''SELECT * FROM category c 
                                                                WHERE c.category_id NOT IN (
                                                                    SELECT cd.categoryes_id 
                                                                    FROM category_driverlicense cd 
                                                                    WHERE cd.numbers_driverlicense = $1
                                                                )''',
                                                        number_driver_license)
            categoryes = list()
            if record_driver_license:
                categoryes_model: List[Category] = [AsyncSession.record_to_dataclass(cat, Category) for cat in record_driver_license]
                categoryes = [CategorySchema(category_id=cat.category_id,
                                             category_name=cat.category_name,
                                            ) for cat in categoryes_model]
            return categoryes

    async def get_category_driver_license_id(self, number_driverlicense, category_id):
        async with AsyncSession(db=self.db) as session:
            record = await session.fetchrow('''SELECT id_category_driverlicense FROM category_driverlicense 
                                                WHERE categoryes_id = $1 AND numbers_driverlicense = $2
                                                ''',
                                            category_id, number_driverlicense)
            if record is None:
                raise HTTPException(detail="Driver license category not in db", status_code=404)
            return record["id_category_driverlicense"]

    async def delete_category_driver_license(self, category_driver_license_id):
        async with AsyncSession(db=self.db) as session:
            await session.execute('''DELETE FROM category_driverlicense WHERE id_category_driverlicense = $1''',
                                           category_driver_license_id)


class CityController:
    def __init__(self, db: DB):
        self.db = db

    async def get(self, city_id):
        async with AsyncSession(db=self.db) as session:
            record = await session.fetchrow("SELECT * FROM city WHERE city_id = $1", city_id)
            if record is not None:
                data = AsyncSession.record_to_dataclass(record, City)
                return data
            raise HTTPException(detail="This city not in db", status_code=404)
    
    async def get_city_for_region(self, region_id):
        async with AsyncSession(db=self.db) as session:
            record = await session.fetch("SELECT * FROM city WHERE region_id = $1", region_id)
            if record:
                return [AsyncSession.record_to_dataclass(city, City) for city in record]
            return []
            
class RegionController:
    def __init__(self, db: DB):
        self.db = db

    async def get(self, region_name):
        async with AsyncSession(db=self.db) as session:
            record = await session.fetchrow("SELECT * FROM region WHERE region_name = $1", region_name)
            if record is not None:
                data = AsyncSession.record_to_dataclass(record, Region)
                return data
            raise HTTPException(detail="This region not in db", status_code=404)
    
    async def get_all_regions(self):
        async with AsyncSession(db=self.db) as session:
            record = await session.fetch("SELECT * FROM region")
            return [AsyncSession.record_to_dataclass(region, Region) for region in record]

class CargoController:
    def __init__(self, db: DB):
        self.db = db

    async def get(self, cargo_id):
        async with AsyncSession(db=self.db) as session:
            record = await session.fetchrow("SELECT * FROM cargo WHERE cargo_id = $1", cargo_id)
            if record is not None:
                data = AsyncSession.record_to_dataclass(record, Cargo)
                return data
            raise HTTPException(detail="This cargo not in db", status_code=404)
        
    async def get_all_cargo(self):
        async with AsyncSession(db=self.db) as session:
            record = await session.fetch("SELECT * FROM cargo")
            return [AsyncSession.record_to_dataclass(cargo, Cargo) for cargo in record]

class DriverController:
    def __init__(self, db: DB):
        self.db = db

    async def get(self, driver_id):
        async with AsyncSession(db=self.db) as session:
            record = await session.fetchrow("SELECT * FROM driver WHERE driver_id = $1", driver_id)
            if record is not None:
                print(record)
                data = AsyncSession.record_to_dataclass(record, Driver)
                return data
            raise HTTPException(detail="This Driver not in db", status_code=404)

    async def create_driver(self, schema: RegisterDriver, document_id: int):
        async with AsyncSession(db=self.db) as session:
            record = await session.fetchrow('''INSERT INTO driver (name, mid_name, last_name, documents_id, car_id) 
                                                VALUES($1, $2, $3, $4, $5)
                                                RETURNING driver_id''',
                                            schema.name, schema.mid_name, schema.last_name, document_id, None)
            print(record, schema)
            return record["driver_id"]

    async def get_driver_info(self, driver_id):
        async with AsyncSession(db=self.db) as session:
            record = await session.fetchrow('''SELECT * FROM driver d 
                                                     JOIN documents doc ON d.documents_id = doc.document_id
                                                     WHERE d.driver_id = $1''', driver_id)
            if record is not None:
                driver = AsyncSession.record_to_dataclass(record, Driver)
                documents = AsyncSession.record_to_dataclass(record, Documents)
                driver.documents = documents
                return driver
            raise HTTPException(detail="This driver not in db", status_code=404)


    async def update_driver_info(self, driver_id: int, **kwargs):
        async with AsyncSession(db=self.db) as session:
            query, params = query_update_on_id(Driver, driver_id, "driver", "driver_id", **kwargs)
            await session.execute(query, *params)
    





class CustomerController:
    def __init__(self, db: DB):
        self.db = db

    async def get(self, customer_id) -> Customer | None:
        async with AsyncSession(db=self.db) as session:
            record = await session.fetchrow("SELECT * FROM customer WHERE customer_id = $1", customer_id)
            print(record)
            if record is not None:
                data = AsyncSession.record_to_dataclass(record, Customer)
                return data
            raise HTTPException(detail="This customer not in db", status_code=404)

    async def get_customer_info(self, customer_id):
        async with AsyncSession(db=self.db) as session:
            record = await session.fetchrow('''SELECT * FROM customer c 
                                                     JOIN documents doc ON c.documents_id = doc.document_id
                                                     WHERE c.customer_id = $1''', customer_id)
            if record is not None:
                customer = AsyncSession.record_to_dataclass(record, Customer)
                documents = AsyncSession.record_to_dataclass(record, Documents)
                customer.documents = documents
                return customer
            raise HTTPException(detail="This customer not in db", status_code=404)

    async def create_customer(self, schema: RegisterCustomer, document_id):
        async with AsyncSession(db=self.db) as session:
            record = await session.fetchrow('''INSERT INTO customer (name_company, documents_id) VALUES ($1, $2)
                                                     RETURNING customer_id''',
                                            schema.name_company, document_id)
            print(record)
            return record["customer_id"]



class PutyListController:
    def __init__(self, db: DB):
        self.db = db

    async def get(self, puty_list_id):
        async with AsyncSession(db=self.db) as session:
            record = await session.fetchrow("SELECT * FROM puty_list WHERE puty_list = $1", puty_list_id)
            if record is not None:
                data = AsyncSession.record_to_dataclass(record, PutyList)
                return data
            raise HTTPException(detail="This puty_list not in db", status_code=404)

    async def get_puty_list_line(self, user_id: int, status: str, role: str):
        async with AsyncSession(db=self.db) as session:
            record = await session.fetch(f'''
                                            SELECT
                                                p.puty_list_id,
                                                p.date_sending,
                                                p.date_arrival,
                                                p.status,
                                                ci.city_name AS departure_city_name,
                                                cia.city_name AS arrival_city_name,
                                                carg.cargo_name,
                                                cust.name_company,
                                                p.all_price + carg.weight::numeric * p.price_kg AS total_price
                                               FROM puty_list p
                                                 JOIN cargo carg ON carg.cargo_id = p.cargo_id
                                                 JOIN customer cust ON cust.customer_id = p.customer_id
                                                 JOIN city ci ON ci.city_id = p.send_city_id
                                                 JOIN city cia ON cia.city_id = p.arrival_city_id
                                               WHERE p.{role} = $1 AND p.status = $2
                                            ''', *[user_id, status])
            if record:
                line = [PutyListLineElement(**elem) for elem in record]
                return PutyListsLine(line=line)
            return PutyListsLine(line=[])

    async def get_puty_list_line_order(self, size: int, page: int):
        async with AsyncSession(db=self.db) as session:
            if page < 1:
                raise ValueError("Page number must be greater than 0")
            if size < 1:
                raise ValueError("Size must be greater than 0")
            
            offset = (page - 1) * size
            
            record = await session.fetch(f'''
                SELECT
                    p.puty_list_id,
                    p.date_sending,
                    p.date_arrival,
                    p.status,
                    ci.city_name AS departure_city_name,
                    cia.city_name AS arrival_city_name,
                    carg.cargo_name,
                    cust.name_company,
                    p.all_price + carg.weight::numeric * p.price_kg + p.all_km::numeric * p.price_km AS total_price
                FROM puty_list p
                    JOIN cargo carg ON carg.cargo_id = p.cargo_id
                    JOIN customer cust ON cust.customer_id = p.customer_id
                    JOIN city ci ON ci.city_id = p.send_city_id
                    JOIN city cia ON cia.city_id = p.arrival_city_id
                WHERE p.driver_id is NULL
                ORDER BY p.date_register_putylist DESC
                OFFSET $1 ROWS FETCH NEXT $2 ROWS ONLY
            ''', offset, size)
            
            if record:
                line = [PutyListLineElement(**elem) for elem in record]
                return PutyListsLine(line=line)
            return PutyListsLine(line=[])

    async def get_puty_list_report(self, puty_list_id: int):
        async with AsyncSession(db=self.db) as session:
            record = await session.fetchrow(f'''
                SELECT
                    p.puty_list_id,
                    p.date_sending,
                    p.date_arrival,
                    p.status,
                    ci.city_name AS departure_city_name,
                    cia.city_name AS arrival_city_name,
                    p.all_km,
                    carg.cargo_name,
                    carg.weight,
                    carg.height,
                    carg.width,
                    carg.length,
                    p.price_km,
                    p.price_kg,
                    p.all_price,
                    p.all_price + carg.weight::numeric * p.price_kg + p.all_km::numeric * p.price_km AS total_price,
                    cust.name_company,
                    d.name,
                    d.mid_name,
                    d.last_name,
                    c.car_name,
                    c.number_car,
                    c.serial_number_car
                FROM puty_list p
                    JOIN cargo carg ON carg.cargo_id = p.cargo_id
                    JOIN driver d ON d.driver_id = p.driver_id
                    JOIN car c ON c.car_id = d.car_id
                    JOIN customer cust ON cust.customer_id = p.customer_id
                    JOIN city ci ON ci.city_id = p.send_city_id
                    JOIN city cia ON cia.city_id = p.arrival_city_id
                WHERE p.puty_list_id = $1 AND p.driver_id IS NOT NULL
            ''', puty_list_id)
            print(record)
            if record is None:
                raise HTTPException(detail="This puty_list not in db", status_code=404)
            
            return PutyListReport(**record)
    
    async def get_puty_list_info(self, puty_list_id: int):
        async with AsyncSession(db=self.db) as session:
            record = await session.fetchrow(f'''
                                            SELECT
                                                p.date_sending,
                                                p.date_arrival,
                                                ci.city_name AS departure_city_name,
                                                cia.city_name AS arrival_city_name,
                                                carg.cargo_name,
                                                cust.name_company,
                                                p.all_km,
                                                p.price_km,
                                                p.price_kg,
                                                carg.weight,
                                                carg.height,
                                                carg.width,
                                                carg.length,                                            
                                                p.all_price + carg.weight::numeric * p.price_kg + p.all_km::numeric * p.price_km AS total_price
                                               FROM puty_list p
                                                 JOIN cargo carg ON carg.cargo_id = p.cargo_id
                                                 JOIN customer cust ON cust.customer_id = p.customer_id
                                                 JOIN city ci ON ci.city_id = p.send_city_id
                                                 JOIN city cia ON cia.city_id = p.arrival_city_id
                                               WHERE p.puty_list_id = $1
                                            ''', puty_list_id)
            if record is not None:
                return PutyListInfo(**record)
            raise HTTPException(detail="This puty_list not in db", status_code=404)

    async def create_puty_list(self, schema: CreatePutyListSchema):
        async with AsyncSession(db=self.db) as session:
            print(schema)
            await session.execute('''INSERT INTO puty_list (date_sending, date_arrival, cargo_id, customer_id, send_city_id, arrival_city_id, all_km, price_km, price_kg)
                                     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)''',
                                     schema.date_sending, schema.date_arrival, schema.cargo_id, schema.customer_id, schema.send_city_id, schema.arrival_city_id, schema.all_km, schema.price_km, schema.price_kg)
            
    async def update_puty_list(self, puty_list_id, **kwargs):
        async with AsyncSession(db=self.db) as session:
            query, params = query_update_on_id(PutyList, puty_list_id, "puty_list", "puty_list_id", **kwargs)
            await session.execute(query, *params)

class CarController:
    def __init__(self, db: DB):
        self.db = db

    async def get(self, car_id):
        async with AsyncSession(db=self.db) as session:
            record = await session.fetchrow("SELECT * FROM car WHERE car_id = $1", car_id)
            if record is not None:
                data = AsyncSession.record_to_dataclass(record, Car)
                return data
            raise HTTPException(detail="This Car not in db", status_code=404)

    async def create_car(self, schema: CreateOrUpdateCarSchema):
        async with AsyncSession(db=self.db) as session:
            record = await session.fetchrow('''INSERT INTO car (car_name, number_car, serial_number_car)
                                                     VALUES ($1, $2, $3)
                                                     RETURNING car_id''',
                                            schema.car_name, schema.number_car, schema.serial_number_car)
            return record["car_id"]

    async def update_car(self, car_id, **kwargs):
        async with AsyncSession(db=self.db) as session:
            query, params = query_update_on_id(Car, car_id, "car", "car_id", **kwargs)
            await session.execute(query, *params)


class MainDbControllers:
    def __init__(self, db: DB):
        self.passport_controller = PassportController(db)
        self.snils_controller = SnilsController(db)
        self.inn_controller = InnController(db)
        self.driver_license_controller = DriverLicenseController(db)
        self.document_controller = DocumentController(db)
        self.category_controller = CategoryController(db)
        self.city_controller = CityController(db)
        self.region_controller = RegionController(db)
        self.cargo_controller = CargoController(db)
        self.driver_controller = DriverController(db)
        self.customer_controller = CustomerController(db)
        self.puty_list_controller = PutyListController(db)
        self.car_controller = CarController(db)


def get_db_controller(db: DB = Depends(get_db)):
    return MainDbControllers(db)

