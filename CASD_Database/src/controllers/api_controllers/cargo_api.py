from typing import List
from datetime import datetime
from pydantic import BaseModel, validator
from decimal import Decimal

from fastapi import APIRouter, Depends
from CASD_Database.src.controllers.db_controllers.controllers import MainDbControllers
from CASD_Database.src.controllers.db_controllers.controllers import get_db_controller
from CASD_Database.src.db.models import Cargo

from CASD_Database.src.pydantic_models import CargoSchema
from CASD_Database.src.pydantic_models import CargoAllSchema

cargo_router = APIRouter(tags=["Cargo"], prefix="/api/cargo")





@cargo_router.get("/get-all")
async def get_all_cargo(db_controller: MainDbControllers = Depends(get_db_controller)):
    cargos: List[Cargo] = await db_controller.cargo_controller.get_all_cargo()
    return CargoAllSchema(cargos=[CargoSchema(cargo_id=cargo.cargo_id, cargo_name=cargo.cargo_name, weight=cargo.weight, length=cargo.length, width=cargo.width, height=cargo.height) for cargo in cargos])


