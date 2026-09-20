import { useEffect, useState } from "react";
import "./App.css";

function App() {
 const [dashboard, setDashboard] = useState(null);
 const [weather, setWeather] = useState(null);
 const [showCropForm, setShowCropForm] = useState(false);
 const [showCropDetails, setShowCropDetails] = useState(false);
 const [showWaterForm, setShowWaterForm] = useState(false);
 const [showHarvestForm, setShowHarvestForm] = useState(false);
 const [showSoilDetails, setShowSoilDetails] = useState(false);

const [showSoilForm, setShowSoilForm] = useState(false);

const [soilForm, setSoilForm] = useState({
  soil_type: "",
  soil_ph: "",
  nitrogen: "",
  phosphorus: "",
  potassium: "",
  organic_matter: "",
  soil_moisture: "",
  soil_health_status: "",
  source: "",
  is_estimated: "0",
  recorded_date: ""
});

const [showFarmDetails, setShowFarmDetails] = useState(false);
const [showFarmerForm, setShowFarmerForm] = useState(false);
const [showFarmForm, setShowFarmForm] = useState(false);

const [farmForm, setFarmForm] = useState({
  farm_size: "",
  farm_size_unit: "",
  farming_type: "",
  terrain: "",
  current_land_use: ""
});

const [farmerForm, setFarmerForm] = useState({
  farmer_name: "",
  location: "",
  district: "",
  village: ""
});
 const [harvestForm, setHarvestForm] = useState({
  crop_name: "",
  harvest_date: "",
  harvest_quantity: "",
  quantity_unit: "",
  additional_info: ""
});
const [showResourceForm, setShowResourceForm] = useState(false);
const [showFertilizerForm, setShowFertilizerForm] = useState(false);

const [resourceForm, setResourceForm] = useState({
  resource_type: "",
  quantity: "",
  quantity_unit: "",
  source: "",
  usual_use: "",
  estimated: "0",
  available_for_exchange: "0"
});

const [fertilizerForm, setFertilizerForm] = useState({
  fertilizer_name: "",
  fertilizer_type: "",
  organic_manure: "",
  pesticide_name: "",
  frequency: "",
  approximate_quantity: "",
  quantity_unit: "",
  additional_info: "",
  recorded_date: ""
});

const [residueEstimate, setResidueEstimate] = useState(null);
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

      // Simple residue estimate based on cultivated area.
      // This is clearly treated as an estimate, not an exact measurement.
      if (
        data.current_crop &&
        data.current_crop.cultivated_area &&
        data.current_crop.current_crop
      ) {
        const area = Number(data.current_crop.cultivated_area);

        const residueFactors = {
          Rice: 250,
          Maize: 200,
          Potato: 100,
          Ginger: 80,
          Turmeric: 100,
          Pineapple: 150,
          Chilli: 80,
          "Black Pepper": 50,
          "Khasi Mandarin / Orange": 100,
          Banana: 150,
          "Sweet Potato": 100,
          Yam: 100,
          Colocasia: 100,
          Tapioca: 120,
          Pulses: 100,
          Vegetables: 120
        };

        const factor =
          residueFactors[data.current_crop.current_crop] || 100;

        setResidueEstimate({
          amount: (area * factor).toFixed(1),
          unit: "kg",
          crop: data.current_crop.current_crop
        });
      }
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
  const Sidebar = () => (
  <aside className="megha-sidebar">
    <div className="megha-logo">
      <span className="logo-icon">🌱</span>
      <h2>Home</h2>
    </div>

    <nav className="megha-nav">
      <button
        className="nav-item active"
        onClick={() => {
          setShowCropForm(false);
          setShowCropDetails(false);
          setShowWaterForm(false);
          setShowHarvestForm(false);
          setShowSoilDetails(false);
          setShowFarmDetails(false);
          setShowResourceForm(false);
        }}
      >
        🏠 <span>Dashboard</span>
      </button>

      <button
        className="nav-item"
        onClick={() => setShowFarmDetails(true)}
      >
        🚜 <span>Farm Profile</span>
      </button>

      <button className="nav-item">
        📚 <span>Learning</span>
      </button>
    </nav>
  </aside>
);

if (!dashboard) {
  return <h2>Loading farm data...</h2>;
}
  if (showWaterForm) {
  return (
    <div>
      <h1>Water & Irrigation 💧</h1>

      <p>Update your farm's water and irrigation information.</p>

      <section className="dashboard-card water-form-card">
        <h2>Water Information</h2>

        <label>Water Availability</label>
        <select
          value={waterForm.water_availability}
          onChange={(e) =>
            setWaterForm({
              ...waterForm,
              water_availability: e.target.value
            })
          }
        >
          <option value="">Select availability</option>
          <option>Good</option>
          <option>Moderate</option>
          <option>Low</option>
        </select>

        <label>Water Source</label>
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

        <label>Irrigation Method</label>
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

        <label>Rainfall Dependence</label>
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

        <label>Watering Frequency</label>
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

        <label>Seasonal Water Issue</label>
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

        <label>Additional Information</label>
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
                seasonal_water_issue:
                  waterForm.seasonal_water_issue
              })
            })
              .then((response) => response.json())
              .then(() =>
                fetch("http://localhost:5000/api/dashboard/1")
              )
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
      </section>
    </div>
  );
}
if (showFertilizerForm) {
  return (
    <div>
      <h1>Fertilizer & Pesticide 🧪</h1>

      <p>
        Record the fertilizers, manure, compost, or pesticides normally used
        on your farm.
      </p>

      <section className="dashboard-card">
        <h2>Farm Input Information</h2>

        <label>Fertilizer Name</label>
        <input
          type="text"
          value={fertilizerForm.fertilizer_name}
          onChange={(e) =>
            setFertilizerForm({
              ...fertilizerForm,
              fertilizer_name: e.target.value
            })
          }
          placeholder="Example: Urea"
        />

        <label>Fertilizer Type</label>
        <select
          value={fertilizerForm.fertilizer_type}
          onChange={(e) =>
            setFertilizerForm({
              ...fertilizerForm,
              fertilizer_type: e.target.value
            })
          }
        >
          <option value="">Select type</option>
          <option>Organic</option>
          <option>Chemical</option>
          <option>Bio-fertilizer</option>
          <option>Other</option>
        </select>

        <label>Organic Manure / Compost</label>
        <input
          type="text"
          value={fertilizerForm.organic_manure}
          onChange={(e) =>
            setFertilizerForm({
              ...fertilizerForm,
              organic_manure: e.target.value
            })
          }
          placeholder="Example: Cow manure, compost"
        />

        <label>Pesticide Name</label>
        <input
          type="text"
          value={fertilizerForm.pesticide_name}
          onChange={(e) =>
            setFertilizerForm({
              ...fertilizerForm,
              pesticide_name: e.target.value
            })
          }
          placeholder="Enter pesticide name if used"
        />

        <label>Frequency</label>
        <select
          value={fertilizerForm.frequency}
          onChange={(e) =>
            setFertilizerForm({
              ...fertilizerForm,
              frequency: e.target.value
            })
          }
        >
          <option value="">Select frequency</option>
          <option>Daily</option>
          <option>Weekly</option>
          <option>Every 2 weeks</option>
          <option>Monthly</option>
          <option>Seasonally</option>
          <option>As needed</option>
          <option>Rarely</option>
        </select>

        <label>Approximate Quantity</label>
        <input
          type="number"
          step="0.1"
          value={fertilizerForm.approximate_quantity}
          onChange={(e) =>
            setFertilizerForm({
              ...fertilizerForm,
              approximate_quantity: e.target.value
            })
          }
          placeholder="Enter approximate quantity"
        />

        <label>Quantity Unit</label>
        <select
          value={fertilizerForm.quantity_unit}
          onChange={(e) =>
            setFertilizerForm({
              ...fertilizerForm,
              quantity_unit: e.target.value
            })
          }
        >
          <option value="">Select unit</option>
          <option>kg</option>
          <option>litre</option>
          <option>quintal</option>
          <option>tonne</option>
        </select>

        <label>Recorded Date</label>
        <input
          type="date"
          value={fertilizerForm.recorded_date}
          onChange={(e) =>
            setFertilizerForm({
              ...fertilizerForm,
              recorded_date: e.target.value
            })
          }
        />

        <label>Additional Information</label>
        <textarea
          rows="4"
          value={fertilizerForm.additional_info}
          onChange={(e) =>
            setFertilizerForm({
              ...fertilizerForm,
              additional_info: e.target.value
            })
          }
          placeholder="Add any other information about fertilizer, manure, or pesticide use..."
        ></textarea>

        <button
          onClick={() => {
            if (
              !fertilizerForm.fertilizer_name &&
              !fertilizerForm.organic_manure &&
              !fertilizerForm.pesticide_name
            ) {
              alert(
                "Please enter at least a fertilizer, manure/compost, or pesticide."
              );
              return;
            }

            fetch("http://localhost:5000/api/fertilizer/update", {
              method: "POST",
              headers: {
                "Content-Type": "application/json"
              },
              body: JSON.stringify({
                farm_id: dashboard.farm.farm_id,
                fertilizer_name: fertilizerForm.fertilizer_name,
                fertilizer_type: fertilizerForm.fertilizer_type,
                organic_manure: fertilizerForm.organic_manure,
                pesticide_name: fertilizerForm.pesticide_name,
                frequency: fertilizerForm.frequency,
                approximate_quantity:
                  fertilizerForm.approximate_quantity || null,
                quantity_unit: fertilizerForm.quantity_unit,
                additional_info: fertilizerForm.additional_info,
                recorded_date:
                  fertilizerForm.recorded_date ||
                  new Date().toISOString().split("T")[0]
              })
            })
              .then((response) => response.json())
              .then((data) => {
                console.log(data);

                return fetch(
                  "http://localhost:5000/api/dashboard/1"
                );
              })
              .then((response) => response.json())
              .then((updatedDashboard) => {
                setDashboard(updatedDashboard);

                setFertilizerForm({
                  fertilizer_name: "",
                  fertilizer_type: "",
                  organic_manure: "",
                  pesticide_name: "",
                  frequency: "",
                  approximate_quantity: "",
                  quantity_unit: "",
                  additional_info: "",
                  recorded_date: ""
                });

                setShowFertilizerForm(false);
                setShowFarmDetails(true);
              })
              .catch((error) => {
                console.error(
                  "Error saving fertilizer/pesticide information:",
                  error
                );

                alert(
                  "Could not save fertilizer and pesticide information."
                );
              });
          }}
        >
          Save Farm Input
        </button>

        <button
          onClick={() => setShowFertilizerForm(false)}
        >
          Back to Farm Profile
        </button>
      </section>
    </div>
  );
}
if (showResourceForm) {
  return (
    <div>
      <h1>Manage Farm Resources ♻️</h1>

      <p>
        Record crop residue, manure, compost, unused produce, or other
        farm resources.
      </p>

      <section className="dashboard-card">
        <h2>Resource Information</h2>

        <label>Resource Type</label>
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

        <label>Quantity</label>
        <input
          type="number"
          step="0.1"
          value={resourceForm.quantity}
          onChange={(e) =>
            setResourceForm({
              ...resourceForm,
              quantity: e.target.value
            })
          }
          placeholder="Enter quantity"
        />

        <label>Unit</label>
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

        <label>Source</label>
<input
  type="text"
  value={resourceForm.source}
  onChange={(e) =>
    setResourceForm({
      ...resourceForm,
      source: e.target.value
    })
  }
  placeholder="Example: Rice cultivation"
/>

<label>Usual Use</label>
<select
  value={resourceForm.usual_use}
  onChange={(e) =>
    setResourceForm({
      ...resourceForm,
      usual_use: e.target.value
    })
  }
>
  <option value="">Select usual use</option>
  <option>Animal feed</option>
  <option>Compost</option>
  <option>Mulch</option>
  <option>Sell</option>
  <option>Give away</option>
  <option>Burn or discard</option>
  <option>Other</option>
</select>
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
    if (
      !resourceForm.resource_type ||
      !resourceForm.quantity ||
      !resourceForm.quantity_unit
    ) {
      alert("Please select a resource, enter a quantity, and select a unit.");
      return;
    }

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
usual_use: resourceForm.usual_use,
estimated: resourceForm.estimated,
        available_for_exchange:
          resourceForm.available_for_exchange
      })
    })
      .then((response) => response.json())
      .then(() =>
        fetch("http://localhost:5000/api/dashboard/1")
      )
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
  Save Resource
