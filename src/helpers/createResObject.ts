export type ResponseMessage = {
    message?: string;
    data?: any;
    totalItems?: number;
    pagination?: number;
    additionalInfo?: object;
}


export function generateResponseMessage(responseMessage : ResponseMessage): ResponseMessage {
    const responseMessageToArray = Object.entries(responseMessage)
    const responseObject: ResponseMessage = {}

    responseMessageToArray.forEach(([key, value]) => {
        if(key){
            responseObject[key] = value
        }
    })

    return responseObject;
}

