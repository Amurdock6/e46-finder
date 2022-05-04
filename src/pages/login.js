import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import '../css/login.css'
import { IoMdArrowRoundBack } from 'react-icons/io'
import { useState } from 'react'
import axios from 'axios'
import validator from 'validator';
import { GoogleLogin } from 'react-google-login';

const Login = () => {
    let navigate = useNavigate();


    const [email, setEmail] = useState("");
    const [emailError, setEmailError] = useState("");
    const [password, setPassword] = useState("");

    const login = async () => {
        await axios.post('http://localhost:5000/login', {
            withCredentials: true,
            email: email,
            password: password,
            // Sets httpOnly cookie with jwt from backend
        }).then(sendToken => {
            return axios.get('http://localhost:5000', { withCredentials: true }).then((res) => {
                // console.log(res.data)
            });
        });
        navigate('/account');

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

    // Sign in with Google logic 
    const onSuccess = async (response) => {

        try {
            await axios({
                method: 'POST',
                url: 'http://localhost:5000/googlelogin',
                data: { idToken: response.tokenId }
            }).then(sendToken => {
                return axios.get('http://localhost:5000', { withCredentials: true }).then((res) => {
                })

            })

        } catch (error) {
            console.log(error);
        }

       navigate('/account');
    }

    const onFailure = (res) => {
        console.log("Login Failed! res: ", res);
    }


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

                    <GoogleLogin
                        clientId={'793531866299-a0lqtj70qp6s1200hhpl08rba6195m7h.apps.googleusercontent.com'}
                        buttonText="Login with Google"
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
                                        setEmail(e.target.value);
                                    }}
                                    id="authentactor-email"
                                    placeholder="Email"
                                    defaultValue=""
                                    required
                                />
                            </div>
                            <span id="email-span">{emailError}</span>

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
