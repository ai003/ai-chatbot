import { NextApiRequest, NextApiResponse } from 'next';
import formidable, { Fields, Files } from 'formidable';
import fs from 'fs';
import fetch from 'node-fetch';

export const config = {
  api: {
    bodyParser: false,
  },
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const form = new formidable.IncomingForm();

    form.parse(req, async (err: any, fields: Fields, files: Files) => {
      if (err) {
        res.status(500).json({ message: 'Error parsing the files' });
        return;
      }

      const file = files.file as formidable.File | formidable.File[];
      const vectorStoreIdArray = fields.vector_store_id as string[] | undefined;

      if (!file) {
        res.status(400).json({ message: 'No file uploaded' });
        return;
      }

      if (!vectorStoreIdArray || vectorStoreIdArray.length === 0) {
        res.status(400).json({ message: 'No vector store ID provided' });
        return;
      }

      const vectorStoreId = vectorStoreIdArray[0];

      const fileToProcess = Array.isArray(file) ? file[0] : file;

      try {
        // Read the file content
        const filePath = (fileToProcess as formidable.File).filepath;
        const fileContent = fs.readFileSync(filePath, 'utf-8');

        // Prepare form data for upload
        const formData = new FormData();
        formData.append('file', new Blob([fileContent], { type: 'text/plain' }));
        formData.append('vector_store_id', vectorStoreId);

        // Convert FormData to URLSearchParams
        const urlSearchParams = new URLSearchParams();
        formData.forEach((value, key) => {
          urlSearchParams.append(key, value as string);
        });

        // Upload the file to OpenAI
        const uploadResponse = await fetch('http://localhost:8000/upload_to_vector_store/', {
          method: 'POST',
          body: urlSearchParams
        })

        const data = await uploadResponse.json();
        res.status(200).json(data);
      } catch (error) {
        console.error('Error uploading file to OpenAI:', error);
        res.status(500).json({ message: 'Error processing or parsing file' });
      }
    });
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
};

export default handler;
