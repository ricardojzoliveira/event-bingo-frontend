import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Cookies from "js-cookie";
import api from "../api/api";

// get all cards
export function useCards() {
  return useQuery({
    queryKey: ["cards"],
    queryFn: async () => {
      const response = await api.get("/cards?size=999999");

      return response.data.content;
    },
  });
}

// get card by id
export function useCard(id) {
  return useQuery({
    queryKey: ["card", id],
    queryFn: async () => {      
      const response = await api.get(`cards/${id}`);

      return response.data;
    },
    enabled: !!id,
  });
}

//buy card
export const useBuyCard = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ cardId }) => {
      const token = Cookies.get("token");
      const response = await api.post(`cards/${cardId}/buy`, {}, {
        headers: { 
          "Authorization": `Bearer ${token}` 
        },
      });
      return response.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["cards"] });
      
      queryClient.invalidateQueries({ queryKey: ["card", variables.cardId] });
      
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
    },
  });
};