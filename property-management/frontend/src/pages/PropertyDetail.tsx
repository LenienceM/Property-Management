// src/pages/PropertyDetail.tsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type { Property } from "../types/Property";
import { imageUrl } from "../utils/image";
import { auth } from "../api/auth";

export default function PropertyDetail() {
  const { id } = useParams();
  const [property, setProperty] = useState<Property | null>(null);
  //const [activeImage, setActiveImage] = useState<string | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

  useEffect(() => {
    // UPDATED URL
    fetch(`${API_BASE_URL}/properties/${id}`)
      .then(res => res.json())
      .then(data => {
        setProperty(data);
        if (data.imageUrls?.length) {
          setActiveIndex(0);
        }
      });
  }, [id, API_BASE_URL]);

  /*useEffect(() => {
    fetch(`http://localhost:8080/api/properties/${id}`)
      .then(res => res.json())
      .then(data => {
        setProperty(data);
        if (data.imageUrls?.length) {
          setActiveIndex(0);
        }
      });
  }, [id]);
  */
  useEffect(() => {
    if (!property?.imageUrls?.length) return;

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        setActiveIndex(i =>
          (i + 1) % property.imageUrls.length
        );
      }

      if (e.key === "ArrowLeft") {
        setActiveIndex(i =>
          (i - 1 + property.imageUrls.length) %
          property.imageUrls.length
        );
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [property]);


  if (!property) return <p className="p-6">Loading property…</p>;
  const activeImage =
    property.imageUrls?.[activeIndex];
  return (
    <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-2 gap-10">





      {/* 🖼 Image Gallery */}
      <div className="relative">
        <div className="relative rounded-lg overflow-hidden border mb-4">
          {/* Remove the extra const declaration from here */}
          <img
            key={activeImage}
            src={imageUrl(activeImage)}
            alt={property.title}
            className="w-full h-[420px] object-cover"
          />

          {/* Left Arrow */}
          {property.imageUrls.length > 1 && (
            <button
              onClick={() =>
                setActiveIndex(i =>
                  (i - 1 + property.imageUrls.length) %
                  property.imageUrls.length
                )
              }
              className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/60 text-white px-3 py-2 rounded-full hover:bg-black"
            >
              ‹
            </button>
          )}

          {/* Right Arrow */}
          {property.imageUrls.length > 1 && (
            <button
              onClick={() =>
                setActiveIndex(i =>
                  (i + 1) % property.imageUrls.length
                )
              }
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/60 text-white px-3 py-2 rounded-full hover:bg-black"
            >
              ›
            </button>
          )}
        </div>

        {/* Thumbnails */}
        {property.imageUrls.length > 1 && (
          <div className="grid grid-cols-5 gap-3">
            {property.imageUrls.map((url, index) => (
              <img
                key={index}
                src={imageUrl(url)}
                onClick={() => setActiveIndex(index)}
                className={`h-20 w-full object-cover cursor-pointer rounded border
            ${activeIndex === index ? "ring-2 ring-black" : "opacity-80 hover:opacity-100"}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Property Info */}
      <div>

        <h1 className="text-3xl font-bold">{property.title}</h1>

        <p className="text-2xl font-semibold mt-4">
          R {property.price.toLocaleString()}
        </p>

        <div className="flex gap-6 mt-6 text-gray-700">
          <span>{property.bedrooms} Bedrooms</span>
          <span>{property.bathrooms} Bathrooms</span>
        </div>

        <p className="mt-6 text-gray-600">{property.description}</p>

      </div>

      {auth.isAdmin() && (
        <div className="flex gap-4 mt-8">
          {property.status === "ACTIVE" && (
            <button
              onClick={async () => {

                const handleArchive = async () => {
                  if (!property) return;

                  await fetch(
                    `${API_BASE_URL}/properties/${property.id}/archive`, // UPDATED URL
                    {
                      method: "PUT",
                      headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                      },
                    }
                  );
                  setProperty({ ...property, status: "ARCHIVED" });
                };
                /*  await fetch(
                    `http://localhost:8080/api/properties/${property.id}/archive`,
                    {
                      method: "PUT",
                      headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                      },
                    }
                  );
                  setProperty({ ...property, status: "ARCHIVED" });*/
              }}
              className="px-6 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
            >
              Archive Property
            </button>
          )}
        </div>
      )}

    </div>
  );
}