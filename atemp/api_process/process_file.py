from typing import Required
import openai
import dotenv
import sys
import json

Required('dotenv').config()
# Set your OpenAI API key
openai.api_key = process.env.OPENAI_API_KEY

def process_file(file_path):
    # Create the assistant (assuming you have a method for this)
    assistant = openai.Assistant.create(name="My Assistant")

    # Upload the file to OpenAI
    with open(file_path, 'rb') as file:
        response = assistant.files.upload(file=file)
    # upload_response = openai.file.create(
    #         file=content,
    #         purpose="assistants"
    #     )

    # Return the response
    return response

if __name__ == "__main__":
    file_path = sys.argv[1]
    response = process_file(file_path)
    print(json.dumps(response))
