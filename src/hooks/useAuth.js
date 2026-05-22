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
      queryClient.invalidateQueries(["currentUser"]);
      queryClient.invalidateQueries(["profile"]);

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

// Hook para ir buscar o user atual.
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
  const token = Cookies.get("token");

  const useTransactions = () => {
    return useQuery({
      queryKey: ["walletTransactions", token], 
      queryFn: async () => {
        const response = await api.get("/transactions", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        return response.data; 
      },
      enabled: !!token,
    });
  };

  const useTransactionMutation = () => {
    return useMutation({
      mutationFn: async ({ amount, type, cardNumber, cardValid, cardHolderName, ccNumber }) => {
        const upperType = type.toUpperCase();

        const response = await api.post(
          "/transactions",
          {
            type: upperType,
            amount: amount,
            cardNumber: cardNumber,
            cardValid: cardValid,
            cardHolderName: cardHolderName,
            ccNumber: ccNumber
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        return response.data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["currentUser"] });
        queryClient.invalidateQueries({ queryKey: ["walletTransactions"] });
      },
    });
  };

  return { useTransactions, useTransactionMutation };
}
