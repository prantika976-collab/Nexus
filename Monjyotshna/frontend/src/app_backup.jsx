import { useEffect, useState } from "react";
import "./App.css";

function App() {
 const [dashboard, setDashboard] = useState(null);
 const [weather, setWeather] = useState(null);
 const [showCropForm, setShowCropForm] = useState(false);
 const [showWaterForm, setShowWaterForm] = useState(false);
 const [showHarvestForm, setShowHarvestForm] = useState(false);
 const [harvestForm, setHarvestForm] = useState({
  crop_name: "",
  harvest_date: "",
  harvest_quantity: "",
  quantity_unit: "",
  additional_info: ""
});
const [showResourceForm, setShowResourceForm] = useState(false);

const [resourceForm, setResourceForm] = useState({
  resource_type: "",
  quantity: "",
  quantity_unit: "",
  source: "",
  estimated: "0",
  available_for_exchange: "0"
});
 const [waterForm, setWaterForm] = useState({
  water_availability: "",
  water_source: "",
  irrigation_method: "",
  rainfall_dependence: "",
  watering_frequency: "",
  seasonal_water_issue: "",
  additional_info: ""
});
 const [selectedCrop, setSelectedCrop] = useState("");
const [cropForm, setCropForm] = useState({
  planting_date: "",
  expected_harvest_date: "",
  cultivated_area: "",
  crop_season: "",
  crop_status: "",
  additional_info: ""
});
 useEffect(() => {
  fetch("http://localhost:5000/api/dashboard/1")
    .then((response) => response.json())
    .then((data) => {
      setDashboard(data);
    })
    .catch((error) => {
      console.error("Error fetching farm data:", error);
    });

  fetch("http://localhost:5000/api/weather/Shillong")
    .then((response) => response.json())
    .then((data) => {
      setWeather(data);
    })
    .catch((error) => {
      console.error("Error fetching weather:", error);
    });
}, []);

  if (!dashboard)  {
    return <h2>Loading farm data...</h2>;
  }
  if (showWaterForm) {
  return (
    <div>
      <h1>Update Water & Irrigation</h1>

      <label>Water Availability:</label>
      <select
  value={waterForm.water_availability}
  onChange={(e) =>
    setWaterForm({
      ...waterForm,
      water_availability: e.target.value
    })
  }
>
        <option>Select availability</option>
        <option>Good</option>
        <option>Moderate</option>
        <option>Low</option>
      </select>

      <label>Water Source:</label>
      <select
  value={waterForm.water_source}
  onChange={(e) =>
    setWaterForm({
      ...waterForm,
      water_source: e.target.value
    })
  }
>
  <option value="">Select source</option>
  <option>Rainwater</option>
  <option>Well</option>
  <option>River</option>
  <option>Other</option>
</select>
<label>Irrigation Method:</label>
<select
  value={waterForm.irrigation_method}
  onChange={(e) =>
    setWaterForm({
      ...waterForm,
      irrigation_method: e.target.value
    })
  }
>
  <option value="">Select method</option>
  <option>Rainfed</option>
  <option>Drip Irrigation</option>
  <option>Sprinkler</option>
  <option>Flood Irrigation</option>
  <option>Other</option>
</select>
<label>Rainfall Dependence:</label>
<select
  value={waterForm.rainfall_dependence}
  onChange={(e) =>
    setWaterForm({
      ...waterForm,
      rainfall_dependence: e.target.value
    })
  }
>
  <option value="">Select dependence</option>
  <option>Low</option>
  <option>Moderate</option>
  <option>High</option>
</select>
<label>Watering Frequency:</label>
<select
  value={waterForm.watering_frequency}
  onChange={(e) =>
    setWaterForm({
      ...waterForm,
      watering_frequency: e.target.value
    })
  }
>
  <option value="">Select frequency</option>
  <option>Daily</option>
  <option>Every 2–3 days</option>
  <option>Weekly</option>
  <option>As needed</option>
  <option>Rain-dependent</option>
</select>
<label>Seasonal Water Issue:</label>
<select
  value={waterForm.seasonal_water_issue}
  onChange={(e) =>
    setWaterForm({
      ...waterForm,
      seasonal_water_issue: e.target.value
    })
  }
>
  <option value="">Select issue</option>
  <option>None</option>
  <option>Water shortage</option>
  <option>Excess water</option>
  <option>Irregular rainfall</option>
  <option>Other</option>
</select>
<label>Additional Information:</label>
<textarea
  rows="4"
  value={waterForm.additional_info}
  onChange={(e) =>
    setWaterForm({
      ...waterForm,
      additional_info: e.target.value
    })
  }
  placeholder="Add any additional information about water or irrigation..."
></textarea>
<button
  onClick={() => {
    fetch("http://localhost:5000/api/water/update", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        farm_id: dashboard.farm.farm_id,
        water_availability: waterForm.water_availability,
        water_source: waterForm.water_source,
        irrigation_method: waterForm.irrigation_method,
        rainfall_dependence: waterForm.rainfall_dependence,
        watering_frequency: waterForm.watering_frequency,
        seasonal_water_issue: waterForm.seasonal_water_issue
      })
    })
      .then((response) => response.json())
      .then((data) => {
  console.log(data);

  return fetch("http://localhost:5000/api/dashboard/1");
})
.then((response) => response.json())
.then((updatedDashboard) => {
  setDashboard(updatedDashboard);
  setShowWaterForm(false);
})
      .catch((error) => {
        console.error("Error updating water:", error);
      });
  }}
