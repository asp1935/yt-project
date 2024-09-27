import { useEffect } from 'react';
import {useDispatch} from 'react-redux';
import { getUserData, tokenCheck } from '../API/APICalls';
import { setUserData } from '../Redux/Slice/UserSlice';


const useAuthUser=()=>{
    const dispatch=useDispatch();
    useEffect(()=>{
        const verifyToken=async()=>{
            const responce=await tokenCheck();
            if(responce.success){
                const responce=await getUserData();
                if(responce){
                   dispatch(setUserData(responce?.data))
                    
                }
            }    
        };
        verifyToken();
    },[dispatch])
};

export default useAuthUser;