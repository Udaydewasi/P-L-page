// components/ProtectedRoute.js
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from 'prop-types';

const ProtectedRoute = ({ children, allowedRole }) => {
  const navigate = useNavigate();
  const user = localStorage.getItem("user");

  const parsedUser = JSON.parse(user);
  const role = parsedUser?.role;

  useEffect(() => {
    if (!user || role !== allowedRole) {
      localStorage.removeItem("user");
      // localStorage.removeItem("role");
      navigate("/", { replace: true });
    }
  }, [navigate, role, allowedRole]);

  return role === allowedRole ? children : null;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
  allowedRole: PropTypes.oneOf(['admin', 'user']).isRequired
};

export default ProtectedRoute;