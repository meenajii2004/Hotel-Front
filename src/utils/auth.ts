import { supabase } from '../lib/supabaseClient';

// **Sign Up Function**
export const signUp = async (email: string, password: string, name: string) => {
  const { data, error } = await supabase.auth.signUp({ email, password });

  if (error) throw error;

  // If user is created, store their info in "users" table
  const { error: dbError } = await supabase.from("users").insert([{ 
    id: data.user?.id,  // User ID from Supabase Auth
    name: name,
    email: email 
  }]);

  if (dbError) throw dbError;

  return data.user;
};

// **Login Function**


// **Logout Function**
export const logout = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

// **Get Current User**
export const getCurrentUser = async () => {
  const { data, error } = await supabase.auth.getUser();
  if (error) throw error;
  return data.user;
};


// utils/auth.ts

export const login = async (email: string, password: string) => {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Login failed");
  }

  // Save token to localStorage
  localStorage.setItem("token", data.data.token);

  return data.data.user;
};
