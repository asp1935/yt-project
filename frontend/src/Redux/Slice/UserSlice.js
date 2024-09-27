import {createSlice} from '@reduxjs/toolkit';

const UserSlice=createSlice({
    name:'userReducer',
    initialState:{
        user:null,
    },
    reducers:{
        setUserData:(state,actions)=>{
            state.user=actions.payload;
            
        },
    }
})

export const {setUserData}=UserSlice.actions;
export const user=(state)=>state.userReducer.user;
export default UserSlice.reducer;