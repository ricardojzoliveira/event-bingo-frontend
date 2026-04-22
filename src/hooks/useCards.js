import { useQuery } from "@tanstack/react-query";


export function useCards() {
  return useQuery({
    queryKey: ["cards"],
    queryFn: async () => {
      const response = await fetch("/api/cards");
      if (!response.ok) {
        throw new Error("Erro ao carregar a lista de cartões");
      }
      return response.json();
    },
  });
}

export function useCard(id) {
  return useQuery({
    queryKey: ["card", id],
    queryFn: async () => {
      const response = await fetch(`/api/cards/${id}`);
      if (!response.ok) {
        if (response.status === 404) throw new Error("Cartão não encontrado");
        throw new Error("Erro ao carregar os detalhes do cartão");
      }
      return response.json();
    },
    enabled: !!id, 
  });
}