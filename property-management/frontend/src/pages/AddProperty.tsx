import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Container from "../components/layout/Container";
import SectionHeader from "../components/ui/SectionHeader";

export default function AddProperty() {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [suburb, setSuburb] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [bedrooms, setBedrooms] = useState("");
  const [bathrooms, setBathrooms] = useState("");
  const [description, setDescription] = useState("");
  const [suggestedAmenities, setSuggestedAmenities] = useState<string[]>([]);
  const [amenities, setAmenities] = useState<string[]>([]);
  const [aiLoading, setAiLoading] = useState(false);
  const navigate = useNavigate();
  const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

  const suggestAmenities = async () => {
  if (!description) return;

  setAiLoading(true);

  try {



const res = await fetch(`${API_BASE_URL}/properties/suggest-amenities`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
  body: JSON.stringify({ description }),
});

if (!res.ok) {
  const text = await res.text();
  console.error("AI error:", res.status, text);
  throw new Error("AI request failed");
}

const data = await res.json();

console.log("AI RAW:", data);

const parsed = Array.isArray(data)
  ? data
  : typeof data === "string"
  ? data.split(",").map((s: string) => s.trim())
  : data.amenities || [];

setSuggestedAmenities(parsed);







  } catch (err) {
    console.error(err);
    alert("Failed to get AI suggestions");
  } finally {
    setAiLoading(false);
  }
};
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      // Create property
      const res = await fetch(`${API_BASE_URL}/properties`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          suburb,
          price: Number(price),
          bedrooms: Number(bedrooms),
          bathrooms: Number(bathrooms),
          description,
          status: "ACTIVE",
          amenities,  
        }),
      });

      if (!res.ok) {
        const text = await res.text();
        console.error("Backend error:", text);
        throw new Error("Failed to create property");
      }

      const property = await res.json();
      

      // Upload images if any
      if (images.length > 0) {
        const formData = new FormData();
        images.forEach((img) => formData.append("files", img));

        const imgRes = await fetch(
          `${API_BASE_URL}/properties/${property.id}/images`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
            },
            body: formData,
          }
        );

        if (!imgRes.ok) {
        //  const text = await imgRes.text();
         // console.error("Image upload error:", text);
            console.error("Status:", imgRes.status);

            const text = await imgRes.text();
            console.error("Body:", text || "EMPTY");

          throw new Error("Failed to upload images");
        }
      }

      alert("Property added successfully!");
      navigate("/properties", { replace: true });
    } catch (err) {
      console.error(err);
      alert("Failed to add property");
    } finally {
      setLoading(false);
    }
  };



