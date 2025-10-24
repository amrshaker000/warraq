import axios from "axios";
import type { Member, MemberFilters } from "./types/member";

const API_BASE_URL = "http://localhost:8000/api"; // Update as needed

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

// Auth
export const login = async (username: string, password: string) => {
  return api.post("/auth/login", { username, password });
};

// Members
export const fetchMembers = async (params?: MemberFilters) => {
  return api.get("/members", { params });
};

export const addMember = async (
  data: Omit<Member, "id" | "createdAt" | "updatedAt">,
) => {
  return api.post("/members", data);
};

export const updateMember = async (id: string, data: Partial<Member>) => {
  return api.put(`/members/${id}`, data);
};

export const deleteMember = async (id: string) => {
  return api.delete(`/members/${id}`);
};

// Import/Export
export const importMembers = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  return api.post("/data/import", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const exportMembers = async (params?: MemberFilters) => {
  return api.get("/data/export", { params, responseType: "blob" });
};
