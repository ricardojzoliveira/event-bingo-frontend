import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Cookies from "js-cookie";
import { useQueryClient } from "@tanstack/react-query";

export default function Logout() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  useEffect(() => {

    Cookies.remove("token");

    queryClient.setQueryData(["currentUser"], null);

    navigate("/");
  }, [navigate, queryClient]);

  return null;
}