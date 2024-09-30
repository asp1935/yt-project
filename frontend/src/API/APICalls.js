import axios from 'axios';
import { useNavigate } from 'react-router-dom';


const APIErrorHandler = (error) => {
    const navigate = useNavigate()
    if (error.response && error.response.status === 401) {
        navigate('/login')
    }
    else {
        console.log(error);
    }
}

const url = 'http://localhost:3000/api/v1'

export const tokenCheck = async () => {
    try {
        const responce = await axios.get(`${url}/healthcheck/tokencheck`, {
            withCredentials: true,
        });
        return responce.data;

    } catch (error) {
        APIErrorHandler(error)
    }
}

export const getUserData = async () => {
    try {
        const responce = await axios.get(`${url}/users/current-user`, {
            withCredentials: true,
        });

        return responce.data;


    } catch (error) {
        APIErrorHandler(error);
        console.log(error);

    }
}

export const login_user = async (email, username, password) => {
    try {
        const response = await axios.post(`${url}/users/login`,
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

export const getAllVideos = async (page = 1, limit = 10, query = '', sortBy = 'createdAt', sortType = 'desc') => {
    try {
        console.log(page);
        
        const responce = await axios.get(`${url}/video/get-videos`, {
            params: { page, limit, query, sortBy, sortType },
            withCredentials: true
        }
        );
        return responce.data.data;
    }
    catch (error) {
        APIErrorHandler(error);
        // throw error;

    }

}

export const getVideoById = async (videoId) => {
    // eslint-disable-next-line no-useless-catch
    try {
        const responce = await axios.get(`${url}/video/get-videoby-id/${videoId}`, {
            withCredentials: true
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

export const toggleSubscribe = async (channelId) => {
    try {
        const responce = await axios.get(`${url}/subscription/toggle-subscribe/${channelId}`, {
            withCredentials: true
        });

        return responce.data
    } catch (error) {
        APIErrorHandler(error);
    }
}



/////////////////////Like\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

export const toggleVideoLike = async (videoId) => {
    try {
        const responce = await axios.get(`${url}/like/video-like/${videoId}`, {
            withCredentials: true
        });
        return responce.data
    } catch (error) {
        APIErrorHandler(error);
    }
}

export const toggleCommentLike = async (commentId) => {
    try {
        const responce = await axios.get(`${url}/like/comment-like/${commentId}`, {
            withCredentials: true
        });
        return responce.data
    } catch (error) {
        APIErrorHandler(error);
    }
}



///////////////////Comments///////////////////////////////

export const getVideoComments = async (videoId, page = 1, limit = 5) => {
    try {
        const responce = await axios.get(`${url}/comment/get-video-comments/${videoId}`, {
            params: { page, limit },
            withCredentials: true,
        });
        return responce.data;
    } catch (error) {
        APIErrorHandler(error);
    }
}


export const add_comment = async (videoId, content) => {
    try {
        const responce = await axios.post(`${url}/comment/add-comment/${videoId}`,
            { content },
            {
                withCredentials: true,
            });
        return responce.data;
    } catch (error) {
        APIErrorHandler(error);
    }
};

export const update_comment = async (cmtId, content) => {
    try {
        const responce = await axios.patch(`${url}/comment/update-comment/${cmtId}`,
            { content },
            { withCredentials: true }
        );
        return responce.data;
    } catch (error) {
        APIErrorHandler(error);
    }
}

export const delete_comment=async(cmtId)=>{
    try {
        const responce=await axios.delete(`${url}/comment/delete-comment/${cmtId}`,{
            withCredentials:true
        })
        return responce.data;
    } catch (error) {
        APIErrorHandler(error);
    }
}


