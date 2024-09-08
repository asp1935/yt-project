import {createSlice} from '@reduxjs/toolkit';

const AuthSlice=createSlice({
    name:'authReducer',
    initialState:{
        isAuthorize:false,
        username:''
    },
    reducers:{
        setAuthLogin:(state,action)=>{
            state.isAuthorize=true,
            state.username=action.payload
        },
        setAuthLogout:(state)=>{
            state.isAuthorize=false,
            state.username=''
        }
    }
})

export const {setAuthLogin,setAuthLogout}=AuthSlice.actions;
export default AuthSlice.reducer;