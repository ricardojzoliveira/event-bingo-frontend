import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";

export default function Logout({ setRole }) {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    useEffect(() => {
        setRole(null);

        queryClient.clear();

        navigate("/");
    }, [setRole, navigate, queryClient]);

    return null;
}