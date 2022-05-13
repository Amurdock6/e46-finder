import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import '../css/loginandregister.css'
import '../css/register.css'
import sideIamge from '../pictures/register.webp';
import { useState } from 'react'
import axios from 'axios';
import validator from 'validator';
import { GoogleLogin } from 'react-google-login';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleArrowRight, faLock, faEnvelope, faXmark, faCircleInfo, faCheck, faUser } from '@fortawesome/free-solid-svg-icons';
import Tooltip from '@mui/material/Tooltip';
import Button from '@mui/material/Button';



const Register = () => {
    let navigate = useNavigate();

    const [emailReg, setEmailReg] = useState("");
    const [usernameReg, setUsernameReg] = useState("");
    const [passwordReg, setPasswordReg] = useState("");
    const [confirmationPasswordReg, setConfirmationPasswordReg] = useState("");

    // Error handelers
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [passwordConfError, setPasswordConfError] = useState("");
    const [usernameError, setUsernameError] = useState("");


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

            if (error.response.data === 'User Already Exist. Please Login.') {
                setEmailError("Account already exist. Please Login");
                document.getElementById("authentactor-email").style.borderColor = "rgb(218, 0, 0)";
            } else {
                setEmailError("");
                document.getElementById("authentactor-email").style.borderColor = "";
            };

            if (error.response.data === 'Username Already taken. Please choose another.') {
                setUsernameError("Username Already taken. Please choose another.");
                document.getElementById("authentactor-text").style.borderColor = "rgb(218, 0, 0)";
            } else {
                setUsernameError("");
                document.getElementById("authentactor-text").style.borderColor = "";
            };

            if (error.response.data === 'Passwords do not match') {
                setPasswordConfError("Passwords do not match");
                document.getElementById("reg-password").style.borderColor = "rgb(218, 0, 0)";
                document.getElementById("authentactor-password").style.borderColor = "rgb(218, 0, 0)";
            } else {
                setPasswordConfError("");
                document.getElementById("reg-password").style.borderColor = "";
                document.getElementById("authentactor-password").style.borderColor = "";
            };

            if (error.response.data === 'All input is required') {
                setUsernameError("");
                setEmailError("");
                setPasswordConfError("All input is required");
                if (!emailReg) {
                    document.getElementById("authentactor-email").style.borderColor = "rgb(218, 0, 0)";
                } else {
                    document.getElementById("authentactor-email").style.borderColor = "";
                }

                if (!usernameReg) {
                    document.getElementById("authentactor-text").style.borderColor = "rgb(218, 0, 0)";
                } else {
                    document.getElementById("authentactor-text").style.borderColor = "";
                }

                if (!passwordReg) {
                    document.getElementById("reg-password").style.borderColor = "rgb(218, 0, 0)";
                } else {
                    document.getElementById("reg-password").style.borderColor = "";
                }

                if (!confirmationPasswordReg) {
                    document.getElementById("authentactor-password").style.borderColor = "rgb(218, 0, 0)";
                } else {
                    document.getElementById("authentactor-password").style.borderColor = "";
                }

            };


        };

    };

    // Adds "Please enter vaild Email!" to form if email is not vaild
    const validateEmail = (e) => {
        var email = e.target.value

        if (validator.isEmail(email)) {
            setEmailError("");
            document.getElementById("authentactor-email").style.borderColor = "";
        } else {
            setEmailError("Please enter valid Email");
            document.getElementById("authentactor-email").style.borderColor = "rgb(218, 0, 0)";
        }
    };


    // Adds "Confirmation Password should match Password!" to form if Password and confirm Password do not match.
    const validatePassword = (e) => {
        var password = e.target.value

        if (passwordReg === password) {
            setPasswordConfError("");
            document.getElementById("authentactor-password").style.borderColor = "";
        } else {
            setPasswordConfError("Confirmation Password should match Password");
            document.getElementById("authentactor-password").style.borderColor = "rgb(218, 0, 0)";
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
        <div id='whole-page-wrapper'>
            <div className='left-side' style={{ backgroundImage: `url(${sideIamge})`, backgroundPosition: 'left' }}>

            </div>

            <div className='right-side'>
                <div id='x-wrapper'>
                    <Link to="/"><FontAwesomeIcon icon={faXmark} id="back-to-home" /></Link>
                </div>

                <div id='content-wrapper'>


                    <h1>
                        Create an Account
                    </h1>
                    <p>
                        Please fill out the required felids below to create your E46 Finder account!
                    </p>

                    <div id='google-login'>
                        <GoogleLogin
                            clientId={'793531866299-a0lqtj70qp6s1200hhpl08rba6195m7h.apps.googleusercontent.com'}
                            onSuccess={onSuccess}
                            onFailure={onFailure}
                            cookiePolicy={'single_host_origin'}
                            isSignedIn={true}
                        />
                    </div>

                    <div className="line-wrapper">
                        <hr className='or-line' /> <p>Or</p> <hr className='or-line' />
                    </div>

                    <form>
                        <div id='email-wrapper'>
                            <div className="textarea" id="email">
                                <label><FontAwesomeIcon icon={faEnvelope} /> Email <br /></label>
                                <input
                                    type="email"
                                    onChange={(e) => {
                                        validateEmail(e);
                                        setEmailReg(e.target.value);
                                    }}
                                    id="authentactor-email"
                                    defaultValue=""
                                    required
                                />
                            </div>
                        </div>
                        <span id="email-span">{emailError}</span>

                        <div id='email-wrapper'>
                            <div className="textarea" id="username">
                                <label><FontAwesomeIcon icon={faUser} /> Username <br /></label>
                                <input
                                    type="text"
                                    onChange={(e) => {
                                        setUsernameReg(e.target.value);
                                    }}
                                    id="authentactor-text"
                                    defaultValue=""
                                    required
                                />
                            </div>
                        </div>
                        <span id="username-span">{usernameError}</span>

                        <div id='password-wrapper'>
                            <div className="textarea" id="password">
                                <label>
                                    <FontAwesomeIcon icon={faLock} /> Password <br /></label>
                                <input
                                    type="password"
                                    onChange={(e) => {
                                        setPasswordReg(e.target.value);
                                    }}
                                    id="reg-password"
                                    autoComplete="on"
                                    required
                                />
                            </div>
                        </div>
                        <span id="password-span">{passwordError}</span>

                        <div id='password-wrapper'>
                            <div className="textarea" id="password">
                                <label>
                                    <FontAwesomeIcon icon={faCheck} /> Confirm Password <br /></label>
                                <input
                                    type="password"
                                    onChange={(e) => {
                                        validatePassword(e);
                                        setConfirmationPasswordReg(e.target.value);
                                    }}
                                    id="authentactor-password"
                                    autoComplete="on"
                                    required
                                />
                            </div>
                        </div>
                        <span id="password-span">{passwordConfError}</span>

                        <div className="bottom-form-container">

                            <div className="checkBox" id="checkbox">
                                <Tooltip title="Check this box if you would like to stay logged in even after you close your browser. You will stay logged in to e46finder.com as long as you don't clear your cookies." arrow>
                                    <Button><FontAwesomeIcon icon={faCircleInfo} /></Button>
                                </Tooltip>
                                <label>
                                    Remember me?
                                    <input
                                        type="checkbox"
                                        checked={keepMeLoggedIn}
                                        onChange={remeberMe}
                                        id="keepmeloggedin"
                                        name="keepmeloggedin"
                                    />
                                </label>
                            </div>
                        </div>

                        <div className="button-wrapper">
                            <button type="button" onClick={register} className="submit-button"><FontAwesomeIcon icon={faCircleArrowRight} id="arrow-icon" />Continue</button>
                            <p> Already have an account? <Link to='/login'>Log in here</Link></p>
                        </div>
                    </form>
                </div>
            </div>

        </div>
    )
}

export default Register
