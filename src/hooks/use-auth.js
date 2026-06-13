import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import api from "../api/api";
import Cookies from "js-cookie";

// register
export const useRegister = (setRole, onSuccessCallback) => {
  const queryClient = useQueryClient(); 

  return useMutation({
    mutationFn: async (userData) => {
      const response = await api.post("/auth/register", userData); 
      return response.data; 
    },
    onSuccess: (data) => {
      if (data.token) {
        Cookies.set("token", data.token, {
          expires: 1,
          secure: true,
          sameSite: "strict",
        }); // create token, save it during 24 hours and security
      }
      queryClient.invalidateQueries(["currentUser"]);
      queryClient.invalidateQueries(["profile"]);

      if (onSuccessCallback) onSuccessCallback(); // if success go to homepage
    },
  });
};

// login
export const useLogin = (onSuccessCallback) => {
  const queryClient = useQueryClient(); 

  return useMutation({
    mutationFn: async (credentials) => {
      const response = await api.post("/auth/login", credentials); 
      return response.data; 
    },
    onSuccess: (data) => {
      if (data.token) {
        Cookies.set("token", data.token, {
          expires: 1,
          secure: true,
          sameSite: "strict",
        }); // create token, save it during 24 hours and security
      }
      queryClient.invalidateQueries(["currentUser"]); 
      queryClient.invalidateQueries(["profile"]); 

      if (onSuccessCallback) onSuccessCallback(); // if success go to homepage
    },
  });
};

//checks user
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

      const userData = response.data; // save response

      if (userData && userData.role) {
        // if userData and role exist
        userData.role = userData.role.toLowerCase();
      }

      return userData; // return user data and role transformed
    },
    staleTime: 1000 * 60 * 5, // saves user data during 5 minutes
    retry: false, // don´t repeat request if fail on 1st try
    refetchOnWindowFocus: false, // don´t repeat request if change window
  });
};

// wallet functions
export function useWallet() {
  const queryClient = useQueryClient(); 
  const token = Cookies.get("token"); 

  // get transactions
  const useTransactions = () => {
    return useQuery({
      queryKey: ["walletTransactions", token], 
      queryFn: async () => {
        const response = await api.get(
          `/transactions?size=999999&sort=date,desc`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        return response.data; // if user token returns each user transactions, if admin token returns all transactions
      },
      enabled: !!token, 
    });
  };

  // deposit or withdraw
  const useTransactionMutation = () => {
    return useMutation({
      mutationFn: async (transactionData) => {
        const payload = {
          ...transactionData,
          type: transactionData.type.toUpperCase(),
        }; // build payload

        const response = await api.post("/transactions",payload, // request
          {
            headers: {
              Authorization: `Bearer ${token}`, 
            },
          },
        );
        return response.data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["currentUser"] }); 
        queryClient.invalidateQueries({ queryKey: ["walletTransactions"] }); 
      },
    });
  };

  // help with visual animation
  const useClaimPrizeMutation = () => {
    return useMutation({
      mutationFn: async (transactionId) => {
        const response = await api.patch( 
          `/transactions/${transactionId}`,
          { claimed: true },
          {
            headers: { Authorization: `Bearer ${token}` }, 
          },
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

// update user info
export function useUpdateProfile() {
  const queryClient = useQueryClient(); 
  const { data: user } = useCurrentUser(); 
  const token = Cookies.get("token"); 

  return useMutation({
    mutationFn: async (updatedData) => {
      const response = await api.patch(`/users/${user.id}`, updatedData, { 
        headers: {
          Authorization: `Bearer ${token}`, 
        },
      });

      return response.data; 
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["currentUser"],
      });
    }, 
  });
}

// delete account
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

// self exclude user
export function useSelfExclusion() {
  const queryClient = useQueryClient(); 
  const { data: user } = useCurrentUser(); 

  return useMutation({
    mutationFn: async () => {
      const token = Cookies.get("token"); 
      return await api.patch( 
        `/users/${user.id}`,
        { status: "SUSPENDED" }, 
        {
          headers: {
            Authorization: `Bearer ${token}`, 
          },
        },
      );
    },
    onSuccess: () => {
      Cookies.remove("token"); 
      queryClient.setQueryData(["currentUser"], null); 
      queryClient.clear(); 
    },
  });
}
