from flask import Flask, request, jsonify
from flask_cors import CORS

from database import (
    initialize_database,
    create_user,
    get_user_by_email,
    save_farmer_profile,
    get_farmer_profile,
    save_business_profile,
    get_business_profile
)


# ==============================
# Flask Configuration
# ==============================

app = Flask(__name__)

# Allows frontend requests during development
CORS(app)


# ==============================
# Initialize Database
# ==============================

initialize_database()


# ==============================
# Home Route
# ==============================

@app.route("/", methods=["GET"])
def home():
    return jsonify({
        "message": "Circular Agriculture Platform backend is running."
    })


# ==============================
# Health Check Route
# ==============================

@app.route("/api/health", methods=["GET"])
def health_check():
    return jsonify({
        "status": "success",
        "message": "Backend is working correctly."
    })


# ==============================
# Create User Route
# ==============================

@app.route("/api/users", methods=["POST"])
def register_user():

    data = request.get_json()

    firebase_uid = data.get("firebase_uid")
    email = data.get("email")
    role = data.get("role")

    if not email or not role:
        return jsonify({
            "status": "error",
            "message": "Email and role are required."
        }), 400

    if role not in ["farmer", "business"]:
        return jsonify({
            "status": "error",
            "message": "Role must be farmer or business."
        }), 400

    existing_user = get_user_by_email(email)

    if existing_user:
        return jsonify({
            "status": "success",
            "message": "User already exists.",
            "user_id": existing_user["id"],
            "role": existing_user["role"]
        }), 200

    user_id = create_user(
        firebase_uid=firebase_uid,
        email=email,
        role=role
    )

    return jsonify({
        "status": "success",
        "message": "User created successfully.",
        "user_id": user_id,
        "role": role
    }), 201


# ==============================
# Save Farmer Profile
# ==============================

@app.route("/api/farmers/profile", methods=["POST"])
def register_farmer_profile():

    data = request.get_json()

    user_id = data.get("user_id")

    if not user_id:
        return jsonify({
            "status": "error",
            "message": "User ID is required."
        }), 400

    if not data.get("farmer_name"):
        return jsonify({
            "status": "error",
            "message": "Farmer name is required."
        }), 400

    save_farmer_profile(
        user_id=user_id,
        farmer_data=data
    )

    return jsonify({
        "status": "success",
        "message": "Farmer profile saved successfully."
    }), 201


# ==============================
# Get Farmer Profile
# ==============================

@app.route("/api/farmers/profile/<int:user_id>", methods=["GET"])
def fetch_farmer_profile(user_id):

    profile = get_farmer_profile(user_id)

    if not profile:
        return jsonify({
            "status": "error",
            "message": "Farmer profile not found."
        }), 404

    return jsonify({
        "status": "success",
        "profile": dict(profile)
    })


# ==============================
# Save Business Profile
# ==============================

@app.route("/api/businesses/profile", methods=["POST"])
def register_business_profile():

    data = request.get_json()

    user_id = data.get("user_id")

    if not user_id:
        return jsonify({
            "status": "error",
            "message": "User ID is required."
        }), 400

    if not data.get("business_name"):
        return jsonify({
            "status": "error",
            "message": "Business name is required."
        }), 400

    save_business_profile(
        user_id=user_id,
        business_data=data
    )

    return jsonify({
        "status": "success",
        "message": "Business profile saved successfully."
    }), 201


# ==============================
# Get Business Profile
# ==============================

@app.route("/api/businesses/profile/<int:user_id>", methods=["GET"])
def fetch_business_profile(user_id):

    profile = get_business_profile(user_id)

    if not profile:
        return jsonify({
            "status": "error",
            "message": "Business profile not found."
        }), 404

    return jsonify({
        "status": "success",
        "profile": dict(profile)
    })


# ==============================
# Run Application
# ==============================

if __name__ == "__main__":
    app.run(
        debug=True,
        host="127.0.0.1",
        port=5000
    )
