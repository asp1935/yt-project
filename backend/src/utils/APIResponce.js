class APIResponce {
    constructor(statusCode, data, message = 'success') {
        this.statusCode = statusCode
        this.data = data
        this.message = message
        this.success = statusCode < 400    //this is responce not error error status code start from 400-599
    }
}

export { APIResponce };