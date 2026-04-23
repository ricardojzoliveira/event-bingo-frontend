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
            localStorage.setItem("user_role", data.role);
            setRole(data.role);
            if (onSuccesCallback) onSuccesCallback(data);
        },
    });
}

export function useRegister(setRole, onSuccessCallback) {
    return useMutation({
        mutationFn: async (userData) => {
            const response = await fetch("/api/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(userData),
            });

            // Se o backend retornar um erro (ex: email já existe)
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Erro ao criar conta");
            }

            return response.json();
        },
        onSuccess: (data) => {
            // Normalmente, após o registo, o utilizador fica logo logado
            if (data.role) {
                localStorage.setItem("user_role", data.role);
                setRole(data.role);
            }
            
            if (onSuccessCallback) onSuccessCallback(data);
        },
    });
}