>
  Save Changes
</button>
      <button onClick={() => setShowWaterForm(false)}>
        Back to Dashboard
      </button>
    </div>
  );
}
if (showResourceForm) {
  return (
    <div>
      <h1>Manage Farm Resources</h1>

      <label>Resource Type:</label>
      <select
        value={resourceForm.resource_type}
        onChange={(e) =>
          setResourceForm({
            ...resourceForm,
            resource_type: e.target.value
          })
        }
      >
        <option value="">Select resource</option>
        <option>Crop Residue</option>
        <option>Animal Manure</option>
        <option>Compost</option>
        <option>Unused Produce</option>
        <option>Other</option>
      </select>

      <label>Quantity:</label>
      <input
        type="number"
        value={resourceForm.quantity}
        onChange={(e) =>
          setResourceForm({
            ...resourceForm,
            quantity: e.target.value
          })
        }
      />

      <label>Unit:</label>
      <select
        value={resourceForm.quantity_unit}
        onChange={(e) =>
          setResourceForm({
            ...resourceForm,
            quantity_unit: e.target.value
          })
        }
      >
        <option value="">Select unit</option>
        <option>kg</option>
        <option>quintal</option>
        <option>tonne</option>
      </select>

      <label>Source:</label>
      <input
        type="text"
        value={resourceForm.source}
        onChange={(e) =>
          setResourceForm({
            ...resourceForm,
            source: e.target.value
          })
        }
        placeholder="Where did this resource come from?"
      />

      <label>Is the quantity estimated?</label>
      <select
        value={resourceForm.estimated}
        onChange={(e) =>
          setResourceForm({
            ...resourceForm,
            estimated: e.target.value
          })
        }
      >
        <option value="0">No</option>
        <option value="1">Yes</option>
      </select>

      <label>Available for Reuse/Exchange?</label>
      <select
        value={resourceForm.available_for_exchange}
        onChange={(e) =>
          setResourceForm({
            ...resourceForm,
            available_for_exchange: e.target.value
          })
        }
      >
        <option value="0">No</option>
        <option value="1">Yes</option>
      </select>
<button
  onClick={() => {
    fetch("http://localhost:5000/api/resources/update", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        farm_id: dashboard.farm.farm_id,
        resource_type: resourceForm.resource_type,
        quantity: resourceForm.quantity,
        quantity_unit: resourceForm.quantity_unit,
        source: resourceForm.source,
        estimated: resourceForm.estimated,
        available_for_exchange: resourceForm.available_for_exchange
      })
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);

        return fetch("http://localhost:5000/api/dashboard/1");
      })
      .then((response) => response.json())
      .then((updatedDashboard) => {
        setDashboard(updatedDashboard);
        setShowResourceForm(false);
      })
      .catch((error) => {
        console.error("Error updating resources:", error);
      });
  }}
>
  Save Changes
