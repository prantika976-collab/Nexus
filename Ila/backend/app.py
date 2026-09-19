from flask import Flask, request, jsonify
import sqlite3

app = Flask(__name__)

DATABASE = "database.db"


@app.after_request
def add_cors(response):
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type"
    response.headers["Access-Control-Allow-Methods"] = "GET, POST"
    return response


def get_db():
    return sqlite3.connect(DATABASE)


def create_tables():

    db = get_db()
    cursor = db.cursor()

    # BUSINESS TABLE
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS business (
            business_id INTEGER PRIMARY KEY AUTOINCREMENT,
            business_name TEXT,
            location TEXT,
            business_type TEXT
        )
    """)

    # FOOD RECORDS TABLE
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS food_records (
            record_id INTEGER PRIMARY KEY AUTOINCREMENT,
            business_id INTEGER,
            date TEXT,
            food_prepared INTEGER,
            food_sold INTEGER,
            food_remaining INTEGER
        )
    """)

    # PRODUCE TABLE
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS produce (
            produce_id INTEGER PRIMARY KEY AUTOINCREMENT,
            produce_type TEXT,
            quantity REAL,
            supplier TEXT,
            location TEXT,
            availability TEXT,
            expected_arrival TEXT
        )
    """)

    # SURPLUS TABLE
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS surplus (
            surplus_id INTEGER PRIMARY KEY AUTOINCREMENT,
            business_id INTEGER,
            surplus_type TEXT,
            quantity REAL,
            date TEXT,
            redistribution_status TEXT
        )
    """)

    # SETTINGS TABLE
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS app_settings (
            setting_name TEXT PRIMARY KEY,
            setting_value TEXT
        )
    """)

    # ADD NEW SURPLUS COLUMNS IF THEY DO NOT EXIST
    cursor.execute("PRAGMA table_info(surplus)")
    surplus_columns = [row[1] for row in cursor.fetchall()]

    if "contact_number" not in surplus_columns:
        cursor.execute("""
            ALTER TABLE surplus
            ADD COLUMN contact_number TEXT
        """)

    if "destination" not in surplus_columns:
        cursor.execute("""
            ALTER TABLE surplus
            ADD COLUMN destination TEXT
        """)

    if "notes" not in surplus_columns:
        cursor.execute("""
            ALTER TABLE surplus
            ADD COLUMN notes TEXT
        """)

    # -------------------------------------------------
    # CREATE BUSINESS DEMO DATA IF BUSINESS TABLE IS EMPTY
    # -------------------------------------------------

    cursor.execute("SELECT COUNT(*) FROM business")
    business_count = cursor.fetchone()[0]

    if business_count == 0:

        cursor.execute("""
            INSERT INTO business
            (
                business_name,
                location,
                business_type
            )
            VALUES (?, ?, ?)
        """, (
            "GreenBite Kitchen",
            "Shillong, Meghalaya",
            "Restaurant & Food Business"
        ))

    # -------------------------------------------------
    # CREATE FOOD DEMO DATA IF FOOD TABLE IS EMPTY
    # -------------------------------------------------

    cursor.execute("SELECT COUNT(*) FROM food_records")
    food_count = cursor.fetchone()[0]

    if food_count == 0:

        cursor.execute("""
            SELECT business_id
            FROM business
            LIMIT 1
        """)

        business = cursor.fetchone()

        if business:

            business_id = business[0]

            cursor.execute("""
                INSERT INTO food_records
                (
                    business_id,
                    date,
                    food_prepared,
                    food_sold,
                    food_remaining
                )
                VALUES (?, ?, ?, ?, ?)
            """, (
                business_id,
                "2026-09-17",
                120,
                100,
                20
            ))

    # -------------------------------------------------
    # CREATE LOCAL PRODUCE DEMO DATA
    # -------------------------------------------------

    cursor.execute("""
        SELECT setting_value
        FROM app_settings
        WHERE setting_name = ?
    """, ("produce_demo_initialized",))

    setting = cursor.fetchone()

    if setting is None:

        cursor.execute("SELECT COUNT(*) FROM produce")
        produce_count = cursor.fetchone()[0]

        if produce_count == 0:

            cursor.executemany("""
                INSERT INTO produce
                (
                    produce_type,
                    quantity,
                    supplier,
                    location,
                    availability,
                    expected_arrival
                )
                VALUES (?, ?, ?, ?, ?, ?)
            """, [

                (
                    "Fresh Ginger",
                    50,
                    "Farmer Name 1",
                    "Sohra, Meghalaya",
                    "Available now",
                    "Available now"
                ),

                (
                    "Fresh Vegetables",
                    30,
                    "Farmer Name 2",
                    "Shillong, Meghalaya",
                    "Available",
                    "Tomorrow"
                ),

                (
                    "Potatoes",
                    40,
                    "Farmer Name 3",
                    "Nongpoh, Meghalaya",
                    "Available now",
                    "Available now"
                ),

                (
                    "Leafy Vegetables",
                    25,
                    "Farmer Name 4",
                    "Mawphlang, Meghalaya",
                    "Available",
                    "Tomorrow"
                ),

                (
                    "Fresh Turmeric",
                    20,
                    "Farmer Name 5",
                    "Mairang, Meghalaya",
                    "Available",
                    "Available now"
                )

            ])

        cursor.execute("""
            INSERT INTO app_settings
            (
                setting_name,
                setting_value
            )
            VALUES (?, ?)
        """, (
            "produce_demo_initialized",
            "true"
        ))

    db.commit()
    db.close()


# -------------------------------------------------
# HOME
# -------------------------------------------------

@app.route("/")
def home():

    return "Business backend is running"


# -------------------------------------------------
# FOOD RECORDS
# -------------------------------------------------

@app.route("/food", methods=["POST"])
def add_food():

    data = request.json

    try:

        prepared = int(data["food_prepared"])
        sold = int(data["food_sold"])

    except (KeyError, TypeError, ValueError):

        return jsonify({
            "error": "Invalid food quantity"
        }), 400

    if prepared < 0 or sold < 0:

        return jsonify({
            "error": "Food quantity cannot be negative"
        }), 400

    if sold > prepared:

        return jsonify({
            "error": "Sold food cannot be greater than prepared food"
        }), 400

    remaining = prepared - sold

    db = get_db()
    cursor = db.cursor()

    cursor.execute("""
        INSERT INTO food_records
        (
            business_id,
            date,
            food_prepared,
            food_sold,
            food_remaining
        )
        VALUES (?, ?, ?, ?, ?)
    """, (
        data["business_id"],
        data["date"],
        prepared,
        sold,
        remaining
    ))

    db.commit()
    db.close()

    return jsonify({
        "message": "Food record saved",
        "food_remaining": remaining
    })


@app.route("/food/<int:business_id>", methods=["GET"])
def get_food(business_id):

    db = get_db()
    cursor = db.cursor()

    cursor.execute("""
        SELECT
            record_id,
            business_id,
            date,
            food_prepared,
            food_sold,
            food_remaining
        FROM food_records
        WHERE business_id = ?
        ORDER BY record_id DESC
    """, (business_id,))

    rows = cursor.fetchall()

    db.close()

    records = []

    for row in rows:

        records.append({
            "record_id": row[0],
            "business_id": row[1],
            "date": row[2],
            "food_prepared": row[3],
            "food_sold": row[4],
            "food_remaining": row[5]
        })

    return jsonify(records)


# -------------------------------------------------
# AVERAGE DEMAND
# -------------------------------------------------

@app.route("/food/average/<int:business_id>", methods=["GET"])
def average_food(business_id):

    db = get_db()
    cursor = db.cursor()

    cursor.execute("""
        SELECT AVG(food_sold)
        FROM food_records
        WHERE business_id = ?
    """, (business_id,))

    result = cursor.fetchone()

    db.close()

    if result[0] is None:

        return jsonify({
            "average_sold": None
        })

    return jsonify({
        "average_sold": round(result[0], 1)
    })


# -------------------------------------------------
# LOCAL PRODUCE
# -------------------------------------------------

@app.route("/produce", methods=["GET"])
def get_produce():

    db = get_db()
    cursor = db.cursor()

    cursor.execute("""
        SELECT
            produce_id,
            produce_type,
            quantity,
            supplier,
            location,
            availability,
            expected_arrival
        FROM produce
        ORDER BY produce_id
    """)

    rows = cursor.fetchall()

    db.close()

    produce = []

    for row in rows:

        produce.append({
            "produce_id": row[0],
            "produce_type": row[1],
            "quantity": row[2],
            "supplier": row[3],
            "location": row[4],
            "availability": row[5],
            "expected_arrival": row[6]
        })

    return jsonify(produce)


@app.route("/produce", methods=["POST"])
def add_produce():

    data = request.json

    required_fields = [
        "produce_type",
        "quantity",
        "supplier",
        "location",
        "availability",
        "expected_arrival"
    ]

    for field in required_fields:

        if field not in data:

            return jsonify({
                "error": f"Missing field: {field}"
            }), 400

    try:

        quantity = float(data["quantity"])

    except (TypeError, ValueError):

        return jsonify({
            "error": "Invalid quantity"
        }), 400

    if quantity <= 0:

        return jsonify({
            "error": "Quantity must be greater than zero"
        }), 400

    db = get_db()
    cursor = db.cursor()

    cursor.execute("""
        INSERT INTO produce
        (
            produce_type,
            quantity,
            supplier,
            location,
            availability,
            expected_arrival
        )
        VALUES (?, ?, ?, ?, ?, ?)
    """, (
        data["produce_type"],
        quantity,
        data["supplier"],
        data["location"],
        data["availability"],
        data["expected_arrival"]
    ))

    db.commit()

    produce_id = cursor.lastrowid

    db.close()

    return jsonify({
        "message": "Produce added successfully",
        "produce_id": produce_id
    }), 201


# -------------------------------------------------
# SURPLUS
# -------------------------------------------------

@app.route("/surplus", methods=["POST"])
def add_surplus():

    data = request.json

    required_fields = [
        "business_id",
        "surplus_type",
        "quantity",
        "date",
        "redistribution_status"
    ]

    for field in required_fields:

        if field not in data:

            return jsonify({
                "error": f"Missing field: {field}"
            }), 400

    try:

        quantity = float(data["quantity"])

    except (TypeError, ValueError):

        return jsonify({
            "error": "Invalid surplus quantity"
        }), 400

    if quantity <= 0:

        return jsonify({
            "error": "Surplus quantity must be greater than zero"
        }), 400

    contact_number = data.get("contact_number", "")
    destination = data.get("destination", "")
    notes = data.get("notes", "")

    db = get_db()
    cursor = db.cursor()

    cursor.execute("""
        INSERT INTO surplus
        (
            business_id,
            surplus_type,
            quantity,
            date,
            redistribution_status,
            contact_number,
            destination,
            notes
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        data["business_id"],
        data["surplus_type"],
        quantity,
        data["date"],
        data["redistribution_status"],
        contact_number,
        destination,
        notes
    ))

    db.commit()

    surplus_id = cursor.lastrowid

    db.close()

    return jsonify({
        "message": "Surplus recorded successfully",
        "surplus_id": surplus_id
    }), 201


@app.route("/surplus/<int:business_id>", methods=["GET"])
def get_surplus(business_id):

    db = get_db()
    cursor = db.cursor()

    cursor.execute("""
        SELECT
            surplus_id,
            business_id,
            surplus_type,
            quantity,
            date,
            redistribution_status,
            contact_number,
            destination,
            notes
        FROM surplus
        WHERE business_id = ?
        ORDER BY surplus_id DESC
    """, (business_id,))

    rows = cursor.fetchall()

    db.close()

    records = []

    for row in rows:

        records.append({
            "surplus_id": row[0],
            "business_id": row[1],
            "surplus_type": row[2],
            "quantity": row[3],
            "date": row[4],
            "redistribution_status": row[5],
            "contact_number": row[6],
            "destination": row[7],
            "notes": row[8]
        })

    return jsonify(records)


# -------------------------------------------------
# RUN SERVER
# -------------------------------------------------

if __name__ == "__main__":

    create_tables()

    app.run(
        host="127.0.0.1",
        port=5000,
        debug=True
    )
