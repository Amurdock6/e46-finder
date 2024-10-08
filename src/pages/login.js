import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import '../css/loginandregister.css'
import { useState } from 'react'
import axios from 'axios'
import validator from 'validator';
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleArrowRight, faLock, faEnvelope, faXmark, faCircleInfo } from '@fortawesome/free-solid-svg-icons';
import Tooltip from '@mui/material/Tooltip';
import Button from '@mui/material/Button';

const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;

const Login = () => {

    let navigate = useNavigate();


    const [email, setEmail] = useState("");
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [password, setPassword] = useState("");
    const [keepMeLoggedIn, setKeepMeLoggedIn] = useState(false);

    const login = async () => {
        try {
            await axios.post('http://localhost:5000/login', {
                withCredentials: true,
                email: email,
                password: password,
                keepmeloggedin: keepMeLoggedIn
            }).then(async () => {
                return await axios.get('http://localhost:5000/', { withCredentials: true }).then((res) => {

                }).then(() => {
                    navigate('/account');
                });
            });
        } catch (error) {
            if (error.response.data === 'Invalid Email') {
                document.getElementById("authentactor-email").style.borderColor = "rgb(218, 0, 0)";
                document.getElementById("authentactor-password").style.borderColor = "";
                setEmailError("Invalid Email")
                setPasswordError("")
            } else if (error.response.data === 'Invalid Password') {
                document.getElementById("authentactor-password").style.borderColor = "rgb(218, 0, 0)";
                document.getElementById("authentactor-email").style.borderColor = "";
                setPasswordError("Invalid Password")
                setEmailError("")
            } else if (error.response.data === 'All input is required') {
                if (!email) {
                    document.getElementById("authentactor-email").style.borderColor = "rgb(218, 0, 0)";
                } else {
                    document.getElementById("authentactor-email").style.borderColor = "";
                };

                if (!password) {
                    document.getElementById("authentactor-password").style.borderColor = "rgb(218, 0, 0)";
                } else {
                    document.getElementById("authentactor-password").style.borderColor = "";
                };
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
            setEmailError("Please enter valid Email");
            document.getElementById("email").style.paddingBottom = "0";
        }
    };

    // Sign in with Google logic 
    const onSuccess = async (response) => {
        try {
            await axios({
                method: 'POST',
                url: 'http://localhost:5000/googlelogin',
                withCredentials: true,
                data: { idToken: response.credential }  // Use 'credential' instead of 'tokenId'
            }).then(sendToken => {
                return axios.get('http://localhost:5000/', { withCredentials: true }).then((res) => {
                    // Handle the response if needed
                });
            });

            navigate('/account');
        } catch (error) {
            console.error(error);
        }
    };

    // Remeber me check box logic
    const remeberMe = () => {
        setKeepMeLoggedIn(!keepMeLoggedIn);
    };


    return (
        <div id='whole-page-wrapper'>
            <GoogleOAuthProvider clientId={clientId}>
                <div className='left-side'>

                </div>

                <div className='right-side'>
                    <div id='x-wrapper'>
                        <Link to="/"><FontAwesomeIcon icon={faXmark} id="back-to-home" /></Link>
                    </div>

                    <div id='content-wrapper'>


                        <h1>
                            Log into E46 Finder
                        </h1>
                        <p>
                            Welcome back! Login to access your account!
                        </p>

                        <div id='google-login'>
                            <GoogleLogin 
                            clientId={clientId}
                            buttonText="Login"
                            onSuccess={onSuccess} 
                            onError={() => console.log('Login Failed')}
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
                                            setEmail(e.target.value);
                                        }}
                                        id="authentactor-email"
                                        defaultValue=""
                                        onKeyPress={(e) => e.key === 'Enter' && login()}
                                        required
                                    />
                                </div>
                            </div>
                            <span id="email-span">{emailError}</span>

                            <div id='password-wrapper'>
                                <div className="textarea" id="password">
                                    <label>
                                        <FontAwesomeIcon icon={faLock} /> Password <br /></label>
                                    <input
                                        type="password"
                                        onChange={(e) => {
                                            setPassword(e.target.value);
                                        }}
                                        id="authentactor-password"
                                        autoComplete="on"
                                        onKeyPress={(e) => e.key === 'Enter' && login()}
                                        required
                                    />
                                </div>
                            </div>
                            <span id="password-span">{passwordError}</span>


                            <div className="bottom-form-container">
                                <p><Link to='/forgotpassword'>Forgot Password?</Link></p>

                                <div className="checkBox" id="checkbox">
                                    <Tooltip title="Check this box if you would like to stay logged in even after you close your browser. You will stay logged in to e46finder.app as long as you don't clear your cookies." arrow>
                                        <Button id="info-button"><FontAwesomeIcon icon={faCircleInfo} /></Button>
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
                                <button type="button" onClick={login} className="submit-button"><FontAwesomeIcon icon={faCircleArrowRight} id="arrow-icon" />Continue</button>
                                <p> Don't already have an account? <Link to='/register'>Create one here</Link></p>
                            </div>
                        </form>
                    </div>
                </div>
            </GoogleOAuthProvider>
        </div>
    )
}

export default Login
