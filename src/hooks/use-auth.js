import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import api from "../api/api";
import Cookies from "js-cookie";

// register
export const useRegister = (setRole, onSuccessCallback) => {
  const queryClient = useQueryClient(); // get queryClient instance

  return useMutation({
    mutationFn: async (userData) => {
      const response = await api.post("/auth/register", userData); // request
      return response.data; // response from server
    },
    onSuccess: (data) => {
      if (data.token) {
        Cookies.set("token", data.token, {
          expires: 1,
          secure: true,
          sameSite: "strict",
        }); // create token, save it during 24 hours and security
      }
      queryClient.invalidateQueries(["currentUser"]); // clear current user cache and update it
      queryClient.invalidateQueries(["profile"]); // clear profile cache and update it

      if (onSuccessCallback) onSuccessCallback(); // if success go to homepage
    },
  });
};

// login
export const useLogin = (onSuccessCallback) => {
  const queryClient = useQueryClient(); // get queryClient instance

  return useMutation({
    mutationFn: async (credentials) => {
      const response = await api.post("/auth/login", credentials); // request
      return response.data; // response from server
    },
    onSuccess: (data) => {
      if (data.token) {
        Cookies.set("token", data.token, {
          expires: 1,
          secure: true,
          sameSite: "strict",
        }); // create token, save it during 24 hours and security
      }
      queryClient.invalidateQueries(["currentUser"]); // clear current user cache and update it
      queryClient.invalidateQueries(["profile"]); // clear profile cache and update it

      if (onSuccessCallback) onSuccessCallback(); // if success go to homepage
    },
  });
};

//checks user
export const useCurrentUser = () => {
  return useQuery({
    queryKey: ["currentUser"], // react cache for current user
    queryFn: async () => {
      const token = Cookies.get("token"); // get token

      if (!token) return null;

      const response = await api.get("/users/me", {
        // request
        headers: {
          Authorization: `Bearer ${token}`, // send token
        },
      });

      const userData = response.data; // save response

      if (userData && userData.role) {
        // if userData and role exist
        userData.role = userData.role.toLowerCase(); // transform role string
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
  const queryClient = useQueryClient(); // get queryClient instance
  const token = Cookies.get("token"); // get token

  // get transactions
  const useTransactions = () => {
    return useQuery({
      queryKey: ["walletTransactions", token], // react cache for transactions
      queryFn: async () => {
        const response = await api.get(
          `/transactions?size=999999&sort=date,desc`,
          {
            // request
            headers: {
              Authorization: `Bearer ${token}`, // send token
            },
          },
        );

        return response.data; // if user token returns each user transactions, if admin token returns all transactions
      },
      enabled: !!token, // waits for token to not be null or undefined
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
              Authorization: `Bearer ${token}`, // send token
            },
          },
        );
        return response.data; // response from server
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["currentUser"] }); // clear react current user cache and update it
        queryClient.invalidateQueries({ queryKey: ["walletTransactions"] }); // clear react transactions cache and update it
      },
    });
  };

  // help with visual animation
  const useClaimPrizeMutation = () => {
    return useMutation({
      mutationFn: async (transactionId) => {
        const response = await api.patch( // request
          `/transactions/${transactionId}`,
          { claimed: true },
          {
            headers: { Authorization: `Bearer ${token}` }, // token
          },
        );
        return response.data; // response from server 
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["walletTransactions"] }); // clear react transactions cache and update it
      },
    });
  };

  return { useTransactions, useTransactionMutation, useClaimPrizeMutation }; // return all functions
}

// update user info
export function useUpdateProfile() {
  const queryClient = useQueryClient(); // get queryClient instance
  const { data: user } = useCurrentUser(); // get user info
  const token = Cookies.get("token"); // get token

  return useMutation({
    mutationFn: async (updatedData) => {
      const response = await api.patch(`/users/${user.id}`, updatedData, { // request
        headers: {
          Authorization: `Bearer ${token}`, // send token
        },
      });

      return response.data; // response from server
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["currentUser"],
      });
    }, // clear react current user cache and update it if success on update user
  });
}

// delete account
export function useDeleteAccount() {
  const queryClient = useQueryClient(); // get queryClient instance

  return useMutation({
    mutationFn: async (userId) => {
      const token = Cookies.get("token"); // get token

      return await api.delete(`/users/${userId}`, { // request
        headers: {
          Authorization: `Bearer ${token}`, // send token
        },
      });
    },
    onSuccess: () => {
      Cookies.remove("token"); // remove token
      queryClient.setQueryData(["currentUser"], null); // clear react current user cache
      queryClient.clear(); // clear query client instance
    },
  });
}

// self exclude user
export function useSelfExclusion() {
  const queryClient = useQueryClient(); // get queryClient instance
  const { data: user } = useCurrentUser(); // get user info

  return useMutation({
    mutationFn: async () => {
      const token = Cookies.get("token"); // get token
      return await api.patch( // request
        `/users/${user.id}`,
        { status: "SUSPENDED" }, // send user status
        {
          headers: {
            Authorization: `Bearer ${token}`, // send token
          },
        },
      );
    },
    onSuccess: () => {
      Cookies.remove("token"); // remove token
      queryClient.setQueryData(["currentUser"], null); // clear react current user cache
      queryClient.clear(); // clear query client instance
    },
  });
}
