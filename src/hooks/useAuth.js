import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";

export const useLogin = (setRole, onSuccessCallback) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (credentials) => {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Login failed");
      }

      return response.json();
    },
    onSuccess: (data) => {
      localStorage.setItem("user_id", data.id);
      localStorage.setItem("user_role", data.role);
      
      setRole(data.role);
      queryClient.invalidateQueries(["profile"]);
      
      if (onSuccessCallback) onSuccessCallback();
    },
  });
};

export const useRegister = (setRole, onSuccessCallback) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userData) => {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Registration failed");
      }

      return response.json();
    },
    onSuccess: (data) => {
      localStorage.setItem("user_id", data.id);
      localStorage.setItem("user_role", data.role);
      
      setRole(data.role);
      queryClient.invalidateQueries(["profile"]);

      if (onSuccessCallback) onSuccessCallback();
    },
  });
}

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