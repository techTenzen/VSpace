from langchain_community.vectorstores import FAISS
from langchain.embeddings.base import Embeddings
from langchain_core.documents import Document

session_vector_stores = {}

def init_vector_store(session_id, embedding_model: Embeddings):
    """Initializes a FAISS vector store for a session."""
    global session_vector_stores
    if session_id not in session_vector_stores:
        session_vector_stores[session_id] = FAISS.from_texts(["dummy"], embedding_model)
    return session_vector_stores[session_id]

def add_json_to_vector(session_id, data):
    global session_vector_stores
    if session_id in session_vector_stores:
        if not data:
            return
        docs = [Document(page_content=doc) for doc in data]
        session_vector_stores[session_id].add_documents(docs)

def retrieve_json_from_vector(session_id, question, k=4):
    global session_vector_stores
    if session_id in session_vector_stores:
        retrieved_docs = session_vector_stores[session_id].similarity_search(question, k=k)
        if retrieved_docs:
            return "\n\n".join([doc.page_content for doc in retrieved_docs])
    return "No relevant information found in the JSON data."
