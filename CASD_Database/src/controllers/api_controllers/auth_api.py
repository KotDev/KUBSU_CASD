from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse

from CASD_Database.src.controllers.db_controllers.controllers import MainDbControllers, get_db_controller
from fastapi import Depends
from CASD_Database.src.pydantic_models import Register, Authorize, User

auth_router = APIRouter(tags=["Auth"], prefix="/api/auth")


@auth_router.post("/register")
async def register_user(schema: Register, db_controller: MainDbControllers = Depends(get_db_controller)):
    document_id: int = await db_controller.document_controller.create_documents()
    role = "customer"
    driver_id: int | None = None
    customer_id: int | None = None
    if schema.register_customer is None:
        driver_id: int = await db_controller.driver_controller.create_driver(schema.register_driver, document_id)
        role = "driver"
    else:
        customer_id: int = await db_controller.customer_controller.create_customer(schema.register_customer, document_id)
    return User(id=customer_id if customer_id is not None else driver_id, role=role, document_id=document_id)


@auth_router.post("/authorize")
async def authorize_user(schema: Authorize, db_controller: MainDbControllers = Depends(get_db_controller)):
    if schema.role == "customer":
        user = await db_controller.customer_controller.get(schema.id)
    else:
        user = await db_controller.driver_controller.get(schema.id)
    document_id = user.documents_id
    if document_id is None:
        raise HTTPException(detail="This user not in db", status_code=401)
    return User(id=schema.id, role=schema.role, document_id=document_id)

