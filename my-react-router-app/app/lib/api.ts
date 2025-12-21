// src/lib/api.ts
import { Property } from "../types/property";

const API_BASE_URL = "http://localhost:8080/api";

export async function fetchProperties(): Promise<Property[]> {
  const res = await fetch(`${API_BASE_URL}/properties`);
  if (!res.ok) {
    throw new Error("Failed to load properties");
  }
  return res.json();
}

export async function fetchProperty(id: number): Promise<Property> {
  const res = await fetch(`${API_BASE_URL}/properties/${id}`);
  if (!res.ok) {
    throw new Error("Failed to load property");
  }
  return res.json();
}