</button>

        <button onClick={() => setShowResourceForm(false)}>
          Back to Dashboard
        </button>
      </section>
    </div>
  );
}

if (showHarvestForm) {
  return (
    <div>
      <h1>Record Harvest 🌾</h1>

      <p>Record the details of your harvest.</p>

      <section className="dashboard-card">
        <h2>Harvest Information</h2>

        <label>Crop</label>
        <select
          value={harvestForm.crop_name}
          onChange={(e) =>
            setHarvestForm({
              ...harvestForm,
              crop_name: e.target.value
            })
          }
        >
          <option value="">Select crop</option>
          <option>Rice</option>
          <option>Maize</option>
          <option>Potato</option>
          <option>Ginger</option>
          <option>Turmeric</option>
          <option>Pineapple</option>
          <option>Chilli</option>
          <option>Black Pepper</option>
          <option>Khasi Mandarin / Orange</option>
          <option>Banana</option>
          <option>Sweet Potato</option>
          <option>Yam</option>
          <option>Colocasia</option>
          <option>Tapioca</option>
          <option>Pulses</option>
          <option>Vegetables</option>
        </select>

        <label>Harvest Date</label>
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

        <label>Harvest Quantity</label>
        <input
          type="number"
          step="0.1"
          value={harvestForm.harvest_quantity}
          onChange={(e) =>
            setHarvestForm({
              ...harvestForm,
              harvest_quantity: e.target.value
            })
          }
          placeholder="Enter quantity"
        />

        <label>Unit</label>
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

        <label>Additional Information</label>
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
  crop_name: harvestForm.crop_name,
  harvest_date: harvestForm.harvest_date,
  harvest_quantity: harvestForm.harvest_quantity,
  quantity_unit: harvestForm.quantity_unit,
  additional_info: harvestForm.additional_info
})
            })
              .then((response) => response.json())
              .then(() =>
                fetch("http://localhost:5000/api/dashboard/1")
              )
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
          Save Harvest
        </button>

        <button onClick={() => setShowHarvestForm(false)}>
          Back to Dashboard
        </button>
      </section>
    </div>
  );
}
if (showCropDetails) {
  return (
    <div className="megha-app">
      <Sidebar />

      <main className="megha-main">
        <div className="form-page">

          <div className="form-page-header">
            <h1>Current Crop Details 🌱</h1>
            <p>View the information about your currently cultivated crop.</p>
          </div>

          <section className="dashboard-card">

            <h2>Crop Information</h2>

            <p>
              <strong>Current Crop:</strong>{" "}
              {dashboard.current_crop.current_crop}
            </p>

            <p>
              <strong>Crop Status:</strong>{" "}
              {dashboard.current_crop.crop_status}
            </p>

            <p>
              <strong>Planting Date:</strong>{" "}
              {dashboard.current_crop.planting_date || "Not recorded"}
            </p>

            <p>
              <strong>Expected Harvest Date:</strong>{" "}
              {dashboard.current_crop.expected_harvest_date ||
                "Not recorded"}
            </p>

            <p>
              <strong>Cultivated Area:</strong>{" "}
              {dashboard.current_crop.cultivated_area || "Not recorded"} acres
            </p>

            <p>
              <strong>Crop Season:</strong>{" "}
              {dashboard.current_crop.crop_season || "Not recorded"}
            </p>

            <div>
              <button
                className="card-action"
                onClick={() => {
                  setShowCropDetails(false);
                  setShowCropForm(true);
                }}
              >
                Edit Current Crop
              </button>

              <button
                className="card-action secondary"
                onClick={() => setShowCropDetails(false)}
              >
                Back to Dashboard
              </button>
            </div>

          </section>
        </div>
      </main>
    </div>
  );
}
if (showCropForm) {
  return (
    <div className="megha-app">
      <Sidebar />

      <main className="megha-main">
        <div className="form-page">
          <div className="form-page-header">
            <h1>Edit Current Crop 🌱</h1>
            <p>Update the information about your currently cultivated crop.</p>
          </div>

      <section className="dashboard-card">

        <h2>Crop Information</h2>

        <label>Current Crop</label>
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
          <option value="Khasi Mandarin / Orange">
            Khasi Mandarin / Orange
          </option>
          <option value="Banana">Banana</option>
          <option value="Sweet Potato">Sweet Potato</option>
          <option value="Yam">Yam</option>
          <option value="Colocasia">Colocasia</option>
          <option value="Tapioca">Tapioca</option>
          <option value="Pulses">Pulses</option>
          <option value="Vegetables">Vegetables</option>
        </select>

        <label>Planting Date</label>
        <input
          type="date"
          value={
            cropForm.planting_date ||
            dashboard.current_crop.planting_date
          }
          onChange={(e) =>
            setCropForm({
              ...cropForm,
              planting_date: e.target.value
            })
          }
        />

        <label>Expected Harvest Date</label>
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

        <label>Cultivated Area (acres)</label>
        <input
          type="number"
          step="0.1"
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

        <label>Crop Season</label>
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

        <label>Crop Status</label>
        <select
          value={
            cropForm.crop_status ||
            dashboard.current_crop.crop_status
          }
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

        <label>Additional Information</label>
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

        <div>
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
                    selectedCrop ||
                    dashboard.current_crop.current_crop,
                  planting_date:
                    cropForm.planting_date ||
                    dashboard.current_crop.planting_date,
                  expected_harvest_date:
                    cropForm.expected_harvest_date ||
                    dashboard.current_crop.expected_harvest_date,
                  cultivated_area:
  cropForm.cultivated_area ||
  dashboard.current_crop.cultivated_area,

crop_season:
  cropForm.crop_season ||
  dashboard.current_crop.crop_season,

crop_status:
  cropForm.crop_status ||
  dashboard.current_crop.crop_status
                })
              })
                .then((response) => response.json())
                .then((data) => {
                  console.log(data);

                  return fetch(
                    "http://localhost:5000/api/dashboard/1"
                  );
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

          <button
            onClick={() => setShowCropForm(false)}
          >
            Back to Dashboard
          </button>
        </div>

              </section>
      </div>
    </main>
  </div>
  );
}
if (showSoilForm) {
  return (
    <div className="megha-app">
      <Sidebar />

      <main className="megha-main">
        <div className="form-page">

          <div className="form-page-header">
            <h1>Update Soil Information 🌍</h1>
            <p>Update the latest soil information for your farm.</p>
          </div>

          <section className="dashboard-card">

            <h2>Soil Information</h2>

            <label>Soil Type</label>
            <select
              value={soilForm.soil_type}
onChange={(e) =>
                setSoilForm({
                  ...soilForm,
                  soil_type: e.target.value
                })
              }
            >
              <option value="">Select soil type</option>
              <option value="Loamy">Loamy</option>
              <option value="Sandy">Sandy</option>
              <option value="Clayey">Clayey</option>
              <option value="Silty">Silty</option>
              <option value="Laterite">Laterite</option>
              <option value="Other">Other</option>
            </select>

            <label>Soil pH</label>
            <input
              type="number"
              step="0.1"
              value={soilForm.soil_ph}
              onChange={(e) =>
                setSoilForm({
                  ...soilForm,
                  soil_ph: e.target.value
                })
              }
              placeholder="Example: 6.2"
            />

            <label>Nitrogen</label>
            <input
              type="number"
              step="0.1"
              value={soilForm.nitrogen}
              onChange={(e) =>
                setSoilForm({
                  ...soilForm,
                  nitrogen: e.target.value
                })
              }
            />

            <label>Phosphorus</label>
            <input
              type="number"
              step="0.1"
              value={soilForm.phosphorus}
              onChange={(e) =>
                setSoilForm({
                  ...soilForm,
                  phosphorus: e.target.value
                })
              }
            />

            <label>Potassium</label>
            <input
              type="number"
              step="0.1"
              value={soilForm.potassium}
              onChange={(e) =>
                setSoilForm({
                  ...soilForm,
                  potassium: e.target.value
                })
              }
            />

            <label>Organic Matter</label>
            <input
              type="number"
              step="0.1"
              value={soilForm.organic_matter}
              onChange={(e) =>
                setSoilForm({
                  ...soilForm,
                  organic_matter: e.target.value
                })
              }
            />

            <label>Soil Moisture (%)</label>
            <input
              type="number"
              step="0.1"
              value={soilForm.soil_moisture}
              onChange={(e) =>
                setSoilForm({
                  ...soilForm,
                  soil_moisture: e.target.value
                })
              }
            />

            <label>Soil Health Status</label>
            <select
              value={soilForm.soil_health_status}
              onChange={(e) =>
                setSoilForm({
                  ...soilForm,
                  soil_health_status: e.target.value
                })
              }
            >
              <option value="">Select status</option>
              <option value="Good">Good</option>
              <option value="Moderate">Moderate</option>
              <option value="Needs Attention">Needs Attention</option>
            </select>

            <label>Source of Information</label>
            <select
              value={soilForm.source}
              onChange={(e) =>
                setSoilForm({
                  ...soilForm,
                  source: e.target.value
                })
              }
            >
              <option value="">Select source</option>
              <option value="Recorded farm data">
                Recorded farm data
              </option>
              <option value="Soil Health Card">
                Soil Health Card
              </option>
              <option value="Estimated">
                Estimated
              </option>
              <option value="Other">
                Other
              </option>
            </select>

            <label>Is this information estimated?</label>
            <select
              value={soilForm.is_estimated}
              onChange={(e) =>
                setSoilForm({
                  ...soilForm,
                  is_estimated: e.target.value
                })
              }
            >
              <option value="1">Yes</option>
              <option value="0">No</option>
            </select>

            <label>Recorded Date</label>
            <input
              type="date"
              value={soilForm.recorded_date}
              onChange={(e) =>
                setSoilForm({
                  ...soilForm,
                  recorded_date: e.target.value
                })
              }
            />

            <div>
              <button
                onClick={() => {
                  fetch("http://localhost:5000/api/soil/update", {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                      farm_id: dashboard.farm.farm_id,
                      soil_type:
                        soilForm.soil_type ||
                        dashboard.soil.soil_type,
                      soil_ph:
                        soilForm.soil_ph ||
                        dashboard.soil.soil_ph,
                      nitrogen:
                        soilForm.nitrogen ||
                        dashboard.soil.nitrogen,
                      phosphorus:
                        soilForm.phosphorus ||
                        dashboard.soil.phosphorus,
                      potassium:
                        soilForm.potassium ||
                        dashboard.soil.potassium,
                      organic_matter:
                        soilForm.organic_matter ||
                        dashboard.soil.organic_matter,
                      soil_moisture:
                        soilForm.soil_moisture ||
                        dashboard.soil.soil_moisture,
                      soil_health_status:
                        soilForm.soil_health_status ||
                        dashboard.soil.soil_health_status,
                      source:
                        soilForm.source ||
                        dashboard.soil.source,
                      is_estimated:
                        soilForm.is_estimated,
                      recorded_date:
                        soilForm.recorded_date ||
                        dashboard.soil.recorded_date
                    })
                  })
                    .then((response) => response.json())
                    .then((data) => {
                      console.log(data);

                      return fetch(
                        "http://localhost:5000/api/dashboard/1"
                      );
                    })
                    .then((response) => response.json())
                    .then((updatedDashboard) => {
                      setDashboard(updatedDashboard);
                      setSoilForm({
  soil_type: "",
  soil_ph: "",
  nitrogen: "",
  phosphorus: "",
  potassium: "",
  organic_matter: "",
  soil_moisture: "",
  soil_health_status: "",
  source: "",
  is_estimated: "0",
  recorded_date: ""
});
                      setShowSoilForm(false);
                      setShowFarmDetails(true);
                    })
                    .catch((error) => {
                      console.error(
                        "Error updating soil:",
                        error
                      );
                    });
                }}
              >
                Save Soil Information
              </button>

              <button
                onClick={() => setShowSoilForm(false)}
              >
                Back
              </button>
            </div>

          </section>
        </div>
      </main>
    </div>
  );
}

