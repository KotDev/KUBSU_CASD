from typing import List

from fastapi import APIRouter, HTTPException, Depends
from CASD_Database.src.controllers.db_controllers.controllers import MainDbControllers, get_db_controller
from CASD_Database.src.db.models import City, Region
from CASD_Database.src.pydantic_models import CitySchema, CitiesForRegion, Regions, RegionSchema
city_router = APIRouter(tags=["City"], prefix="/api/city")

@city_router.get("/for-region")
async def get_city_for_region(region_id: int, db_controller: MainDbControllers = Depends(get_db_controller)):
    cities: List[City] = await db_controller.city_controller.get_city_for_region(region_id)
    return CitiesForRegion(cities=[CitySchema(city_name=city.city_name, city_id=city.city_id) for city in cities])

@city_router.get("/regions")
async def get_region(db_controller: MainDbControllers = Depends(get_db_controller)):
    regions = await db_controller.region_controller.get_all_regions()
    return Regions(regions=[RegionSchema(region_name=region.region_name, region_id=region.region_id) for region in regions])

