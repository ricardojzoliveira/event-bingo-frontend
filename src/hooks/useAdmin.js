import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export function useAdminEvents() {
  return useQuery({
    queryKey: ["admin", "events"],
    queryFn: async () => {
      const response = await fetch("/api/admin/events");
      if (!response.ok) throw new Error("Erro ao carregar eventos");
      return response.json();
    }
  });
}

export function useCreateEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (eventData) => {
      const response = await fetch("/api/admin/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(eventData),
      });
      if (!response.ok) throw new Error("Erro ao criar evento");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "events"] });
    }
  });
}

export function useDeleteEvent() {
    const queryClient = useQueryClient();

    return useMutation({
    mutationFn: async (eventId) => {
      const response = await fetch(`/api/admin/events/${eventId}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Error deleting event");
      return eventId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "events"] });
    }
  });
}