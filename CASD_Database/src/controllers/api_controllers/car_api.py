from fastapi import APIRouter, Request, HTTPException
from starlette.responses import JSONResponse

from CASD_Database.src.controllers.db_controllers.controllers import MainDbControllers, get_db_controller
from fastapi import Depends
from CASD_Database.src.pydantic_models import CarSchema, CreateOrUpdateCarSchema

from CASD_Database.src.db.models import Driver, Passport, DriverLicense, Car

car_router = APIRouter(tags=["Car Driver"], prefix="/api/driver-car")

@car_router.put("/update")
async def put_car(schema: CreateOrUpdateCarSchema, request: Request, db_controller: MainDbControllers = Depends(get_db_controller)):
    driver_id = int(request.headers.get("driver_id"))
    if not isinstance(driver_id, int):
        return HTTPException(detail="driver_id must be int", status_code=400)
    elif driver_id is None:
        return HTTPException(detail="driver_id not in headers request", status_code=404)
    driver: Driver = await db_controller.driver_controller.get(driver_id)
    if driver.car_id is None:
        return HTTPException(detail="The driver already exists", status_code=400)
    dict_schema = schema.model_dump()
    await db_controller.car_controller.update_car(car_id=driver.car_id, **dict_schema)
    return JSONResponse({"status": "successful", "update": driver.car_id}, status_code=200)


@car_router.get("/get")
async def get_car(request: Request, db_controller: MainDbControllers = Depends(get_db_controller)):
    car_id = int(request.headers.get("car_id"))
    if not isinstance(car_id, int):
        return HTTPException(detail="car_id must be int", status_code=400)
    elif car_id is None:
        return HTTPException(detail="car_id not in headers request", status_code=404)

    car: Car = await db_controller.car_controller.get(car_id)
    print(car)
    return CarSchema(car_id=car.car_id,
                     car_name=car.car_name,
                     number_car=car.number_car,
                     serial_number_car=car.serial_number_car)

@car_router.post("/create")
async def create_car(schema: CreateOrUpdateCarSchema, request: Request, db_controller: MainDbControllers = Depends(get_db_controller)):
    driver_id = int(request.headers.get("driver_id"))
    if not isinstance(driver_id, int):
        return HTTPException(detail="driver_id must be int", status_code=400)
    elif driver_id is None:
        return HTTPException(detail="driver_id not in headers request", status_code=404)
    driver: Driver = await db_controller.driver_controller.get(driver_id)
    if driver.car_id is not None:
        return HTTPException(detail="The driver already exists", status_code=400)
    car_id = await db_controller.car_controller.create_car(schema)
    await db_controller.driver_controller.update_driver_info(driver_id, car_id=car_id)
    return JSONResponse({"status": "successful", "car_id": car_id}, status_code=200)



