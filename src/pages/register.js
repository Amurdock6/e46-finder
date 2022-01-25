import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom'
import '../css/register.css';
import {IoMdArrowRoundBack} from 'react-icons/io'
import { useState } from 'react'
import { Axios } from 'axios';


const Register = () => {

    const [emailReg, setEmailReg] = useState("");
    const [usernameReg, setUsernameReg] = useState("");
    const [passwordReg, setPasswordReg] = useState("");

    const register = () => {
        Axios.post('http://localhost:5000/register', {
            email: emailReg,
            username: usernameReg, 
            password: passwordReg, 
        })
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

            <h1>Create Account</h1>

                <div className="wrapper">
                    <form>
                        <div className="textarea" id="email">
                         <input 
                            type="email" 
                            onChange={(e) => {
                                setEmailReg(e.target.value);
                            }} 
                            name="email" 
                            id="authentactor-email" 
                            placeholder="Email" 
                            defaultValue="" 
                            required 
                          />
                        </div>

                        <div className="textarea" id="username">
                          <input 
                            type="text" 
                            onChange={(e) => {
                                setUsernameReg(e.target.value);
                            }}
                            name="name" 
                            id="authentactor-text" 
                            placeholder="Username" 
                            defaultValue="" 
                            required 
                          />
                        </div>

                        <div className="textarea" id="password">
                          <input 
                            type="password" 
                            onChange={(e) => {
                                setPasswordReg(e.target.value);
                            }}
                            name="password" 
                            id="authentactor-password" 
                            placeholder="Password" 
                            defaultValue="" 
                            required 
                          />
                        </div>

                        <div id="button-wrapper">
                            <button id="button" onClick={register}>Create Account</button>
                        </div>
                    </form>


                    <div className='bottom-text-wrapper'>
                        <h4>Already have an account?   <Link to='/login'>Login Here</Link></h4>
                    </div>
                    
                </div>
            </div>
        </div>
    </div>
    )
}

export default Register
