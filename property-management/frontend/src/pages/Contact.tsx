import { useState } from "react";
import SectionHeader from "../components/ui/SectionHeader";
import Container from "../components/layout/Container";
import heroImage from "../utils/background.avif";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
   inquiryType: "General Inquiry",
    message: "",
  });

  // Added states for better UI feedback
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
   const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      const response = await fetch(`${API_BASE_URL}/contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitStatus("success");
        // Clear the form after successful submission
        setFormData({ name: "", email: "", inquiryType: "General Inquiry", message: "" });
      } else {
        setSubmitStatus("error");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
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
            <div>
              {/* Feedback Messages */}
              {submitStatus === "success" && (
                <div className="mb-6 p-4 bg-green-50 text-green-700 border border-green-200 rounded">
                  Thank you for contacting Pelican Properties. Our team will reach out to you shortly.
                </div>
              )}
              {submitStatus === "error" && (
                <div className="mb-6 p-4 bg-red-50 text-red-700 border border-red-200 rounded">
                  Something went wrong sending your message. Please try again or contact us directly.
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <input
                  
                  required
                  aria-label="Your Name"
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  disabled={isSubmitting}
                />
                <input
                  required
                  type="email"
                  className="w-full border border-gray-300 p-4 rounded focus:border-[#C9A24D] outline-none"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  disabled={isSubmitting}
                />

                {/* Service Selection */}
                <select
                  className="w-full border border-gray-300 p-4 rounded focus:border-[#C9A24D] outline-none bg-white text-gray-500"
                  value={formData.inquiryType}
                  onChange={(e) => setFormData({ ...formData, inquiryType: e.target.value })}
                  disabled={isSubmitting}
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
                  disabled={isSubmitting}
                />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`px-8 py-4 border border-[#C9A24D] text-[#C9A24D] font-semibold transition rounded ${
                    isSubmitting 
                      ? "opacity-50 cursor-not-allowed" 
                      : "hover:bg-[#C9A24D] hover:text-black"
                  }`}
                >
                  {isSubmitting ? "Sending..." : "Send Message"}
                </button>
              </form>
            </div>

            {/* Contact Details */}
            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">Office</h3>
                <p className="text-gray-700">Randburg, Johannesburg</p>
                <p className="text-gray-700">South Africa</p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">Email</h3>
                
                <a href="mailto:info@pelicanproperties.co.za" className="text-[#C9A24D] hover:underline">
                    info@pelicanproperties.co.za
                </a>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">Professional Support</h3>
                <a href="tel:+27789620727" className="text-gray-700 hover:text-[#C9A24D] transition">
                   +27 78 962 0727
              </a>
                <p className="text-sm text-gray-500 mt-2">Available: Mon - Fri, 08:00 - 17:00</p>
              </div>
              <div className="pt-6 border-t border-gray-200">
                <p className="text-sm italic text-gray-600">
                  Relieving property owners of the burdens associated with property management.
                </p>
              </div>
            </div>

          </div>
        </Container>
      </div>
    </div>
  );
}