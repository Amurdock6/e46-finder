import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom'
import '../css/login.css'
import {IoMdArrowRoundBack} from 'react-icons/io'

//http://192.168.50.84:3000/login
//http://192.168.164.1:3000/login
// if(document.URL.indexOf("http://localhost:3000/login") >= 0){
//     document.body.style.backgroundImage = `url(${Background})`
// } else {
//     document.body.style.backgroundImage = 'none'
// }

// if(!document.URL.indexOf("http://localhost:3000/login") >= 0) {
//     document.body.style.backgroundImage = 'none'
// }  

const login = () => {
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

                <div className="wrapper">
                    <form action="/login" method="POST">
                        <div className="textarea" id="email">
                            <input type="email" name="email" id="authentactor-email" placeholder="Email" defaultValue="" required />
                        </div>

                        <div className="textarea" id="password">
                            <input type="password" name="password" id="authentactor-password" placeholder="Password" defaultValue="" required />
                        </div>

                        <div id="button-wrapper">
                            <button type="submit" id="button">Login</button>
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

export default login
