import { BrowserRouter as Router, Route, Routes, Link, useParams } from 'react-router-dom'
import { IoMdArrowRoundBack } from 'react-icons/io'
import '../css/loginandregister.css'
import { useState } from 'react'
import axios from 'axios'

const ResetPassword = (props) => {
    let { reset_id } = useParams();

    const [password, setPassword] = useState("");

    const login = async () => {
        try {
            await axios.patch('http://localhost:5000/reset', {
                withCredentials: true,
                password: password,
                reset_id: reset_id

            });
        } catch (error) {
            console.log(error);
            // if (error.response.data === 'Password reset request all ready sent.') {
            //     console.log("Password reset request all ready sent.")
            // } else if (error.response.status === 404) {
            //     console.log("No email found. Please create an account.")
            // };
        };
    };

    // Checks if password has been submited or not

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


                    <h1>Please Enter New Password</h1>

                    <div className="wrapper">
                        <form>
                            <div className="textarea" id="password">
                                <input
                                    type="password"
                                    onChange={(e) => {
                                        setPassword(e.target.value);
                                    }}
                                    id="authentactor-password"
                                    placeholder="New Password"
                                    required
                                />
                            </div>

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

export default ResetPassword;