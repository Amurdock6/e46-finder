import { BrowserRouter as Router, Route, Routes, Link, Navigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleArrowLeft, faRectangleXmark } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom'
import NavBar from "../componets/NavBar/NavBar"
import Footer from '../componets/Footer/Footer'
import axios from "axios"
import '../css/Logout.css'

const Deleted = () => {
    let navigate = useNavigate();


    const back = () => {

    }

    // Send request to delete users account
    const deleteAccount = async () => {
        try {
            await axios.get('https://backend.e46finder.app/delete', {
                withCredentials: true
            });

            navigate('/accountdeleted');
        } catch (error) {
            console.log(error);
        };
    }


    return (
        <div className="logout-page-wrapper">

            <NavBar />

<br />
<br />

            <div className="center-box">
                <h1>Are you sure you want to delete your account?</h1>
                <p>Click delete bellow to delete your account</p>

                <div id="Back-button">
                    <button type="button" onClick={back} className="submit-button"><FontAwesomeIcon icon={faCircleArrowLeft} id="arrow-icon" />Back to Account page</button>
                    <p id="delete-or">or</p>
                    <button type="button" id="delete-button" onClick={deleteAccount} className="submit-button"><FontAwesomeIcon icon={faRectangleXmark} id="arrow-icon" />Delete Account</button>
                </div>
            </div>

            <Footer />

        </div>
    )
}

export default Deleted;