from flask import Flask, jsonify, request
from flask_cors import CORS
import sqlite3
from dotenv import load_dotenv
load_dotenv()
import os
import urllib.request
import urllib.parse
import json

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = "backend/uploads/soil"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER


def get_db():
    db_path = os.path.join(
        os.path.dirname(os.path.abspath(__file__)),
        "monjo.db"
    )

    connection = sqlite3.connect(db_path)
    connection.row_factory = sqlite3.Row
    return connection
@app.route("/")
def home():
    return "Megha Farmer Dashboard Backend is running!"

@app.route("/api/farm/<int:farm_id>", methods=["PUT"])
def update_farm(farm_id):
    db = get_db()

    data = request.get_json()

    farm_size = data.get("farm_size", "")
    farm_size_unit = data.get("farm_size_unit", "")
    farming_type = data.get("farming_type", "")
    terrain = data.get("terrain", "")
    current_land_use = data.get("current_land_use", "")

    db.execute(
        """
        UPDATE farms
        SET farm_size = ?,
            farm_size_unit = ?,
            farming_type = ?,
            terrain = ?,
            current_land_use = ?
        WHERE farm_id = ?
        """,
        (
            farm_size,
            farm_size_unit,
            farming_type,
            terrain,
            current_land_use,
            farm_id
        )
    )

    db.commit()
    db.close()

    return jsonify({
        "message": "Farm information updated successfully"
    })


@app.route("/api/farmer/<int:farmer_id>", methods=["PUT"])
def update_farmer(farmer_id):
    db = get_db()

    data = request.get_json()

    farmer_name = data.get("farmer_name", "")
    location = data.get("location", "")
    district = data.get("district", "")
    village = data.get("village", "")

    db.execute(
        """
        UPDATE farmers
        SET farmer_name = ?,
            locality = ?,
            district = ?,
            village = ?
        WHERE farmer_id = ?
        """,
        (
            farmer_name,
            location,
            district,
            village,
            farmer_id
        )
    )

    db.commit()
    db.close()

    return jsonify({
        "message": "Farmer information updated successfully"
    })


@app.route("/api/farmer/<int:farmer_id>")
def get_farmer(farmer_id):
    db = get_db()

    farmer = db.execute(
        "SELECT * FROM farmers WHERE farmer_id = ?",
        (farmer_id,)
    ).fetchone()

    print("FARMER COLUMNS:", [
        row["name"]
        for row in db.execute("PRAGMA table_info(farmers)").fetchall()
    ])

    print("FARMER DATA:", dict(farmer))

    db.close()

    if farmer is None:
        return jsonify({"error": "Farmer not found"}), 404

    return jsonify(dict(farmer))

@app.route("/api/farm/<int:farm_id>")
def get_farm(farm_id):
    db = get_db()

    farm = db.execute(
        "SELECT * FROM farms WHERE farm_id = ?",
        (farm_id,)
    ).fetchone()

    db.close()

    if farm is None:
        return jsonify({"error": "Farm not found"}), 404

    return jsonify(dict(farm))
@app.route("/api/current-crop/<int:farm_id>")
def get_current_crop(farm_id):
    db = get_db()

    crop = db.execute(
        "SELECT * FROM current_crops WHERE farm_id = ?",
        (farm_id,)
    ).fetchone()

    db.close()

    if crop is None:
        return jsonify({"error": "Current crop not found"}), 404

    return jsonify(dict(crop))
