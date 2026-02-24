#!/usr/bin/env python
"""
Test script to verify database connection
"""

import asyncio
import databases
from database import DATABASE_URL, SYNC_DATABASE_URL, init_db
from sqlalchemy import create_engine, text

def test_sync_connection():
    """Test synchronous connection"""
    print("Testing synchronous connection...")
    try:
        engine = create_engine(SYNC_DATABASE_URL, connect_args={'connect_timeout': 5})
        with engine.connect() as conn:
            result = conn.execute(text("SELECT 1"))
            print("✓ Synchronous connection successful!")
            return True
    except Exception as e:
        print(f"✗ Synchronous connection failed: {e}")
        return False

async def test_async_connection():
    """Test asynchronous connection"""
    print("\nTesting asynchronous connection...")
    try:
        database = databases.Database(DATABASE_URL, min_size=1, max_size=5)
        await database.connect()
        result = await database.fetch_one("SELECT 1")
        await database.disconnect()
        print("✓ Asynchronous connection successful!")
        return True
    except Exception as e:
        print(f"✗ Asynchronous connection failed: {e}")
        return False

def test_tables():
    """Test if tables exist"""
    print("\nChecking database tables...")
    try:
        init_db()
        engine = create_engine(SYNC_DATABASE_URL)
        with engine.connect() as conn:
            # Check tables
            tables = ['users', 'assessments', 'responses', 'questions']
            for table_name in tables:
                result = conn.execute(text(f"SELECT 1 FROM information_schema.tables WHERE table_schema='pocassessments' AND table_name='{table_name}'"))
                if result.fetchone():
                    print(f"  ✓ Table '{table_name}' exists")
                else:
                    print(f"  ⚠ Table '{table_name}' not found (will be created)")
        return True
    except Exception as e:
        print(f"✗ Table check failed: {e}")
        return False

if __name__ == "__main__":
    print("=" * 50)
    print("Database Connection Test")
    print("=" * 50)
    
    sync_ok = test_sync_connection()
    async_ok = asyncio.run(test_async_connection())
    tables_ok = test_tables()
    
    print("\n" + "=" * 50)
    if sync_ok and async_ok and tables_ok:
        print("✓ All tests passed! Database is ready.")
    else:
        print("✗ Some tests failed. Please check your database setup.")
        if not (sync_ok and async_ok):
            print("\nCommon issues:")
            print("1. MySQL server is not running")
            print("2. Database 'pocassessments' does not exist")
            print("3. User 'root' doesn't have the correct password (should be empty)")
            print("\nTo create the database, run:")
            print("  CREATE DATABASE pocassessments;")
    print("=" * 50)
