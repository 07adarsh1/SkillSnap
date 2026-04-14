import uuid
import json
from typing import Any, Dict, List

import firebase_admin
from firebase_admin import credentials, firestore

from core.config import get_settings

settings = get_settings()


class MockCursor:
    def __init__(self, data: List[Dict[str, Any]]):
        self.data = data

    def sort(self, key: str, direction: int):
        reverse = direction == -1
        self.data.sort(key=lambda x: x.get(key) or "", reverse=reverse)
        return self

    async def to_list(self, length: int):
        return self.data[:length]


class MockCollection:
    def __init__(self):
        self.data: List[Dict[str, Any]] = []

    async def insert_one(self, document: Dict[str, Any]):
        self.data.append(document)
        return True

    async def find_one(self, query: Dict[str, Any]):
        for doc in self.data:
            if _matches_query(doc, query):
                return doc
        return None

    async def update_one(self, query: Dict[str, Any], update: Dict[str, Any]):
        doc = await self.find_one(query)
        if doc and "$set" in update:
            doc.update(update["$set"])
        return True

    def find(self, query: Dict[str, Any]):
        results = [doc for doc in self.data if _matches_query(doc, query)]
        return MockCursor(results)

    async def delete_one(self, query: Dict[str, Any]):
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
        self.collections: Dict[str, MockCollection] = {}

    def __getitem__(self, name: str):
        if name not in self.collections:
            self.collections[name] = MockCollection()
        return self.collections[name]


def _matches_query(doc: Dict[str, Any], query: Dict[str, Any]) -> bool:
    if not query:
        return True

    for key, value in query.items():
        if key == "$or":
            if not isinstance(value, list):
                return False
            return any(_matches_query(doc, condition) for condition in value)

        if doc.get(key) != value:
            return False

    return True


class FirestoreCursor:
    def __init__(self, data: List[Dict[str, Any]]):
        self.data = data

    def sort(self, key: str, direction: int):
        reverse = direction == -1
        self.data.sort(key=lambda x: x.get(key) or "", reverse=reverse)
        return self

    async def to_list(self, length: int):
        return self.data[:length]


class FirestoreCollection:
    def __init__(self, collection_ref):
        self.collection_ref = collection_ref

    async def insert_one(self, document: Dict[str, Any]):
        document_id = str(document.get("id") or uuid.uuid4())
        payload = dict(document)
        payload["id"] = document_id
        self.collection_ref.document(document_id).set(payload)
        return True

    async def find_one(self, query: Dict[str, Any]):
        for doc in self.collection_ref.stream():
            data = doc.to_dict() or {}
            if _matches_query(data, query):
                return data
        return None

    async def update_one(self, query: Dict[str, Any], update: Dict[str, Any]):
        target = await self.find_one(query)
        if not target:
            return False

        updates = update.get("$set", {})
        if not updates:
            return False

        doc_id = str(target.get("id"))
        if not doc_id:
            return False

        self.collection_ref.document(doc_id).update(updates)
        return True

    def find(self, query: Dict[str, Any]):
        results: List[Dict[str, Any]] = []
        for doc in self.collection_ref.stream():
            data = doc.to_dict() or {}
            if _matches_query(data, query):
                results.append(data)
        return FirestoreCursor(results)

    async def delete_one(self, query: Dict[str, Any]):
        target = await self.find_one(query)

        class DeleteResult:
            deleted_count = 0

        result = DeleteResult()
        if target and target.get("id"):
            self.collection_ref.document(str(target["id"])).delete()
            result.deleted_count = 1
        return result


class FirestoreDatabase:
    def __init__(self, client):
        self.client = client

    def __getitem__(self, name: str):
        return FirestoreCollection(self.client.collection(name))


class FirebaseDB:
    app = None
    db = None

    async def connect_to_database(self):
        print("Connecting to Firebase Firestore...")
        try:
            if not firebase_admin._apps:
                if settings.FIREBASE_CREDENTIALS_JSON:
                    cred_info = json.loads(settings.FIREBASE_CREDENTIALS_JSON)
                    cred = credentials.Certificate(cred_info)
                    self.app = firebase_admin.initialize_app(
                        cred,
                        {"projectId": settings.FIREBASE_PROJECT_ID},
                    )
                elif settings.FIREBASE_CREDENTIALS_PATH:
                    cred = credentials.Certificate(settings.FIREBASE_CREDENTIALS_PATH)
                    self.app = firebase_admin.initialize_app(
                        cred,
                        {"projectId": settings.FIREBASE_PROJECT_ID},
                    )
                else:
                    # Uses Application Default Credentials when service account path is not provided.
                    self.app = firebase_admin.initialize_app(
                        options={"projectId": settings.FIREBASE_PROJECT_ID}
                    )
            else:
                self.app = firebase_admin.get_app()

            client = firestore.client(app=self.app)
            self.db = FirestoreDatabase(client)
            print("Successfully connected to Firebase Firestore!")
        except Exception as e:
            print(f"Unable to connect to Firebase Firestore: {e}")
            print("WARNING: using In-Memory Mock Database for demonstration.")
            self.db = MockDatabase()

    async def close_database_connection(self):
        print("Closing Firebase connection")


db = FirebaseDB()


async def get_database():
    return db.db
