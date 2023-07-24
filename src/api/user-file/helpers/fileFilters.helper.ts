
export const imageFileFilter = (req: any, file: Express.Multer.File, callback) => {
    if(!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
        req.fileValidationError = 'only image file allows'
        return callback(null, false)
    }

    callback(null, true)
}