return (
  <Container>
    {/* heading */}
    <div className="py-6 border-b border-gray-200 mb-6">
      <h1 className="text-3xl font-bold text-[#C9A24D]">Add Property</h1>
      <p className="text-gray-500 mt-2">Enter the details below to list your property.</p>
    </div>

    <form onSubmit={handleSubmit} className="max-w-xl mx-auto space-y-8 py-6">
      
      {/* Grouped: Basic Info */}
     <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
        <h2 className="text-lg font-semibold text-gray-800">Basic Information</h2>
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" className="w-full border p-3 rounded focus:border-[#C9A24D] outline-none" required />
        <div className="grid grid-cols-2 gap-4">
          <input value={suburb} onChange={(e) => setSuburb(e.target.value)} placeholder="Suburb" className="w-full border p-3 rounded focus:border-[#C9A24D] outline-none" required />
          <input value={price} onChange={(e) => setPrice(e.target.value)} type="number" placeholder="Price" className="w-full border p-3 rounded focus:border-[#C9A24D] outline-none" required />
        </div>
      </div>

      {/* Grouped: Amenities */}
      <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
        <h2 className="text-lg font-semibold text-gray-800">Description</h2>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Property Description (e.g., 'A lovely home in Morningside with a pool')" className="w-full border p-3 rounded h-24 focus:border-[#C9A24D] outline-none" required />
        
        <button type="button" onClick={suggestAmenities}   disabled={aiLoading} className="w-full py-2 bg-[#C9A24D] text-black font-medium rounded hover:bg-[#B79424] transition disabled:opacity-50">
          {aiLoading ? "Thinking..." : "Generate AI Amenities"}
        </button>

    

{/* Suggested Amenities */}
{suggestedAmenities.length > 0 && (
  <div className="mt-4">
    <p className="text-sm font-semibold mb-2 text-gray-700">
      Suggested Amenities
    </p>
    <div className="flex flex-wrap gap-2">
      {suggestedAmenities.map((item, index) => (
        <button
          key={index}
          type="button"
          onClick={() =>
            setAmenities((prev) =>
              prev.includes(item) ? prev : [...prev, item]
            )
          }
          className="px-3 py-1 bg-white border border-[#C9A24D] text-[#C9A24D] rounded hover:bg-[#C9A24D] hover:text-black transition"
        >
          + {item}
        </button>
      ))}
    </div>
  </div>
)}

{/* Selected Amenities */}
{amenities.length > 0 && (
  <div className="mt-4">
    <p className="text-sm font-semibold mb-2 text-gray-700">
      Selected Amenities
    </p>
    <div className="flex flex-wrap gap-2">
      {amenities.map((item, index) => (
        <span
          key={index}
          onClick={() =>
            setAmenities((prev) => prev.filter((a) => a !== item))
          }
          className="px-3 py-1 bg-[#C9A24D] text-black rounded cursor-pointer hover:opacity-80"
        >
          {item} ✕
        </span>
      ))}
    </div>
  </div>
)}


        {/* Suggested and Selected sections here... */}
      </div>

      {/* Grouped: Media */}
      
          <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
        <h2 className="text-lg font-semibold text-gray-800">Gallery</h2>
        <div className="border-2 border-dashed border-gray-300 p-4 rounded text-center">
          <input type="file" accept="image/*" multiple onChange={(e) => setImages(e.target.files ? Array.from(e.target.files) : [])} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-[#C9A24D] file:text-black hover:file:bg-[#B79424]" />
        </div>
      </div>

      <button type="submit" disabled={loading} className="w-full bg-black text-[#C9A24D] py-4 rounded font-bold hover:bg-gray-800 transition">
        {loading ? "Saving..." : "Publish Property"}
      </button>
    </form>
  </Container>
);
}

  

/*
  return (
    <Container>
      <div className="py-6 border-b border-gray-200 mb-6">
      <h1 className="text-3xl font-bold text-[#C9A24D]">Add Property</h1>
      <p className="text-gray-500 mt-2">Enter the details below to list your property.</p>
    </div>

      <form onSubmit={handleSubmit} className="max-w-lg mx-auto space-y-4 py-6">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          className="w-full border p-3 rounded focus:border-[#C9A24D] outline-none"
          required
        />

        <input
          value={suburb}
          onChange={(e) => setSuburb(e.target.value)}
          placeholder="Suburb"
          className="w-full border p-3 rounded focus:border-[#C9A24D] outline-none"
          required
        />

        <input
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          type="number"
          placeholder="Price"
          min={1000}
          step="0.01"
          className="w-full border p-3 rounded focus:border-[#C9A24D] outline-none"
          required
        />

        <input
          value={bedrooms}
          onChange={(e) => setBedrooms(e.target.value)}
          type="number"
          placeholder="Bedrooms"
          min={0}
          className="w-full border p-3 rounded focus:border-[#C9A24D] outline-none"
          required
        />

        <input
          value={bathrooms}
          onChange={(e) => setBathrooms(e.target.value)}
          type="number"
          placeholder="Bathrooms"
          min={0}
          className="w-full border p-3 rounded focus:border-[#C9A24D] outline-none"
          required
        />

        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
          className="w-full border p-3 rounded focus:border-[#C9A24D] outline-none"
          required
        />


        <button
          type="button"
          onClick={suggestAmenities}
          className="mt-2 px-4 py-2 bg-black text-white rounded"
          
        >
          {aiLoading ? "Thinking..." : "Suggest Amenities"}
        </button>

        {suggestedAmenities.length > 0 && (
          <div className="mt-4">
            <p className="text-sm font-semibold mb-2">Suggested Amenities:</p>
            <div className="flex flex-wrap gap-2">
              {suggestedAmenities.map((item, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() =>
                    setAmenities((prev) =>
                      prev.includes(item) ? prev : [...prev, item]
                    )
                  }
                  className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                >
                  + {item}
                </button>
              ))}
            </div>
          </div>
        )}

        {amenities.length > 0 && (
          <div className="mt-4">
            <p className="text-sm font-semibold mb-2">Selected Amenities:</p>
            <div className="flex flex-wrap gap-2">
              {amenities.map((item, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-[#C9A24D] text-black rounded cursor-pointer"
                  onClick={() =>
                    setAmenities((prev) => prev.filter((a) => a !== item))
                  }
                >
                  {item} ✕
                </span>
              ))}
            </div>
          </div>
        )}

        <input
          type="file"
          accept="image/*"
          multiple
          onChange={(e) =>
            setImages(e.target.files ? Array.from(e.target.files) : [])
          }
        />

        {images.length > 0 && (
          <div className="grid grid-cols-3 gap-3 mt-3">
            {images.map((file, index) => (
              <div key={index} className="relative">
                <img
                  src={URL.createObjectURL(file)}
                  alt="preview"
                  className="h-24 w-full object-cover rounded"
                />
                <button
                  type="button"
                  onClick={() =>
                    setImages((prev) => prev.filter((_, i) => i !== index))
                  }
                  className="absolute top-1 right-1 bg-black/70 text-white text-xs px-2 py-1 rounded"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#C9A24D] text-black py-3 rounded disabled:opacity-50 hover:bg-[#B79424] transition"
        >
          {loading ? "Saving..." : "Add Property"}
        </button>
      </form>
    </Container>
  );
}




*/