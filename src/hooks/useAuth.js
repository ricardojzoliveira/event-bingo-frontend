import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import api from "../api/api";
import Cookies from "js-cookie";

// Hook para o registo.
export const useRegister = (setRole, onSuccessCallback) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userData) => {
      const response = await api.post("/auth/register", userData);
      // Guarda o token de autenticação.
      return response.data; 
    },
    onSuccess: (data) => {
      if (data.token) {
        // Guarda o token nos cookies(mais seguros).
        Cookies.set("token", data.token, { expires: 1, secure: true, sameSite: "strict" });
      }
      // Atualiza o profile e o user, para não ficar dados antigos.
      queryClient.invalidateQueries(["profile"]);
      queryClient.invalidateQueries(["user"]);

      if (onSuccessCallback) onSuccessCallback();
    },
  });
};

// Hook para o login.
export const useLogin = (onSuccessCallback) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (credentials) => {
      const response = await api.post("/auth/login", credentials);
      // Guarda o token de autenticação.
      return response.data;
    },
    onSuccess: (data) => {
      if (data.token) {
        // Guarda o token nos cookies(mais seguros).
        Cookies.set("token", data.token, { expires: 1, secure: true, sameSite: "strict" });
      }
      // Atualiza o profile e o user, para não ficar dados antigos.
      queryClient.invalidateQueries(["currentUser"]);
      queryClient.invalidateQueries(["profile"]);

      if (onSuccessCallback) onSuccessCallback();
    },
  });
};

export const useCurrentUser = () => {
  return useQuery({
    queryKey: ["currentUser"],
    queryFn: async () => {
      const token = Cookies.get("token");

      if (!token) return null;

      const response = await api.get("/users/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const userData = response.data;
      if (userData && userData.role) {
        userData.role = userData.role.toLowerCase();
      }

      return userData;
    },
    staleTime: 1000 * 60 * 5, // Considera os dados "frescos" por 5 minutos (evita pedidos repetidos a cada clique)
    retry: false, // Se der erro 401 (token expirado), não vale a pena tentar novamente
    refetchOnWindowFocus: false, // Evita disparar pedidos sempre que o utilizador muda de aba no browser
  });
};

export function useProfile() {
  return useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const userId = localStorage.getItem("user_id");
      
      const response = await fetch("/api/profile", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${userId}`, 
        },
      });

      if (!response.ok) throw new Error("Failed to fetch profile");
      return response.json();
    },
  });
}; 

export function useWallet() {
  const queryClient = useQueryClient();
  const userId = localStorage.getItem("user_id");

  const useTransactions = () => {
    return useQuery({
      queryKey: ["wallet", userId],
      queryFn: async () => {
        const response = await fetch("/api/wallet", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${userId}`,
          },
        });
        if (!response.ok) throw new Error("Failed to fetch wallet history");
        return response.json(); 
      },
      enabled: !!userId, 
    });
  };

  const useTransactionMutation = () => {
    return useMutation({
      mutationFn: async ({ amount, type }) => {
        const response = await fetch("/api/wallet/transaction", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${userId}`,
          },
          body: JSON.stringify({ amount, type }),
        });
        if (!response.ok) throw new Error("Transaction failed");
        return response.json();
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["wallet", userId] });
        queryClient.invalidateQueries({ queryKey: ["profile"] }); 
      },
    });
  };

  return { useTransactions, useTransactionMutation };
}