import axios from 'axios'
import { Outlet, Navigate } from "react-router"
import { useEffect, useState } from 'react'

const useAuth = () => {
  const [data, setData] = useState();

  useEffect(() => {
      const fetchAuthData = async () => {
          try {
              const resp = await axios.get('http://localhost:5000/auth', { withCredentials: true });

              if (resp.data === true) {
                  setData(true);
              } else {
                  setData(false);
              }
          } catch (err) {
              setData(false);
          }
      };

      fetchAuthData();
  }, []);
  return data;
};

const ProtectedRoutes = () => {
  const isAuth = useAuth();
  if (isAuth === undefined) {
    return null
  };

  return isAuth ? <Outlet/> : <Navigate to="/login" />;
}

export default ProtectedRoutes