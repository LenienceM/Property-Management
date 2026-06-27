export default function Footer() {
  return (
    <footer className="w-full py-8 mt-12 border-t border-gray-200 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 flex flex-col items-center justify-center space-y-2">
        {/* Client Copyright */}
        <p className="text-sm text-gray-500">
          © {new Date().getFullYear()} Pelican Properties. All rights reserved.
        </p>

        {/* Developer Signature */}
        <p className="text-xs text-gray-400">
          Platform Architecture & Design by{" "}
          <a
            href="https://www.linkedin.com/in/lenience-moyo-aa706536/" 
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium hover:text-[#C9A24D] transition-colors"
          >
            Lenience Moyo
          </a>
        </p>
      </div>
    </footer>
  );
}