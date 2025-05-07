from typing import List

from fastapi import APIRouter, Request, HTTPException
from starlette.responses import JSONResponse

from CASD_Database.src.controllers.db_controllers.controllers import MainDbControllers, get_db_controller
from fastapi import Depends
from CASD_Database.src.pydantic_models import (User,
                                               DriverInfo,
                                               PassportSchema,
                                               DocumentsSchema,
                                               CategorySchema,
                                               DriverLicenseSchema,
                                               DriverUpdateSchema,
                                               UpdatePassportSchema,
                                               UpdateDriverLicense,
                                               CreateCategoryDriverLicenseSchema,
                                               CreatePassportSchema,
                                               CreateDriverLicenseSchema)

from CASD_Database.src.db.models import Driver, Passport, DriverLicense, Category

profile_driver_router = APIRouter(tags=["Profile Drivers"], prefix="/api/drivers/me")

#---------------------------------------------------GET-----------------------------------------------------------------

@profile_driver_router.get("/")
async def get_me(request: Request, db_controller: MainDbControllers = Depends(get_db_controller)):
    driver_id: int = int(request.headers.get("driver_id"))
    if not isinstance(driver_id, int):
        return HTTPException(detail="driver_id must be int", status_code=400)
    elif driver_id is None:
        return HTTPException(detail="driver_id not in headers request", status_code=404)
    driver: Driver = await db_controller.driver_controller.get_driver_info(driver_id)
    return DriverInfo(id=driver.driver_id,
                      document_id=driver.documents_id,
                      last_name=driver.last_name,
                      mid_name=driver.mid_name,
                      name=driver.name,
                      number_passport=driver.documents.number_passport,
                      number_driver_license=driver.documents.number_driverlicense,
                      car_id=driver.car_id)


@profile_driver_router.get("/document/passport")
async def get_me_passport(request: Request, db_controller: MainDbControllers = Depends(get_db_controller)):
    number_passport: str = request.headers.get("number_passport")
    if number_passport is None:
        return HTTPException(detail="number_passport not in headers request", status_code=404)
    passport: Passport = await db_controller.passport_controller.get(number_passport)
    return PassportSchema(number_passport=passport.number_passport,
                          get_date=passport.get_date,
                          serial_passport=passport.serial_passport,
                          birthday=passport.birthday)

@profile_driver_router.get("/driver-license/not-category")
async def get_not_category(request: Request, db_controller: MainDbControllers = Depends(get_db_controller)):
    number_driverlicense: str = request.headers.get("number_driverlicense")
    if number_driverlicense is None:
        return HTTPException(detail="number_license not in headers request", status_code=404)
    categoryes: List[CategorySchema] = await db_controller.category_controller.get_not_categoryes_driver_license(number_driverlicense)
    return categoryes

@profile_driver_router.get("/documents")
async def get_me_documents(request: Request, db_controller: MainDbControllers = Depends(get_db_controller)):
    document_id: int = int(request.headers.get("document_id"))
    if not isinstance(document_id, int):
        return  HTTPException(detail="document_id must be int", status_code=400)
    elif document_id is None:
        return HTTPException(detail="document_id not in headers request", status_code=404)
    documents = await db_controller.document_controller.get_all_info_document_driver(document_id)
    if documents.number_driverlicense is None and documents.number_passport is None:
        return DocumentsSchema(document_id=document_id)
    if documents.driver_license_data is not None:
        if documents.driver_license_data.categoryes is not None:
            categoryes_schema = [CategorySchema(category_id=category.category_id,
                                                category_name=category.category_name)
                                 for category in documents.driver_license_data.categoryes]

        else:
            categoryes_schema = None

        driver_license_schema = DriverLicenseSchema(number_driverlicense=documents.number_driverlicense,
                                                    get_date=documents.driver_license_data.get_date,
                                                    categoryes=categoryes_schema,
                                                    seria_driverlicense=documents.driver_license_data.seria_driverlicense)
    else:
        driver_license_schema = None

    if documents.passport_data is not None:
        passport_schema: PassportSchema = PassportSchema(number_passport=documents.number_passport,
                                                  get_date=documents.passport_data.get_date,
                                                  birthday=documents.passport_data.birthday,
                                                  serial_passport=documents.passport_data.serial_passport)
    else:
        passport_schema = None

    return DocumentsSchema(document_id=document_id,
                           passport_data=passport_schema,
                           driver_license_data=driver_license_schema,
                           number_passport=documents.number_passport,
                           number_driverlicense=documents.number_driverlicense)

@profile_driver_router.get("/document/driver-license")
async def get_me_driver_license(request: Request, db_controller: MainDbControllers = Depends(get_db_controller)):
    driver_license_id = request.headers.get("number_driverlicense")
    if driver_license_id is None:
        return HTTPException(detail="driver_license_id not in headers request", status_code=404)

    driver_license: DriverLicense = await db_controller.driver_license_controller.get_all_info_driver_license(driver_license_id)
    if driver_license.categoryes is not None:
        categoryes_schema = [CategorySchema(category_id=category.category_id,
                                            category_name=category.category_name)
                             for category in driver_license.categoryes]
    else:
        categoryes_schema = None
    return DriverLicenseSchema(number_driverlicense=driver_license.number_driverlicense,
                               get_date=driver_license.get_date,
                               seria_driverlicense=driver_license.seria_driverlicense,
                               categoryes=categoryes_schema)

