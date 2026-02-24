#!/usr/bin/env python
"""
Quick diagnostic script for backend issues
"""
import sys
import asyncio
import json
from datetime import datetime

print("=" * 60)
print("BACKEND DIAGNOSTIC TEST")
print("=" * 60)

# Test 1: Import modules
print("\n[1/5] Testing imports...")
try:
    from database import DATABASE_URL, SYNC_DATABASE_URL
    from models import Item2
    print("✓ Imports successful")
except Exception as e:
    print(f"✗ Import failed: {e}")
    sys.exit(1)

# Test 2: Check database URL
print("\n[2/5] Checking database configuration...")
print(f"  Database URL: {DATABASE_URL}")
print("  (Should be: mysql+aiomysql://root:@localhost/pocassessments)")

# Test 3: Test MySQL connection
print("\n[3/5] Testing MySQL connection...")
try:
    from sqlalchemy import create_engine, text
    engine = create_engine(SYNC_DATABASE_URL, connect_args={'connect_timeout': 5})
    with engine.connect() as conn:
        result = conn.execute(text("SELECT 1"))
        print("✓ MySQL connection successful")
except Exception as e:
    print(f"✗ MySQL connection failed: {e}")
    print("  → Make sure MySQL is running and 'pocassessments' database exists")

# Test 4: Test async database
print("\n[4/5] Testing async database connection...")
async def test_async_db():
    try:
        import databases
        db = databases.Database(DATABASE_URL, min_size=1, max_size=5)
        await db.connect()
        result = await db.fetch_one("SELECT 1")
        await db.disconnect()
        print("✓ Async database connection successful")
        return True
    except Exception as e:
        print(f"✗ Async database failed: {e}")
        return False

asyncio.run(test_async_db())

# Test 5: Test API payload
print("\n[5/5] Testing API payload validation...")
try:
    test_payload = {
        "user_id": "test@example.com",
        "user_name": "Test User",
        "user_email": "test@example.com",
        "assessment_type": "PHQ9_GAD7",
        "responses_json": [1, 1, 2, 3, 2, 1, 1, 0, 0, 1, 1, 2, 1, 1, 3, 1],
        "phq9_score": 11,
        "gad7_score": 10,
        "phq9_severity": "Moderate",
        "gad7_severity": "Moderate",
        "depression_severity": "Moderate",
        "anxiety_severity": "Moderate",
        "insomnia_severity": "Moderate",
        "anger_severity": "Severe"
    }
    item = Item2(**test_payload)
    print("✓ API payload validation successful")
except Exception as e:
    print(f"✗ Payload validation failed: {e}")

print("\n" + "=" * 60)
print("DIAGNOSTIC COMPLETE")
print("=" * 60)
print("\nNext steps:")
print("1. Ensure MySQL is running (port 3306)")
print("2. Create database: CREATE DATABASE pocassessments;")
print("3. Restart backend: uvicorn main:app --reload")
print("4. Test frontend submission")
