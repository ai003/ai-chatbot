import { NextApiHandler, NextApiRequest } from "next"
import formidable from 'formidable'
import path from 'path'
import fs from 'fs/promises'


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
        await fs.readdir(path.join(process.cwd() + "/public", "/files"))
    } catch (error) {//if no directory create it
        await fs.mkdir(path.join(process.cwd() + "/public", "/files"))
    }

    await readFile(req, true)
    res.json({ done: "succesful" })

}

// const handler: NextApiHandler = (req, res) => {
//     const form = formidable({// pas in options to call back for handling

//     })//form object to parse and read
//     form.parse(req, (err, fields, files) => {//call back for object
//         //use files for API
//     })

// }

export default handler