@app.route("/api/dashboard/<int:farmer_id>")
def get_dashboard(farmer_id):

    db = get_db()

    print("SOIL COLUMNS:", [
        row["name"]
        for row in db.execute("PRAGMA table_info(soil_data)").fetchall()
    ])

    # -------------------------
    # Farmer information
    # -------------------------
    farmer = db.execute(
        "SELECT * FROM farmers WHERE farmer_id = ?",
        (farmer_id,)
    ).fetchone()

    print("FARMER DATA:", dict(farmer))

    if not farmer:
        db.close()
        return jsonify({"error": "Farmer not found"}), 404

    # -------------------------
    # Farm information
    # -------------------------
    farm = db.execute(
        "SELECT * FROM farms WHERE farmer_id = ?",
        (farmer_id,)
    ).fetchone()

    if not farm:
        db.close()
        return jsonify({"error": "Farm not found"}), 404

    farm_id = farm["farm_id"]

    # -------------------------
    # Current crop
    # -------------------------
    current_crop = db.execute(
        """
        SELECT *
        FROM current_crops
        WHERE farm_id = ?
        ORDER BY crop_id ASC
        LIMIT 1
        """,
        (farm_id,)
    ).fetchone()

    # -------------------------
    # Latest soil information
    # -------------------------
    soil = db.execute(
        """
        SELECT *
        FROM soil_data
        WHERE farm_id = ?
        ORDER BY soil_id DESC
        LIMIT 1
        """,
        (farm_id,)
    ).fetchone()

    # -------------------------
    # Soil history
    # -------------------------
    soil_history = db.execute(
    """
    SELECT *
    FROM soil_history
    WHERE farm_id = ?
    GROUP BY farm_id, recorded_date, soil_type, soil_ph
    ORDER BY recorded_date DESC, soil_history_id DESC
    """,
    (farm_id,)
).fetchall()
    # -------------------------
    # Latest water information
    # -------------------------
    water = db.execute(
        """
        SELECT *
        FROM water_data
        WHERE farm_id = ?
        ORDER BY water_id DESC
        LIMIT 1
        """,
        (farm_id,)
    ).fetchone()

    # -------------------------
    # Previous crop history
    # -------------------------
    crop_history = db.execute(
        """
        SELECT *
        FROM crop_history
        WHERE farm_id = ?
        ORDER BY crop_history_id DESC
        """,
        (farm_id,)
    ).fetchall()

    # -------------------------
    # Harvest history
    # -------------------------
    harvest_history = db.execute(
        """
        SELECT *
        FROM harvest_history
        WHERE farm_id = ?
        ORDER BY harvest_date DESC, harvest_id DESC
        """,
        (farm_id,)
    ).fetchall()

    # -------------------------
    # Farm resources
    # -------------------------
    resources = db.execute(
        """
        SELECT *
        FROM farm_resources
        WHERE farm_id = ?
        ORDER BY resource_id DESC
        """,
        (farm_id,)
    ).fetchall()

    # -------------------------
    # Fertilizer & pesticide records
    # -------------------------
    fertilizer_pesticide = db.execute(
        """
        SELECT *
        FROM fertilizer_pesticide
        WHERE farm_id = ?
        ORDER BY recorded_date DESC, record_id DESC
        """,
        (farm_id,)
    ).fetchall()

    # -------------------------
    # Cultivation day calculation
    # -------------------------
    cultivation_day = None

    if current_crop and current_crop["planting_date"]:
        from datetime import datetime

        try:
            planting_date = datetime.strptime(
                current_crop["planting_date"],
                "%Y-%m-%d"
            ).date()

            today = datetime.today().date()

            cultivation_day = max(
                0,
                (today - planting_date).days + 1
            )

        except ValueError:
            cultivation_day = None

    # -------------------------
    # Send everything to frontend
    # -------------------------
    result = {
        "farmer": dict(farmer),
        "farm": dict(farm),
        "current_crop": dict(current_crop) if current_crop else None,
        "cultivation_day": cultivation_day,
        "soil": dict(soil) if soil else None,
        "soil_history": [
            dict(row) for row in soil_history
        ],
        "water": dict(water) if water else None,
        "crop_history": [
            dict(row) for row in crop_history
        ],
        "harvest_history": [
            dict(row) for row in harvest_history
        ],
        "resources": [
            dict(row) for row in resources
        ],
        "fertilizer_pesticide": [
            dict(row) for row in fertilizer_pesticide
        ]
    }

    db.close()

    return jsonify(result)

@app.route("/api/weather/<city>")
def get_weather(city):
    api_key = os.getenv("OPENWEATHER_API_KEY")

    params = urllib.parse.urlencode({
        "q": city,
        "appid": api_key,
        "units": "metric"
    })

    url = "https://api.openweathermap.org/data/2.5/weather?" + params

    with urllib.request.urlopen(url) as response:
        data = json.loads(response.read().decode())

    return jsonify(data)