if (showSoilDetails) {
  return (
    <div className="megha-app">
      <Sidebar />

      <main className="megha-main">
        <div className="form-page">

          <div className="form-page-header">
            <h1>Soil Details 🌍</h1>
            <p>View the latest recorded soil information for your farm.</p>
          </div>

          <section className="dashboard-card">

            <h2>Soil Information</h2>

            <p>
              <strong>Soil Type:</strong>{" "}
              {dashboard.soil.soil_type}
            </p>

            <p>
              <strong>pH:</strong>{" "}
              {dashboard.soil.soil_ph}
            </p>

            <p>
              <strong>Moisture:</strong>{" "}
              {dashboard.soil.soil_moisture}%
            </p>

            <p>
              <strong>Nitrogen:</strong>{" "}
              {dashboard.soil.nitrogen}
            </p>

            <p>
              <strong>Phosphorus:</strong>{" "}
              {dashboard.soil.phosphorus}
            </p>

            <p>
              <strong>Potassium:</strong>{" "}
              {dashboard.soil.potassium}
            </p>

            <p>
              <strong>Organic Matter:</strong>{" "}
              {dashboard.soil.organic_matter}
            </p>

            <p>
              <strong>Soil Health Status:</strong>{" "}
              {dashboard.soil.soil_health_status}
            </p>

            <p>
              <strong>Information Source:</strong>{" "}
              {dashboard.soil.source || "Not recorded"}
            </p>

            <p>
              <strong>Recorded Date:</strong>{" "}
              {dashboard.soil.recorded_date || "Not recorded"}
            </p>

            <p>
  <strong>Estimated:</strong>{" "}
  {Number(dashboard.soil.is_estimated) === 1 ? "Yes" : "No"}
</p>
            <div>
              <button
                onClick={() => setShowSoilForm(true)}
              >
                Update Soil Information
              </button>

              <button
                onClick={() => setShowSoilDetails(false)}
              >
                Back to Dashboard
              </button>
            </div>

          </section>
        </div>
      </main>
    </div>
  );
}
if (showFarmerForm) {
  return (
    <div className="megha-app">
      <Sidebar />

      <main className="megha-main">
        <div className="farm-profile-page">

          <button
            className="back-button"
            onClick={() => {
              setShowFarmerForm(false);
              setShowFarmDetails(true);
            }}
          >
            ← Back to Farm Profile
          </button>

          <div className="farm-profile-header">
            <p className="card-label">FARMER</p>
            <h1 style={{ color: "#2f5237" }}>👨‍🌾 Edit Farmer Information</h1>
            <p>Update the farmer's basic information.</p>
          </div>

          <section className="dashboard-card farm-profile-section">

            <div className="card-heading">
              <div>
                <p className="card-label">FARMER INFORMATION</p>
                <h2>👨‍🌾 Farmer Details</h2>
              </div>
            </div>

            <form
  onSubmit={(e) => {
    e.preventDefault();
    console.log("Farmer form data:", farmerForm);
  }}
>

              <div className="farmer-form-grid">

                <div className="farmer-form-field">
                  <label>Farmer Name</label>
                  <input
                    type="text"
                    value={farmerForm.farmer_name}
                    onChange={(e) =>
                      setFarmerForm({
                        ...farmerForm,
                        farmer_name: e.target.value
                      })
                    }
                    placeholder="Enter farmer name"
                  />
                </div>

                <div className="farmer-form-field">
                  <label>General Location</label>
                  <input
                    type="text"
                    value={farmerForm.location}
                    onChange={(e) =>
                      setFarmerForm({
                        ...farmerForm,
                        location: e.target.value
                      })
                    }
                    placeholder="Enter general location"
                  />
                </div>

                <div className="farmer-form-field">
                  <label>District</label>
                  <input
                    type="text"
                    value={farmerForm.district}
                    onChange={(e) =>
                      setFarmerForm({
                        ...farmerForm,
                        district: e.target.value
                      })
                    }
                    placeholder="Enter district"
                  />
                </div>

                <div className="farmer-form-field">
                  <label>Village / Locality</label>
                  <input
                    type="text"
                    value={farmerForm.village}
                    onChange={(e) =>
                      setFarmerForm({
                        ...farmerForm,
                        village: e.target.value
                      })
                    }
                    placeholder="Enter village or locality"
                  />
                </div>

              </div>

              <div className="farmer-form-actions">

                <button
                  type="button"
                  className="card-action secondary"
                  onClick={() => {
                    setShowFarmerForm(false);
                    setShowFarmDetails(true);
                  }}
                >
                  Cancel
                </button>

                <button
  type="button"
  className="card-action"
  onClick={async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/farmer/${dashboard.farmer.farmer_id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(farmerForm)
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to update farmer");
      }

      alert("Farmer information updated successfully!");

      setShowFarmerForm(false);
      setShowFarmDetails(true);

      window.location.reload();

    } catch (error) {
      console.error("Error updating farmer:", error);
      alert("Failed to save farmer information.");
    }
  }}
