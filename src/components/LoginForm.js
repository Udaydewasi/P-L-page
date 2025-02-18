import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchUserByEmail } from "../utils/fetchdetails";

function LoginForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "", role: "user" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password, role } = formData;

    const user = await fetchUserByEmail(formData);
    console.log("user is : ", user);
    if (!user || user == ' Gmail is incorrect' || user == 'Password is incorrect.') {
      alert("Invalid email or password!");
      return;
    }

    
    localStorage.setItem("email", user);
    localStorage.setItem("role", role);
    
    if (role === "admin") {
      navigate("/admin-dashboard");
    } else {
      navigate("/user-dashboard");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form className="bg-white p-8 rounded-lg shadow-lg" onSubmit={handleSubmit}>
        <h2 className="text-2xl font-bold text-gray-700 mb-4">Login</h2>

        <label className="block mb-2">
          <span className="text-gray-600">Email Address</span>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="mt-1 p-2 w-full border rounded"
          />
        </label>

        <label className="block mb-2">
          <span className="text-gray-600">Password</span>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="mt-1 p-2 w-full border rounded"
          />
        </label>

        <label className="block mb-4">
          <span className="text-gray-600">Role</span>
          <select name="role" value={formData.role} onChange={handleChange} className="mt-1 p-2 w-full border rounded">
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </label>

        <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded w-full">Sign In</button>
      </form>
    </div>
  );
}

export default LoginForm;
