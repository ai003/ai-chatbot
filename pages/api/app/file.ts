import { NextApiHandler, NextApiRequest } from "next"
import formidable from 'formidable'
import path from 'path'
import fs from 'fs'
import { openai } from '@/app/openai'
import { FormData } from 'formdata-node'
import { fileFromPath } from 'formdata-node/file-from-path'
import { Uploadable } from "openai/uploads"




//disable next js bodyparser
export const config = {
    api: {
        bodyParser: false,
    },
}

//promise version
const readFile = (req: NextApiRequest, saveLocally?: boolean)
    : Promise<{ fields: formidable.Fields, files: formidable.Files }> => { //return type
    const options: formidable.Options = {}
    if (saveLocally) {
        options.uploadDir = path.join(process.cwd(), "/public/files")
        options.filename = (name, ext, path, form) => {//use path if add extensions
            return path.originalFilename || 'default_filename' //to ensure it returns a string
        }
    }
    const form = formidable(options)
    return new Promise((resolve, reject) => {
        form.parse(req, (err, fields, files) => {
            if (err) {
                reject(err)//reject if error
                console.log("made in read file but couldn''t parse", err)

            }
            resolve({ fields, files }) //hold file-s in this object
        })
    })


}


const handler: NextApiHandler = async (req, res) => {
    try {
        await fs.promises.readdir(path.join(process.cwd() + "/public", "/files"))
    } catch (error) {//if no directory create it
        await fs.promises.mkdir(path.join(process.cwd() + "/public", "/files"))
    }



    const { files } = await readFile(req, true)
    res.json({ done: "succesful" })
    
    
    // const file = files.file
    // const filePath = (file as any).filepath || (file as any).path
    // //const fileContent = await readFile(filePath)
    // const fileStreams: fs.ReadStream[] = [filePath];

    // const filePaths: string[] = [/* array of file paths */];

    // const uploadable: Uploadable[] = filePaths.map((filePath) => ({
    //     stream: fs.createReadStream(filePath),
    //     name: file.name,
    //     filename: 'filename.txt', // Example filename, use your actual filename here
    // }))

    // Get the file path
    //const fileStream = fs.createReadStream
    // const uploadable: Uploadable[] = [filePath].map((path) =>
    //     fs.createReadStream(path),
    // )
    const vectorStoreId = process.env.VECTOR_STORE_ID || ''
    
    // const assistant = await openai.beta.assistants.create({
    //     name: "Document Reader",
    //     instructions: "You are an expert Document Reader. Use you knowledge base to answer questions based on documents.",
    //     model: "gpt-3.5-turbo-0125",
    //     tools: [{ type: "file_search" }],
    //   })
    //console.log(assistant)
    
    // // Create a vector store including file.
    // let vectorStore = await openai.beta.vectorStores.create({
    //     name: "Document Storage",
    // })
    // const fileBatches = {
    //     files: uploadable,
    //   }

    //const status = await openai.beta.vectorStores.fileBatches.uploadAndPoll(vectorStoreId, filePaths)

    // console.log(status)
    
    

    // //start to upload file to openai
    // const formData = new FormData()
    // const filePath = (file as any).filpath || (file as any).path
    // const fileUpload = await fileFromPath(filePath)
    // formData.append("file", fileUpload)

    // //upload to openai
    // const openAIFile = await openai.files.create({
    //     file: fileUpload,
    //     purpose: "assistants"
    // })

    
    // if (!vectorStoreId) {//check for 
    //     throw new Error("VECTOR_STORE_ID is not defined in the environment variables.");
    // }

    // const vectorStore = await openai.beta.vectorStores.create({
    //     name: "Product Documentation",
    //     file_ids: openAIFile
    //   });

    // const vectorStore = openai.beta.vectorStores.create(vectorStoreId, {
    //     file_id: openAIFile
    // })

    // upload using the file stream
    // const openaiFile = await openai.files.create({
    //     file: new Blob([fileContent]),
    //     purpose: "assistants",
    // });

    // const example = await openai.beta.vectorStores.files.createAndPoll(
    //     vectorStoreId,
    //     { file_id: openAIFile }
    //   )
    



}

// const handler: NextApiHandler = (req, res) => {
//     const form = formidable({// pas in options to call back for handling

//     })//form object to parse and read
//     form.parse(req, (err, fields, files) => {//call back for object
//         //use files for API
//     })

// }

export default handler