</button>
      <button onClick={() => setShowResourceForm(false)}>
        Back to Dashboard
      </button>
    </div>
  );
}
if (showHarvestForm) {
  return (
    <div>
      <h1>Record Harvest</h1>

      <label>Crop:</label>
      <input
        type="text"
        value={harvestForm.crop_name}
        onChange={(e) =>
          setHarvestForm({
            ...harvestForm,
            crop_name: e.target.value
          })
        }
        placeholder="Enter crop name"
      />

      <label>Harvest Date:</label>
      <input
        type="date"
        value={harvestForm.harvest_date}
        onChange={(e) =>
          setHarvestForm({
            ...harvestForm,
            harvest_date: e.target.value
          })
        }
      />

      <label>Harvest Quantity:</label>
      <input
        type="number"
        value={harvestForm.harvest_quantity}
        onChange={(e) =>
          setHarvestForm({
            ...harvestForm,
            harvest_quantity: e.target.value
          })
        }
      />

      <label>Unit:</label>
      <select
        value={harvestForm.quantity_unit}
        onChange={(e) =>
          setHarvestForm({
            ...harvestForm,
            quantity_unit: e.target.value
          })
        }
      >
        <option value="">Select unit</option>
        <option>kg</option>
        <option>quintal</option>
        <option>tonne</option>
      </select>

      <label>Additional Information:</label>
      <textarea
        rows="4"
        value={harvestForm.additional_info}
        onChange={(e) =>
          setHarvestForm({
            ...harvestForm,
            additional_info: e.target.value
          })
        }
        placeholder="Add any additional information about the harvest..."
      ></textarea>
<button
  onClick={() => {
    fetch("http://localhost:5000/api/harvest/update", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        farm_id: dashboard.farm.farm_id,
        crop_id: dashboard.current_crop.crop_id,
        harvest_date: harvestForm.harvest_date,
        harvest_quantity: harvestForm.harvest_quantity
      })
    })
      .then((response) => response.json())
      .then((data) => {
  console.log(data);

  return fetch("http://localhost:5000/api/dashboard/1");
})
.then((response) => response.json())
.then((updatedDashboard) => {
  setDashboard(updatedDashboard);
  setShowHarvestForm(false);
})
      .catch((error) => {
        console.error("Error recording harvest:", error);
      });
  }}
>
  Save Changes
</button>
      <button onClick={() => setShowHarvestForm(false)}>
        Back to Dashboard
      </button>
    </div>
  );
}
if (showCropForm) {
  return (
    <div>
      <h1>Edit Current Crop</h1>

      <label>Current Crop:</label>
      <select
        value={selectedCrop || dashboard.current_crop.current_crop}
        onChange={(e) => setSelectedCrop(e.target.value)}
      >
        <option value="Rice">Rice</option>
<option value="Maize">Maize</option>
<option value="Potato">Potato</option>
<option value="Ginger">Ginger</option>
<option value="Turmeric">Turmeric</option>
<option value="Pineapple">Pineapple</option>
<option value="Chilli">Chilli</option>
<option value="Black Pepper">Black Pepper</option>
<option value="Khasi Mandarin / Orange">Khasi Mandarin / Orange</option>
<option value="Banana">Banana</option>
<option value="Sweet Potato">Sweet Potato</option>
<option value="Yam">Yam</option>
<option value="Colocasia">Colocasia</option>
<option value="Tapioca">Tapioca</option>
<option value="Pulses">Pulses</option>
<option value="Vegetables">Vegetables</option>
      </select>

      <label>Planting Date:</label>
<input
  type="date"
  value={
    cropForm.planting_date || dashboard.current_crop.planting_date
  }
  onChange={(e) =>
    setCropForm({
      ...cropForm,
      planting_date: e.target.value
    })
  }
/>
      <label>Expected Harvest Date:</label>
<input
  type="date"
  value={
    cropForm.expected_harvest_date ||
    dashboard.current_crop.expected_harvest_date
  }
  onChange={(e) =>
    setCropForm({
      ...cropForm,
      expected_harvest_date: e.target.value
    })
  }
/>

      <label>Cultivated Area:</label>
<input
  type="number"
  value={
    cropForm.cultivated_area ||
    dashboard.current_crop.cultivated_area
  }
  onChange={(e) =>
    setCropForm({
      ...cropForm,
      cultivated_area: e.target.value
    })
  }
/>

      <label>Crop Season:</label>
<select
  value={cropForm.crop_season}
  onChange={(e) =>
    setCropForm({
      ...cropForm,
      crop_season: e.target.value
    })
  }
>
  <option value="">Select season</option>
  <option value="Kharif">Kharif</option>
  <option value="Rabi">Rabi</option>
  <option value="Zaid">Zaid</option>
  <option value="Year-round">Year-round</option>
</select>
      <label>Crop Status:</label>
<select
  value={cropForm.crop_status || dashboard.current_crop.crop_status}
  onChange={(e) =>
    setCropForm({
      ...cropForm,
      crop_status: e.target.value
    })
  }
>
  <option>Growing</option>
  <option>Ready for Harvest</option>
  <option>Harvested</option>
  <option>Failed</option>
</select>

      <label>Additional Information:</label>
<textarea
  rows="4"
  value={cropForm.additional_info}
  onChange={(e) =>
    setCropForm({
      ...cropForm,
      additional_info: e.target.value
    })
  }
  placeholder="Add any additional information about the crop..."
></textarea>
<button
  onClick={() => {
    fetch("http://localhost:5000/api/current-crop/update", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        crop_id: dashboard.current_crop.crop_id,
        current_crop:
          selectedCrop || dashboard.current_crop.current_crop,
        planting_date:
          cropForm.planting_date ||
          dashboard.current_crop.planting_date,
        expected_harvest_date:
          cropForm.expected_harvest_date ||
          dashboard.current_crop.expected_harvest_date,
        cultivated_area:
          cropForm.cultivated_area ||
          dashboard.current_crop.cultivated_area,
        crop_status:
          cropForm.crop_status ||
          dashboard.current_crop.crop_status
      })
    })
      .then((data) => {
  console.log(data);

  return fetch("http://localhost:5000/api/dashboard/1");
})
.then((response) => response.json())
.then((updatedDashboard) => {
  setDashboard(updatedDashboard);
  setShowCropForm(false);
})
      .catch((error) => {
        console.error("Error updating crop:", error);
      });
  }}
