import { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const GoogleSignIn = ({ keepMeLoggedIn, text = 'continue_with' }) => {
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!process.env.REACT_APP_GOOGLE_CLIENT_ID) {
        return null;
    }

    const handleSuccess = async (credentialResponse) => {
        if (!credentialResponse.credential) {
            setErrorMessage('Google did not return a sign-in credential. Please try again.');
            return;
        }

        setErrorMessage('');
        setIsSubmitting(true);

        try {
            await axios.post(
                `${process.env.REACT_APP_BACKEND_URL}/googlelogin`,
                {
                    idToken: credentialResponse.credential,
                    keepmeloggedin: keepMeLoggedIn,
                },
                { withCredentials: true }
            );
            navigate('/account');
        } catch (error) {
            const message = error.response?.data?.message
                || error.response?.data?.error
                || 'Unable to sign in with Google. Please try again.';
            setErrorMessage(message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div id="google-login" aria-busy={isSubmitting}>
            <GoogleLogin
                onSuccess={handleSuccess}
                onError={() => setErrorMessage('Google sign-in was not completed. Please try again.')}
                text={text}
                shape="rectangular"
                size="large"
                theme="outline"
                width="320"
                use_fedcm_for_button
            />
            {isSubmitting && <p className="google-login-status">Signing you in…</p>}
            {errorMessage && <p className="google-login-error" role="alert">{errorMessage}</p>}
        </div>
    );
};

export default GoogleSignIn;
