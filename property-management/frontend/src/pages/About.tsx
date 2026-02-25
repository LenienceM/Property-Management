// src/pages/About.tsx
import heroImage from "../utils/background.avif"; // optional hero image
import SectionHeader from "../components/ui/SectionHeader";
import Container from "../components/layout/Container";

export default function About() {
  return (
    <div className="min-h-screen bg-white">

      {/* Hero */}
      <SectionHeader
        title="About Us"
        subtitle="We focus on quality properties, transparent processes, and long-term value for buyers and investors."
        backgroundImage={heroImage} // optional
      />

      {/* Core Content */}
      <Container>
        <div className="py-16 grid md:grid-cols-2 gap-12">

          <div>
            <h3 className="text-2xl font-semibold">Our Mission</h3>
            <p className="mt-3 text-gray-700 max-w-lg">
              To help people discover properties they can trust, whether they’re buying a home or investing for the future.
            </p>
          </div>

          <div>
            <h3 className="text-2xl font-semibold">What Sets Us Apart</h3>
            <ul className="mt-3 space-y-2 text-gray-700 list-disc list-inside">
              <li>Carefully vetted listings</li>
              <li>Honest pricing & clear information</li>
              <li>Strong local market knowledge</li>
              <li>Long-term value mindset</li>
            </ul>
          </div>

        </div>
      </Container>
    </div>
  );
}
