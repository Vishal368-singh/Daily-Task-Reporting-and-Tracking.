import { FaSpinner } from "react-icons/fa";

const LoadingSpinner = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 p-8 flex items-center justify-center">
      <div className="bg-[#2a2a2a] p-8 rounded-2xl shadow-lg flex flex-col items-center space-y-4">
        <FaSpinner className="text-blue-500 text-4xl animate-spin" />
        <p className="text-gray-400 text-lg">Loading analysis report...</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;
