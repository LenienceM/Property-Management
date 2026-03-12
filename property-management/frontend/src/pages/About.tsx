// src/pages/About.tsx
import heroImage from "../utils/background.avif";
import SectionHeader from "../components/ui/SectionHeader";
import Container from "../components/layout/Container";

export default function About() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <SectionHeader
        title="About Pelican Properties"
        subtitle="Turn your real estate dreams into reality with a seamless, stress-free experience."
        backgroundImage={heroImage}
      />

      <Container>
        <div className="py-16 space-y-16">
          {/* Main Story */}
          <section className="max-w-4xl">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
            <p className="text-gray-700 leading-relaxed text-lg">
              Pelican Properties was founded by passionate young professionals with a deep-rooted commitment
              to the real estate industry. Our vision is to create meaningful career opportunities while
              building and maintaining lasting professional relationships with our clients and partners.
            </p>
            <p className="mt-4 text-gray-700 leading-relaxed text-lg">
              At Pelican Properties, we understand that our clients are our number one priority.
              We pride ourselves on going above and beyond to ensure that every client receives
              exceptional service, professional guidance, and a seamless property experience.
            </p>
          </section>

          {/* Mission & Vision Grid */}
          <div className="grid md:grid-cols-2 gap-12 border-t border-b py-12">
            <div>
              <h3 className="text-2xl font-semibold text-[#C9A24D]">Vision Statement</h3>
              <p className="mt-4 text-gray-700 leading-relaxed">
                In the world of real estate, timing is everything. Our vision is to become a trusted
                and reliable real estate partner by relieving property owners and clients of the burdens
                associated with property management and transactions.
              </p>
            </div>
            <div>
              <h3 className="text-2xl font-semibold text-[#C9A24D]">Mission Statement</h3>
              <p className="mt-4 text-gray-700 leading-relaxed">
                Our mission is to turn your real estate dreams into reality. Our work is guided by our
                core values of <strong>Faith in God, Professionalism, Integrity, and Timeliness</strong>.
              </p>
            </div>
          </div>

          {/* Services Section */}
          <section className="bg-gray-50 p-8 rounded-xl">
            <h2 className="text-2xl font-bold mb-6">Our Services Include:</h2>
            <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 text-gray-700">
              <li className="flex items-center gap-2">✔ Property Sales</li>
              <li className="flex items-center gap-2">✔ Property Rentals</li>
              <li className="flex items-center gap-2">✔ Property Buying Assistance</li>
              <li className="flex items-center gap-2">✔ Property Management</li>
              <li className="flex items-center gap-2">✔ Property Maintenance & Compliance</li>
            </ul>
          </section>

          {/* Final Statement */}
          <p className="text-center text-gray-600 italic pb-10">
            Through professionalism, market knowledge, and dedication, we strive to deliver results
            that exceed expectations.
          </p>
        </div>
      </Container>
    </div>
  );
}