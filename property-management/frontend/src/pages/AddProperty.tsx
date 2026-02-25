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

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      // Create property
      const res = await fetch("http://localhost:8080/api/properties", {
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
          `http://localhost:8080/api/properties/${property.id}/images`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
            },
            body: formData,
          }
        );

        if (!imgRes.ok) {
          const text = await imgRes.text();
          console.error("Image upload error:", text);
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
      <SectionHeader title="Add Property" />

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