#---------------------------------------------------PUT-----------------------------------------------------------------

@profile_driver_router.put("/")
async def put_me(schema: DriverUpdateSchema, request: Request, db_controller: MainDbControllers = Depends(get_db_controller)):
    driver_id: int = int(request.headers.get("driver_id"))
    if not isinstance(driver_id, int):
        return HTTPException(detail="driver_id must be int", status_code=400)
    elif driver_id is None:
        return HTTPException(detail="driver_id not in headers request", status_code=404)
    update_schema = schema.model_dump()
    await db_controller.driver_controller.get(driver_id)
    print(update_schema)
    await db_controller.driver_controller.update_driver_info(driver_id, **update_schema)
    return JSONResponse({"Status": "Successful", "update_driver_id": driver_id}, status_code=200)

@profile_driver_router.put("/document/passport")
async def put_passport(schema: UpdatePassportSchema, request: Request, db_controller: MainDbControllers = Depends(get_db_controller)):
    number_passport: str = request.headers.get("number_passport")
    if number_passport is None:
        return HTTPException(detail="number_passport not in headers request", status_code=404)
    update_schema = schema.model_dump()
    await db_controller.passport_controller.get(number_passport)
    await db_controller.passport_controller.update_passport(number_passport, **update_schema)
    return JSONResponse({"Status": "Successful", "update_number_passport": number_passport}, status_code=200)


@profile_driver_router.put("/document/driver-license")
async def put_driver_license(schema: UpdateDriverLicense, request: Request, db_controller: MainDbControllers = Depends(get_db_controller)):
    number_driver_license: str = request.headers.get("number_driverlicense")
    if number_driver_license is None:
        return HTTPException(detail="number_driverlicense not in headers request", status_code=404)
    update_schema = schema.model_dump()
    driver_license: DriverLicense = await db_controller.driver_license_controller.get(number_driver_license)
    await db_controller.driver_license_controller.update_driver_license(driver_license.number_driverlicense, **update_schema)
    return JSONResponse({"Status": "Successful", "update_driver_license": driver_license.number_driverlicense}, status_code=200)


#---------------------------------------------------POST-----------------------------------------------------------------


@profile_driver_router.post("/document/passport/create")
async def post_me_passport(schema: CreatePassportSchema, db_controller: MainDbControllers = Depends(get_db_controller)):
    print(schema)
    passport = await db_controller.passport_controller.exists(schema.number_passport)
    if passport is not None:
        raise HTTPException(detail="The passport already exists", status_code=400)
    await db_controller.passport_controller.create_passport(schema)
    return JSONResponse({"status": "Successful"}, status_code=200)

@profile_driver_router.post("/document/driver-license/create")
async def post_me_driver_license(schema: CreateDriverLicenseSchema, db_controller: MainDbControllers = Depends(get_db_controller)):
    driver_license = await db_controller.driver_license_controller.exists(schema.number_driverlicense)
    if driver_license is not None:
        raise HTTPException(detail="The driver_license already exists", status_code=400)
    await db_controller.driver_license_controller.create_driver_license(schema)
    return JSONResponse({"status": "Successful"}, status_code=200)


@profile_driver_router.post("/document/driver-license/add-category")
async def post_driver_license_category(schema: CreateCategoryDriverLicenseSchema, db_controller: MainDbControllers = Depends(get_db_controller)):
    category_id = schema.category_id
    number_driverlicense = schema.number_driverlicense
    category: Category = await db_controller.category_controller.get(category_id)
    driverlicense: DriverLicense = await db_controller.driver_license_controller.get(number_driverlicense)
    await db_controller.driver_license_controller.create_category_for_driver_license(category.category_id, driverlicense.number_driverlicense)
    return JSONResponse({"status": "successful"}, status_code=200)

#---------------------------------------------------DELETE-----------------------------------------------------------------

@profile_driver_router.delete("/document/driver-license/delete-category")
async def delete_driver_license_category(request: Request, db_controller: MainDbControllers = Depends(get_db_controller)):
    category_id = int(request.headers.get("category_id"))
    number_driverlicense = request.headers.get("number_driverlicense")
    if category_id is None and number_driverlicense is None:
        return HTTPException(detail="category_id and number_driverlicense not in headers request", status_code=404)
    elif not isinstance(category_id, int):
        return HTTPException(detail="category_id must be int", status_code=200)
    category: Category = await db_controller.category_controller.get(category_id)
    driver_license: DriverLicense = await db_controller.driver_license_controller.get(number_driverlicense)
    driver_license_category_id = await db_controller.category_controller.get_category_driver_license_id(
        category_id=category.category_id, number_driverlicense=driver_license.number_driverlicense
    )
    await db_controller.category_controller.delete_category_driver_license(driver_license_category_id)
    return JSONResponse({"status": "successful"}, status_code=200)
