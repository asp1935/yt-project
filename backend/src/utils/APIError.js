// this Class is for formating APIErrors or controlling Errors

class APIError extends Error{
    constructor(
        statusCode,                //status code for error
        message="Somthing went wrong!!!",      // default msg set 
        errors=[],                          //errors
        stack=''                            //error stack
    )
    //override constructor
    {
        super(message) 
        this.statusCode=statusCode
        this.data=null
        this.message=message
        this.success=false      //we are handling api errors not api responce
        this.errors=errors


        //stack Trace is  if error comes then dev can find in which file  error came 

        if(stack){
            this.stack=stack
        }
        else{
            Error.captureStackTrace(this,this.constructor)
        }


    }
}

export {APIError}