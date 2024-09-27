import { APIResponce } from "../utils/APIResponce.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const healthCheck = asyncHandler(async (req, res) => {
    return res
        .status(201)
        .json(new APIResponce(200, 'Server is working fine...'))
});

const tokenCheck = asyncHandler(async (req, res) => {
    const accessToken = req.cookies.accessToken;
    const refreshToken = req.cookies.refreshToken;

    if (accessToken && refreshToken) {
        // Both tokens are available
        return res.status(200).json(
            new APIResponce(200, { accessToken: true, refreshToken: true }, 'Both tokens available')
        );
    } else if (!accessToken && refreshToken) {
        // Access token is missing, but refresh token is available
        return res.status(200).json(
            new APIResponce(200, { accessToken: false, refreshToken: true }, 'Access Token Not Available & Refresh Token Available')
        );
    } else if (accessToken && !refreshToken) {
        // Access token present, but refresh token is missing
        return res.status(401).json(
            new APIResponce(401, { accessToken: true, refreshToken: false }, 'Unauthorized User: Missing Refresh Token')
        );
    } else {
        // Neither token is available
        return res.status(401).json(
            new APIResponce(401, { accessToken: false, refreshToken: false }, 'Unauthorized User: No Tokens Available')
        );
    }
});


export { healthCheck ,tokenCheck};