>
  Save Changes
</button>

              </div>

            </form>
          </section>

        </div>
      </main>
    </div>
  );
}
if (showFarmForm) {
  return (
    <div className="megha-app">
      <Sidebar />

      <main className="megha-main">
        <div className="farm-profile-page">

          <button
            className="back-button"
            onClick={() => {
              setShowFarmForm(false);
              setShowFarmDetails(true);
            }}
          >
            ← Back to Farm Profile
          </button>

          <div className="farm-profile-header">
            <p className="card-label">YOUR FARM</p>
            <h1 style={{ color: "#2f5237" }}>🚜 Edit Farm Information</h1>
            <p>Update your farm details.</p>
          </div>

          <section className="dashboard-card farm-profile-section">

            <div className="card-heading">
              <div>
                <p className="card-label">FARM INFORMATION</p>
                <h2>🚜 Farm Details</h2>
              </div>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
              }}
            >

              <div className="farm-form-grid">

  <div className="farm-form-field">
    <label>Farm Size</label>
    <input
      type="number"
      value={farmForm.farm_size}
      onChange={(e) =>
        setFarmForm({
          ...farmForm,
          farm_size: e.target.value
        })
      }
      placeholder="Enter farm size"
    />
  </div>

  <div className="farm-form-field">
    <label>Farm Size Unit</label>
    <input
      type="text"
      value={farmForm.farm_size_unit}
      onChange={(e) =>
        setFarmForm({
          ...farmForm,
          farm_size_unit: e.target.value
        })
      }
      placeholder="e.g. acre, hectare"
    />
  </div>

  <div className="farm-form-field">
    <label>Farming Type</label>
    <input
      type="text"
      value={farmForm.farming_type}
      onChange={(e) =>
        setFarmForm({
          ...farmForm,
          farming_type: e.target.value
        })
      }
      placeholder="e.g. Organic, Conventional"
    />
  </div>

  <div className="farm-form-field">
    <label>Terrain</label>
    <input
      type="text"
      value={farmForm.terrain}
      onChange={(e) =>
        setFarmForm({
          ...farmForm,
          terrain: e.target.value
        })
      }
      placeholder="Enter terrain"
    />
  </div>

  <div className="farm-form-field">
    <label>Current Land Use</label>
    <input
      type="text"
      value={farmForm.current_land_use}
      onChange={(e) =>
        setFarmForm({
          ...farmForm,
          current_land_use: e.target.value
        })
      }
      placeholder="Enter current land use"
    />
  </div>

