import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../api/api";
import Cookies from "js-cookie";

// get all events
export function useAdminEvents() {
  return useQuery({
    queryKey: ["admin", "events"],
    queryFn: async () => {
      const token = Cookies.get("token");

      const response = await api.get("/events?size=999999&sort=date,desc", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data.content;
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
      const response = await api.patch(`/events/${eventId}`, { status }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "events"] });
      queryClient.invalidateQueries({ queryKey: ["cards"] });
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

// delete card
export function useDeleteCard() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (cardId) => {
      const token = Cookies.get("token");
      const response = await api.delete(`/cards/${cardId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cards"] });
    },
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
          "Content-Type": "application/json"
        },
        "Accept": "application/json"
      });
      return response.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["cards"] }),
  });
}

// Lista de users.
export function useAllUsers() {
  return useQuery({
    queryKey: ["admin", "users"],
    queryFn: async () => {
      const token = Cookies.get("token");

      const response = await api.get(`/users?size=999999`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data.content;
    },
  });
}

// Dados de um utilizador.
export const useGetOneUser = (userId) => {
  return useQuery({
    queryKey: ["user", userId],
    queryFn: async () => {
      const token = Cookies.get("token");
      const { data } = await api.get(`/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return data;
    },
    enabled: !!userId,
  });
};

// Altera dados de um utilizador.
export const useUpdateUserByAdmin = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ userId, payload }) => {
      const token = Cookies.get("token");
      const { data } = await api.patch(`/users/${userId}`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["admin", "users"]);
      queryClient.invalidateQueries(["user"]);
    },
  });
};

// Elimina um utilizador.
export function useAdminDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userId) => {
      const token = Cookies.get("token");
      return await api.delete(`/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["admin", "users"]);
    },
  });
}

export const useAdminTransactionsUSer = (userId) => {
  return useQuery({
    queryKey: ["admin", "transactions", userId],
    queryFn: async () => {
      const token = Cookies.get("token");
      const { data } = await api.get(`/transactions/${userId}?size=999999&sort=date,desc`, {
        headers : {
          Authorization: `Bearer ${token}`
        }
      });
      return data;
    },
    enabled: !!userId,
  })
};

