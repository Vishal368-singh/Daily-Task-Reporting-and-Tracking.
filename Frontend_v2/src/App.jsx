import { BrowserRouter as Router } from "react-router-dom";
import { AuthProvider } from "./context/AuthProvider";
import AppRoutes from "./routes/AppRoutes.jsx";

function App() {
  return (
    <Router basename="/DTRT/">
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

export default App;
