import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import '../css/register.css';
import { IoMdArrowRoundBack } from 'react-icons/io'
import { useState } from 'react'
import axios from 'axios';
import validator from 'validator';
import { GoogleLogin } from 'react-google-login';


const Register = () => {
    let navigate = useNavigate();

    const [emailReg, setEmailReg] = useState("");
    const [emailError, setEmailError] = useState('')
    const [usernameReg, setUsernameReg] = useState("");
    const [passwordReg, setPasswordReg] = useState("");
    const [confirmationPasswordReg, setConfirmationPasswordReg] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [keepMeLoggedIn, setKeepMeLoggedIn] = useState(false);


    // Sends Registration form data to API
    const register = async () => {
        try {
            await axios.post('http://localhost:5000/register', {
                email: emailReg,
                username: usernameReg,
                password: passwordReg,
                confpassword: confirmationPasswordReg,
                keepmeloggedin: keepMeLoggedIn

                // Sets httpOnly cookie with jwt from backend
            }).then(async () => {
                return await axios.get('http://localhost:5000', { withCredentials: true }).then((res) => {
                }).then(() => {
                    navigate('/account');
                });
            });
        } catch (error) {
            if (error.response.data === 'All input is required') {
                console.log("Most fill out all feilds")
            } else if (error.response.data === 'User Already Exist. Please Login.') {
                console.log("Account already exist please Login")
            } else if (error.response.data === 'Username Already taken. Please choose another.') {
                console.log("Username Already taken. Please choose another.")
            } else if (error.response.data === 'Passwords do not match') {
                console.log("Passwords do not match.")
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

    // Adds "Confirmation Password should match Password!" to form if Password and confirm Password do not match.
    const validatePassword = (e) => {
        var password = e.target.value

        if (passwordReg === password) {
            setPasswordError("");
        } else {
            setPasswordError("Confirmation Password should match Password!");
        }
    };

    // Google functions
    const onSuccess = async (response) => {

        await axios({
            method: 'POST',
            url: 'http://localhost:5000/googlelogin',
            data: { idToken: response.tokenId }
        }).then(async () => {
            return await axios.get('http://localhost:5000', { withCredentials: true }).then((res) => {
            }).then(() => {
                navigate('/account');
            });
        });
    };

    const onFailure = (res) => {
        console.log("Login Failed! res: ", res);
    };

    // Remeber me check box logic
    const remeberMe = () => {
        setKeepMeLoggedIn(!keepMeLoggedIn);
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

                    <GoogleLogin
                        clientId={'793531866299-a0lqtj70qp6s1200hhpl08rba6195m7h.apps.googleusercontent.com'}
                        buttonText="Create Account with Google"
                        onSuccess={onSuccess}
                        onFailure={onFailure}
                        cookiePolicy={'single_host_origin'}
                        isSignedIn={true}
                    />

                    <div className="wrapper">
                        <form>
                            <div className="textarea" id="email">
                                <input
                                    type="email"
                                    onChange={(e) => {
                                        validateEmail(e);
                                        setEmailReg(e.target.value);
                                    }}
                                    id="authentactor-email"
                                    placeholder="Email"
                                    defaultValue=""
                                    required
                                />
                            </div>
                            <span id="email-span">{emailError}</span>

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
                                    autoComplete="new-password"
                                    minLength="8"
                                    required
                                />
                            </div>

                            <div className="textarea" id="password">
                                <input
                                    type="password"
                                    onChange={(e) => {
                                        validatePassword(e);
                                        setConfirmationPasswordReg(e.target.value);
                                    }}
                                    id="authentactor-conf-password"
                                    placeholder="Confirm Password"
                                    minLength="8"
                                    required
                                />
                            </div>
                            <span id="password-span">{passwordError}</span>

                            <div className="checkBox" id="checkbox">
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={keepMeLoggedIn}
                                        onChange={remeberMe}
                                        id="keepmeloggedin"
                                        name="keepmeloggedin"
                                    />
                                    Remember me
                                </label>
                            </div>

                            <div id="button-wrapper">
                                <button type="button" onClick={register} id="button">Create Account</button>
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
