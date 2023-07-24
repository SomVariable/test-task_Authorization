export const ANOTHER_USER_FILE_MESSAGE = 'You try to get file that belong another user'
export const MISSING_FILE_MESSAGE = 'there is no such file in the database'
export const IMAGE_FILE_MESSAGE = 'only image file allows'
export const IMAGE_FILE_FORMAT = /\.(jpg|jpeg|png)$/
export const API_FILE_CONFIG = {
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  }