</div>

              <div className="farmer-form-actions">

                <button
                  type="button"
                  className="card-action secondary"
                  onClick={() => {
                    setShowFarmForm(false);
                    setShowFarmDetails(true);
                  }}
                >
                  Cancel
                </button>

                <button
                  type="button"
                  className="card-action"
                  onClick={async () => {
                    try {
                      const response = await fetch(
                        `http://localhost:5000/api/farm/${dashboard.farm.farm_id}`,
                        {
                          method: "PUT",
                          headers: {
                            "Content-Type": "application/json"
                          },
                          body: JSON.stringify(farmForm)
                        }
                      );

                      const result = await response.json();

                      if (!response.ok) {
                        throw new Error(
                          result.error || "Failed to update farm"
                        );
                      }

                      alert("Farm information updated successfully!");

                      setShowFarmForm(false);
                      setShowFarmDetails(true);

                      window.location.reload();

                    } catch (error) {
                      console.error("Error updating farm:", error);
                      alert("Failed to save farm information.");
                    }
                  }}
                >
                  Save Changes
                </button>

              </div>

            </form>

          </section>

        </div>
      </main>
    </div>
  );
}
if (showFarmDetails) {
  return (
    <div className="megha-app">
      <Sidebar />

      <main className="megha-main">
        <div className="farm-profile-page">

  <style>
  {`
    /* =========================
       FARM PROFILE - REFERENCE UI
       ========================= */

    .farm-profile-page {
      width: 100%;
      max-width: 1100px;
      margin: 0 auto;
    }
.farm-profile-top-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

@media (max-width: 800px) {
  .farm-profile-top-grid {
    grid-template-columns: 1fr;
  }
}
  .profile-info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
}

.profile-info-item {
  display: flex;
  flex-direction: column;
  gap: 5px;
  padding: 14px 16px;
  border-bottom: 1px solid #e8e5dc;
}

.profile-info-item span {
  font-size: 11px;
  color: #7b837a;
  font-weight: 500;
}

.profile-info-item strong {
  font-size: 14px;
  color: #354238;
  font-weight: 600;
}

@media (max-width: 700px) {
  .profile-info-grid {
    grid-template-columns: 1fr;
  }
}
    /* Card heading */
    .farm-profile-page .card-heading {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 20px;
      margin-bottom: 20px;
    }

    .farm-profile-page .card-label {
      margin: 0 0 5px;
      color: #7b837a;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }

    .farm-profile-page .dashboard-card h2 {
      margin: 0;
      color: #2f5237;
      font-size: 20px;
      font-weight: 700;
    }

    /* Detail sections */
    .farm-profile-page .profile-details-grid {
      display: grid !important;
      grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
      gap: 0 !important;
      margin-top: 0 !important;
    }

    .farm-profile-page .profile-details-grid > div {
      display: flex !important;
      flex-direction: column !important;
      gap: 5px !important;
      padding: 14px 16px !important;
      background: transparent !important;
      border-radius: 0 !important;
      border-bottom: 1px solid #e8e5dc;
    }

    .farm-profile-page .profile-details-grid > div:nth-child(odd) {
      border-right: 1px solid #e8e5dc;
    }

    .farm-profile-page .profile-details-grid > div span {
      display: block !important;
      font-size: 11px !important;
      color: #7b837a !important;
      font-weight: 500 !important;
    }

    .farm-profile-page .profile-details-grid > div strong {
      display: block !important;
      font-size: 14px !important;
      color: #354238 !important;
      font-weight: 600 !important;
      line-height: 1.4 !important;
    }

    /* Status badge */
    .farm-profile-page .status-badge {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 6px 11px;
      border-radius: 999px;
      background: #e5efe2;
      color: #426b4a;
      font-size: 11px;
      font-weight: 700;
      white-space: nowrap;
    }

    /* History rows */
    .farm-profile-page .history-list {
      display: flex;
      flex-direction: column;
    }

    .farm-profile-page .history-row {
      display: flex !important;
      justify-content: space-between !important;
      align-items: center !important;
      gap: 24px !important;
      padding: 15px 0 !important;
      border-bottom: 1px solid #e5eadf !important;
    }

    .farm-profile-page .history-row:last-child {
      border-bottom: none !important;
    }

    .farm-profile-page .history-row > div:first-child {
      display: flex !important;
      flex-direction: column !important;
      gap: 5px !important;
      min-width: 0;
    }

    .farm-profile-page .history-row > div:first-child strong {
      display: block !important;
      color: #354238 !important;
      font-size: 14px !important;
    }

    .farm-profile-page .history-row > div:first-child span {
      display: block !important;
      color: #7b837a !important;
      font-size: 12px !important;
      line-height: 1.4 !important;
    }

    .farm-profile-page .history-value {
      flex-shrink: 0;
      white-space: nowrap !important;
      font-weight: 700 !important;
      color: #426b4a !important;
      font-size: 13px !important;
    }

    /* Buttons */
    .farm-profile-page .card-action {
      margin-top: 18px;
    }

    /* Soil image */
    .farm-profile-page .soil-image-placeholder {
      padding: 18px;
      background: #f7f4ec;
      border-radius: 12px;
      text-align: center;
    }

    .farm-profile-page .soil-image-preview {
      display: block;
      width: 100%;
      max-width: 460px;
      max-height: 300px;
      object-fit: cover;
      margin: 14px auto 0;
      border-radius: 12px;
      border: 1px solid #e1ddd2;
    }

    /* Mobile */
    @media (max-width: 700px) {
      .farm-profile-page {
        width: 100%;
      }

      .farm-profile-page .profile-details-grid {
        grid-template-columns: 1fr !important;
      }

      .farm-profile-page .profile-details-grid > div:nth-child(odd) {
        border-right: none;
      }

      .farm-profile-page .profile-details-grid > div {
        border-right: none !important;
      }

      .farm-profile-page .history-row {
        align-items: flex-start !important;
        gap: 10px !important;
      }

      .farm-profile-page .card-heading {
        align-items: flex-start;
      }
    }

    @media (max-width: 450px) {
      .farm-profile-page .history-row {
        flex-direction: column !important;
      }

      .farm-profile-page .history-value {
        width: 100%;
        text-align: left;
      }

      .farm-profile-page .card-heading {
        flex-direction: column;
        gap: 10px;
      }
    }
      .farm-profile-header {
  margin: 10px 0 24px;
}

.farm-profile-page .farm-profile-header h1 {
  margin: 0;
  color: #2f5237 !important;
  font-size: 28px;
  font-weight: 700;
}

.farm-profile-header p:last-child {
  margin: 6px 0 0;
  color: #7b837a;
  font-size: 14px;
}

.back-button {
  border: none;
  background: transparent;
  color: #426b4a;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  padding: 0;
  margin-bottom: 18px;
}

.farmer-form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 18px 20px;
}

.farmer-form-field {
  display: flex;
  flex-direction: column;
  gap: 7px;
}

.farmer-form-field label {
  color: #354238;
  font-size: 12px;
  font-weight: 700;
}

.farmer-form-field input {
  width: 100%;
  box-sizing: border-box;
  padding: 12px 14px;
  border: 1px solid #e1ddd2;
  border-radius: 10px;
  background: #fffdf8;
  color: #354238;
  font-size: 14px;
  outline: none;
}

.farmer-form-field input:focus {
  border-color: #426b4a;
  box-shadow: 0 0 0 3px rgba(66, 107, 74, 0.10);
}

.farmer-form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 25px;
  position: relative;
  z-index: 10;
}
@media (max-width: 700px) {
  .farmer-form-grid {
    grid-template-columns: 1fr;
  }

  .farmer-form-actions {
    flex-direction: column-reverse;
  }

  .farmer-form-actions button {
    width: 100%;
  }
}
  `}
</style>

          {/* PAGE HEADER */}
          <div className="form-page-header">
            <p className="card-label">FARM PROFILE</p>

            <h1>🌱 Farm Profile</h1>

            <p>
              Your complete farm information, soil details, water status,
              crop history, and farm records.
            </p>

            <button
              className="card-action secondary"
              onClick={() => setShowFarmDetails(false)}
            >
              ← Back to Dashboard
            </button>
          </div>

<div className="farm-profile-top-grid">
{/* FARMER INFORMATION */}
<section className="dashboard-card farm-profile-section">
  <div className="card-heading">
    <div>
      <p className="card-label">FARMER</p>
      <h2>👨‍🌾 Farmer Information</h2>
    </div>

    <button
  className="card-action secondary"
  onClick={() => {
    setFarmerForm({
      farmer_name: dashboard.farmer.farmer_name || "",
      location: dashboard.farmer.locality || dashboard.farmer.location || "",
      district: dashboard.farmer.district || "",
      village: dashboard.farmer.village || ""
    });

    setShowFarmDetails(false);
    setShowFarmerForm(true);
  }}
>
  Edit
</button>
  </div>

  <div className="profile-info-grid">
    <div className="profile-info-item">
      <span>Name</span>
      <strong>
        {dashboard.farmer.farmer_name || "Not recorded"}
      </strong>
    </div>

    <div className="profile-info-item">
      <span>District</span>
      <strong>
        {dashboard.farmer.district || "Not recorded"}
      </strong>
    </div>

    <div className="profile-info-item">
      <span>Village / Locality</span>
      <strong>
        {dashboard.farmer.village ||
          dashboard.farmer.locality ||
          "Not recorded"}
      </strong>
    </div>

    <div className="profile-info-item">
      <span>General Location</span>
      <strong>
        {dashboard.farmer.locality || "Not recorded"}
      </strong>
    </div>
  </div>

  <span className="source-badge">
    ● Recorded farm data
  </span>
</section>
{/* FARM INFORMATION */}
<section className="dashboard-card farm-profile-section">
  <div className="card-heading">
  <div>
    <p className="card-label">YOUR FARM</p>
    <h2>🚜 Farm Information</h2>
  </div>

  <button
    className="card-action secondary"
    onClick={() => {
      setFarmForm({
        farm_size: dashboard.farm.farm_size || "",
        farm_size_unit: dashboard.farm.farm_size_unit || "",
        farming_type: dashboard.farm.farming_type || "",
        terrain: dashboard.farm.terrain || "",
        current_land_use: dashboard.farm.current_land_use || ""
      });

      setShowFarmDetails(false);
      setShowFarmForm(true);
    }}
  >
    Edit
  </button>
</div>

  <div className="profile-info-grid">
    <div className="profile-info-item">
      <span>Farm size</span>
      <strong>
        {dashboard.farm.farm_size || "Not recorded"}{" "}
        {dashboard.farm.farm_size_unit || ""}
      </strong>
    </div>

    <div className="profile-info-item">
      <span>Farming type</span>
      <strong>
        {dashboard.farm.farming_type || "Not recorded"}
      </strong>
    </div>

    <div className="profile-info-item">
      <span>Terrain</span>
      <strong>
        {dashboard.farm.terrain || "Not recorded"}
      </strong>
    </div>

    <div className="profile-info-item">
      <span>Current land use</span>
      <strong>
        {dashboard.farm.current_land_use || "Not recorded"}
      </strong>
    </div>
  </div>

  <span className="source-badge">
    ● Recorded farm data
  </span>
</section>
</div>

                    {/* SOIL INFORMATION */}
<section className="dashboard-card farm-profile-section">
  <div className="card-heading">
    <div>
      <p className="card-label">SOIL</p>
      <h2>🌍 Soil Information</h2>
    </div>

    <button
      className="card-action secondary"
      onClick={() => {
        if (dashboard.soil) {
          setSoilForm({
            soil_type: dashboard.soil.soil_type || "",
            soil_ph: dashboard.soil.soil_ph ?? "",
            nitrogen: dashboard.soil.nitrogen ?? "",
            phosphorus: dashboard.soil.phosphorus ?? "",
            potassium: dashboard.soil.potassium ?? "",
            organic_matter: dashboard.soil.organic_matter ?? "",
            soil_moisture: dashboard.soil.soil_moisture ?? "",
            soil_health_status: dashboard.soil.soil_health_status || "",
            source: dashboard.soil.source || "",
            is_estimated: dashboard.soil.is_estimated ? "1" : "0",
            recorded_date: dashboard.soil.recorded_date || ""
          });
        }

        setShowFarmDetails(false);
        setShowSoilForm(true);
      }}
    >
      Edit
    </button>
  </div>

  {dashboard.soil ? (
    <>
      <div className="soil-metrics-grid">

        <div className="soil-metric">
          <span>Soil type</span>
          <strong>{dashboard.soil.soil_type || "Not recorded"}</strong>
        </div>

        <div className="soil-metric">
          <span>pH</span>
          <strong>{dashboard.soil.soil_ph ?? "Not recorded"}</strong>
        </div>

        <div className="soil-metric">
          <span>Nitrogen</span>
          <strong>{dashboard.soil.nitrogen ?? "Not recorded"}</strong>
        </div>

        <div className="soil-metric">
          <span>Phosphorus</span>
          <strong>{dashboard.soil.phosphorus ?? "Not recorded"}</strong>
        </div>

        <div className="soil-metric">
          <span>Potassium</span>
          <strong>{dashboard.soil.potassium ?? "Not recorded"}</strong>
        </div>

        <div className="soil-metric">
          <span>Organic matter</span>
          <strong>{dashboard.soil.organic_matter ?? "Not recorded"}</strong>
        </div>

        <div className="soil-metric">
          <span>Soil moisture</span>
          <strong>
            {dashboard.soil.soil_moisture ?? "Not recorded"}
            {dashboard.soil.soil_moisture !== null &&
            dashboard.soil.soil_moisture !== undefined
              ? "%"
              : ""}
          </strong>
        </div>

        <div className="soil-health-box">
          <span>Soil health status</span>
          <strong>
            {dashboard.soil.soil_health_status || "Not recorded"}
          </strong>
        </div>

      </div>

      <div className="profile-source">
        <strong>Source:</strong>{" "}
        {dashboard.soil.source || "Not recorded"}

        {Number(dashboard.soil.is_estimated) === 1 && (
  <span className="estimated-label"> • Estimated</span>
)}
      </div>

      {dashboard.soil.recorded_date && (
        <p className="soil-recorded-date">
          Recorded on {dashboard.soil.recorded_date}
        </p>
      )}
    </>
  ) : (
    <div className="soil-empty-state">
      <p>No soil information recorded yet.</p>

      <button
        className="card-action secondary"
        onClick={() => {
          setShowFarmDetails(false);
          setShowSoilForm(true);
        }}
      >
        Add Soil Information
      </button>
    </div>
  )}
</section>

         {/* WATER INFORMATION */}
<section className="dashboard-card farm-profile-section">
  <div className="card-heading">
    <div>
      <p className="card-label">WATER</p>
      <h2>💧 Water & Irrigation</h2>
    </div>
  </div>

  {dashboard.water ? (
    <>
      <div className="profile-details-grid">

        <div>
          <span>Water availability</span>
          <strong>
            {dashboard.water.water_availability || "Not recorded"}
          </strong>
        </div>

        <div>
          <span>Water source</span>
          <strong>
            {dashboard.water.water_source || "Not recorded"}
          </strong>
        </div>

        <div>
          <span>Irrigation method</span>
          <strong>
            {dashboard.water.irrigation_method || "Not recorded"}
          </strong>
        </div>

        <div>
          <span>Rainfall dependence</span>
          <strong>
            {dashboard.water.rainfall_dependence || "Not recorded"}
          </strong>
        </div>

        <div>
          <span>Watering frequency</span>
          <strong>
            {dashboard.water.watering_frequency || "Not recorded"}
          </strong>
        </div>

        <div>
          <span>Seasonal water issue</span>
          <strong>
            {dashboard.water.seasonal_water_issue || "None recorded"}
          </strong>
        </div>

      </div>

      <button
        className="card-action secondary"
        onClick={() => {
          setShowFarmDetails(false);
          setShowWaterForm(true);
        }}
      >
        Update Water Information
      </button>
    </>
  ) : (
    <>
      <p>No water information recorded yet.</p>

      <button
        className="card-action secondary"
        onClick={() => {
          setShowFarmDetails(false);
          setShowWaterForm(true);
        }}
      >
        Add Water Information
      </button>
    </>
  )}
</section>


          {/* CURRENT CROP */}
<section className="dashboard-card farm-profile-section">
  <div className="card-heading">
    <div>
      <p className="card-label">CURRENT CROP</p>
      <h2>🌾 Current Crop</h2>
    </div>

    <span className="status-badge">
      {dashboard.current_crop?.crop_status || "Not recorded"}
    </span>
  </div>

  {dashboard.current_crop ? (
    <>
      <div className="profile-details-grid">

        <div>
          <span>Crop</span>
          <strong>
            {dashboard.current_crop.current_crop}
          </strong>
        </div>

        <div>
          <span>Planting date</span>
          <strong>
            {dashboard.current_crop.planting_date || "Not recorded"}
          </strong>
        </div>

        <div>
          <span>Cultivation day</span>
          <strong>
            Day {dashboard.cultivation_day}
          </strong>
        </div>

        <div>
          <span>Expected harvest</span>
          <strong>
            {dashboard.current_crop.expected_harvest_date ||
              "Not recorded"}
          </strong>
        </div>

        <div>
          <span>Cultivated area</span>
          <strong>
            {dashboard.current_crop.cultivated_area || "Not recorded"} acres
          </strong>
        </div>

        <div>
          <span>Crop season</span>
          <strong>
            {dashboard.current_crop.crop_season || "Not recorded"}
          </strong>
        </div>

      </div>

      <button
        className="card-action secondary"
        onClick={() => {
          setShowFarmDetails(false);
          setShowCropForm(true);
        }}
      >
        Edit Current Crop
      </button>
    </>
  ) : (
    <>
      <p>No current crop recorded.</p>

      <button
        className="card-action secondary"
        onClick={() => {
          setShowFarmDetails(false);
          setShowCropForm(true);
        }}
      >
        Add Current Crop
      </button>
    </>
  )}
</section>


          {/* PREVIOUS CROPS */}
<section className="dashboard-card farm-profile-section">
  <div className="card-heading">
    <div>
      <p className="card-label">HISTORY</p>
      <h2>🌾 Previous Crops</h2>
    </div>
  </div>

  {dashboard.crop_history.length > 0 ? (
    <div className="crop-history-table">
      <div className="crop-history-header">
        <span>Crop</span>
        <span>Cultivation Period</span>
        <span>Area</span>
      </div>

      {dashboard.crop_history.map((crop) => (
        <div
          className="crop-history-row"
          key={crop.crop_history_id}
        >
          <strong>{crop.crop_name || "Not recorded"}</strong>

          <span>
            {crop.cultivation_start_date || "Date not recorded"}
            {crop.cultivation_end_date
              ? ` → ${crop.cultivation_end_date}`
              : ""}
          </span>

          <span>
            {crop.cultivated_area
              ? `${crop.cultivated_area} acres`
              : "Not recorded"}
          </span>
        </div>
      ))}
    </div>
  ) : (
    <p>No previous crops recorded yet.</p>
  )}
</section>


          {/* HARVEST HISTORY */}
          <section className="dashboard-card farm-profile-section">
            <div className="card-heading">
              <div>
                <p className="card-label">HARVEST</p>
                <h2>📦 Harvest History</h2>
              </div>
            </div>

            {dashboard.harvest_history.length > 0 ? (
              <div className="harvest-history-list">
  {dashboard.harvest_history
    .filter((harvest) => harvest.harvest_date)
    .slice(0, 5)
    .map((harvest) => (
      <div
        className="harvest-history-row"
        key={harvest.harvest_id}
      >
        <div>
          <strong>
            {harvest.crop_name || "Crop not recorded"}
          </strong>

          <span>
            {harvest.harvest_date}
          </span>
        </div>

        <strong className="harvest-quantity">
          {harvest.harvest_quantity
            ? `${harvest.harvest_quantity} kg`
            : "Quantity not recorded"}
        </strong>
      </div>
    ))}
</div>
            ) : (
              <p>No harvest records yet.</p>
            )}
          </section>


          {/* FARM RESOURCES */}
          <section className="dashboard-card farm-profile-section">
            <div className="card-heading">
              <div>
                <p className="card-label">CIRCULAR RESOURCES</p>
                <h2>♻️ Farm Resources</h2>
              </div>
            </div>

            {dashboard.resources.length > 0 ? (
              <div className="fertilizer-history-list">
  {dashboard.fertilizer_pesticide.map((record) => (
    <div
      className="fertilizer-history-row"
      key={record.record_id}
    >
      <div>
        <strong>
          {record.pesticide_name
            ? record.pesticide_name
            : record.organic_manure
            ? record.organic_manure
            : record.fertilizer_type === "Organic"
            ? "Organic fertilizer / manure"
            : record.fertilizer_name || "Farm input not recorded"}
        </strong>

        <span>
          {record.fertilizer_name && record.fertilizer_type
            ? `Fertilizer • ${record.fertilizer_type}`
            : record.pesticide_name
            ? "Pesticide"
            : record.organic_manure
            ? "Organic manure / compost"
            : "Farm input"}
        </span>

        {record.frequency && (
          <span>
            Frequency: {record.frequency}
          </span>
        )}
      </div>

      <strong className="fertilizer-quantity">
        {record.approximate_quantity
          ? `${record.approximate_quantity} ${
              record.quantity_unit || ""
            }`
          : "Quantity not recorded"}
      </strong>
    </div>
  ))}
</div>
            ) : (
              <p>No farm resources recorded yet.</p>
            )}
          </section>


          {/* FERTILIZER & PESTICIDE */}
<section className="dashboard-card farm-profile-section">
  <div className="card-heading">
    <div>
      <p className="card-label">FARM INPUTS</p>
      <h2>🧪 Fertilizer & Pesticide</h2>
    </div>
  </div>

  {dashboard.fertilizer_pesticide.length > 0 ? (
  <div className="history-list">
    {dashboard.fertilizer_pesticide.map((record) => (
      <div
        className="history-row"
        key={record.record_id}
      >
        <div>
          <strong>
  {record.pesticide_name
    ? record.pesticide_name
    : record.organic_manure
    ? record.organic_manure
    : record.fertilizer_type === "Organic"
    ? "Organic fertilizer / manure"
    : record.fertilizer_name || "Farm input not recorded"}
</strong>

          <span>
            {record.fertilizer_name && record.fertilizer_type
              ? `Fertilizer • ${record.fertilizer_type}`
              : record.pesticide_name
              ? "Pesticide"
              : record.organic_manure
              ? "Organic manure / compost"
              : "Farm input"}
          </span>

          {record.frequency && (
            <span>
              Frequency: {record.frequency}
            </span>
          )}
        </div>

        <div className="history-value">
          {record.approximate_quantity
            ? `${record.approximate_quantity} ${
                record.quantity_unit || ""
              }`
            : "Quantity not recorded"}
        </div>
      </div>
    ))}
  </div>
) : (
  <p>No fertilizer or pesticide records yet.</p>
)}

  <button
    className="card-action secondary"
    onClick={() => {
      setShowFarmDetails(false);
      setShowFertilizerForm(true);
    }}
  >
    Add Fertilizer / Pesticide Record
  </button>
</section>
          {/* SOIL HISTORY */}
          <section className="dashboard-card farm-profile-section">
            <div className="card-heading">
              <div>
                <p className="card-label">SOIL RECORDS</p>
                <h2>📊 Soil History</h2>
              </div>
            </div>

            {dashboard.soil_history.length > 0 ? (
              <div className="soil-history-list">
  {dashboard.soil_history.map((record) => (
    <div
      className="soil-history-card"
      key={record.soil_history_id}
    >
      <div className="soil-history-main">
        <strong>
          {record.soil_type || "Soil record"}
        </strong>

        <span>
          {record.recorded_date || "Date not recorded"}
          {record.source ? ` • ${record.source}` : ""}
        </span>

        <div className="soil-history-metrics">
          <span>
            pH: {record.soil_ph ?? "—"}
          </span>

          <span>
            N: {record.nitrogen ?? "—"}
          </span>

          <span>
            P: {record.phosphorus ?? "—"}
          </span>

          <span>
            K: {record.potassium ?? "—"}
          </span>

          <span>
            Moisture: {record.soil_moisture ?? "—"}%
          </span>

          <span>
            Organic matter: {record.organic_matter ?? "—"}
          </span>
        </div>
      </div>

      <span className="history-status">
        {record.soil_health_status || "—"}
      </span>
    </div>
  ))}
</div>
            ) : (
              <p>No previous soil records yet.</p>
            )}
          </section>


          {/* SOIL IMAGE */}
<section className="dashboard-card farm-profile-section">
  <div className="card-heading">
    <div>
      <p className="card-label">SOIL IMAGE</p>
      <h2>📷 Soil Image</h2>
    </div>
  </div>

  {dashboard.soil?.soil_image ? (
    <div className="soil-image-placeholder">
      <div>
  <p>📷 Soil image recorded.</p>
  <span className="source-badge">● Recorded farm data</span>
</div>
      <img
        src={`http://localhost:5000${dashboard.soil.soil_image}`}
        alt="Uploaded soil"
        className="soil-image-preview"
      />

      <small>
        You can replace this image with a newer soil photo.
      </small>
    </div>
  ) : (
    <div className="soil-image-placeholder">
      <p>📷 No soil image uploaded yet.</p>
      <small>
        Add a clear soil photo for future assisted soil analysis.
      </small>
    </div>
  )}

  <div className="soil-image-upload">
  {dashboard.soil?.soil_image && (
    <button
      type="button"
      className="card-action secondary"
      onClick={() =>
        window.open(
          `http://localhost:5000${dashboard.soil.soil_image}`,
          "_blank"
        )
      }
    >
      View Image
    </button>
  )}

  <label
    htmlFor="soil-image-input"
    className="card-action secondary"
  >
    {dashboard.soil?.soil_image
      ? "Replace Soil Image"
      : "Upload Soil Image"}
  </label>

  <input
    id="soil-image-input"
    type="file"
    accept="image/jpeg,image/png,image/webp"
    style={{ display: "none" }}
    onChange={async (event) => {
      const image = event.target.files[0];

      if (!image) return;

      const formData = new FormData();
      formData.append("farm_id", dashboard.farm.farm_id);
      formData.append("soil_image", image);

      try {
        const response = await fetch(
          "http://localhost:5000/api/soil/image",
          {
            method: "POST",
            body: formData
          }
        );

        const data = await response.json();

        if (!response.ok) {
          alert(data.error || "Could not upload soil image");
          return;
        }

        const updatedResponse = await fetch(
          "http://localhost:5000/api/dashboard/1"
        );

        const updatedDashboard = await updatedResponse.json();

        setDashboard(updatedDashboard);

        alert("Soil image uploaded successfully!");
      } catch (error) {
        console.error("Error uploading soil image:", error);
        alert("Could not upload soil image.");
      }
    }}
  />
</div>
</section>

        </div>
      </main>
    </div>
  );
}
  return (
  <div className="megha-app">

    {/* SIDEBAR */}
    
      <aside className="megha-sidebar">

  <div className="megha-logo">
    <span className="logo-icon">🌱</span>
    <h2>Home</h2>
  </div>

  <nav className="megha-nav">
        <button className="nav-item active">
          🏠 <span>Dashboard</span>
        </button>

        <button
          className="nav-item"
          onClick={() => setShowFarmDetails(true)}
        >
          🚜 <span>Farm Profile</span>
        </button>

        <button className="nav-item">
          📚 <span>Learning</span>
        </button>
      </nav>

      <div className="sidebar-bottom">
        <p>🌿 Growing with your farm</p>
      </div>
    </aside>


    {/* MAIN CONTENT */}
    <main className="megha-main">

      {/* TOP HEADER */}
      <header className="megha-header">
        <div>
          <p className="header-small">MY FARM</p>

          <h1>
            Good morning, {dashboard.farmer.farmer_name} 👋
          </h1>

          <p className="header-location">
            📍 {dashboard.farmer.locality}, {dashboard.farmer.district}
          </p>
        </div>

        <div className="profile-circle">
          👨‍🌾
        </div>
      </header>


      {/* FARM HERO */}
      <section className="farm-hero">
        <div className="farm-hero-text">
          <p className="hero-label">YOUR FARM TODAY</p>

          <h2>
            Growing {dashboard.current_crop.current_crop} 🌾
          </h2>

          <p>
            Day {dashboard.cultivation_day} of your current crop cycle
          </p>

          <button
  onClick={() => {
    setShowCropDetails(true);
    setShowCropForm(false);
  }}
>
  View Crop Details
</button>
        </div>

        <div className="farm-hero-illustration">
          🌄
          <span>🌾</span>
          <span>🌱</span>
          <span>🌾</span>
        </div>
      </section>


      {/* QUICK OVERVIEW */}
      <section className="quick-stats">

        <div className="quick-stat">
          <span>🌱</span>
          <div>
            <p>Current Crop</p>
            <strong>
              {dashboard.current_crop.current_crop}
            </strong>
          </div>
        </div>

        <div className="quick-stat">
          <span>📅</span>
          <div>
            <p>Crop Day</p>
            <strong>
              Day {dashboard.cultivation_day}
            </strong>
          </div>
        </div>

        <div className="quick-stat">
          <span>🌦️</span>
          <div>
            <p>Weather</p>
            <strong>
              {weather
                ? `${Math.round(weather.main.temp)}°C`
                : "Loading..."}
            </strong>
          </div>
        </div>

      </section>


      {/* DASHBOARD GRID */}
      <section className="megha-grid">

        {/* CURRENT CROP */}
        <section className="megha-card current-crop-card">
          <div className="card-heading">
            <div>
              <p className="card-label">CURRENT CROP</p>
              <h2>🌱 {dashboard.current_crop.current_crop}</h2>
            </div>

            <span className="status-badge">
              {dashboard.current_crop.crop_status}
            </span>
          </div>

          <div className="crop-details-grid">

            <div>
              <span>Crop day</span>
              <strong>{dashboard.cultivation_day}</strong>
            </div>

            <div>
              <span>Area</span>
              <strong>
                {dashboard.current_crop.cultivated_area || "—"} acres
              </strong>
            </div>

            <div>
              <span>Planted</span>
              <strong>
                {new Date(
                  dashboard.current_crop.planting_date
                ).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "short",
                  year: "numeric"
                })}
              </strong>
            </div>

            <div>
              <span>Expected harvest</span>
              <strong>
                {new Date(
                  dashboard.current_crop.expected_harvest_date
                ).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "short",
                  year: "numeric"
                })}
              </strong>
            </div>

          </div>

          <button
  className="card-action"
  onClick={() => {
    setShowCropForm(true);
    setShowCropDetails(false);
  }}
