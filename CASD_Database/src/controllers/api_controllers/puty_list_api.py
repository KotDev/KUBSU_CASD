from fastapi import APIRouter, Request, HTTPException
from io import BytesIO
from fastapi.responses import StreamingResponse
import pdfkit
from jinja2 import Template
from datetime import datetime

from CASD_Database.src.controllers.db_controllers.controllers import MainDbControllers, get_db_controller
from fastapi import Depends

from CASD_Database.src.pydantic_models import CreatePutyListSchema

puty_list_router = APIRouter(tags=["PutyList"], prefix="/api/puty-list")


@puty_list_router.get("/customer")
async def get_puty_list_customer(request: Request, db_controller: MainDbControllers = Depends(get_db_controller), status: str = "В пути"):
    customer_id = request.headers.get("customer_id")
    if not isinstance(customer_id, int):
        try:
            customer_id = int(customer_id)
        except ValueError:
            return HTTPException(detail="driver_id must be int", status_code=400)
    elif customer_id is None:
        return HTTPException(detail="driver_id not in headers request", status_code=404)
    elif status not in ("В пути", "Доставлен", "Не доставлен"):
        return HTTPException(detail="filter not correct", status_code=400)
    puty_lists = await db_controller.puty_list_controller.get_puty_list_line(customer_id, status, "customer_id")
    return puty_lists



@puty_list_router.get("/driver")
async def get_puty_list_customer(request: Request, db_controller: MainDbControllers = Depends(get_db_controller), status: str = "В пути"):
    driver_id = request.headers.get("driver_id")
    if not isinstance(driver_id, int):
        try:
            driver_id = int(driver_id)
        except ValueError:
            return HTTPException(detail="driver_id must be int", status_code=400)
    elif driver_id is None:
        return HTTPException(detail="driver_id not in headers request", status_code=404)
    elif status not in ("В пути", "Доставлен", "Не доставлен"):
        return HTTPException(detail="filter not correct", status_code=400)
    puty_lists = await db_controller.puty_list_controller.get_puty_list_line(driver_id, status, "driver_id")
    return puty_lists


@puty_list_router.get("/orders")
async def get_cargo_orders(db_controller: MainDbControllers = Depends(get_db_controller), size: int = 10, page: int = 1):
    puty_lists = await db_controller.puty_list_controller.get_puty_list_line_order(size, page)
    return puty_lists

@puty_list_router.get("/report-order")
async def get_puty_list_report_file(request: Request, db_controller: MainDbControllers = Depends(get_db_controller)):
    puty_list_id = request.headers.get("puty_list_id")
    print(puty_list_id)
    if puty_list_id is None:
        raise HTTPException(status_code=404, detail="puty_list_id not in headers request")
        
    try:
        puty_list_id = int(puty_list_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="puty_list_id must be int")


    buffer = BytesIO()
    report = await db_controller.puty_list_controller.get_puty_list_report(puty_list_id)
    print(report)
    if report is None:
        raise HTTPException(status_code=404, detail="Report not found")
    try:
        with open('/home/danil/NetProjects/KUBSU_CASD/CASD_Database/src/db/raport.html', 'r', encoding='utf-8') as file:
            template = Template(file.read())
            
        html = template.render(
            report=report,
            current_datetime=datetime.now().strftime('%d.%m.%Y %H:%M:%S')
        )
        
        pdf_content = pdfkit.from_string(html, False)
        buffer.write(pdf_content)
        buffer.seek(0)
        
        response = StreamingResponse(
            buffer, 
            media_type="application/pdf",
            headers={
                "Content-Disposition": "attachment; filename=report.pdf",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type, puty_list_id"
            }
        )
        return response
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@puty_list_router.get("/info")
async def get_puty_list_report_file(request: Request, db_controller: MainDbControllers = Depends(get_db_controller)):
    puty_list_id = request.headers.get("puty_list_id")
    if not isinstance(puty_list_id, int):
        try:
            puty_list_id = int(puty_list_id)
        except ValueError:
            return HTTPException(detail="puty_list_id must be int", status_code=400)    
    puty_list = await db_controller.puty_list_controller.get_puty_list_info(puty_list_id)
    return puty_list

@puty_list_router.post("/create")
async def create_puty_list(schema: CreatePutyListSchema, db_controller: MainDbControllers = Depends(get_db_controller)):
    await db_controller.customer_controller.get(schema.customer_id)
    await db_controller.cargo_controller.get(schema.cargo_id)
    await db_controller.city_controller.get(schema.send_city_id)
    await db_controller.city_controller.get(schema.arrival_city_id)
    await db_controller.puty_list_controller.create_puty_list(schema)
    return {"message": "Puty list created successfully"}

@puty_list_router.put("/update")
async def update_puty_list(schema: CreatePutyListSchema, db_controller: MainDbControllers = Depends(get_db_controller)):
    puty_list_id = schema.puty_list_id
    update_schema = schema.model_dump()
    await db_controller.puty_list_controller.update_puty_list(puty_list_id, **update_schema)
    return {"message": "Puty list updated successfully"}

@puty_list_router.patch("/take-load")
async def take_load(request: Request, db_controller: MainDbControllers = Depends(get_db_controller)):
    puty_list_id = request.headers.get("puty_list_id")
    driver_id = request.headers.get("driver_id")
    if not isinstance(puty_list_id, int) or not isinstance(driver_id, int):
        try:
            puty_list_id = int(puty_list_id)
            driver_id = int(driver_id)
        except ValueError:
            return HTTPException(detail="puty_list_id and driver_id must be int", status_code=400)
    await db_controller.puty_list_controller.update_puty_list(puty_list_id, driver_id=driver_id)
    return {"message": "Puty list updated successfully"}

@puty_list_router.patch("/update-status/")
async def update_status(request: Request, db_controller: MainDbControllers = Depends(get_db_controller), status: str = "В пути"):
    puty_list_id = request.headers.get("puty_list_id")
    if not isinstance(puty_list_id, int):
        try:
            puty_list_id = int(puty_list_id)
        except ValueError:
            return HTTPException(detail="puty_list_id must be int", status_code=400)
    await db_controller.puty_list_controller.update_puty_list(puty_list_id, status=status)
    return {"message": "Puty list updated successfully"}



