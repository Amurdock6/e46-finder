import '../css/ErrorPage.css'
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom'

function errorpage() {
    return (
        <div className='error-page-wrapper'>
            <div className="m-boxes">
                <span></span>
                <span></span>
                <span></span>
            </div>
            <div className="error-wrapper">
                <h1 id="error">404 Page Not Found</h1>
                <h2 id="error-text">Page has either moved or dosn't exist <Link to='/'>Back to E46 Finder</Link> </h2>
            </div>
        </div>
    )
}

export default errorpage
