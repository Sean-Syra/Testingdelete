from sqlalchemy import create_engine, MetaData

# Replace with your actual database URL
DATABASE_URL = "mysql+pymysql://username:password@localhost/dbname"

engine = create_engine(DATABASE_URL)
metadata = MetaData()

# Add your table definitions here

def init_db():
    metadata.create_all(engine)
