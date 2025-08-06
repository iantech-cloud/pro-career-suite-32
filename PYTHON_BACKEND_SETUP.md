# Python Backend Setup Guide

This document provides instructions for setting up the Python backend for the Career Tools application.

## Recommended Framework: FastAPI

FastAPI is recommended for this project due to its:
- High performance (comparable to Node.js)
- Automatic API documentation generation
- Built-in data validation with Pydantic
- Async/await support
- Easy integration with databases

## Project Structure
```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py
│   ├── config.py
│   ├── database.py
│   ├── models/
│   │   ├── __init__.py
│   │   ├── user.py
│   │   ├── cv.py
│   │   └── job.py
│   ├── routes/
│   │   ├── __init__.py
│   │   ├── auth.py
│   │   ├── cv.py
│   │   ├── jobs.py
│   │   └── social.py
│   ├── services/
│   │   ├── __init__.py
│   │   ├── auth_service.py
│   │   ├── cv_service.py
│   │   └── job_service.py
│   └── utils/
│       ├── __init__.py
│       ├── security.py
│       └── helpers.py
├── requirements.txt
├── .env
└── README.md
```

## Required Dependencies
```
fastapi==0.104.1
uvicorn[standard]==0.24.0
sqlalchemy==2.0.23
alembic==1.12.1
pydantic==2.5.0
python-jose[cryptography]==3.3.0
passlib[bcrypt]==1.7.4
python-multipart==0.0.6
aiofiles==23.2.1
python-decouple==3.8
psycopg2-binary==2.9.9
redis==5.0.1
celery==5.3.4
stripe==7.8.0
boto3==1.34.0
```

## Environment Variables
```
# Database
DATABASE_URL=postgresql://user:password@localhost/career_tools
REDIS_URL=redis://localhost:6379

# JWT
SECRET_KEY=your-secret-key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7

# API Keys
STRIPE_API_KEY=sk_test_...
OPENAI_API_KEY=sk-...
SENDGRID_API_KEY=SG...

# CORS
ALLOWED_ORIGINS=http://localhost:5173,https://yourdomain.com
```

## Main Application Setup (main.py)
```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from app.routes import auth, cv, jobs, social
from app.config import settings

app = FastAPI(
    title="Career Tools API",
    description="Backend API for Career Tools application",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(cv.router, prefix="/api/cvs", tags=["cvs"])
app.include_router(jobs.router, prefix="/api/jobs", tags=["jobs"])
app.include_router(social.router, prefix="/api/social", tags=["social"])

@app.get("/")
async def root():
    return {"message": "Career Tools API"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
```

## Running the Server
```bash
# Development
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Production
uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4
```

## API Documentation
FastAPI automatically generates interactive API documentation at:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Database Setup
The application expects PostgreSQL as the primary database. You can also use SQLite for development.

## Deployment
Recommended deployment options:
1. **Railway** - Simple Python deployment
2. **Heroku** - Traditional PaaS
3. **DigitalOcean App Platform** - Container-based deployment
4. **AWS EC2** - Full control deployment

## Frontend Integration
The frontend is configured to connect to your Python backend at `http://localhost:8000/api`. Update the `.env` file in the frontend if needed.