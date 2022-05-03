import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom'
import '../css/login.css'
import {IoMdArrowRoundBack} from 'react-icons/io'
import { useState } from 'react'
import axios from 'axios'

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    
    const login = async () => {
        axios.post('http://localhost:5000/login', {
            withCredentials: true,
            email: email,
            password: password, 
            // Sets httpOnly cookie with jwt from backend
        }).then(sendToken => {
            return axios.get('http://localhost:5000', { withCredentials: true }).then((res) => {
                // console.log(res.data)
            });
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
                                setEmail(e.target.value);
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
                                setPassword(e.target.value);
                            }}
                            id="authentactor-password" 
                            placeholder="Password" 
                            defaultValue="" 
                            required 
                          />
                        </div>

                        <div id="button-wrapper">
                            <button type="button" onClick={login} id="button">Login</button>
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
