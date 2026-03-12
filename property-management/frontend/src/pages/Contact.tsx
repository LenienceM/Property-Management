import { useState } from "react";
import SectionHeader from "../components/ui/SectionHeader";
import Container from "../components/layout/Container";
import heroImage from "../utils/background.avif";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    service: "General Inquiry",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Logic for connecting to your Spring Boot /api/contact can go here
    console.log("Form Data:", formData);
    alert("Thank you for contacting Pelican Properties. Our team will reach out to you shortly.");
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <SectionHeader
        title="Contact Us"
        subtitle="Let’s talk about your next property move. Professional guidance is just a message away."
        backgroundImage={heroImage}
      />

      {/* Form + Details */}
      <div className="bg-gray-50 py-16">
        <Container>
          <div className="grid md:grid-cols-2 gap-20">

            {/* Contact Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <input
                required
                className="w-full border border-gray-300 p-4 rounded focus:border-[#C9A24D] outline-none"
                placeholder="Your Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
              <input
                required
                type="email"
                className="w-full border border-gray-300 p-4 rounded focus:border-[#C9A24D] outline-none"
                placeholder="Email Address"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />

              {/* Added Service Selection to match your Mission Statement */}
              <select
                className="w-full border border-gray-300 p-4 rounded focus:border-[#C9A24D] outline-none bg-white text-gray-500"
                value={formData.service}
                onChange={(e) => setFormData({ ...formData, service: e.target.value })}
              >
                <option>General Inquiry</option>
                <option>Property Sales</option>
                <option>Property Rentals</option>
                <option>Property Management</option>
                <option>Maintenance & Compliance</option>
              </select>

              <textarea
                required
                className="w-full border border-gray-300 p-4 h-40 rounded focus:border-[#C9A24D] outline-none"
                placeholder="How can we help you?"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              />
              <button
                type="submit"
                className="px-8 py-4 border border-[#C9A24D] text-[#C9A24D] hover:bg-[#C9A24D] hover:text-black font-semibold transition rounded"
              >
                Send Message
              </button>
            </form>

            {/* Contact Details */}
            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">Office</h3>
                <p className="text-gray-700">Sandton, Johannesburg</p>
                <p className="text-gray-700">South Africa</p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">Email</h3>
                <p className="text-[#C9A24D]">info@pelicanproperties.co.za</p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">Professional Support</h3>
                <p className="text-gray-700">+27 11 000 0000</p>
                <p className="text-sm text-gray-500 mt-2">Available: Mon - Fri, 08:00 - 17:00</p>
              </div>

              <div className="pt-6 border-t border-gray-200">
                <p className="text-sm italic text-gray-600">
                  "Relieving property owners of the burdens associated with property management."
                </p>
              </div>
            </div>

          </div>
        </Container>
      </div>
    </div>
  );
}