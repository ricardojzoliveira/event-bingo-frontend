import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../api/api";
import Cookies from "js-cookie";

// get all events
export function useAdminEvents() {
  return useQuery({
    queryKey: ["admin", "events"],
    queryFn: async () => {
      const token = Cookies.get("token");

      const response = await api.get("/events?size=999999&sort=date,desc", { // 999999 to get all events
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
    enabled: !!id, // waits for id to not be null or undefined
  });
}

// create event
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
          Authorization: `Bearer ${token}` 
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

// update card info
export function useUpdateCard() {
  const queryClient = useQueryClient(); 
  return useMutation({
    mutationFn: async ({ id, cardData }) => {
      const token = Cookies.get("token");
      const response = await api.put(`/cards/${id}`, cardData, { 
        headers: {
          Authorization: `Bearer ${token}` 
        },
      });
      return response.data; 
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["cards"] }),
  });
}

// get users
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

// get user by id
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

// update user 
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

// delete user
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

// get transactions by user id
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

// get system logs
export function useAdminLogs(page = 0, size = 20) { 
  return useQuery({
    queryKey: ["admin", "logs", page, size], 
    queryFn: async () => {
      const token = Cookies.get("token"); 
      
      const response = await api.get(`/logs?page=${page}&size=${size}&sort=timestamp,desc`, { 
        headers: {
          Authorization: `Bearer ${token}`, 
        },
      });
      return response.data; 
    },
  });
}
