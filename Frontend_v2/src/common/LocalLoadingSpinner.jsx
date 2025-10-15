import { FaSpinner } from "react-icons/fa";

const LocalLoadingSpinner = ({ size = "text-4xl", className = "" }) => {
  return (
    <div className={`flex items-center justify-center p-8 ${className}`}>
      <FaSpinner className={`${size} text-blue-400 animate-spin`} />
    </div>
  );
};

export default LocalLoadingSpinner;
