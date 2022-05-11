import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom'
import { IoMdArrowRoundBack } from 'react-icons/io'
import '../css/loginandregister.css'
import { useState } from 'react'
import axios from 'axios'
import validator from 'validator';

const ForgotPassword = () => {

    const [email, setEmail] = useState("");
    const [emailError, setEmailError] = useState("");
    const [emailsent, setEmailsent] = useState(false);

    const login = async () => {
        try {
            await axios.post('http://localhost:5000/forgot', {
                withCredentials: true,
                email: email,
                // Sets httpOnly cookie with jwt from backend
            }).then(() => {
                setEmailsent(true);
            });
        } catch (error) {
            if (error.response.data === 'Password reset request all ready sent.') {
                console.log("Password reset request all ready sent.")
            } else if (error.response.status === 404) {
                console.log("No email found. Please create an account.")
            };
        };
    };

    // Adds "Please enter vaild Email!" to form if email is not vaild
    const validateEmail = (e) => {
        var email = e.target.value

        if (validator.isEmail(email)) {
            setEmailError("");
            document.getElementById("email").style.paddingBottom = "1.8vh";
        } else {
            setEmailError("Please enter valid Email!");
            document.getElementById("email").style.paddingBottom = "0";
        }
    };

    // Checks if email has been sent or not


    return (
        <div className='background-image'>

            <div className='back-button'>
                <Link to='/login'>
                    <IoMdArrowRoundBack id='back-arrow' />
                    <h3>Login</h3>
                </Link>
            </div>

            <div className="container-wrapper">
                <div className="container">


                    <h1>Enter Email</h1>

                    <div className="wrapper">
                        <form>
                            <div className="textarea" id="email">
                                <input
                                    type="email"
                                    onChange={(e) => {
                                        validateEmail(e);
                                        setEmail(e.target.value);
                                    }}
                                    id="authentactor-email"
                                    placeholder="Recovery Email"
                                    defaultValue=""
                                    required
                                />
                            </div>
                            <span id="email-span">{emailError}</span>

                            <div id="button-wrapper">
                                <button type="button" onClick={login} id="button">Reset Password</button>
                            </div>

                        </form>

                    </div>
                </div>
            </div>
        </div>
    )
}

export default ForgotPassword