@app.route("/api/current-crop/update", methods=["PUT"])
def update_current_crop():
    data = request.json
    db = get_db()

    # Get the existing current crop before changing it
    old_crop = db.execute(
        "SELECT * FROM current_crops WHERE crop_id = ?",
        (data["crop_id"],)
    ).fetchone()

    # If the crop is actually being changed, save the old crop as history
    if old_crop and old_crop["current_crop"] != data["current_crop"]:
        db.execute(
            """
            INSERT INTO crop_history (
                farm_id,
                crop_name,
                cultivation_start_date,
                cultivation_end_date,
                cultivated_area,
                harvest_quantity,
                yield,
                residue_generated
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                old_crop["farm_id"],
                old_crop["current_crop"],
                old_crop["planting_date"],
                data["planting_date"],
                old_crop["cultivated_area"],
                None,
                None,
                None
            )
        )

    # Update the current crop
    db.execute(
        """
        UPDATE current_crops
        SET current_crop = ?,
            planting_date = ?,
            expected_harvest_date = ?,
            cultivated_area = ?,
            crop_season = ?,
            crop_status = ?
        WHERE crop_id = ?
        """,
        (
            data["current_crop"],
            data["planting_date"],
            data["expected_harvest_date"],
            data["cultivated_area"],
            data["crop_season"],
            data["crop_status"],
            data["crop_id"]
        )
    )

    db.commit()
    db.close()

    return jsonify({"message": "Current crop updated successfully"})
@app.route("/api/water/update", methods=["POST"])
def update_water():
    data = request.json

    db = get_db()

    db.execute(
        """
        INSERT INTO water_data (
            farm_id,
            water_availability,
            water_source,
            irrigation_method,
            rainfall_dependence,
            watering_frequency,
            seasonal_water_issue
        )
        VALUES (?, ?, ?, ?, ?, ?, ?)
        """,
        (
            data["farm_id"],
            data["water_availability"],
            data["water_source"],
            data["irrigation_method"],
            data["rainfall_dependence"],
            data["watering_frequency"],
            data["seasonal_water_issue"]
        )
    )

    db.commit()
    db.close()

    return jsonify({"message": "Water information updated successfully"})


@app.route("/api/soil/update", methods=["POST"])
def update_soil():
    data = request.json
    db = get_db()

    # Get the current/latest soil record
    old_soil = db.execute(
        """
        SELECT *
        FROM soil_data
        WHERE farm_id = ?
        ORDER BY soil_id DESC
        LIMIT 1
        """,
        (data["farm_id"],)
    ).fetchone()

    # Check whether the new information is actually different
    if old_soil:
        new_values = (
            data["soil_type"],
            data["soil_ph"],
            data["nitrogen"],
            data["phosphorus"],
            data["potassium"],
            data["organic_matter"],
            data["soil_moisture"],
            data["soil_health_status"],
            data["source"],
            data["is_estimated"],
            data["recorded_date"]
        )

        old_values = (
            old_soil["soil_type"],
            old_soil["soil_ph"],
            old_soil["nitrogen"],
            old_soil["phosphorus"],
            old_soil["potassium"],
            old_soil["organic_matter"],
            old_soil["soil_moisture"],
            old_soil["soil_health_status"],
            old_soil["source"],
            old_soil["is_estimated"],
            old_soil["recorded_date"]
        )

        # If nothing changed, don't create duplicate records
        if new_values == old_values:
            db.close()
            return jsonify({
                "message": "No changes were made to the soil information"
            })

        # Save the previous soil record into soil history
        db.execute(
            """
            INSERT INTO soil_history (
                farm_id,
                soil_type,
                soil_ph,
                nitrogen,
                phosphorus,
                potassium,
                organic_matter,
                soil_moisture,
                soil_health_status,
                source,
                recorded_date
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                old_soil["farm_id"],
                old_soil["soil_type"],
                old_soil["soil_ph"],
                old_soil["nitrogen"],
                old_soil["phosphorus"],
                old_soil["potassium"],
                old_soil["organic_matter"],
                old_soil["soil_moisture"],
                old_soil["soil_health_status"],
                old_soil["source"],
                old_soil["recorded_date"]
            )
        )

    # Save the new soil record
    db.execute(
        """
        INSERT INTO soil_data (
            farm_id,
            soil_type,
            soil_ph,
            nitrogen,
            phosphorus,
            potassium,
            organic_matter,
            soil_moisture,
            soil_health_status,
            source,
            is_estimated,
            recorded_date
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """,
        (
            data["farm_id"],
            data["soil_type"],
            data["soil_ph"],
            data["nitrogen"],
            data["phosphorus"],
            data["potassium"],
            data["organic_matter"],
            data["soil_moisture"],
            data["soil_health_status"],
            data["source"],
            data["is_estimated"],
            data["recorded_date"]
        )
    )

    db.commit()
    db.close()

    return jsonify({"message": "Soil information updated successfully"})
