import { Request } from "express";
import { v4 as uuid } from 'uuid';


export const FileNamer = ( req: Request, file: Express.Multer.File, callback: Function ) => {


    if (!file) {
        return callback( new Error('No file provided'), false)
    }

    const fileExtension = file.mimetype.split('/')[1];

    const fileName = `${uuid()}.${fileExtension}`;
    


    callback(null, fileName)

}