import type { Property } from "../../types/Property";
import { Link } from "react-router-dom";
import { getPropertyImageUrl } from "../../utils/image"; // Changed import

type Props = {
  property: Property;
  onDelete?: (id: number) => void;
  onArchive?: (id: number) => void;
  onRestore?: (id: number) => void;
};

export default function PropertyCard({ property, onDelete, onArchive, onRestore }: Props) {
  // Pass both the ID and the image path to our new helper
  const mainImage = getPropertyImageUrl(property.id, property.imageUrls?.[0]);

  return (
    <div className="group relative bg-white rounded-2xl shadow-md hover:shadow-xl 
      transition duration-300 overflow-hidden border border-gray-100"
    >
      {/* Image + link */}
      <Link to={`/properties/${property.id}`}>
        <div className="overflow-hidden h-56">
          <img
            src={mainImage}
            alt={property.title}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            loading="lazy"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = "/placeholder.jpg";
            }}
          />
        </div>
      </Link>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900">{property.title}</h3>
        <p className="text-gray-500 mt-1 line-clamp-1">{property.suburb}</p>

        {/* Using a standard color hex or your theme variable */}
        <p className="text-[#C9A24D] font-bold mt-2 text-lg">
          R {property.price.toLocaleString()}
        </p>

        <p className="text-gray-600 mt-1 text-sm">
          {property.bedrooms} Bed · {property.bathrooms} Bath
        </p>

        <p className="text-gray-500 mt-2 text-sm line-clamp-2 min-h-[2.5rem]">
          {property.description}
        </p>
      </div>

      {/* Admin Actions */}
      {(onArchive || onDelete || onRestore) && (
        <div className="absolute top-3 right-3 flex gap-2 z-10">
          {onArchive && property.status === "ACTIVE" && (
            <button
              onClick={(e) => {
                e.preventDefault();
                onArchive(property.id);
              }}
              className="bg-amber-100 text-amber-700 hover:bg-amber-500 hover:text-white 
                px-3 py-1 text-xs font-medium rounded-md shadow-sm transition"
            >
              Archive
            </button>
          )}

          {onRestore && property.status === "ARCHIVED" && (
            <button
              onClick={(e) => {
                e.preventDefault();
                onRestore(property.id);
              }}
              className="bg-emerald-100 text-emerald-700 hover:bg-emerald-600 hover:text-white 
                px-3 py-1 text-xs font-medium rounded-md shadow-sm transition"
            >
              Restore
            </button>
          )}

          {onDelete && property.status === "ARCHIVED" && (
            <button
              onClick={(e) => {
                e.preventDefault();
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