export function generateSessionKey(id : string, deviceType: string): string {
    return `${id}:${deviceType}`
}

