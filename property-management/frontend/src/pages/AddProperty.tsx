import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Container from "../components/layout/Container";
import imageCompression from "browser-image-compression";


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
      const token = localStorage.getItem("token");

      // STEP 1: Submit the task and get the Ticket ID (UUID)
      const initRes = await fetch(`${API_BASE_URL}/properties/suggest-amenities`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ description }),
      });

      if (!initRes.ok) {
        throw new Error("Failed to start AI task");
      }

      // This is the db1215f5... string
      const jobId = await initRes.text(); 
      console.log("Task started with Job ID:", jobId);

      // STEP 2: "Poll" the status endpoint until the task is COMPLETED
      let isDone = false;
      let finalAmenities: string[] = [];

      while (!isDone) {
        // Wait 2 seconds before checking the status (so we don't spam the server)
        await new Promise((resolve) => setTimeout(resolve, 2000));

        const statusRes = await fetch(
          `${API_BASE_URL}/properties/suggest-amenities/status/${jobId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const statusData = await statusRes.json();
        console.log("Current AI Status:", statusData);

        if (statusData.status === "COMPLETED") {
          // The AI is done! Grab the array from the "data" key
          finalAmenities = statusData.data;
          isDone = true;
        } else if (statusData.status === "ERROR") {
          throw new Error(statusData.message || "AI processing failed");
        }
        // If status is "PENDING", the loop just continues and waits another 2 seconds
      }

      // STEP 3: Update the UI with the final result
      setSuggestedAmenities(finalAmenities);

    } catch (err) {
      console.error("AI flow error:", err);
      alert("Failed to get AI suggestions");
    } finally {
      setAiLoading(false);
    }
  };

  const handleImageSelection = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    if (files.length === 0) return;

    const compressionOptions = {
      maxSizeMB: 0.5, // Max file size in MB (500 KB)
      maxWidthOrHeight: 1920, // Max dimension
      useWebWorker: true, // Speeds up compression by using background threads
    };

    try {
      const compressedFiles = await Promise.all(
        files.map(async (file) => {
          // Compress the file
          const compressedBlob = await imageCompression(file, compressionOptions);
          // Convert the Blob back into a File object so your backend doesn't complain
          return new File([compressedBlob], file.name, {
            type: compressedBlob.type,
            lastModified: Date.now(),
          });
        })
      );
      
      setImages(compressedFiles);
    } catch (error) {
      console.error("Error compressing images:", error);
      // Fallback: if compression fails for some reason, just use the original files
      setImages(files);
    } finally {
      // setIsCompressing(false);
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
        ;
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
  

  <input 
    value={title} 
    onChange={(e) => setTitle(e.target.value)} 
    placeholder="Title" 
    className="w-full border p-3 rounded focus:border-[#C9A24D] outline-none" 
    required 
  />

  {/* Row 1: Suburb and Price */}
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
      className="w-full border p-3 rounded focus:border-[#C9A24D] outline-none" 
      required 
    />
  </div>

  {/* Bedrooms and Bathrooms */}
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
    <input 
      value={bedrooms} 
      onChange={(e) => setBedrooms(e.target.value)} 
      type="number" 
      placeholder="Bedrooms" 
      min="0"
      className="w-full border p-3 rounded focus:border-[#C9A24D] outline-none" 
      required 
    />
    <input 
      value={bathrooms} 
      onChange={(e) => setBathrooms(e.target.value)} 
      type="number" 
      placeholder="Bathrooms" 
      min="0"
      className="w-full border p-3 rounded focus:border-[#C9A24D] outline-none" 
      required 
    />
  </div>
</div>

      {/* Grouped: Amenities */}
      <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
        <h2 className="text-lg font-semibold text-gray-800">Description</h2>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Property Description (e.g., 'A lovely home in Morningside with a pool')" className="w-full border p-3 rounded h-24 focus:border-[#C9A24D] outline-none" required />
        
        <button type="button" onClick={suggestAmenities}   disabled={aiLoading} className="w-full py-2 bg-[#C9A24D] text-black font-medium rounded hover:bg-[#B79424] transition disabled:opacity-50">
          {aiLoading ? "Thinking..." : "Generate AI Amenities"}
        </button>       
         
         {/* Helper text that only shows while loading */}
          {aiLoading && (
            <p className="text-xs text-center text-gray-500 mt-2">
              Feel free to upload your gallery images while we generate this!
            </p>
          )}
        

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

      </div>

      {/* Grouped: Media */}
      
          <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
        <h2 className="text-lg font-semibold text-gray-800">Gallery</h2>
        <div className="border-2 border-dashed border-gray-300 p-4 rounded text-center">
 <input 
  type="file" 
  accept="image/*" 
  multiple 
  onChange={handleImageSelection} 
  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-[#C9A24D] file:text-black hover:file:bg-[#B79424]" 
/>
        </div>
      </div>

      <button type="submit" disabled={loading} className="w-full bg-black text-[#C9A24D] py-4 rounded font-bold hover:bg-gray-800 transition">
        {loading ? "Saving..." : "Publish Property"}
      </button>
    </form>
  </Container>
);
}

