import bcrypt
from flask import Blueprint, request, jsonify
from mongo_client import users_collection

auth_bp = Blueprint('auth', __name__)

def verify_user(email, password):
    user = users_collection.find_one({"email": email})
    if user and bcrypt.checkpw(password.encode("utf-8"), user["password"]):
        return True
    return False

@auth_bp.route('/login', methods=['POST', 'OPTIONS'])
def login():
    if request.method == 'OPTIONS':  # Handling CORS preflight request
        return jsonify({'message': 'CORS preflight check'}), 200
    
    data = request.json
    email = data.get('email')
    password = data.get('password')
    
    if not email or not password:
        return jsonify({"detail": "Email and password are required"}), 400

    if verify_user(email, password):
        return jsonify({"message": "Login successful"}), 200
    else:
        return jsonify({"detail": "Invalid credentials"}), 401

@auth_bp.route('/signup', methods=['POST', 'OPTIONS'])
def signup():
    data = request.json
    user_id = data.get('id')
    first_name = data.get('firstName')
    last_name = data.get('lastName')
    email = data.get('email')
    password = data.get('password')
    location = data.get('location')
    created_at = data.get('created_at')

    print(f'User ID: {user_id} First Name: {first_name} Last Name: {last_name} Email: {email} Password: {password} Location: {location} Created At: {created_at}')

    if users_collection.find_one({"email": email}):
        return jsonify({"detail": "User already exists"}), 409

    hashed_password = bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt())
    users_collection.insert_one({
        "id": user_id,
        "name": f"{first_name} {last_name}",
        "email": email,
        "password": hashed_password,
        "location": location,
        "created_at": created_at,
    })

    return jsonify({"message": "Sign-Up successful"}), 201