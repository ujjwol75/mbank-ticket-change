import { useEffect, useMemo, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";

function PrivateRoute({ children }) {
  const [auth, setauth] = useState(false);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  useMemo(() => {
    if (token) {
      setauth(true);
      navigate("/");
    } else {
      navigate("/login");
    }
  }, [token])




  return auth ? children : <Navigate to="/login" />;
}

export default PrivateRoute;
