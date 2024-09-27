/* eslint-disable no-unused-vars */
import React from 'react';
import Cookies from 'js-cookie';
import {useForm} from 'react-hook-form';
import {useMutation} from '@tanstack/react-query'
import { login_user } from '../API/APICalls';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
function Login() {



  const navigate=useNavigate();
  const location=useLocation();

  const from=location.state?.from?.pathname || '/';


  const {register,handleSubmit,formState:{isSubmitting,errors}}=useForm({defaultValues:{
    email:'',
    username:'',
    password:''
  }});
  const getErrorMessage=()=>{
    if(errors.email) return errors.email.message;
    if(errors.username) return errors.username.message;
    if(errors.password) return errors.password.message;
    return null;
  }

  const {mutate,isError,isSuccess,data}=useMutation({
      mutationFn:(data)=>login_user(data.email,data.username,data.password),
      onSuccess:(data)=>{
        console.log(data);
        
        navigate(from,{replace:true});
      },
      onError:(error)=>{
        console.error(error);
        <p>Somthing Went wrong </p>
      }
  })




  const onSubmit=(data)=>{
    mutate(data);
    // console.log(data.username,data.email,data.password);
    
    
  }
  if(isSuccess){
   
    console.log();
    
  }

  return (
    <div className='flex items-center justify-center min-h-screen bg-black'>
      <div className='text-center  w-full max-w-xl'>
        <div className='bg-white p-8 rounded-lg shadow-lg'>
          <h1 className='text-6xl font-extrabold mb-8'>Login</h1>
          {isError&&(<p className='text-red-700'>Something went wrong </p>)}
          {getErrorMessage()&&(<p className='text-red-600 mb-4'>{getErrorMessage()}</p>)}
          <form onSubmit={handleSubmit(onSubmit)}>
            <input 
              {...register('email',{
                required:'Email is Required!',
                pattern:{
                  value:/^\S+@\S+$/i,
                  message:'Invalid email address'
                },
                
              })}
              type='email'
              placeholder='Email'
              className='w-full p-3 mb-4 border border-gray-300 rounded focus:outline-none focus:border-blue-500'/>

              <input 
              {...register('username',{
                required:'Username is Required!',
              })}
              type='text'
              placeholder='Username'
              className='w-full p-3 mb-4 border border-gray-300 rounded focus:outline-none focus:border-blue-500'/>

              <input 
              {...register('password',{
                required:'Password is Required!',
              })}
              type='password'
              placeholder='Password'
              className='w-full p-3 mb-4 border border-gray-300 rounded focus:outline-none focus:border-blue-500'/>

            <button
              type='submit'
              className={`w-full p-3 mt-4 bg-transparent border border-blue-500 text-black rounded hover:bg-blue-700 hover:text-white transition duration-200 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </button>
          </form>
        </div>
      </div>
    </div>

  )
}

export default Login;
