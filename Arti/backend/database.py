import sqlite3
from pathlib import Path


# ==============================
# Database Configuration
# ==============================

BASE_DIR = Path(__file__).resolve().parent
DATABASE_PATH = BASE_DIR / "circular_agriculture.db"


# ==============================
# Database Connection
# ==============================

def get_connection():
    """
    Create and return a connection to the SQLite database.
    """
    connection = sqlite3.connect(DATABASE_PATH)

    # Allows us to access columns by name
    connection.row_factory = sqlite3.Row

    return connection


# ==============================
# Create Database Tables
# ==============================

def initialize_database():
    """
    Create all required tables if they do not already exist.
    """

    connection = get_connection()
    cursor = connection.cursor()

    # --------------------------
    # Users Table
    # --------------------------

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            firebase_uid TEXT UNIQUE,
            email TEXT UNIQUE NOT NULL,
            role TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)

    # --------------------------
    # Farmer Profiles Table
    # --------------------------

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS farmer_profiles (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER UNIQUE NOT NULL,
            farmer_name TEXT NOT NULL,
            phone TEXT,
            location TEXT,
            district TEXT,
            village TEXT,
            farm_size REAL,
            farm_unit TEXT,
            farming_type TEXT,
            irrigation TEXT,
            irrigation_source TEXT,
            soil_type TEXT,
            current_crops TEXT,
            previous_crops TEXT,
            FOREIGN KEY (user_id) REFERENCES users(id)
        )
    """)

    # --------------------------
    # Business Profiles Table
    # --------------------------

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS business_profiles (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER UNIQUE NOT NULL,
            business_name TEXT NOT NULL,
            business_type TEXT,
            phone TEXT,
            location TEXT,
            district TEXT,
            locality TEXT,
            produce_required TEXT,
            purchase_frequency TEXT,
            approximate_demand TEXT,
            food_surplus TEXT,
            common_surplus_items TEXT,
            waste_types TEXT,
            waste_quantity TEXT,
            waste_frequency TEXT,
            disposal_method TEXT,
            FOREIGN KEY (user_id) REFERENCES users(id)
        )
    """)

    connection.commit()
    connection.close()


# ==============================
# User Functions
# ==============================

def create_user(firebase_uid, email, role):
    """
    Create a new user account.
    """

    connection = get_connection()
    cursor = connection.cursor()

    cursor.execute("""
        INSERT INTO users (firebase_uid, email, role)
        VALUES (?, ?, ?)
    """, (firebase_uid, email, role))

    connection.commit()

    user_id = cursor.lastrowid

    connection.close()

    return user_id


def get_user_by_email(email):
    """
    Find a user using their email address.
    """

    connection = get_connection()
    cursor = connection.cursor()

    cursor.execute("""
        SELECT * FROM users
        WHERE email = ?
    """, (email,))

    user = cursor.fetchone()

    connection.close()

    return user


# ==============================
# Farmer Functions
# ==============================

def save_farmer_profile(user_id, farmer_data):
    """
    Save or update a farmer's profile.
    """

    connection = get_connection()
    cursor = connection.cursor()

    cursor.execute("""
        INSERT OR REPLACE INTO farmer_profiles (
            user_id,
            farmer_name,
            phone,
            location,
            district,
            village,
            farm_size,
            farm_unit,
            farming_type,
            irrigation,
            irrigation_source,
            soil_type,
            current_crops,
            previous_crops
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        user_id,
        farmer_data.get("farmer_name"),
        farmer_data.get("phone"),
        farmer_data.get("location"),
        farmer_data.get("district"),
        farmer_data.get("village"),
        farmer_data.get("farm_size"),
        farmer_data.get("farm_unit"),
        farmer_data.get("farming_type"),
        farmer_data.get("irrigation"),
        farmer_data.get("irrigation_source"),
        farmer_data.get("soil_type"),
        farmer_data.get("current_crops"),
        farmer_data.get("previous_crops")
    ))

    connection.commit()
    connection.close()


def get_farmer_profile(user_id):
    """
    Retrieve a farmer's profile.
    """

    connection = get_connection()
    cursor = connection.cursor()

    cursor.execute("""
        SELECT * FROM farmer_profiles
        WHERE user_id = ?
    """, (user_id,))

    profile = cursor.fetchone()

    connection.close()

    return profile


# ==============================
# Business Functions
# ==============================

def save_business_profile(user_id, business_data):
    """
    Save or update a business profile.
    """

    connection = get_connection()
    cursor = connection.cursor()

    cursor.execute("""
        INSERT OR REPLACE INTO business_profiles (
            user_id,
            business_name,
            business_type,
            phone,
            location,
            district,
            locality,
            produce_required,
            purchase_frequency,
            approximate_demand,
            food_surplus,
            common_surplus_items,
            waste_types,
            waste_quantity,
            waste_frequency,
            disposal_method
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        user_id,
        business_data.get("business_name"),
        business_data.get("business_type"),
        business_data.get("phone"),
        business_data.get("location"),
        business_data.get("district"),
        business_data.get("locality"),
        business_data.get("produce_required"),
        business_data.get("purchase_frequency"),
        business_data.get("approximate_demand"),
        business_data.get("food_surplus"),
        business_data.get("common_surplus_items"),
        business_data.get("waste_types"),
        business_data.get("waste_quantity"),
        business_data.get("waste_frequency"),
        business_data.get("disposal_method")
    ))

    connection.commit()
    connection.close()


def get_business_profile(user_id):
    """
    Retrieve a business profile.
    """

    connection = get_connection()
    cursor = connection.cursor()

    cursor.execute("""
        SELECT * FROM business_profiles
        WHERE user_id = ?
    """, (user_id,))

    profile = cursor.fetchone()

    connection.close()

    return profile
