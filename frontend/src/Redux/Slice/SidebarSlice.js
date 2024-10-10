import { createSlice } from "@reduxjs/toolkit";

const SidebarSlice=createSlice({
    name:'sidebarReducer',
    initialState:{
        isSidebar:true
    },
    reducers:{
        setIsSidebar:(state)=>{
            state.isSidebar=!state.isSidebar
        }
    }
})

export const {setIsSidebar} =SidebarSlice.actions;
export default SidebarSlice.reducer;