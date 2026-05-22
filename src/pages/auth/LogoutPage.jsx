import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Cookies from "js-cookie";

export default function Logout({}) {
  const navigate = useNavigate();

  useEffect(() => {
    Cookies.remove("token");
    
    navigate("/");
  }, [navigate]);

  return null;
}