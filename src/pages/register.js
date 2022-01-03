import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom'
import '../css/register.css';
import {IoMdArrowRoundBack} from 'react-icons/io'


const register = () => {
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

            <h1>Create Account</h1>

                <div className="wrapper">
                    <form action="/register" method="POST">
                        <div className="textarea" id="email">
                            <input type="email" name="email" id="authentactor-email" placeholder="Email" defaultValue="" required />
                        </div>

                        <div className="textarea" id="username">
                            <input type="text" name="name" id="authentactor-text" placeholder="Username" defaultValue="" required />
                        </div>

                        <div className="textarea" id="password">
                            <input type="password" name="password" id="authentactor-password" placeholder="Password" defaultValue="" required />
                        </div>

                        <div id="button-wrapper">
                            <button type="submit" id="button">Create Account</button>
                        </div>
                    </form>


                    <div className='bottom-text-wrapper'>
                        <h4>Already have an account?   <Link to='/login'>Login Here</Link></h4>
                    </div>
                    
                </div>
            </div>
        </div>
    </div>
    )
}

export default register
