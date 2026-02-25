// src/components/property/PropertyCard.tsx
import type { Property } from "../../types/Property";
import { Link } from "react-router-dom";
import { imageUrl } from "../../utils/image";

type Props = {
  property: Property;
  onDelete?: (id: number) => void;
  onArchive?: (id: number) => void;
  onRestore?:(id: number) => void;
};

export default function PropertyCard({ property, onDelete, onArchive, onRestore }: Props) {
  const mainImage = imageUrl(property.imageUrls?.[0]);

  return (

<div className="relative bg-white rounded-2xl shadow-md hover:shadow-xl 
transition duration-300 overflow-hidden border border-gray-100"
>
       
      {/* Image + link */}
      <Link to={`/properties/${property.id}`}>

     <div className="group-hover:scale-105 transition duration-500">

        <img
          src={mainImage}
          alt={property.title}
          className="h-56 w-full object-cover"
          loading="lazy"
          onError={(e) => (e.currentTarget.src = "/placeholder.jpg")}
        />
        </div>
      </Link>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-lg font-semibold">{property.title}</h3>
       
        <p className="text-gray-500 mt-1 line-clamp-2">
          {property.suburb}
        </p>

        <p className="text-secondary font-bold mt-2 text-lg">
          R {property.price.toLocaleString()}
        </p>

        <p className="text-gray-600 mt-1">
          {property.bedrooms} Bedrooms · {property.bathrooms} Bathrooms
        </p>

        <p className="text-gray-500 mt-1 line-clamp-2">
          {property.description}
        </p>
      </div>

     {(onArchive || onDelete || onRestore) && (
  <div className="absolute top-3 right-3 flex gap-2 z-10">
    
    {/* Archive only if ACTIVE */}
    {onArchive && property.status === "ACTIVE" && (
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onArchive(property.id);
        }}
        className="bg-amber-100 text-amber-700 hover:bg-amber-500 hover:text-white 
        px-3 py-1 text-xs font-medium rounded-md shadow-sm transition"
      >
        Archive
      </button>
    )}

    {/* Restore only if ARCHIVED */}
    {onRestore && property.status === "ARCHIVED" && (
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onRestore(property.id);
        }}
        className="bg-emerald-100 text-emerald-700 hover:bg-emerald-600 hover:text-white 
        px-3 py-1 text-xs font-medium rounded-md shadow-sm transition"
      >
        Restore
      </button>
    )}

    {/* Delete (optional rule: always available) */}
    {onDelete && property.status === "ARCHIVED" && (

   
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onDelete(property.id);
        }}
        className="bg-red-100 text-red-700 hover:bg-red-600 hover:text-white 
        px-3 py-1 text-xs font-medium rounded-md shadow-sm transition"
      >
        Delete
      </button>
    )}

  </div>
)}
      
    </div>
  );
}
