import type { Property } from "../types/Property";

//const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api";
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api/properties";

//export async function getProperties(page = 0, size = 6) {
// return fetch(`${API_BASE}?page=${page}&size=${size}`).then(r => r.json());  
//}

type PropertyQuery = {
  page?: number;
  size?: number;
  suburb?: string;
  bedrooms?: number;
  minPrice?: number;
  maxPrice?: number;
  sort?: string; // e.g. "price,asc"
};

export async function getProperties(query: PropertyQuery = {}) {
  const params = new URLSearchParams();

  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      params.append(key, String(value));
    }
  });

  const res = await fetch(`${API_BASE_URL}?${params.toString()}`);

  if (!res.ok) {
    throw new Error(`Failed to load properties (${res.status})`);
  }

  return res.json();
}

export async function getAdminProperties(
  statuses: string[],
  page = 0,
  size = 6
) {
  const qs = statuses.map(s => `statuses=${s}`).join("&");

  return fetch(
    `${API_BASE_URL}/admin?${qs}&page=${page}&size=${size}`,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }
  ).then(r => r.json());
}

export async function addProperty(property: Omit<Property, "id">) {
  if (!property.price || property.price <= 0) {
    alert("Please enter a valid price");
    return;
  }

  return fetch(API_BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify(property),
  }).then(r => r.json());
}

export async function archiveProperty(id: number) {
  return fetch(`${API_BASE_URL}/${id}/archive`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
}

export async function restoreProperty(id: number) {
  const res = await fetch(
    `${API_BASE_URL}/${id}/restore`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }
  );

  if (!res.ok) throw new Error("Failed to restore property");
}

export async function deleteProperty(id: number) {
  return fetch(`${API_BASE_URL}/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
}

export async function uploadImages(id: number, files: File[]) {
  const formData = new FormData();
  files.forEach(f => formData.append("files", f));

  return fetch(`${API_BASE_URL}/${id}/images`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: formData,
  });

  // if (!res.ok) throw new Error("Failed to upload images");
};

export async function getArchivedProperties(page = 0, size = 9) {
  const token = localStorage.getItem("token");

  const res = await fetch(
    //  `${API_BASE}/admin?status=ARCHIVED&page=${page}&size=${size}`,
    `${API_BASE_URL}/admin?statuses=ARCHIVED&page=${page}&size=${size}`,

    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!res.ok) throw new Error("Failed to fetch archived properties");
  return res.json();
}

export async function updatePropertyStatus(
  id: number,
  status: "ACTIVE" | "ARCHIVED" | "SOLD" | "DRAFT"
) {
  const token = localStorage.getItem("token");

  const res = await fetch(
    `${API_BASE_URL}/${id}/status?status=${status}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!res.ok) throw new Error("Failed to update status");
  return res.json();
}