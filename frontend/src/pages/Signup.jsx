import React, { useState } from 'react'
import { SignupApi } from '../api/authApi'
import kairo from '../assets/kairo.png'
import { useNavigate } from 'react-router-dom'

const SignupPage = () => {

  // formdata state
    const [formData, setFormData] = useState({
        email:'',
        password:''
    });

    // error state
    const [errors, setErrors] = useState([]);

    // setformdata when input changes
    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData((prev) => ({...prev, [name] : value}));
    }

    // submit the formdata 
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(formData);
        handleSignup(formData);
    }

    const navigate = useNavigate();

    // send formdata to backend
    const handleSignup = async (formData) => {
        const result = await SignupApi(formData);
        console.log(result);
        if (!result.success) {
            setErrors(result.errors.map((err) => err.msg));
        } else{
            setErrors([]);
            navigate('/signin');
        }
        
    }

  return (
    <div className='flex h-screen w-screen bg-gradient-to-br from-blue-50 to-indigo-100'>
      <div className="flex items-center justify-center w-full">
        <div className="max-w-md w-full mx-4">
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-sm p-8 border border-gray-200/60">
            {/* Header */}
            <div className="text-center mb-8">
              <div className='w-16 h-16 bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg mx-auto mb-4'>
                <img src={kairo} alt="Kairo" className='w-10 h-10 object-contain' />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Welcome
              </h2>
              <p className="text-gray-500 text-sm">
                Create a account to continue
              </p>
            </div>
            {<p style={{ color: "red" }}>{errors[0]}</p>  }

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6" >
              <div>
                <input 
                  type="email"
                  name='email'
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email"
                  className="w-full px-4 py-3 bg-gray-50/80 border border-gray-200/60 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/40 transition-all duration-200"
                />
              </div>
              
              <div>
                <input 
                  type="password"
                  name='password'
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Password"
                  className="w-full px-4 py-3 bg-gray-50/80 border border-gray-200/60 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/40 transition-all duration-200"
                />
              </div>

              {/* Sign up button */}
              <button type='submit' className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 shadow-lg hover:shadow-md transform hover:scale-105 active:scale-95" >
                Create Account
              </button>

              {/* Already have account link */}
              <div className="text-center">
                <p className="text-sm text-gray-500">
                  Already have an account?{' '}
                  <a href="/signin" className="font-medium text-blue-600 hover:text-blue-500 transition-colors duration-200">
                    Sign in
                  </a>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SignupPage;