from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.auth import router as auth_router
from routes.match import router as match_router

app = FastAPI()

# Allow Angular to call the API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:4200"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router, prefix="/auth")
app.include_router(match_router, prefix="/match")

@app.get("/")
def read_root():
    return {"message": "Welcome to the Sketch API!"}

