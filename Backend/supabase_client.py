
from supabase import create_client
from dotenv import load_dotenv
import os

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
SECRET_KEY = os.getenv("SECRET_KEY")

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

# Optional: Verify connection (testing connection with a sample query)
def test_connection():
    response = supabase.table("users").select("*").execute()
    if response.status_code == 200:
        print("Connection to Supabase successful!")
    else:
        print(f"Connection failed: {response.error_message}")