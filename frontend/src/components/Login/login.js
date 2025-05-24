// src/pages/LoginPage.jsx
import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate, Link } from "react-router-dom";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleOnSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    axios
      .post(`http://localhost:3000/api/users/login`, { email, password })
      .then((res) => {
        toast.success("Login Successful");
        const user = res.data.user;

        localStorage.setItem("token", res.data.token);
        localStorage.setItem("ID", res.data.user._id);
        localStorage.setItem("user", JSON.stringify(user));

        switch (user.role) {
          case "farmer":
            navigate("/farmer/");
            break;
          case "buyer":
            navigate("/buyerHome/");
            break;
          case "admin":
            navigate("/users_management/");
            break;
          case "tool dealer":
            navigate("/welcome");
            break;
          case "agricultural inspector":
          case "customer":
          default:
            navigate("/");
        }
      })
      .catch((err) => {
        toast.error(err.response?.data?.error || "An error occurred");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-cover bg-center relative" style={{ backgroundImage: "url('/loginbg.jpg')" }}>
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/50 z-0"></div>

      {/* Floating circles */}
      <div className="absolute top-10 left-10 w-24 h-24 bg-white/10 rounded-full blur-2xl animate-float z-0"></div>
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl animate-float2 z-0"></div>

      {/* Main Container */}
      <div className="z-10 flex w-11/12 max-w-6xl bg-white/10 backdrop-blur-md rounded-xl overflow-hidden shadow-2xl">
        {/* Welcome Text */}
        <div className="w-1/2 p-10 text-white hidden lg:flex flex-col justify-center">
          <h1 className="text-5xl font-bold mb-4">Welcome Back</h1>
          <p className="text-lg mb-6">
            It is a long established fact that a reader will be distracted by the readable content of a page.
          </p>
          <div className="flex space-x-4">
            {["facebook", "twitter", "instagram", "youtube"].map((icon) => (
              <a key={icon} href="#" className="text-white hover:text-green-300 transition duration-300">
                <i className={`fab fa-${icon} text-xl`}></i>
              </a>
            ))}
          </div>
        </div>

        {/* Login Form */}
        <div className="w-full lg:w-1/2 p-10 bg-white/20">
          <h2 className="text-3xl font-semibold text-white mb-6 text-center">Sign in</h2>

          <form onSubmit={handleOnSubmit} className="space-y-6">
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 rounded bg-white/70 text-black placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-green-400"
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 rounded bg-white/70 text-black placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-green-400"
            />

            <div className="flex justify-between items-center text-white">
              <label className="flex items-center space-x-2">
                <input type="checkbox" className="accent-green-500" />
                <span className="text-sm">Remember Me</span>
              </label>
              <Link to="/forgot-password" className="text-sm hover:underline">Lost your password?</Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded font-semibold transition-all"
            >
              {isLoading ? "Signing in..." : "Sign in now"}
            </button>

            <p className="text-sm text-white text-center mt-4">
              By clicking on "Sign in now" you agree to our{" "}
              <a href="#" className="underline hover:text-green-300">Terms of Service</a> and{" "}
              <a href="#" className="underline hover:text-green-300">Privacy Policy</a>.
            </p>
          </form>
        </div>
      </div>

      {/* Extra Styles */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }

        @keyframes float2 {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(15px); }
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        .animate-float2 {
          animation: float2 8s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
