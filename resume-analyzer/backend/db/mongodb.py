from motor.motor_asyncio import AsyncIOMotorClient
from core.config import get_settings
import certifi

settings = get_settings()

class MongoDB:
    client: AsyncIOMotorClient = None
    db = None

    async def connect_to_database(self):
        print(f"Connecting to MongoDB...")
        # Create a new client and connect to the server
        self.client = AsyncIOMotorClient(
            settings.MONGODB_URL,
            tlsCAFile=certifi.where()
        )
        self.db = self.client[settings.DATABASE_NAME]
        
        # Ping the server to verify connection
        try:
            await self.client.admin.command('ping')
            print("Successfully connected to MongoDB!")
        except Exception as e:
            print(f"Unable to connect to MongoDB: {e}")

    async def close_database_connection(self):
        print("Closing MongoDB connection")
        if self.client:
            self.client.close()

db = MongoDB()

async def get_database():
    return db.db
