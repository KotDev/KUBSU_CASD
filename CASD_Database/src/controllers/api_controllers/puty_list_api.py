from fastapi import APIRouter

from CASD_Database.src.controllers.db_controllers.controllers import MainDbControllers, get_db_controller
from fastapi import Depends


puty_list_router = APIRouter(tags=["PutyList"], prefix="/api/puty-list")




