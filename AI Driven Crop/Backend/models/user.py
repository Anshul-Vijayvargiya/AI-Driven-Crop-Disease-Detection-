
from werkzeug.security import generate_password_hash, check_password_hash
from bson.objectid import ObjectId

class User:
    def __init__(self, db):
        self.collection = db["users"]

    def create_user(self, data):
        email = data.get("email")
        password = data.get("password")
        confirm = data.get("confirm_password")
        name = data.get("name")

        if not email or not password or not confirm or not name:
            return None, "All fields are required"

        if password != confirm:
            return None, "Passwords do not match"

        if self.collection.find_one({"email": email}):
            return None, "User already exists"

        hashed_pw = generate_password_hash(password)
        user_doc = {
            "name": name,
            "email": email,
            "password": hashed_pw,
            "role": "farmer"  # default role
        }

        result = self.collection.insert_one(user_doc)
        user_doc["_id"] = str(result.inserted_id)
        del user_doc["password"]
        return user_doc, None

    def authenticate_user(self, email, password):
        user = self.collection.find_one({"email": email})
        if not user or not check_password_hash(user["password"], password):
            return None, "Invalid credentials"

        user["_id"] = str(user["_id"])
        del user["password"]
        return user, None

    def get_user_by_id(self, user_id):
        user = self.collection.find_one({"_id": ObjectId(user_id)})
        if user:
            user["_id"] = str(user["_id"])
            del user["password"]
        return user