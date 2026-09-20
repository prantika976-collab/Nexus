const db = require("./database");

db.exec(`
  CREATE TABLE IF NOT EXISTS farmers (
    farmer_id INTEGER PRIMARY KEY AUTOINCREMENT,
    farmer_name TEXT NOT NULL,
    district TEXT,
    village TEXT,
    locality TEXT
  );

  CREATE TABLE IF NOT EXISTS farms (
    farm_id INTEGER PRIMARY KEY AUTOINCREMENT,
    farmer_id INTEGER,
    farm_size REAL,
    farm_size_unit TEXT,
    farming_type TEXT,
    terrain TEXT,
    current_land_use TEXT,
    FOREIGN KEY (farmer_id) REFERENCES farmers(farmer_id)
  );
  CREATE TABLE IF NOT EXISTS current_crops (
    crop_id INTEGER PRIMARY KEY AUTOINCREMENT,
    farm_id INTEGER,
    current_crop TEXT NOT NULL,
    planting_date TEXT,
    expected_harvest_date TEXT,
    cultivated_area REAL,
    crop_status TEXT,
    FOREIGN KEY (farm_id) REFERENCES farms(farm_id)
  );
  CREATE TABLE IF NOT EXISTS soil_data (
    soil_id INTEGER PRIMARY KEY AUTOINCREMENT,
    farm_id INTEGER,
    soil_type TEXT,
    soil_ph REAL,
    nitrogen REAL,
    phosphorus REAL,
    potassium REAL,
    organic_matter REAL,
    soil_moisture REAL,
    soil_health_status TEXT,
    soil_image TEXT,
    source TEXT,
    is_estimated INTEGER DEFAULT 0,
    recorded_date TEXT,
    FOREIGN KEY (farm_id) REFERENCES farms(farm_id)
  );
  CREATE TABLE IF NOT EXISTS water_data (
    water_id INTEGER PRIMARY KEY AUTOINCREMENT,
    farm_id INTEGER,
    water_availability TEXT,
    water_source TEXT,
    irrigation_method TEXT,
    rainfall_dependence TEXT,
    watering_frequency TEXT,
    seasonal_water_issue TEXT,
    FOREIGN KEY (farm_id) REFERENCES farms(farm_id)
  );
  CREATE TABLE IF NOT EXISTS crop_history (
    crop_history_id INTEGER PRIMARY KEY AUTOINCREMENT,
    farm_id INTEGER,
    crop_name TEXT NOT NULL,
    cultivation_start_date TEXT,
    cultivation_end_date TEXT,
    cultivated_area REAL,
    harvest_quantity REAL,
    yield REAL,
    residue_generated REAL,
    FOREIGN KEY (farm_id) REFERENCES farms(farm_id)
  );
  CREATE TABLE IF NOT EXISTS harvest_history (
    harvest_id INTEGER PRIMARY KEY AUTOINCREMENT,
    farm_id INTEGER,
    crop_id INTEGER,
    harvest_date TEXT,
    harvest_quantity REAL,
    FOREIGN KEY (farm_id) REFERENCES farms(farm_id),
    FOREIGN KEY (crop_id) REFERENCES current_crops(crop_id)
  );
  CREATE TABLE IF NOT EXISTS farm_resources (
    resource_id INTEGER PRIMARY KEY AUTOINCREMENT,
    farm_id INTEGER,
    resource_type TEXT NOT NULL,
    quantity REAL,
    quantity_unit TEXT,
    source TEXT,
    estimated INTEGER DEFAULT 0,
    available_for_exchange INTEGER DEFAULT 0,
    FOREIGN KEY (farm_id) REFERENCES farms(farm_id)
  );
`);
console.log("Monjo database tables created successfully");
const farmer = db.prepare(`
  INSERT INTO farmers (farmer_name, district, village, locality)
  VALUES (?, ?, ?, ?)
`).run("Demo Farmer", "East Khasi Hills", "Mawphlang", "Shillong");

const farmerId = farmer.lastInsertRowid;

db.prepare(`
  INSERT INTO farms
  (farmer_id, farm_size, farm_size_unit, farming_type, terrain, current_land_use)
  VALUES (?, ?, ?, ?, ?, ?)
`).run(
  farmerId,
  2,
  "acres",
  "Mixed Farming",
  "Hilly",
  "Crop cultivation"
);

console.log("Demo farmer and farm added successfully");
db.prepare(`
  INSERT INTO current_crops
  (farm_id, current_crop, planting_date, expected_harvest_date, cultivated_area, crop_status)
  VALUES (?, ?, ?, ?, ?, ?)
`).run(
  1,
  "Rice",
  "2026-08-01",
  "2026-11-15",
  1.5,
  "Growing"
);

console.log("Demo current crop added successfully");
db.prepare(`
  INSERT INTO soil_data
  (farm_id, soil_type, soil_ph, nitrogen, phosphorus, potassium,
   organic_matter, soil_moisture, soil_health_status, source, is_estimated, recorded_date)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`).run(
  1,
  "Loamy",
  6.2,
  45,
  30,
  40,
  2.5,
  55,
  "Good",
  "Demo data",
  1,
  "2026-09-13"
);

console.log("Demo soil data added successfully");
