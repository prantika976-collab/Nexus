from dataclasses import dataclass


@dataclass
class Farmer:
    name: str
    email: str
    phone: str
    location: str
    district: str
    village: str
    farm_size: float
    farm_unit: str
    farming_type: str
    irrigation: str
    water_source: str
    soil_type: str
    current_crop: str
    previous_crop: str


@dataclass
class Business:
    name: str
    email: str
    phone: str
    business_name: str
    business_type: str
    location: str
    district: str
    locality: str
    produce_required: str
    purchase_frequency: str
    approximate_demand: str
    food_surplus: str
    surplus_items: str
    waste_type: str
    waste_quantity: str
    disposal_method: str
