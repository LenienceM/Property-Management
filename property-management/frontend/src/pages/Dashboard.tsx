import { useState, useEffect } from "react";
import DashboardLayout from "../components/layout/DashboardLayout";
import type { Property } from "../types/Property"; 

export default function Dashboard() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api";
        const token = localStorage.getItem("token");

        // Fetch a large size (e.g., 1000) so the dashboard can calculate 
        // accurate global stats for Total Properties and Active Listings locally
        const response = await fetch(`${API_BASE_URL}/properties/admin?statuses=ACTIVE&statuses=ARCHIVED&page=0&size=1000`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (!response.ok) throw new Error("Failed to fetch properties");
        
        const data = await response.json();
        const rawProperties: Property[] = data.content || data; // Unpack the 'content' array from the page response
        
        // Deduplicate properties by ID to handle potential backend Cartesian product (duplicate items from joins)
        const uniqueProperties = Array.from(new Map(rawProperties.map(p => [p.id, p])).values());

        setProperties(uniqueProperties);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProperties();
  }, []);

  // Dynamically calculate stats directly from the database response
  const totalProperties = properties.length;
  const activeListings = properties.filter(p => p.status === 'ACTIVE').length;

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-500">Welcome back! Here is what is happening with your properties today.</p>
      </div>

      {/* Dynamic Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <h3 className="text-gray-500 text-sm font-medium">Total Properties</h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">
            {isLoading ? "..." : totalProperties}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <h3 className="text-gray-500 text-sm font-medium">Active Listings</h3>
          <p className="text-3xl font-bold text-[#C9A24D] mt-2">
            {isLoading ? "..." : activeListings}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <h3 className="text-gray-500 text-sm font-medium">New Inquiries</h3>
          {/* Note: This is still static data! You will need to build and fetch an inquiries endpoint. */}
          <p className="text-3xl font-bold text-gray-900 mt-2">0</p>
        </div>
      </div>

      {/* Live Property Data Grid */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-900">Recent Properties</h2>
          <a href="/properties/add" className="bg-[#C9A24D] text-black font-semibold px-4 py-2 rounded hover:bg-yellow-600 transition">
            + Add Property
          </a>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-sm border-b border-gray-200">
                <th className="p-4 font-medium">Property</th>
                <th className="p-4 font-medium">Location</th>
                <th className="p-4 font-medium">Price</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-500">Loading properties...</td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-red-500">{error}</td>
                </tr>
              ) : properties.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-500">No properties found. Add your first one!</td>
                </tr>
              ) : (
                // Only show the 5 most recent properties in the dashboard table
                properties.slice(0, 5).map((property) => (
                  <tr key={property.id} className="hover:bg-gray-50 transition">
                    <td className="p-4 font-medium text-gray-900">{property.title}</td>
                    <td className="p-4 text-gray-600">{property.suburb}</td>
                    <td className="p-4 text-gray-900 font-medium">R {property.price.toLocaleString()}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        property.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {property.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button className="text-[#C9A24D] hover:underline font-medium text-sm">Edit</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}