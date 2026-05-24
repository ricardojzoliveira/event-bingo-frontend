import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Cookies from "js-cookie";
import { useQueryClient } from "@tanstack/react-query";

export default function Logout() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  useEffect(() => {

    //Remove o token do utilizador dos cookies.
    Cookies.remove("token");

    // Dá reset do estado do utiliador.
    queryClient.setQueryData(["currentUser"], null);

    // Redireciona para a página inicial.
    navigate("/");
  }, [navigate, queryClient]);

  return null;
}