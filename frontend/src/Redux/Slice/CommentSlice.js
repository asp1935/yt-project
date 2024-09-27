import { createSlice } from "@reduxjs/toolkit";

const CommentSlice=createSlice({
    name:'commentReducer',
    initialState:{
        totalComments:0,
        newUserComment:'',
        comments:[],
    },
    reducers:{
        setCommentCnt:(state,action)=>{
            state.totalComments=action.payload
        },
        setNewUserComment:(state,action)=>{
            state.newUserComment=action.payload
        },
        setComments: (state, action) => {
            
            
            state.comments = action.payload;
          },
          clearComments: (state) => {
            state.comments = []; 
          },
    }
});

export const {setCommentCnt,setComments,setNewUserComment,clearComments}=CommentSlice.actions;
export default CommentSlice.reducer;