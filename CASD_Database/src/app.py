import asyncio
from fastapi import FastAPI
from CASD_Database.src.controllers.api_controllers.auth_api import auth_router
from CASD_Database.src.controllers.api_controllers.puty_list_api import puty_list_router
from CASD_Database.src.controllers.api_controllers.profile_driver_api import profile_driver_router
from CASD_Database.src.controllers.api_controllers.profile_customer_api import profile_customer_router
from CASD_Database.src.controllers.api_controllers.car_api import car_router
from fastapi.middleware.cors import CORSMiddleware
from CASD_Database.src.controllers.api_controllers.city_api import city_router
from CASD_Database.src.controllers.api_controllers.cargo_api import cargo_router
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Для разработки можно "*", на проде укажите конкретные домены
    allow_credentials=True,
    allow_methods=["*"],  # Разрешаем все методы, включая OPTIONS
    allow_headers=["*"],
)
app.include_router(auth_router)
app.include_router(puty_list_router)
app.include_router(profile_driver_router)
app.include_router(profile_customer_router)
app.include_router(car_router)
app.include_router(city_router)
app.include_router(cargo_router)
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)