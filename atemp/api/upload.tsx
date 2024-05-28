// import { NextApiRequest, NextApiResponse } from 'next'
// import formidable, { Fields, Files } from 'formidable'
// import fs from 'fs'

// import { spawn } from 'child_process'
// import path from 'path'

// export const config = {
//     api: {
//         bodyParser: false,
//     },
// }

// const handler = (req: NextApiRequest, res: NextApiResponse) => {
//     if (req.method === 'POST') {
//         const form = new formidable.IncomingForm()
//         const uploadDir = path.join(process.cwd(), 'public', 'uploads')

//         //ensure upload directory exists
//         if (!fs.existsSync(uploadDir)) {
//             fs.mkdirSync(uploadDir, { recursive: true }) //if path doesn't exists creates it
//         }

//         form.on('fileBegin', (name, file) => {
//             //ensure the file has an original filename
//             const fileName = file.originalFilename || 'default_filename'
//             file.filepath = path.join(uploadDir, fileName)
//         })

//         form.parse(req, (err, fields, files) => {
//             if (err) {
//                 return res.status(500).json({ error: err.message })
//             }

//             const uploadedFiles = files.file
//             if (!uploadedFiles) {
//                 return res.status(400).json({ error: 'empty' })
//             }

//             //type saftey is multiple files or not
//             const filesArray = Array.isArray(uploadedFiles) ? uploadedFiles : [uploadedFiles]
//             const filesPaths = filesArray.map((file: formidable.File) => file.filepath)
//             console.log('file uploaded successfully')
//             try {
//                 for (const filePath of filesPaths) {
//                     //spawn a new python process
//                     const pythonProcess = spawn('python', [
//                         //path to the Python script execute and arg passed to python script
//                         path.join(process.cwd(), 'api_process', 'process_file'), filePath])

//                     //listening for calls
//                     pythonProcess.stdout.on('data', (data) => {
//                         const result = JSON.parse(data.toString())
//                         res.status(200).json(result)
//                     })

//                     pythonProcess.stderr.on('data', (data) => {
//                         const result = JSON.parse(data.toString())
//                         res.status(500).json({ error: data.toString() })
//                     })
//                 }
//             } catch (error) {
//                 res.status(500).json({ error: 'spawn error' })
//             }

//         })

//     } else {
//         res.status(405).json({ error: 'Method not allowed' })
//     }
// }

// export default handler