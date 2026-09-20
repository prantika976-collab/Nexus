const express = require("express");
const db = require("./database");

const app = express();

app.use(express.json());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});
app.get("/", (req, res) => {
  res.json({
    message: "Monjo backend is running!"
  });
});

// Get farm information
app.get("/api/farm/:farmId", (req, res) => {
  const farmId = req.params.farmId;

  const farm = db.prepare(`
  SELECT
    farms.*,
    farmers.farmer_name,
    farmers.district,
    farmers.village,
    farmers.locality,
    current_crops.crop_id,
    current_crops.current_crop,
    current_crops.planting_date,
    current_crops.expected_harvest_date,
    current_crops.cultivated_area,
    current_crops.crop_status,
    soil_data.soil_type,
    soil_data.soil_ph,
    soil_data.nitrogen,
    soil_data.phosphorus,
    soil_data.potassium,
    soil_data.organic_matter,
    soil_data.soil_moisture,
    soil_data.soil_health_status
  FROM farms
  JOIN farmers ON farms.farmer_id = farmers.farmer_id
  LEFT JOIN current_crops ON farms.farm_id = current_crops.farm_id
  LEFT JOIN soil_data ON farms.farm_id = soil_data.farm_id
  WHERE farms.farm_id = ?
`).get(farmId);

if (!farm) {
  return res.status(404).json({
    message: "Farm not found"
  });
}

res.json(farm);
});

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Monjo backend running on http://localhost:${PORT}`);
});
