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
        return responce.data;
    }
    catch(error){
        if (error.response && error.response.status === 401) {
            navigate('/login')
        }
        console.log(error);
        // throw error;
        
    }

}