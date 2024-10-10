import {configureStore} from '@reduxjs/toolkit'
import UserSlice from './Slice/UserSlice';
import CommentSlice from './Slice/CommentSlice';
import SidebarSlice from './Slice/SidebarSlice';
const store=configureStore({
    reducer:{
        userReducer:UserSlice,
        commentReducer:CommentSlice,
        sidebarReducer:SidebarSlice,

    }
});

export default store;