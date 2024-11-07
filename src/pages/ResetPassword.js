import { BrowserRouter as Router, Route, Routes, Link, useParams } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import '../css/forgotandreset.css'
import { useState } from 'react'
import axios from 'axios'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUnlockKeyhole, faLock, faCheck, faArrowLeft } from '@fortawesome/free-solid-svg-icons';

const ResetPassword = (props) => {
    let { reset_id } = useParams();
    let navigate = useNavigate();

    const [passwordRes, setPasswordRes] = useState("");
    const [confirmationPassword, setConfirmationPassword] = useState("");

    const [passwordConfError, setPasswordConfError] = useState("");


    const resetPassword = async () => {
        try {
            await axios.patch(`${process.env.BACKEND_URL}/reset`, {
                withCredentials: true,
                password: passwordRes,
                confpassword: confirmationPassword,
                reset_id: reset_id

            }).then(() => {
                navigate('/login');
            });
        } catch (error) {
            if (error.response.status === 404) {
                setPasswordConfError("No Account Found. Please create an account")
            } else if (error.response.status === 409) {
                setPasswordConfError("Passwords do not match")
            };
        };
    };

    // Adds "Confirmation Password should match Password!" to form if Password and confirm Password do not match.
    const validatePassword = (e) => {
        var password = e.target.value

        if (passwordRes === password) {
            setPasswordConfError("");
            document.getElementById("authentactor-password error").style.borderColor = "";
        } else {
            setPasswordConfError("Confirmation Password should match Password");
            document.getElementById("authentactor-password error").style.borderColor = "rgb(218, 0, 0)";
        }
    };

    return (
        <div className="content-wrapper">


            <FontAwesomeIcon icon={faUnlockKeyhole} id="key" />
            <h1>Create new Password</h1>
            <p>Please enter your new password below.</p>

            <div id="wrapper">
                <form>
                    <div className="textarea" id="password">
                        <label><FontAwesomeIcon icon={faLock} /> New Password <br /></label>
                        <input
                            type="password"
                            onChange={(e) => {
                                setPasswordRes(e.target.value);
                            }}
                            id="authentactor-password"
                            autoComplete="on"
                            required
                        />
                    </div>

                    <div className="textarea" id="password">
                        <label>
                            <FontAwesomeIcon icon={faCheck} /> Confirm Password <br /></label>
                        <input
                            type="password"
                            onChange={(e) => {
                                validatePassword(e);
                                setConfirmationPassword(e.target.value);
                            }}
                            id="authentactor-password error"
                            autoComplete="on"
                            required
                        />
                    </div>
                    <span id="password-sapn">{passwordConfError}</span>


                    <div className="button-wrapper">
                        <button className="send-button" type="button" onClick={resetPassword} id="button">Reset Password</button>
                    </div>

                    <div id='arrow-wrapper'>
                        <Link to='/login'>
                            <FontAwesomeIcon icon={faArrowLeft} /><span>Back to login</span>
                        </Link>
                    </div>

                </form>

            </div>
        </div>
    )
}

export default ResetPassword;