>
  Edit Current Crop
</button>
        </section>


        {/* WEATHER */}
        <section className="megha-card weather-card">
          <p className="card-label">LOCAL WEATHER</p>

          <h2>🌦️ Weather</h2>

          {weather ? (
            <>
              <div className="weather-main">
                <strong>
                  {Math.round(weather.main.temp)}°C
                </strong>

                <span>
                  {weather.weather[0].description}
                </span>
              </div>

              <div className="weather-info">
                <span>
                  💧 {weather.main.humidity}% humidity
                </span>

                <span>
                  💨 {weather.wind?.speed ?? "—"} m/s
                </span>
              </div>
            </>
          ) : (
            <p>Loading live weather...</p>
          )}
        </section>


        {/* SOIL */}
        <section className="megha-card">
          <p className="card-label">SOIL HEALTH</p>

          <h2>🌍 Soil Health</h2>

          <div className="health-status">
            <span>●</span>
            <strong>
              {dashboard.soil.soil_health_status}
            </strong>
          </div>

          <p>
            <strong>Soil type:</strong>{" "}
            {dashboard.soil.soil_type}
          </p>

          <p>
            <strong>pH:</strong>{" "}
            {dashboard.soil.soil_ph}
          </p>

          <p>
            <strong>Moisture:</strong>{" "}
            {dashboard.soil.soil_moisture}%
          </p>

          <button
            className="card-action secondary"
            onClick={() => setShowSoilDetails(true)}
          >
            View Soil Details
          </button>
        </section>


        {/* WATER */}
        <section className="megha-card">
          <p className="card-label">WATER & IRRIGATION</p>

          <h2>💧 Water</h2>

          {dashboard.water ? (
            <>
              <div className="water-status">
                <strong>
                  {dashboard.water.water_availability}
                </strong>
                <span>availability</span>
              </div>

              <p>
                <strong>Method:</strong>{" "}
                {dashboard.water.irrigation_method}
              </p>

              <p>
                <strong>Source:</strong>{" "}
                {dashboard.water.water_source}
              </p>

              <p>
                <strong>Frequency:</strong>{" "}
                {dashboard.water.watering_frequency || "Not recorded"}
              </p>

              <button
                className="card-action secondary"
                onClick={() => setShowWaterForm(true)}
              >
                Update Water
              </button>
            </>
          ) : (
            <>
              <p>No water information recorded yet.</p>

              <button
                className="card-action secondary"
                onClick={() => setShowWaterForm(true)}
              >
                Add Water Information
              </button>
            </>
          )}
        </section>


        {/* FARM RESOURCES */}
        <section className="megha-card resources-card">
          <div className="card-heading">
            <div>
              <p className="card-label">FARM RESOURCES</p>
              <h2>♻️ Resources</h2>
            </div>

            <span className="resource-icon">♻️</span>
  </div>

  {residueEstimate && (
    <div className="residue-estimate">
      <strong>Estimated residue from current crop</strong>
      <span>
        {residueEstimate.amount} {residueEstimate.unit}
      </span>
      <small>
        Estimated from {residueEstimate.crop} cultivation area. Actual residue
        may vary.
      </small>
    </div>
  )}

          {dashboard.resources
            .filter(
              (resource) =>
                resource.resource_type &&
                resource.quantity !== "" &&
                resource.quantity !== null
            )
            .slice(0, 3)
            .map((resource) => (
              <div
                className="resource-row"
                key={resource.resource_id}
              >
               <div>
  <strong>{resource.resource_type}</strong>

<span>
  {resource.source || "Source not recorded"}
</span>

<small className="resource-suggestion">
  {resource.usual_use
    ? `Usual use: ${resource.usual_use}`
    : resource.resource_type === "Crop Residue"
    ? "Suggested use: Compost, mulch, or animal bedding"
    : resource.resource_type === "Animal Manure"
    ? "Suggested use: Compost or organic fertilizer"
    : resource.resource_type === "Compost"
    ? "Suggested use: Soil enrichment"
    : resource.resource_type === "Unused Produce"
    ? "Suggested use: Food processing, animal feed, or compost"
    : "Suggested use: Consider reuse or safe disposal"}
</small>
</div>

<strong>
  {resource.quantity} {resource.quantity_unit}
  {resource.estimated === 1 && (
    <span className="estimated-label"> • Estimated</span>
  )}
</strong>
</div>
            ))}

          <button
            className="card-action secondary"
            onClick={() => setShowResourceForm(true)}
          >
            Manage Resources
          </button>
        </section>


        {/* FARM PROGRESS */}
        <section className="megha-card progress-card">
          <p className="card-label">FARM PROGRESS</p>

          <h2>📈 Progress</h2>

          <div className="progress-item">
            <span>Current crop</span>
            <strong>
              {dashboard.current_crop.current_crop}
            </strong>
          </div>

          <div className="progress-item">
            <span>Previous crop</span>
            <strong>
              {dashboard.crop_history.length > 0
                ? dashboard.crop_history[0].crop_name
                : "No previous crop recorded"}
            </strong>
          </div>

          <div className="progress-item">
  <span>Recent harvest</span>
  <strong>
    {dashboard.harvest_history.length > 0
      ? `${dashboard.harvest_history[0].harvest_quantity} kg`
      : "No harvest yet"}
  </strong>
