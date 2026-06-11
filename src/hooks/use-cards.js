import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Cookies from "js-cookie";
import api from "../api/api";

// get all cards
export function useCards() {
  return useQuery({
    queryKey: ["cards"], // react cache for cards
    queryFn: async () => {
      const response = await api.get("/cards?size=999999"); // request

      return response.data.content; // cards lits
    },
  });
}

// get card by id
export function useCard(id) {
  return useQuery({
    queryKey: ["card", id], // react cache for card
    queryFn: async () => {      
      const response = await api.get(`cards/${id}`); // request

      return response.data; // cardid info
    },
    enabled: !!id, // waits for id to not be null or undefined
  });
}

//buy card
export const useBuyCard = () => {
  const queryClient = useQueryClient(); // get queryClient instance

  return useMutation({
    mutationFn: async ({ cardId }) => {
      const token = Cookies.get("token"); // get token
      const response = await api.post(`cards/${cardId}/buy`, {}, { // request
        headers: { 
          "Authorization": `Bearer ${token}` // send token
        },
      });
      return response.data; // response from server 
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["cards"] }); // clear react cards cache and update it
      queryClient.invalidateQueries({ queryKey: ["card", variables.cardId] }); // clear react card cache and update it
      queryClient.invalidateQueries({ queryKey: ["currentUser"] }); // clear react current user cache and update it
    },
  });
};