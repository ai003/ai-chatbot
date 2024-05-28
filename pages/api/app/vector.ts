import { openai } from "@/app/openai"
import { NextApiHandler, NextApiRequest, NextApiResponse } from "next"
import { NextResponse } from "next/server"
import fs from 'fs';
import path from 'path';


const vectorStoreId = process.env.VECTOR_STORE_ID || ''
// upload file to assistant's vector store
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { filePath } = req.body;
    
        if (!filePath) {
          return ({ error: 'No file path provided' });
        }
    
        try {
          // Ensure the file stream is created correctly
          const fileStream = fs.createReadStream(path.resolve(filePath));
    
          // Create a vector store including the uploaded file
          let vectorStore = await openai.beta.vectorStores.create({
            name: 'Uploaded Files',
          })
    
          // Upload the file stream to the vector store
          await openai.beta.vectorStores.fileBatches.uploadAndPoll(vectorStore.id, {
            files: [fileStream],
          })
    

        } catch (error) {
            console.error('Error uploading file to openai:', error);
            
          }
        
    } else {
        res.status(405).json({ message: 'Method Not Allowed' })
      }
}
