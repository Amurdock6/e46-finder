import { BrowserRouter as Router, Route, Routes, Link, Navigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark, faCircleArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom'
import NavBar from "../componets/NavBar/NavBar"
import Footer from '../componets/Footer/Footer'
import '../css/Logout.css'

const Logout = () => {
    let navigate = useNavigate();

    const login = async () => {
        navigate('/');
    }


    return (
        <div className="logout-page-wrapper">

            <NavBar />

<br />
<br />

            <div className="center-box">
                <h1>Logged Out</h1>
                <p>You have successfully logged out</p>

                <div id="Back-button">
                    <button type="button" onClick={login} className="submit-button"><FontAwesomeIcon icon={faCircleArrowLeft} id="arrow-icon" />Back To Listings</button>
                </div>
            </div>

            <Footer />

        </div>
    )
}

export default Logout;