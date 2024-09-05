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
        throw error

    }
};