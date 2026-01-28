
from motor.motor_asyncio import AsyncIOMotorClient
from core.config import get_settings
import certifi

settings = get_settings()

class MockCursor:
    def __init__(self, data):
        self.data = data
        
    def sort(self, key, direction):
        reverse = direction == -1
        # Handle datetime sorting safely
        self.data.sort(key=lambda x: x.get(key) or "", reverse=reverse)
        return self
        
    async def to_list(self, length):
        return self.data[:length]

class MockCollection:
    def __init__(self):
        self.data = []
        
    async def insert_one(self, document):
        self.data.append(document)
        return True
        
    async def find_one(self, query):
        for doc in self.data:
            match = True
            for k, v in query.items():
                if doc.get(k) != v:
                    match = False
                    break
            if match:
                return doc
        return None
        
    async def update_one(self, query, update):
        doc = await self.find_one(query)
        if doc and "$set" in update:
            doc.update(update["$set"])
        return True
        
    def find(self, query):
        results = []
        for doc in self.data:
            match = True
            for k, v in query.items():
                if doc.get(k) != v:
                    match = False
                    break
            if match:
                results.append(doc)
        return MockCursor(results)
    
    async def delete_one(self, query):
        doc = await self.find_one(query)
        class DeleteResult:
            deleted_count = 0
        result = DeleteResult()
        if doc:
            self.data.remove(doc)
            result.deleted_count = 1
        return result

class MockDatabase:
    def __init__(self):
        self.collections = {}
        
    def __getitem__(self, name):
        if name not in self.collections:
            self.collections[name] = MockCollection()
        return self.collections[name]

class MongoDB:
    client: AsyncIOMotorClient = None
    db = None

    async def connect_to_database(self):
        print(f"Connecting to MongoDB...")
        try:
            # Set a shorter timeout for the initial connection
            self.client = AsyncIOMotorClient(
                settings.MONGODB_URL,
                tlsCAFile=certifi.where(),
                serverSelectionTimeoutMS=5000
            )
            self.db = self.client[settings.DATABASE_NAME]
            
            # Ping the server to verify connection
            await self.client.admin.command('ping')
            print("Successfully connected to MongoDB!")
        except Exception as e:
            print(f"Unable to connect to MongoDB: {e}")
            print("⚠️  using In-Memory Mock Database for demonstration.")
            self.db = MockDatabase()

    async def close_database_connection(self):
        print("Closing MongoDB connection")
        if self.client:
            self.client.close()

db = MongoDB()

async def get_database():
    return db.db
