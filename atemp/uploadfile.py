# from fastapi import FastAPI, File, UploadFile
# import openai
# import uvicorn

# app = FastAPI()

# openai.api_key = 'your_openai_api_key'

# @app.post("/create_vector_store/")
# async def create_vector_store():
#     try:
#         # Create a new vector store
#         vector_store = openai.vector_stores.create(
#             name="Document Describer"
#         )
#         return {"vector_store_id": vector_store['id']}
#     except Exception as e:
#         return {"error": str(e)}

# @app.post("/upload_to_vector_store/")
# async def upload_file(vector_store_id: str, file: UploadFile = File(...)):
#     content = await file.read()

#     try:
#         # Upload the file to OpenAI
#         upload_response = openai.file.create(
#             file=content,
#             purpose="assistants"
#         )

#         # Get the file ID from the upload response
#         file_id = upload_response['id']

#         # Add the file to the vector store
#         file_response = openai.vector_stores.create_and_poll(
#             vector_store_id=vector_store_id,
#             file_id=file_id
#         )

#         return {"file_id": file_id, "file_response": file_response}

#     except Exception as e:
#         return {"error": str(e)}

# if __name__ == "__main__":
#     uvicorn.run(app, host="0.0.0.0", port=8000)
