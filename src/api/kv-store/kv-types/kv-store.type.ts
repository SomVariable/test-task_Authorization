export type Session = {
    id: string,
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

export type CloseSession = {
    id: string
}
