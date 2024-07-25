//utils use for same code or functinality or utility we are using multiple time like file upload to cloud,api related
//so this asyncHandle main use for creating asynchronous functions and handling errors 

// this is a higher order function  which take functions as arugment or return function

// using promises
const asyncHandler=(requestHandler)=>{
    (req,res,next)=>{
        Promise.resolve(requestHandler(req,res,next)).catch((err)=>{next(err)})
    } 
}

export {asyncHandler};




/*
// simple function
const asyncHandler=()=>{}

//passing function as a parameter/argument to function
const asyncHandler=(fn)=>{ ()=>{} }

// simple version of above
const asyncHandler =(fn)=>()=>{}

//if i want to make async funtion 
const asyncHandler =(fn)=>async()=>{}

*/

/*
// this function using trycatch block
const asyncHandler = (fn)=>async(req,res,next)=>{
    try {
        await fn(req,res,next)
    } catch (err) {
        res.status(err.code || 500).json({
            success: false,
            message: err.message
        })
    }
}
    */