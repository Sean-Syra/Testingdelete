from sqlalchemy import create_engine, MetaData, Table, Column, Integer, String, Float, DateTime, Text, ForeignKey
import databases
from datetime import datetime

# Replace with your actual database URL
DATABASE_URL = "mysql+aiomysql://root:@localhost/pocassessments"
SYNC_DATABASE_URL = "mysql+pymysql://root:@localhost/pocassessments"

# Create async database instance
database = databases.Database(DATABASE_URL)

# Create engine with proper pooling configuration for synchronous operations (like init_db)
sync_engine = create_engine(
    SYNC_DATABASE_URL,
    pool_size=5,
    max_overflow=10,
    pool_pre_ping=True,
    connect_args={'connect_timeout': 10}
)
metadata = MetaData()

# Define Users table
users_table = Table(
    'users',
    metadata,
    Column('id', Integer, primary_key=True, autoincrement=True),
    Column('user_id', String(255), unique=True, nullable=False),
    Column('name', String(255), nullable=False),
    Column('email', String(255), unique=True, nullable=False),
    Column('created_at', DateTime, default=datetime.utcnow),
)

# Define Assessments table
assessments_table = Table(
    'assessments',
    metadata,
    Column('id', Integer, primary_key=True, autoincrement=True),
    Column('user_id', String(255), ForeignKey('users.user_id'), nullable=False),
    Column('assessment_type', String(100), nullable=False),
    Column('phq9_score', Integer, nullable=False),
    Column('gad7_score', Integer, nullable=False),
    Column('phq9_severity', String(50), nullable=False),
    Column('gad7_severity', String(50), nullable=False),
    Column('depression_severity', String(50), nullable=False),
    Column('anxiety_severity', String(50), nullable=False),
    Column('insomnia_severity', String(50), nullable=False),
    Column('anger_severity', String(50), nullable=False),
    Column('responses_json', Text, nullable=False),
    Column('created_at', DateTime, default=datetime.utcnow),
)

# Define Responses table (for individual question responses)
responses_table = Table(
    'responses',
    metadata,
    Column('id', Integer, primary_key=True, autoincrement=True),
    Column('assessment_id', Integer, ForeignKey('assessments.id'), nullable=False),
    Column('question_id', Integer, nullable=False),
    Column('response_text', String(255), nullable=False),
    Column('response_value', Integer, nullable=False),
    Column('created_at', DateTime, default=datetime.utcnow),
)

# Define Questions table
questions_table = Table(
    'questions',
    metadata,
    Column('id', Integer, primary_key=True, autoincrement=True),
    Column('question_text', Text, nullable=False),
    Column('question_type', String(50), nullable=False),
    Column('created_at', DateTime, default=datetime.utcnow),
)

def init_db():
    """Create all tables in the database"""
    metadata.create_all(sync_engine)
    print("Database tables created successfully.")

def get_connection():
    """Get a database connection"""
    return sync_engine.connect()

