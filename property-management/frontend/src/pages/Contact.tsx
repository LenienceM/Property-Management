// src/pages/Contact.tsx
import SectionHeader from "../components/ui/SectionHeader";
import Container from "../components/layout/Container";
import heroImage from "../utils/background.avif"; // optional hero image

export default function Contact() {
  return (
    <div className="min-h-screen bg-white">

      {/* Hero */}
      <SectionHeader
        title="Contact Us"
        subtitle="Let’s talk about your next property move."
        backgroundImage={heroImage} // optional
      />

      {/* Form + Details */}
      <div className="bg-gray-50 py-16">
        <Container>
          <div className="grid md:grid-cols-2 gap-20">

            {/* Contact Form */}
            <form className="space-y-6">
              <input
                className="w-full border border-gray-300 p-4 rounded focus:border-[#C9A24D] outline-none"
                placeholder="Your Name"
              />
              <input
                className="w-full border border-gray-300 p-4 rounded focus:border-[#C9A24D] outline-none"
                placeholder="Email Address"
              />
              <textarea
                className="w-full border border-gray-300 p-4 h-40 rounded focus:border-[#C9A24D] outline-none"
                placeholder="Message"
              />
              <button className="px-8 py-4 border border-[#C9A24D] text-[#C9A24D] hover:bg-[#C9A24D] hover:text-black transition rounded">
                Send Message
              </button>
            </form>

            {/* Contact Details */}
            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-semibold">Office</h3>
                <p className="text-gray-700">Johannesburg, South Africa</p>
              </div>
              <div>
                <h3 className="text-xl font-semibold">Email</h3>
                <p className="text-gray-700">info@pelicanproperties.co.za</p>
              </div>
              <div>
                <h3 className="text-xl font-semibold">Phone</h3>
                <p className="text-gray-700">+27 11 000 0000</p>
              </div>
            </div>

          </div>
        </Container>
      </div>
    </div>
  );
}
