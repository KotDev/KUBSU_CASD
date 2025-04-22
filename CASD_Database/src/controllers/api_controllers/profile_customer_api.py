from fastapi import APIRouter, Request, HTTPException
from starlette.responses import JSONResponse

from CASD_Database.src.controllers.db_controllers.controllers import MainDbControllers, get_db_controller
from fastapi import Depends

from CASD_Database.src.pydantic_models import CustomerInfoSchema, DocumentsSchema, InnSchema, SnilsSchema, CreateInnSchema, CreateSnilsSchema
from CASD_Database.src.db.models import Customer, Documents, Snils, Inn

profile_customer_router = APIRouter(tags=["Profile Customer"], prefix="/api/customer/me")

#---------------------------------------------------GET-----------------------------------------------------------------

@profile_customer_router.get("/", response_model=CustomerInfoSchema)
async def get_me(request: Request, db_controller: MainDbControllers = Depends(get_db_controller)):
    customer_id: int = int(request.headers.get("customer_id"))
    if not isinstance(customer_id, int):
        return HTTPException(detail="customer_id must be int", status_code=400)
    elif customer_id is None:
        return HTTPException(detail="customer not in headers request", status_code=404)
    customer: Customer = await db_controller.customer_controller.get_customer_info(customer_id)
    return CustomerInfoSchema(id=customer.customer_id,
                              name_company=customer.name_company,
                              number_inn=customer.documents.number_inn,
                              number_snils=customer.documents.number_snils,
                              documents_id=customer.documents.document_id)

@profile_customer_router.get("/document/snils", response_model=SnilsSchema)
async def get_me_snils(request: Request, db_controller: MainDbControllers = Depends(get_db_controller)):
    number_snils: str = request.headers.get("number_snils")
    if number_snils is None:
        return HTTPException(detail="number_snils not in headers request", status_code=404)
    snils: Snils = await db_controller.snils_controller.get(number_snils)
    return SnilsSchema(number_snils=snils.number_snils,
                       get_date=snils.get_date)

@profile_customer_router.get("/document/inn")
async def get_me_inn(request: Request, db_controller: MainDbControllers = Depends(get_db_controller)):
    number_inn: str = request.headers.get("number_inn")
    if number_inn is None:
        return HTTPException(detail="number_inn not in headers request", status_code=404)
    inn: Inn = await db_controller.inn_controller.get(number_inn)
    return InnSchema(number_inn=inn.number_inn,
                       get_date=inn.get_date)

@profile_customer_router.get("/documents", response_model=DocumentsSchema)
async def get_me_documents(request: Request, db_controller: MainDbControllers = Depends(get_db_controller)):
    document_id: int = int(request.headers.get("document_id"))
    if not isinstance(document_id, int):
        return  HTTPException(detail="document_id must be int", status_code=400)
    elif document_id is None:
        return HTTPException(detail="document_id not in headers request", status_code=404)
    documents: Documents = await db_controller.document_controller.get_all_info_document_customer(document_id)
    if documents.number_snils is None and documents.number_inn is None:
        return DocumentsSchema(document_id=documents.document_id)
    if documents.inn_data is not None:
        inn_schema = InnSchema(number_inn=documents.inn_data.number_inn,
                               get_date=documents.inn_data.get_date)
    else:
        inn_schema = None
    if documents.snils_data is not None:
        snils_schema = SnilsSchema(number_snils=documents.snils_data.number_snils,
                                   get_date=documents.snils_data.get_date)
    else:
        snils_schema = None
    return DocumentsSchema(document_id=documents.document_id,
                           number_snils=documents.number_snils,
                           number_inn=documents.number_inn,
                           snils_data=snils_schema,
                           inn_data=inn_schema)



#---------------------------------------------------POST----------------------------------------------------------------

@profile_customer_router.post("/document/snils/create")
async def create_me_snils(schema: CreateSnilsSchema, db_controller: MainDbControllers = Depends(get_db_controller)):
    snils: Snils = await db_controller.snils_controller.exists(schema.number_snils)
    if snils is not None:
        return HTTPException(detail="This snils on exists", status_code=400)
    await db_controller.snils_controller.create_snils(schema)
    return JSONResponse({"status": "Successful"},status_code=200)

@profile_customer_router.post("/document/inn/create")
async def create_me_inn(schema: CreateInnSchema, db_controller: MainDbControllers = Depends(get_db_controller)):
    inn: Inn = await db_controller.inn_controller.exists(schema.number_inn)
    if inn is not None:
        return HTTPException(detail="This inn on exists", status_code=400)
    await db_controller.inn_controller.create_inn(schema)
    return JSONResponse({"status": "Successful"},status_code=200)
