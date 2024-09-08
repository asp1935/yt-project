/* eslint-disable no-unused-vars */
import React from "react";
import { useSelector } from "react-redux";
import {Navigate, useLocation} from 'react-router-dom';
import PropTypes from 'prop-types';



const ProtectedRoute=({children})=>{
    const isAuthorize=useSelector(state=>state.authReducer.isAuthorize);
    const location=useLocation();
    console.log(isAuthorize);
    
    if(!isAuthorize){
        return <Navigate to={'/login'} state={{from :location}} replace/>;
    }
    return children;


};

ProtectedRoute.propTypes={
    children:PropTypes.object.isRequired,
}

export default ProtectedRoute;  