</div>

<div className="progress-item">
  <span>Latest recorded yield</span>
  <strong>
    {dashboard.harvest_history.length > 0
      ? `${dashboard.harvest_history[0].harvest_quantity} kg`
      : "Not recorded"}
  </strong>
</div>

<button
  className="card-action"
  onClick={() => setShowHarvestForm(true)}
>
  Record Harvest
</button>
        </section>


        {/* LEARNING */}
        <section className="megha-card learning-card">
          <div className="learning-image">
  {dashboard.current_crop.current_crop === "Rice"
    ? "🌾"
    : dashboard.current_crop.current_crop === "Maize"
    ? "🌽"
    : dashboard.current_crop.current_crop === "Potato"
    ? "🥔"
    : dashboard.current_crop.current_crop === "Ginger"
    ? "🫚"
    : dashboard.current_crop.current_crop === "Turmeric"
    ? "🌱"
    : dashboard.current_crop.current_crop === "Pineapple"
    ? "🍍"
    : dashboard.current_crop.current_crop === "Chilli"
    ? "🌶️"
    : dashboard.current_crop.current_crop === "Black Pepper"
    ? "🌿"
    : dashboard.current_crop.current_crop === "Khasi Mandarin / Orange"
    ? "🍊"
    : dashboard.current_crop.current_crop === "Banana"
    ? "🍌"
    : dashboard.current_crop.current_crop === "Sweet Potato"
    ? "🍠"
    : dashboard.current_crop.current_crop === "Yam"
    ? "🌱"
    : dashboard.current_crop.current_crop === "Colocasia"
    ? "🌿"
    : dashboard.current_crop.current_crop === "Tapioca"
    ? "🌱"
    : dashboard.current_crop.current_crop === "Pulses"
    ? "🫘"
    : dashboard.current_crop.current_crop === "Vegetables"
    ? "🥬"
    : "🌱"}
