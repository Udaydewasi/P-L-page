import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LoginForm from "./components/LoginForm";
import UserDashboard from "./components/UserDashboard";
import AdminDashboard from "./components/AdminDashboard";

function App() {
  const role = localStorage.getItem("role");

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginForm />} />
        {role === "admin" ? (
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
        ) : (
          <Route path="/user-dashboard" element={<UserDashboard />} />
        )}
      </Routes>
    </Router>
  );
}

export default App;
