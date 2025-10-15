import { BrowserRouter as Router } from "react-router-dom";
import { AuthProvider } from "./context/AuthProvider";
import AppRoutes from "./routes/AppRoutes.jsx";
import { ToastContainer } from "react-toastify";

function App() {
  return (
    <Router basename="/DTRT/">
      <AuthProvider>
        <AppRoutes />
        <ToastContainer
          position="top-center"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
        />
      </AuthProvider>
    </Router>
  );
}

export default App;
