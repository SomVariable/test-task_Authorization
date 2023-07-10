export type Session = {
    id: string,
    jwtToken: string,
    refreshToken: string,
    verificationKey: string,
    verificationTimestamp: string,
    status: 'ACTIVE' | 'BLOCKED'
}


export type CreateSession = {
    id: string
}

export type SetVerificationProps = {
    id: string,
    verificationTimestamp: string,
    verificationKey: string,
}

export type SetJWTProps = {
    id: string,
    jwtToken: string,
    refreshToken: string,
}

export type CloseSession = {
    id: string
}
