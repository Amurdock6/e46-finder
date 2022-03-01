import axios from 'axios'
import { Outlet, Navigate } from "react-router";
import { useEffect, useState } from 'react';

const useAuth = () => {

  const [data, setData] = useState();

  useEffect(() => {
    const fetchAuthData = async () => {
      await axios.get('http://localhost:5000/auth')
        .then(resp => {
          console.log(resp.data)
          setData(!!resp.data);
        })
        .catch(err => {
          console.log(err);
          setData(false)
        });


    };

    fetchAuthData()
  }, []);
  console.log(data)
  return data;


};

const ProtectedRoutes = () => {
  const isAuth = useAuth();
  console.log(isAuth)
  if (isAuth === undefined) return null;

  return isAuth ? <Outlet/> : <Navigate to="/login" />;
}

export default ProtectedRoutes

// Need to assign the auth cookie with the user on login as well as the user id and send it with the httpOnly token on login/registration
// Then keep this page as is just change up the value of auth to be a random string so instead of true or false make it a ran string val 
// That i will first send to the front end from backend when logedin/registration
// Then send it to backend to verify that value is correct and not something a user added
// this should make protected route more secure