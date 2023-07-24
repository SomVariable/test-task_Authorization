import { IMAGE_FILE_FORMAT, IMAGE_FILE_MESSAGE } from "../constants/user-file.constants"

export const imageFileFilter = (req: any, file: Express.Multer.File, callback) => {
    if(!file.originalname.match(IMAGE_FILE_FORMAT)) {
        req.fileValidationError = IMAGE_FILE_MESSAGE
        return callback(null, false)
    }

    callback(null, true)
}