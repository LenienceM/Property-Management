// src/routes/properties.tsx
import { useLoaderData } from "react-router";
import { fetchProperties } from "../lib/api";
import type { Property } from "../types/property";

export async function loader() {
  return fetchProperties();
}

export default function Properties() {
  const properties = useLoaderData() as Property[];

  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
      {properties.map((p) => (
        <div key={p.id} className="border p-4 rounded">
          <h3 className="font-semibold">{p.title}</h3>
          <p>{p.location}</p>
          <p className="font-bold">R {p.price.toLocaleString()}</p>
        </div>
      ))}
    </div>
  );
}
