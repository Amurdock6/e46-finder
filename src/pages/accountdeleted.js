import { BrowserRouter as Router, Route, Routes, Link, Navigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark, faCircleArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom'
import NavBar from "../componets/NavBar/NavBar"
import Footer from '../componets/Footer/Footer'
import '../css/Logout.css'

const AccountDeleted = () => {
    let navigate = useNavigate();

    const home = async () => {
        navigate('/');
    }


    return (
        <div className="logout-page-wrapper">

            <NavBar />

            <br />
            <br />

            <div className="center-box">
                <h1>Account Deleted</h1>
                <p>Account successfully deleted.</p>

                <div id="Back-button">
                    <button type="button" onClick={home} className="submit-button"><FontAwesomeIcon icon={faCircleArrowLeft} id="arrow-icon" />Back To Listings</button>
                </div>
            </div>

            <Footer />

        </div>
    )
}

export default AccountDeleted;