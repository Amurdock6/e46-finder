import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom'
import '../css/login.css'
import {IoMdArrowRoundBack} from 'react-icons/io'
import { useState } from 'react'
import axios from 'axios'

const Login = () => {

    const [setEmailReg, emailReg] = useState("");
    const [setPasswordReg, passwordReg] = useState("");
    
    const login = () => {
        axios.post('http://localhost:5000/login', {
            email: setEmailReg,
            password: setPasswordReg, 
        }).catch(function (error) {
            console.log(error);
        });
    };

    return (
    <div className='background-image'>

            <div className='back-button'>
                <Link to='/'>
                    <IoMdArrowRoundBack id='back-arrow' />
                    <h3>Home</h3>
                </Link>
            </div>

     <div className="container-wrapper">
        <div className="container">


            <h1>Login</h1>

                <div className="wrapper">
                    <form>
                        <div className="textarea" id="email">
                        <input 
                            type="email" 
                            onChange={(e) => {
                                emailReg(e.target.value);
                            }}  
                            id="authentactor-email" 
                            placeholder="Email" 
                            defaultValue="" 
                            required 
                          />
                        </div>

                        <div className="textarea" id="password">
                        <input 
                            type="password" 
                            onChange={(e) => {
                                passwordReg(e.target.value);
                            }}
                            id="authentactor-password" 
                            placeholder="Password" 
                            defaultValue="" 
                            required 
                          />
                        </div>

                        <div id="button-wrapper">
                            <button onClick={login} id="button">Login</button>
                        </div>
                    </form>

                    <div className='bottom-text-wrapper'>
                        <h4>Don't Already have an account?   <Link to='/register'>Create one here</Link></h4>
                    </div>

                </div>
            </div>
        </div>
     </div>
    )
}

export default Login
