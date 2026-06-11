import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import api from "../api/api";
import Cookies from "js-cookie";

// Registar novo utilizador e guardar token nos cookies.
export const useRegister = (setRole, onSuccessCallback) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userData) => {
      const response = await api.post("/auth/register", userData);
      return response.data; 
    },
    onSuccess: (data) => {
      if (data.token) {
        Cookies.set("token", data.token, { expires: 1, secure: true, sameSite: "strict" });
      }
      queryClient.invalidateQueries(["currentUser"]);
      queryClient.invalidateQueries(["profile"]);

      if (onSuccessCallback) onSuccessCallback();
    },
  });
};

// Faz login do utilizador.
export const useLogin = (onSuccessCallback) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (credentials) => {
      const response = await api.post("/auth/login", credentials);
      return response.data;
    },
    onSuccess: (data) => {
      if (data.token) {
        Cookies.set("token", data.token, { expires: 1, secure: true, sameSite: "strict" });
      }
      queryClient.invalidateQueries(["currentUser"]);
      queryClient.invalidateQueries(["profile"]);

      if (onSuccessCallback) onSuccessCallback();
    },
  });
};

// Procura dados do utilizador com token.
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
    staleTime: 1000 * 60 * 5, 
    retry: false, 
    refetchOnWindowFocus: false, 
  });
};

export function useWallet() {
  const queryClient = useQueryClient();
  const token = Cookies.get("token");

  // Lista transações do utilizador.
  const useTransactions = () => {
    return useQuery({
      queryKey: ["walletTransactions", token], 
      queryFn: async () => {
        const response = await api.get(`/transactions?size=9999&sort=date,desc`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        return response.data; 
      },
      enabled: !!token,
    });
  };

  // Processa deposito ou levantamento.
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

  const useClaimPrizeMutation = () => {
    return useMutation({
      mutationFn: async (transactionId) => {
        const response = await api.patch(
          `/transactions/${transactionId}`,
          { claimed: true }, 
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        return response.data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["walletTransactions"] });
      },
    });
  };

  return { useTransactions, useTransactionMutation, useClaimPrizeMutation };
}

// Atualiza informações do perfil do user.
export function useUpdateProfile() {
  const queryClient = useQueryClient();
  const { data: user } = useCurrentUser();
  const token = Cookies.get("token");

  return useMutation({
    mutationFn: async (updatedData) => {
      const response = await api.patch(
        `/users/${user.id}`,
        updatedData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["currentUser"],
      });
    },
  });
}

// Elimina a conta do utilizador.
export function useDeleteAccount() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userId) => {
      const token = Cookies.get("token");
      
      return await api.delete(`/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    },
    onSuccess: () => {
      Cookies.remove("token");
      queryClient.setQueryData(["currentUser"], null); 
      queryClient.clear(); 
    },
  });
}

// Tive de criar este hook porque a navbar não atualiza.
export function useSelfExclusion() {
  const queryClient = useQueryClient();
  const { data: user } = useCurrentUser();

  return useMutation({
    mutationFn: async () => {
      const token = Cookies.get("token");
      return await api.patch(`/users/${user.id}`, { status: "SUSPENDED" }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    },
    onSuccess: () => {
      Cookies.remove("token");
      queryClient.setQueryData(["currentUser"], null); 
      queryClient.clear(); 
    },
  });
}
