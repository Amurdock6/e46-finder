import { Link } from 'react-router-dom'
import '../css/login.css';

const login = () => {
    return (
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
                        <h4>Don't Already have an account?   <Link to='register'>Create one here</Link></h4>
                    </div>

                </div>
        </div>
     </div>
    )
}

export default login
