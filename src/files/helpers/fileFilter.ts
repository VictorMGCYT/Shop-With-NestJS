import { Request } from "express";


export const FileFilter = ( req: Request, file: Express.Multer.File, callback: Function ) => {


    if (!file) {
        return callback( new Error('No file provided'), false)
    }

    const fileExtension = file.mimetype.split('/')[1];
    const validExtension = ['jpg', 'jpeg', 'png', 'gif']


    if( validExtension.includes(fileExtension) ){
        return  callback( null, true );
    }

    callback( null, false);

}