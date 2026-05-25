
import DashboardLayout from "../components/layout/DashboardLayout";


export default function Dashboard() {
  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-500">Welcome back! Here is what is happening with your properties today.</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <h3 className="text-gray-500 text-sm font-medium">Total Properties</h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">24</p>
        </div>
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <h3 className="text-gray-500 text-sm font-medium">Active Listings</h3>
          <p className="text-3xl font-bold text-[#C9A24D] mt-2">18</p>
        </div>
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <h3 className="text-gray-500 text-sm font-medium">New Inquiries</h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">5</p>
        </div>
      </div>

      {/* Property Data Grid Header */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-gray-900">Recent Properties</h2>
          <button className="bg-[#C9A24D] text-black font-semibold px-4 py-2 rounded hover:bg-yellow-600 transition">
            + Add Property
          </button>
        </div>
        
        {/* We will map over your API data here in Step 3! */}
        <div className="text-center py-10 text-gray-500 border-2 border-dashed border-gray-200 rounded">
          Property data table will go here...
        </div>
      </div>
    </DashboardLayout>
  );
}