import {configureStore} from '@reduxjs/toolkit'
import UserSlice from './Slice/UserSlice';
import CommentSlice from './Slice/CommentSlice';

const store=configureStore({
    reducer:{
        userReducer:UserSlice,
        commentReducer:CommentSlice,

    }
});

export default store;