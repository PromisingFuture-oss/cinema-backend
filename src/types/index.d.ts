declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string
                name: String
                email: string
                role: string
            }
        }
    }

    interface JWTPayload {
        id: string
        name: string
        email: string
        role: string
    }

    interface ValidationResultError {
        [string: string]: [string];
    }
}

export {}