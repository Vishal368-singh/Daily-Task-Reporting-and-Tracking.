import { FaSpinner } from "react-icons/fa";

const LoadingSpinner = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-2xl border border-white/20 flex flex-col items-center space-y-4 ">
        <FaSpinner className="text-blue-400 text-6xl animate-spin shadow-lg shadow-blue-500/50" />
        <p className="text-white text-xl font-medium">Loading...</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;