@app.route("/api/harvest/update", methods=["POST"])
def update_harvest():
    data = request.json
    db = get_db()

    db.execute(
        """
        INSERT INTO harvest_history (
            farm_id,
            crop_id,
            crop_name,
            harvest_date,
            harvest_quantity
        )
        VALUES (?, ?, ?, ?, ?)
        """,
        (
            data["farm_id"],
            data["crop_id"],
            data["crop_name"],
            data["harvest_date"],
            data["harvest_quantity"]
        )
    )

    db.commit()
    db.close()

    return jsonify({"message": "Harvest recorded successfully"})
@app.route("/api/resources/update", methods=["POST"])
def update_resources():
    data = request.json
    db = get_db()

    db.execute(
        """
        INSERT INTO farm_resources (
            farm_id,
            resource_type,
            quantity,
            quantity_unit,
            source,
            usual_use,
            estimated,
            available_for_exchange
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        """,
        (
            data["farm_id"],
            data["resource_type"],
            data["quantity"],
            data["quantity_unit"],
            data["source"],
            data["usual_use"],
            data["estimated"],
            data["available_for_exchange"]
        )
    )

    db.commit()
    db.close()

    return jsonify({"message": "Farm resource recorded successfully"})


@app.route("/api/fertilizer/update", methods=["POST"])
def update_fertilizer():
    data = request.json
    db = get_db()

    db.execute(
        """
        INSERT INTO fertilizer_pesticide (
            farm_id,
            fertilizer_name,
            fertilizer_type,
            organic_manure,
            pesticide_name,
            frequency,
            approximate_quantity,
            quantity_unit,
            additional_info,
            recorded_date
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """,
        (
            data["farm_id"],
            data["fertilizer_name"],
            data["fertilizer_type"],
            data["organic_manure"],
            data["pesticide_name"],
            data["frequency"],
            data["approximate_quantity"],
            data["quantity_unit"],
            data["additional_info"],
            data["recorded_date"]
        )
    )

    db.commit()
    db.close()

    return jsonify({
        "message": "Fertilizer and pesticide information recorded successfully"
    })
@app.route("/api/soil/image", methods=["POST"])
def upload_soil_image():
    farm_id = request.form.get("farm_id")
    image = request.files.get("soil_image")

    if not farm_id or not image:
        return jsonify({
            "error": "Farm ID and soil image are required"
        }), 400

    if image.filename == "":
        return jsonify({
            "error": "No image selected"
        }), 400

    extension = os.path.splitext(image.filename)[1].lower()

    allowed_extensions = [".jpg", ".jpeg", ".png", ".webp"]

    if extension not in allowed_extensions:
        return jsonify({
            "error": "Only JPG, JPEG, PNG and WEBP images are allowed"
        }), 400

    filename = f"farm_{farm_id}_soil{extension}"
    file_path = os.path.join(
        app.config["UPLOAD_FOLDER"],
        filename
    )

    image.save(file_path)

    db = get_db()

    latest_soil = db.execute(
        """
        SELECT soil_id
        FROM soil_data
        WHERE farm_id = ?
        ORDER BY soil_id DESC
        LIMIT 1
        """,
        (farm_id,)
    ).fetchone()

    if not latest_soil:
        db.close()
        return jsonify({
            "error": "No soil record exists for this farm"
        }), 404

    image_path = f"/uploads/soil/{filename}"

    db.execute(
        """
        UPDATE soil_data
        SET soil_image = ?
        WHERE soil_id = ?
        """,
        (image_path, latest_soil["soil_id"])
    )

    db.commit()
    db.close()

    return jsonify({
        "message": "Soil image uploaded successfully",
        "soil_image": image_path
    })


if __name__ == "__main__":
    app.run(debug=True)
