import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY
);

const API = import.meta.env.VITE_API_URL;

async function request(url, options = {}) {
  const { data, error } = await supabase.auth.getSession();

  if (error) {
    throw new Error("Error getting session");
  }

  const token = data?.session?.access_token;

if (!token) {
  await supabase.auth.signOut();
  window.location.href = "/";
  return;
}


  const res = await fetch(`${API}${url}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
    ...options,
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Error API");
  }

  return res.json();
}


export const api = {
  getOrders: () => request("/orders"),
  getOrder: (id) => request(`/orders/${id}`),
  searchOrders: (term) => request(`/orders/search/${term}`),

  createOrder: (orderData) =>
    request("/orders", {
      method: "POST",
      body: JSON.stringify(orderData),
    }),

  deleteOrder: (id) =>
    request(`/orders/${id}`, { method: "DELETE" }),

  getMasterData: () =>
    request("/orders/data/masters"),

  addNote: (id, description) =>
    request(`/notes/${id}/notes`, {
      method: "POST",
      body: JSON.stringify({ description }),
    }),

  updateStatus: (id, status_id) =>
    request(`/orders/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status_id }),
    }),


    updateOrder: (id, data) =>
  request(`/orders/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  }),

updatePriority: (id, priority_id) =>
  request(`/orders/${id}/priority`, {
    method: "PATCH",
    body: JSON.stringify({ priority_id }),
  }),

deleteNote: (orderId, noteId) =>
  request(`/notes/${orderId}/notes/${noteId}`, {
    method: "DELETE",
  }),

};