>
  Save Changes
</button>
      <button onClick={() => setShowCropForm(false)}>
        Back to Dashboard
      </button>
    </div>
  );
}
  return (
    <div>
      <h1>Good morning, {dashboard.farmer.farmer_name} 👋</h1>
<p>{dashboard.farmer.locality}, {dashboard.farmer.district}</p>

      <h2>👨‍🌾 Farmer Information</h2>
<p>Name: {dashboard.farmer.farmer_name}</p>
<p>District: {dashboard.farmer.district}</p>
<p>Village: {dashboard.farmer.village}</p>
<p>Locality: {dashboard.farmer.locality}</p>

      <h2>🚜 Farm Information</h2>
<p>
  Farm Size: {dashboard.farm.farm_size} {dashboard.farm.farm_size_unit}
</p>
<p>Farming Type: {dashboard.farm.farming_type}</p>
<p>Terrain: {dashboard.farm.terrain}</p>
<p>Land Use: {dashboard.farm.current_land_use}</p>

     <h2>🌱 Current Crop</h2>
<p>Crop: {dashboard.current_crop.current_crop}</p>
<p>Planting Date: {dashboard.current_crop.planting_date}</p>
<p>Cultivation Day: {dashboard.cultivation_day}</p>
<p>Expected Harvest: {dashboard.current_crop.expected_harvest_date}</p>
<p>Cultivated Area: {dashboard.current_crop.cultivated_area} acres</p>
<p>Status: {dashboard.current_crop.crop_status}</p>
<button onClick={() => setShowCropForm(true)}>Edit Current Crop</button>
<h2>🌍 Soil Health</h2>
<p>Soil Type: {dashboard.soil.soil_type}</p>
<p>pH: {dashboard.soil.soil_ph}</p>
<p>Nitrogen: {dashboard.soil.nitrogen}</p>
<p>Phosphorus: {dashboard.soil.phosphorus}</p>
<p>Potassium: {dashboard.soil.potassium}</p>
<p>Moisture: {dashboard.soil.soil_moisture}%</p>
<p>Status: {dashboard.soil.soil_health_status}</p>
<h2>💧 Water & Irrigation</h2>

{dashboard.water ? (
  <>
    <p>Water Availability: {dashboard.water.water_availability}</p>
    <p>Water Source: {dashboard.water.water_source}</p>
    <p>Irrigation Method: {dashboard.water.irrigation_method}</p>
    <p>Rainfall Dependence: {dashboard.water.rainfall_dependence}</p>
    <p>Watering Frequency: {dashboard.water.watering_frequency}</p>
    <p>Seasonal Water Issue: {dashboard.water.seasonal_water_issue}</p>
  </>
) : (
  <p>No water information recorded yet.</p>
)}
<button onClick={() => setShowWaterForm(true)}>
  Update Water
</button>
<h2>🌦️ Weather</h2>

{weather ? (
  <>
    <p>Location: {weather.name}</p>
    <p>Temperature: {weather.main.temp}°C</p>
    <p>Condition: {weather.weather[0].description}</p>
    <p>Humidity: {weather.main.humidity}%</p>
  </>
) : (
  <p>Loading weather...</p>
)}
<h2>♻️ Farm Resources</h2>

{dashboard.resources.length > 0 ? (
  <>
    {dashboard.resources.map((resource) => (
      <p key={resource.resource_id}>
        {resource.resource_type}: {resource.quantity}{" "}
        {resource.quantity_unit}
      </p>
    ))}
  </>
) : (
  <p>No farm resources recorded yet.</p>
)}

<button onClick={() => setShowResourceForm(true)}>Manage Resources</button>
<h2>📚 Crop Facts & Learning</h2>

<p>
  Learn about {dashboard.current_crop.current_crop} cultivation, soil care,
  irrigation, and harvesting.
</p>

<p>
  💡 <strong>Did you know?</strong>
</p>

<p>
  {dashboard.current_crop.current_crop === "Rice"
    ? "Rice is one of the major food crops of Meghalaya and generally needs a reliable water supply during important stages of growth."
    : dashboard.current_crop.current_crop === "Maize"
    ? "Maize is an important food-grain crop in Meghalaya and grows well with adequate sunlight, moisture, and nutrients."
    : dashboard.current_crop.current_crop === "Potato"
    ? "Potato is an important cash crop in Meghalaya and grows best in loose, well-drained soil."
    : dashboard.current_crop.current_crop === "Ginger"
    ? "Ginger is an important spice crop and prefers warm, moist conditions with well-drained soil."
    : dashboard.current_crop.current_crop === "Turmeric"
    ? "Turmeric prefers warm, moist conditions and well-drained soil."
    : dashboard.current_crop.current_crop === "Pineapple"
    ? "Pineapple is an important fruit crop in Meghalaya and is suited to tropical and subtropical areas."
    : dashboard.current_crop.current_crop === "Chilli"
    ? "Chilli grows well with good sunlight, suitable moisture, and well-drained soil."
    : dashboard.current_crop.current_crop === "Black Pepper"
    ? "Black pepper is a climbing spice crop that needs suitable support and moisture."
    : dashboard.current_crop.current_crop === "Khasi Mandarin / Orange"
    ? "Khasi Mandarin is an important citrus fruit associated with Meghalaya's horticulture."
    : dashboard.current_crop.current_crop === "Banana"
    ? "Banana prefers warm conditions and adequate moisture for healthy growth."
    : dashboard.current_crop.current_crop === "Sweet Potato"
    ? "Sweet potato is an important tuber crop grown across Meghalaya."
    : dashboard.current_crop.current_crop === "Yam"
    ? "Yam is a tuber crop that grows well in suitable warm and moist conditions."
    : dashboard.current_crop.current_crop === "Colocasia"
    ? "Colocasia is an important tuber crop that generally prefers moist growing conditions."
    : dashboard.current_crop.current_crop === "Tapioca"
    ? "Tapioca is an important tuber crop grown in parts of Meghalaya."
    : dashboard.current_crop.current_crop === "Pulses"
    ? "Pulses can be useful in crop rotation and are an important food crop."
    : dashboard.current_crop.current_crop === "Vegetables"
    ? "Different vegetables can be grown across Meghalaya's climatic zones depending on local conditions."
    : "Learn about the cultivation, soil care, irrigation, and harvesting needs of this crop."
}
</p>
<h2>📈 Farm Progress</h2>

<div>
  <p>
    <strong>Current Crop:</strong>{" "}
    {dashboard.current_crop.current_crop}
  </p>

  <p>
    <strong>Previous Crop:</strong>{" "}
    {dashboard.crop_history.length > 0
      ? dashboard.crop_history[0].crop_name
      : "No previous crop recorded"}
  </p>

  <p>
    <strong>Latest Harvest:</strong>{" "}
    {dashboard.harvest_history.length > 0
      ? `${dashboard.harvest_history[0].harvest_quantity} recorded`
      : "Not recorded yet"}
  </p>

  <button onClick={() => setShowHarvestForm(true)}>
    Record Harvest
  </button>

  {dashboard.harvest_history.length > 0 ? (
    <>
      <h3>Harvest History</h3>

      {dashboard.harvest_history.map((harvest) => (
        <p key={harvest.harvest_id}>
          {harvest.harvest_date || "Date not recorded"} —{" "}
          {harvest.harvest_quantity}
        </p>
      ))}
    </>
  ) : (
    <p>No harvest records yet.</p>
  )}
</div>

<hr />

<h2>🧑‍🌾 Farm Details</h2>
<button>View & Update Farm Details</button>
    </div>
  );
}

export default App;
