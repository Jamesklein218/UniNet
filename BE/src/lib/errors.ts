export class ErrorUnauthorized extends Error {
    public static readonly code = "unauthorized"
    constructor(_message: string = "Unauthorized Action") {
        super()
        this.message = _message
    }
}

export class ErrorInvalidData extends Error {
    public static readonly code = "data/invalid"
    constructor(_message: string = "Invalid Data") {
        super()
        this.message = _message
    }
}

export class ErrorNotFound extends Error {
    public static readonly code = "notfound"
    constructor(_message: string = "Not Found") {
        super()
        this.message = _message
    }
}

// User error
export class ErrorUserInvalid extends Error {
    public static readonly code = 'user/invalid';
    constructor(_message: string = "Invalid User") {
        super()
        this.message = _message
    }
}

// Bundle error
export class ErrorBundleInvalid extends Error {
    public static readonly code = 'bundle/invalid';
    constructor(_message: string = "Invalid Bundle") {
        super()
        this.message = _message
    }
}

// Event error
export class ErrorEventInvalid extends Error {
    public static readonly code = 'event/invalid';
    constructor(_message: string = "Invalid Event") {
        super()
        this.message = _message
    }
}
