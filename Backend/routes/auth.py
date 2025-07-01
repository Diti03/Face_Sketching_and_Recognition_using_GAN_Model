from fastapi import APIRouter, HTTPException
from supabase_client import supabase
from models.user_model import UserCreate, UserLogin
from passlib.hash import bcrypt
import jwt
import os
from datetime import datetime, timedelta
from pydantic import BaseModel, EmailStr
import secrets

router = APIRouter()

# Secret key to encode JWT token
SECRET_KEY = os.getenv("SECRET_KEY", "your_secret_key")  # Set your secret key in .env or here
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30  # Set the expiration time of the token (e.g., 30 minutes)

# Function to create JWT token
def create_access_token(data: dict, expires_delta: timedelta = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)):
    to_encode = data.copy()
    expire = datetime.utcnow() + expires_delta
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

# Signup route
@router.post("/signup")
def signup(user: UserCreate):
    # Check if user already exists
    existing_user = supabase.table("users").select("*").eq("email", user.email).execute()
    print("Existing user query result:", existing_user)

    if existing_user.data:
        raise HTTPException(status_code=400, detail="Email already registered.")

    # Hash the password
    hashed_password = bcrypt.hash(user.password)

    # Insert new user
    result = supabase.table("users").insert({
        "username": user.username,
        "first_name": user.first_name,
        "last_name": user.last_name,
        "email": user.email,
        "dob": str(user.dob),
        "mobile_number": user.mobile_number,
        "password": hashed_password
    }).execute()
    print("Insert user result:", result)
    print("Insert user status_code:", getattr(result, 'status_code', None))
    print("Insert user error:", getattr(result, 'error', None))
    print("Insert user data:", getattr(result, 'data', None))

    # Check for errors returned by Supabase
    if getattr(result, 'error', None):
        raise HTTPException(status_code=500, detail=f"Failed to create user: {result.error.message}")
    
    # Return success without exposing the password
    user_data = getattr(result, 'data', [])[0]
    if "password" in user_data:
      del user_data["password"]

    return {
        "message": "User created successfully",
        "data": getattr(result, 'data', None)
    }



# Login route
@router.post("/login")
def login(user: UserLogin):
    # Get user by email
    result = supabase.table("users").select("*").eq("email", user.email).execute()
    
    if not result.data:
        raise HTTPException(status_code=401, detail="Invalid email or password.")

    user_data = result.data[0]

    # Verify the hashed password
    if not bcrypt.verify(user.password, user_data["password"]):
        raise HTTPException(status_code=401, detail="Invalid email or password.")

    # Don't return the password, just user data
    user_data.pop("password", None)

    # Create a JWT token for the user
    access_token = create_access_token(data={"sub": user_data["email"]})

    return {"message": "Login successful", "access_token": access_token, "token_type": "bearer", "user": user_data}

# Reset Token Model
class ForgotPasswordRequest(BaseModel):
    email: EmailStr

class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str

RESET_TOKEN_EXPIRY_MINUTES = 30  # Token is valid for 30 minutes

@router.post("/forgot-password")
def forgot_password(payload: ForgotPasswordRequest):
    email = payload.email
    user = supabase.table("users").select("*").eq("email", email).execute()
    if not user.data:
        raise HTTPException(status_code=404, detail="Email not found")

    # Generate secure token
    token = secrets.token_urlsafe(32)
    expiry_time = datetime.utcnow() + timedelta(minutes=RESET_TOKEN_EXPIRY_MINUTES)

    # Store token and expiry in Supabase (assuming you have a 'password_resets' table)
    supabase.table("password_resets").insert({
        "email": email,
        "token": token,
        "expires_at": expiry_time.isoformat()
    }).execute()

    # You can send this link via real email in production
    print(f"Reset link: http://localhost:4200/reset-password?token={token}")

    return {"message": "Reset link sent (check console for now)"}


@router.post("/reset-password")
def reset_password(payload: ResetPasswordRequest):
    token = payload.token
    new_password = payload.new_password

    reset = supabase.table("password_resets").select("*").eq("token", token).execute()
    if not reset.data:
        raise HTTPException(status_code=400, detail="Invalid or expired token")

    reset_entry = reset.data[0]
    expires_at = datetime.fromisoformat(reset_entry["expires_at"])
    if datetime.utcnow() > expires_at:
        raise HTTPException(status_code=400, detail="Token has expired")

    email = reset_entry["email"]
    hashed_password = bcrypt.hash(new_password)

    # Update user password
    supabase.table("users").update({"password": hashed_password}).eq("email", email).execute()

    # Optionally delete token
    supabase.table("password_resets").delete().eq("token", token).execute()

    return {"message": "Password updated successfully"}
