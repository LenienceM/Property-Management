// src/pages/Properties.tsx
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import PropertyCard from "../components/property/PropertyCard";
import type { Property } from "../types/Property";
import { auth } from "../api/auth";
import { getProperties } from "../api/properties";
import heroImage from "../utils/background.avif";
import { PropertyStatus } from "../types/PropertyStatus";
import Container from "../components/layout/Container";
import SectionHeader from "../components/ui/SectionHeader";
import FilterBar from "../components/ui/FilterBar";
import AdminToggle from "../components/ui/AdminToggle";

type PageResponse<T> = {
  content: T[];
  number: number;
  totalPages: number;
};

export default function Properties() {
  const [data, setData] = useState<PageResponse<Property> | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [status, setStatus] = useState<PropertyStatus>(PropertyStatus.ACTIVE);
  const [suburb, setSuburb] = useState("");
  const [bedrooms, setBedrooms] = useState("");
  //const [minPrice, setMinPrice] = useState("");
  const [priceRange, setPriceRange] = useState("");
  //const [maxPrice, setMaxPrice] = useState("");
  const [sort, setSort] = useState("");
  const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";
  const priceRanges: Record<
    string,
    { min?: number; max?: number }
  > = {
    UNDER_5: { max: 5000 },
    "5_10": { min: 5000, max: 10000 },
    "10_20": { min: 10000, max: 20000 },
    OVER_20: { min: 20000 },
  };

  useEffect(() => {
    setLoading(true);

    if (auth.isAdmin()) {
      fetch(
        `${API_BASE_URL}/properties/admin?statuses=${status}&page=${page}&size=6`,
        { headers: { Authorization: `Bearer ${auth.token()}` } }
      )
        .then((res) => res.json())
        .then((res) => {
          setData(res);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    } else {

      const selectedRange = priceRanges[priceRange];
      const min = selectedRange?.min;
      const max = selectedRange?.max;

      getProperties({
        page,
        size: 6,
        suburb: suburb ? suburb.trim().toLowerCase() : undefined,
        bedrooms: bedrooms ? Number(bedrooms) : undefined,
        minPrice: min,
        maxPrice: max,
        sort: sort || undefined,
      })
        .then((res) => {
          setData(res);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [page, status, suburb, bedrooms, priceRange, sort]);

  // Reset page when filters change
  useEffect(() => {
    setPage(0);
  }, [suburb, bedrooms, priceRange, sort]);

  // Admin actions
  const handleDelete = async (id: number) => {
    if (!auth.isAdmin()) return;
    try {
      await fetch(`${API_BASE_URL}/properties/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${auth.token()}` },
      });
      setData((prev) =>
        prev ? { ...prev, content: prev.content.filter((p) => p.id !== id) } : prev
      );
    } catch {
      alert("Failed to delete property");
    }
  };

  const handleArchive = async (id: number) => {
    if (!auth.isAdmin()) return;
    try {
      await fetch(`${API_BASE_URL}/properties/${id}/archive`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${auth.token()}` },
      });
      setData((prev) =>
        prev ? { ...prev, content: prev.content.filter((p) => p.id !== id) } : prev
      );
    } catch {
      alert("Failed to archive property");
    }
  };

  const handleRestore = async (id: number) => {
    if (!auth.isAdmin()) return;
    try {
      await fetch(`${API_BASE_URL}/properties/${id}/restore`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${auth.token()}` },
      });
      setData((prev) =>
        prev ? { ...prev, content: prev.content.filter((p) => p.id !== id) } : prev
      );
    } catch {
      alert("Failed to restore property");
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <SectionHeader
        title="Our Properties"
        subtitle="Discover homes and investment opportunities curated for quality living."
        backgroundImage={heroImage}
      >
        {auth.isAdmin() && (
          <NavLink
            to="/properties/add"
            className="px-6 py-3 bg-[#C9A24D] text-black rounded-lg font-semibold hover:bg-[#B79424]"
          >
            + Add Property
          </NavLink>
        )}
      </SectionHeader>

      {/* Filter Section */}
      <div className="relative">
        <div className="absolute left-0 right-0 -top-10 z-20">

          <FilterBar
            suburb={suburb}
            setSuburb={setSuburb}
            bedrooms={bedrooms}
            setBedrooms={setBedrooms}
            priceRange={priceRange}
            setPriceRange={setPriceRange}
            sort={sort}
            setSort={setSort}
          />

          {auth.isAdmin() && <AdminToggle status={status} setStatus={setStatus} />}

        </div>
      </div>

      {/* Properties Grid */}
      <Container>
        {loading ? (
          <p className="text-center py-20 text-gray-500">Loading properties...</p>
        ) : data?.content.length === 0 ? (
          <p className="text-center py-20 text-gray-500">No properties found.</p>
        ) : (
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {data?.content.map((p) => (
              <PropertyCard
                key={p.id}
                property={p}
                onDelete={auth.isAdmin() ? handleDelete : undefined}
                onArchive={auth.isAdmin() ? handleArchive : undefined}
                onRestore={auth.isAdmin() ? handleRestore : undefined}
              />
            ))}
          </div>
        )}

        {/* Pagination */}

        {(data?.totalPages ?? 0) > 1 && (
          <div className="flex justify-center items-center gap-6 mt-10 pb-20">
            <button
              disabled={page === 0}
              onClick={() => setPage((p) => p - 1)}
              className="px-5 py-2 border rounded disabled:opacity-40 hover:bg-primary hover:text-white transition"
            >
              Previous
            </button>
            <span className="text-gray-600">
              Page {data ? data.number + 1 : 1} of {data?.totalPages ?? 1}
            </span>
            <button
              disabled={!data || page + 1 >= (data?.totalPages ?? 0)}

              // disabled={data? page + 1 >= data?.totalPages : true}
              onClick={() => setPage((p) => p + 1)}
              className="px-5 py-2 border rounded disabled:opacity-40 hover:bg-primary hover:text-white transition"
            >
              Next
            </button>
          </div>
        )}
      </Container>
    </div>
  );
}