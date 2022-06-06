import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import '../css/forgotandreset.css'
import { useState } from 'react'
import axios from 'axios'
import validator from 'validator';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faKey, faEnvelope, faArrowLeft } from '@fortawesome/free-solid-svg-icons';


const ForgotPassword = () => {
    let navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [emailError, setEmailError] = useState("");
    const [emailsent, setEmailsent] = useState(false);

    const login = async () => {
        try {
            await axios.post('https://backend.e46finder.app/forgot', {
                withCredentials: true,
                email: email,
            }).then(() => {
                setEmailsent(true);
                navigate('/login');
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

    return (
        <div className="content-wrapper">


            <FontAwesomeIcon icon={faKey} id="key" />
            <h1>Forgot Your Password?</h1>
            <p>Don't worrier, we'll send you reset instructions.</p>

            <div id="wrapper">
                <form>
                    <div className="textarea" id="email">
                        <label><FontAwesomeIcon icon={faEnvelope} /> Email <br /></label>
                        <input
                            type="email"
                            onChange={(e) => {
                                validateEmail(e);
                                setEmail(e.target.value);
                            }}
                            id="authentactor-email"
                            placeholder=""
                            defaultValue=""
                            required
                        />
                    </div>
                    <span id="email-span">{emailError}</span>


                    <div className="button-wrapper">
                        <button className="send-button" type="button" onClick={login} id="button">Send instructions</button>
                    </div>

                    <div id='arrow-wrapper'>
                        <Link to='/confirmation'>
                            <FontAwesomeIcon icon={faArrowLeft} /><span>Back to login</span>
                        </Link>
                    </div>

                </form>

            </div>
        </div>
    )
}

export default ForgotPassword