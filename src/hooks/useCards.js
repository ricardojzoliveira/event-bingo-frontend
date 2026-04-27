import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export function useCards() {
  return useQuery({
    queryKey: ["cards"],
    queryFn: async () => {
      const token = localStorage.getItem("user_id"); 

      const response = await fetch("/api/cards", {
        headers: {
          "Authorization": `Bearer ${token}` 
        }
      });
      if (!response.ok) throw new Error("Erro ao carregar cartões");
      return response.json();
    },
  });
}

export function useCard(id) {
  return useQuery({
    queryKey: ["card", id],
    queryFn: async () => {
      const token = localStorage.getItem("user_id");
      
      const response = await fetch(`/api/cards/${id}`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      if (!response.ok) throw new Error("Erro ao carregar o cartão");
      return response.json();
    },
    enabled: !!id,
  });
}

export const useBuyCard = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ cardId, price }) => {
      const token = localStorage.getItem("user_id");
      const response = await fetch("/api/user/buy-card", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` 
        },
        body: JSON.stringify({ cardId, price }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
      }
      return response.json();
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      
      queryClient.invalidateQueries({ queryKey: ["card", variables.cardId] });
      
      queryClient.invalidateQueries({ queryKey: ["cards"] });
    },
  });
};