import axios from 'axios';

export const login_user = async (email, username, password) => {
    try {
        const response = await axios.post('http://localhost:3000/api/v1/users/login',
            { email, username, password },
            {
                withCredentials: true,
            }
        );
        return response.data;
    } catch (error) {
        console.log(error);
        // throw error
    }
};

export const getAllVideos=async(navigate,page = 1, limit = 10, query='', sortBy = 'createdAt', sortType = 'desc')=>{
    try{
        const responce=await axios.get(`http://localhost:3000/api/v1/video/get-videos`,{
            params:{page,limit,query,sortBy,sortType},
            withCredentials:true
        }
        );
        return responce.data.data;
    }
    catch(error){
        if (error.response && error.response.status === 401) {
            navigate('/login')
        }
        console.log(error);
        // throw error;
        
    }

}

export const getVideoById=async(videoId)=>{
    // eslint-disable-next-line no-useless-catch
    try {
        const responce=await axios.get(`http://localhost:3000/api/v1/video/get-videoby-id/${videoId}`,{
            withCredentials:true
        });
        return responce.data;

    } 
    catch (error) {
        // if (error.response && error.response.status === 401) {
        //     navigate('/login')
        // }
        // console.log(error);
        
        throw error;
    }
}
// export const getVideoById = async (videoId) => {
//     try {
//         const response = await axios.get(`http://localhost:3000/api/v1/video/get-videoby-id/${videoId}`, {
//             withCredentials: true
//         });
//         return response.data; // Return the data part of the response
//     } catch (error) {
//         // Optionally handle 401 Unauthorized here if needed
//         if (error.response && error.response.status === 401) {
//             throw new Error('Unauthorized access. Please log in.');
//         }
//         console.error('Error in getVideoById:', error);
//         throw error; // Ensure the error is thrown to propagate to React Query
//     }
// };