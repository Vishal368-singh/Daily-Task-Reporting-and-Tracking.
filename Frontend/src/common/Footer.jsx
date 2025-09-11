export default function Footer() {
  return (
    <footer className="bg-[#111111] border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col md:flex-row items-center justify-between">
        {/* Left side */}
        <p className="text-gray-400 text-sm">
          © {new Date().getFullYear()} ML InfoMap Pvt. Ltd. All rights reserved.
        </p>

        {/* Optional right side for links or version */}
        <p className="text-gray-500 text-sm mt-2 md:mt-0">Version 1.0</p>
      </div>
    </footer>
  );
}