</div>

          <div>
            <p className="card-label">LEARNING</p>

            <h2>📚 Crop Facts</h2>

            <p>
              Learn about{" "}
              <strong>
                {dashboard.current_crop.current_crop}
              </strong>{" "}
              cultivation, soil care, irrigation, and harvesting.
            </p>

            <div className="learning-tip">
              <p>
  💡{" "}
  {dashboard.current_crop.current_crop === "Rice"
    ? "Rice is one of the major food crops of Meghalaya and generally needs a reliable water supply during important stages of growth."
    : dashboard.current_crop.current_crop === "Maize"
    ? "Maize is an important crop in Meghalaya and is commonly grown in upland areas."
    : dashboard.current_crop.current_crop === "Potato"
    ? "Potato is an important crop grown in Meghalaya and requires suitable soil and moisture management."
    : dashboard.current_crop.current_crop === "Ginger"
    ? "Ginger is an important spice crop in Meghalaya and grows well in well-drained soil."
    : dashboard.current_crop.current_crop === "Turmeric"
    ? "Turmeric is an important spice crop of Meghalaya and requires suitable soil moisture and drainage."
    : dashboard.current_crop.current_crop === "Pineapple"
    ? "Pineapple is an important horticultural crop grown in Meghalaya."
    : dashboard.current_crop.current_crop === "Banana"
    ? "Banana is an important fruit crop grown in Meghalaya and needs adequate moisture."
    : "Follow suitable cultivation practices and maintain proper soil, water, and nutrient management for this crop."}
</p>
</div>
          </div>
        </section>

      {/* FARM PROFILE STRIP */}
      <section className="farm-profile-strip">
        <div>
          <p className="card-label">YOUR FARM</p>
          <h2>📋 Farm Profile</h2>

          <p>
            {dashboard.farm.farm_size}{" "}
            {dashboard.farm.farm_size_unit} •{" "}
            {dashboard.farm.farming_type} •{" "}
            {dashboard.farm.terrain}
          </p>
        </div>

        <button onClick={() => setShowFarmDetails(true)}>
          Open Farm Profile
        </button>
      </section>
</section>
    </main>
  </div>
);
}
export default App;
