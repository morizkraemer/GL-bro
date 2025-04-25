export class SafeError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "SafeError";
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class ResourceNotFoundError extends SafeError {
    constructor(message: string) {
        super(message)
        this.name = "ResourceNotFoundError"
        Object.setPrototypeOf(this, ResourceNotFoundError.prototype);
    }
}

export class UserError extends SafeError {
    constructor(message: string) {
        super(message)
        this.name = "UserError"
        Object.setPrototypeOf(this, UserError.prototype);
    }
}

export class GenericError extends SafeError {
    constructor(message = "Something went wrong") {
        super(message);
        this.name = "GenericError";

        Object.setPrototypeOf(this, GenericError.prototype);
    }
}

export class AuthenticationError extends SafeError {
    constructor(message = "Please log in") {
        super(message)
        this.name = "AuthenticationError"
        Object.setPrototypeOf(this, GenericError.prototype);
    }
}
