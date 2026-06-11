import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../api/api";
import Cookies from "js-cookie";

// get all events
export function useAdminEvents() {
  return useQuery({
    queryKey: ["admin", "events"], // react cache for events list
    queryFn: async () => {
      const token = Cookies.get("token"); // get admin token

      const response = await api.get("/events?size=999999&sort=date,desc", { // 999999 to get all events
        headers: {
          Authorization: `Bearer ${token}`, // send admin token
        },
      });
      return response.data.content; // events list
    },
  });
}

// get event by id
export function useAdminEvent(id) {
  return useQuery({
    queryKey: ["admin", "events", id], // react cache for events list
    queryFn: async () => {
      if (!id) return null; //  if id don´t found returns null
      const token = Cookies.get("token"); // get admin token

      const response = await api.get(`/events/${id}`, { // request
        headers: {
          Authorization: `Bearer ${token}`, // send admin token
        },
      });
      return response.data; // json content
    },
    enabled: !!id, // waits for id to not be null or undefined
  });
}

// create event
export function useCreateEvent() {
  const queryClient = useQueryClient(); // get queryClient instance

  return useMutation({
    mutationFn: async (eventData) => { // data to post
      const token = Cookies.get("token"); // get admin token

      const response = await api.post("/events", eventData, { // request
        headers: {
          Authorization: `Bearer ${token}`, // send admin token
        },
      });
      return response.data; // response from server
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "events"] }); // clear react cache and update it
    },
  });
}

// delete event
export function useDeleteEvent() {
  const queryClient = useQueryClient(); // get queryClient instance

  return useMutation({
    mutationFn: async (eventId) => { // event id to delete
      const token = Cookies.get("token"); // get admin token
      const response = await api.delete(`/events/${eventId}`, { // request
        headers: {
          Authorization: `Bearer ${token}`, // send admin token
        },
      });
      return response.data; // response from server
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "events"] }); // clear react cache and update it
    },
  });
}

// update event status
export function useUpdateEventStatus() {
  const queryClient = useQueryClient(); // get queryClient instance

  return useMutation({
    mutationFn: async ({ eventId, status }) => {
      const token = Cookies.get("token"); // get admin token
      const response = await api.patch(`/events/${eventId}`, { status }, { // request
        headers: {
          Authorization: `Bearer ${token}`, // send admin token
        },
      });
      return response.data; // response from server
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "events"] }); // clear react events cache and update it
      queryClient.invalidateQueries({ queryKey: ["cards"] }); // clear react cards cache and update it
    },
  });
}

// update event info
export function useUpdateEvent() {
  const queryClient = useQueryClient(); // get queryClient instance
  return useMutation({
    mutationFn: async ({ id, eventData }) => { 
      const token = Cookies.get("token"); // get admin token
      const response = await api.put(`/events/${id}`, eventData, { // request
        headers: {
          Authorization: `Bearer ${token}` // send admin token
        },
      });
      return response.data; // response from server
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "events"] });// clear react events cache and update it
    },
  });
}

// create card
export function useCreateCard() {
  const queryClient = useQueryClient(); // get queryClient instance
  return useMutation({
    mutationFn: async (cardData) => {
      const token = Cookies.get("token"); // get admin token

      const response = await api.post("/cards", cardData, { // request
        headers: {
          Authorization: `Bearer ${token}` // send admin token
        },
      });
      return response.data; // response from server 
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cards"] }); // clear react cards cache and update it
    },
  });
}

// delete card
export function useDeleteCard() {
  const queryClient = useQueryClient(); // get queryClient instance

  return useMutation({
    mutationFn: async (cardId) => {
      const token = Cookies.get("token"); // get admin token
      const response = await api.delete(`/cards/${cardId}`, { // request
        headers: {
          Authorization: `Bearer ${token}`, // send admin token
        },
      });
      return response.data; // response from server
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cards"] }); // clear react cards cache and update it
    },
  });
}

// update card info
export function useUpdateCard() {
  const queryClient = useQueryClient(); // get queryClient instance
  return useMutation({
    mutationFn: async ({ id, cardData }) => {
      const token = Cookies.get("token"); // get admin token
      const response = await api.put(`/cards/${id}`, cardData, { // request
        headers: {
          Authorization: `Bearer ${token}` // send admin token
        },
      });
      return response.data; // response from server
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["cards"] }), // clear react cards cache and update it
  });
}

// get users
export function useAllUsers() {
  return useQuery({
    queryKey: ["admin", "users"], // react cache for users list
    queryFn: async () => {
      const token = Cookies.get("token"); // get admin token

      const response = await api.get(`/users?size=999999`, { // request
        headers: {
          Authorization: `Bearer ${token}`, // send admin token
        },
      });
      return response.data.content; // users list
    },
  });
}

// get user by id
export const useGetOneUser = (userId) => {
  return useQuery({
    queryKey: ["user", userId], // react cache for user
    queryFn: async () => {
      const token = Cookies.get("token"); // get admin token
      const { data } = await api.get(`/users/${userId}`, { // request
        headers: { Authorization: `Bearer ${token}` } // send admin token
      });
      return data; // user 
    },
    enabled: !!userId, // waits for user id to not be null or undefined
  });
};

// update user 
export const useUpdateUserByAdmin = () => {
  const queryClient = useQueryClient(); // get queryClient instance
  return useMutation({
    mutationFn: async ({ userId, payload }) => {
      const token = Cookies.get("token"); // get admin token
      const { data } = await api.patch(`/users/${userId}`, payload, { // request 
        headers: { Authorization: `Bearer ${token}` } // send admin token
      });
      return data; // response from server
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["admin", "users"]); // clear react users cache and update it
      queryClient.invalidateQueries(["user"]); // clear react user cache and update it
    },
  });
};

// delete user
export function useAdminDeleteUser() {
  const queryClient = useQueryClient(); // get queryClient instance

  return useMutation({
    mutationFn: async (userId) => {
      const token = Cookies.get("token"); // get admin token
      return await api.delete(`/users/${userId}`, { // request
        headers: { Authorization: `Bearer ${token}` }, // send admin token
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["admin", "users"]); // clear react users cache and update it
    },
  });
}

// get transactions by user id
export const useAdminTransactionsUSer = (userId) => { 
  return useQuery({
    queryKey: ["admin", "transactions", userId], // react cache for transactions
    queryFn: async () => {
      const token = Cookies.get("token"); // get admin token
      const { data } = await api.get(`/transactions/${userId}?size=999999&sort=date,desc`, { // request
        headers : {
          Authorization: `Bearer ${token}` // send admin token
        }
      });
      return data; // response from server 
    },
    enabled: !!userId, // waits for user id to not be null or undefined
  })
};

// get system logs
export function useAdminLogs(page = 0, size = 20) { // using backend pagination
  return useQuery({
    queryKey: ["admin", "logs", page, size], // react cache for logs
    queryFn: async () => {
      const token = Cookies.get("token"); // get admin token
      
      const response = await api.get(`/logs?page=${page}&size=${size}&sort=timestamp,desc`, { // request
        headers: {
          Authorization: `Bearer ${token}`, // send admin token
        },
      });
      return response.data; // response from server
    },
  });
}
