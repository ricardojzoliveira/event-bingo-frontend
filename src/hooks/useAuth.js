import { useMutation } from "@tanstack/react-query";

export function useLogin(setRole, onSuccesCallback){
    return useMutation({
        mutationFn: async (credentials) => {
            const response = await fetch("/api/login", {
                method: "POST",
                headers: {"Content-Type": "application/json" },
                body: JSON.stringify(credentials),
            });

            if (!response.ok) throw new Error("Wrong Credentials");
            return response.json();
        },
        onSuccess: (data) => {
            setRole(data.role);
            if (onSuccesCallback) onSuccesCallback();
        },
    });
}