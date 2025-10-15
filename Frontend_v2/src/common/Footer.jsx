export default function Footer() {
  return (
    <footer className="sticky bottom-0 z-40 bg-[#111111] border-t-1 border-white/20 shadow-inner">
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col md:flex-row items-center justify-between">
        {/* Left side */}
        <p className="text-gray-300 text-sm">
          © {new Date().getFullYear()} ML InfoMap Pvt. Ltd. All rights reserved.
        </p>

        {/* Right side */}
        <p className="text-gray-400 text-sm mt-2 md:mt-0">Version 1.0</p>
      </div>
    </footer>
  );
}
