import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom'
import '../css/register.css';
import {IoMdArrowRoundBack} from 'react-icons/io'
import { useState } from 'react'
import axios, { Axios } from 'axios';


const Register = () => {

    const [emailReg, setEmailReg] = useState("");
    const [usernameReg, setUsernameReg] = useState("");
    const [passwordReg, setPasswordReg] = useState("");

    const register = () => {
        axios.post('http://localhost:5000/register', {
            email: emailReg,
            username: usernameReg, 
            password: passwordReg, 
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

            <h1>Create Account</h1>

                <div className="wrapper">
                    <form>
                        <div className="textarea" id="email">
                         <input 
                            type="email" 
                            onChange={(e) => {
                                setEmailReg(e.target.value);
                            }}  
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
                            id="authentactor-password" 
                            placeholder="Password" 
                            defaultValue="" 
                            required 
                          />
                        </div>

                        <div id="button-wrapper">
                            <button onClick={register} id="button">Create Account</button>
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
