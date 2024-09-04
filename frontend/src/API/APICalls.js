import axios from 'axios';

export const login_user=async()=>{
    try {
        const responce=await axios.post('/api/login');
        return responce.data;
    } catch (error) {
        console.log(error);
        
    }
};