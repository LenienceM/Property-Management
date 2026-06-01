
import { useEffect, useState } from "react";

type Props = {
  suburb: string;
  setSuburb: (v: string) => void;
  bedrooms: string;
  setBedrooms: (v: string) => void;
  // Add bathrooms to match the backend search capabilities
  bathrooms: string;
  setBathrooms: (v: string) => void;
  priceRange: string;
  setPriceRange: (v: string) => void;
  sort: string;
  setSort: (v: string) => void;
};

export default function FilterBar({
  suburb,
  setSuburb,
  bedrooms,
  setBedrooms,
  // Destructure the new props
  bathrooms,
  setBathrooms,
  priceRange,
  setPriceRange,
  sort,
  setSort,
}: Props) {
  // 1. State to hold the list of suburbs fetched from the API
  const [suburbsList, setSuburbsList] = useState<string[]>([]);

  // 2. Fetch the unique list of suburbs when the component first loads
  useEffect(() => {
    const fetchSuburbs = async () => {
      try {
        // Use the new endpoint to get a clean list for the dropdown
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/properties/suburbs`
        );
        if (response.ok) {
          const data = await response.json();
          setSuburbsList(data);
        }
      } catch (error) {
        console.error("Failed to fetch suburbs:", error);
      }
    };

    fetchSuburbs();
  }, []); // The empty array [] ensures this runs only once

  return (
    <div className="bg-white shadow-md -mt-12 relative z-20 rounded-xl p-4">
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        {/* 3. Changed from a text input to a dropdown for better UX */}
        <select
          value={suburb}
          onChange={(e) => setSuburb(e.target.value)}
          className="border rounded-lg px-3 py-2"
        >
          <option value="">All Suburbs</option>
          {suburbsList.map((s) => (
            <option key={s} value={s}>
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </option>
          ))}
        </select>

        <select
          value={bedrooms}
          onChange={(e) => setBedrooms(e.target.value)}
          className="border rounded-lg px-3 py-2"
        >
          <option value="">Bedrooms</option>
          <option value="1">1+</option>
          <option value="2">2+</option>
          <option value="3">3+</option>
          <option value="4">4+</option>
          
        </select>

        {/* 4. Added a new dropdown for bathrooms */}
        <select
          value={bathrooms}
          onChange={(e) => setBathrooms(e.target.value)}
          className="border rounded-lg px-3 py-2"
        >
          <option value="">Bathrooms</option>
          <option value="1">1+</option>
          <option value="2">2+</option>
          <option value="3">3+</option>
        </select>

        <select
          value={priceRange}
          onChange={(e) => setPriceRange(e.target.value)}
          className="border rounded-lg px-3 py-2"
        >         

          <option value="">Any Price</option>
          <option value="UNDER_5">Under R5 000 </option>
          <option value="5_10">R5 000 – R10 000</option>
          <option value="10_20">R10 000  – R20 000</option>
          <option value="OVER_20">R20 000+</option>

        </select>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="border rounded-lg px-3 py-2"
        >
          <option value="">Sort</option>
          <option value="price,asc">Price ↑</option>
          <option value="price,desc">Price ↓</option>
        </select>

        <button
          onClick={() => {
            setSuburb("");
            setBedrooms("");
            setBathrooms(""); // Also clear the new bathrooms filter
            setPriceRange("");
            setSort("");
          }}
          className="border rounded-lg px-4 py-2 text-sm hover:bg-gray-100"
        >
          Clear Filters
        </button>
      </div>
    </div>
  );
}