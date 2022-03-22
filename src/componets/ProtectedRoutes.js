import axios from 'axios'
import { Outlet, Navigate } from "react-router";
import { useEffect, useState } from 'react';

const useAuth = () => {

  const [data, setData] = useState();

  useEffect(() => {
    const fetchAuthData = async () => {
      await axios.get('http://localhost:5000/auth')
      
        .then(resp => {
          console.log(!!resp.data)
          if (!!resp.data === true) {
            setData(true)
          } else if (!!resp.data === false) {
            setData(false)
          } else {
            alert('Error')
          }
        })
        .catch(err => {
          console.warn(err);
          setData(false)
        })

    };

    fetchAuthData()
  }, []);
  console.log(data)
  return data;
  
};

const ProtectedRoutes = () => {
  const isAuth = useAuth();
  // const isAuth = true;
  console.log(isAuth)
  if (isAuth === undefined) return null;

  return isAuth ? <Outlet/> : <Navigate to="/login" />;
}

export default ProtectedRoutes