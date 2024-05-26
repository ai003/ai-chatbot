// api/upload.ts
import { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import fs from 'fs';
import path from 'path';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const form = new formidable.IncomingForm();
    form.parse(req, async (err, fields, files) => {
        if (err) {
            res.status(500).json({ error: 'Error parsing form data' })
            return
        }
        form.on('fileBegin', (name, file) => {
            //ensure the file has an original filename
            const fileName = file.originalFilename || 'default_filename'
        
    
            const uploadDir = path.join(process.cwd(), 'public', 'uploads'); // Directory to save the uploaded files
            const filePath = path.join(uploadDir, fileName)

            // Ensure upload directory exists
            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir, { recursive: true });
            }

            // Move the uploaded file to the upload directory
            fs.renameSync(filePath, path.join(uploadDir, fileName));
    })
        res.status(200).json({ message: 'File uploaded successfully' });
    });
}
