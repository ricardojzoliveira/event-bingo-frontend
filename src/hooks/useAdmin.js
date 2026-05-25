import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../api/api";
import Cookies from "js-cookie";

// get all events
export function useAdminEvents() {
  return useQuery({
    queryKey: ["admin", "events"],
    queryFn: async () => {
      const token = Cookies.get("token");

      const response = await api.get("/events", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    },
  });
}

// get event by id
export function useAdminEvent(id) {
  return useQuery({
    queryKey: ["admin", "events", id],
    queryFn: async () => {
      if (!id) return null;
      const token = Cookies.get("token");

      const response = await api.get(`/events/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    },
    enabled: !!id,
  });
}

// post event
export function useCreateEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (eventData) => {
      const token = Cookies.get("token");

      const response = await api.post("/events", eventData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "events"] });
    },
  });
}

// delete event
export function useDeleteEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (eventId) => {
      const token = Cookies.get("token");
      const response = await api.delete(`/events/${eventId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "events"] });
    },
  });
}

// update event status
export function useUpdateEventStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ eventId, status }) => {
      const token = Cookies.get("token");
      const response = await api.patch(`/events/${eventId}`, {status}, {
        headers: { 
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "events"] });
    },
  });
}

// update event info
export function useUpdateEvent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, eventData }) => {
      const token = Cookies.get("token");
      const response = await api.put(`/events/${id}`, eventData, {
        headers: { 
          Authorization: `Bearer ${token}`
         },
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "events"] });
    },
  });
}

// create card
export function useCreateCard() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (cardData) => {
      const token = Cookies.get("token");

      //console.log("DADOS A ENVIAR:", JSON.stringify(cardData, null, 2));

      const response = await api.post("/cards", cardData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
         },
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cards"] });
    },
  });
}

export function useDeleteCard() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      const response = await fetch(`/api/admin/cards/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Erro ao eliminar cartão");
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["cards"] }),
  });
}

export function useUpdateCard() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, cardData }) => {
      console.log("DADOS A ENVIAR:", JSON.stringify(cardData, null, 2));
      const token = Cookies.get("token");
      const response = await api.put(`/cards/${id}`, cardData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json" },
          "Accept": "application/json"
      });
      return response.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["cards"] }),
  });
}
