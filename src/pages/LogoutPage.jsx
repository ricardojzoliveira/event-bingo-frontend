import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function Logout({ setRole }) {
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem("user_role");
    
    setRole(null);
    
    navigate("/");
  }, [setRole, navigate]);

  return null;
}