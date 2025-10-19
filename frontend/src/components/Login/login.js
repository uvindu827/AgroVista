
import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../Farmer/pages/context/AuthContext";


export default function LoginPage() {
  // Email validation function
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) return "Email is required";
    if (!emailRegex.test(email)) return "Please enter a valid email address";
    return "";
  };

  // Password validation function
  const validatePassword = (password) => {
    if (!password) return "Password is required";
    if (password.length < 6)
      return "Password must be at least 6 characters long";
    return "";
  };
  const { setUser, setToken } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

// ...existing code...
  // ...existing code...

  // ...existing code...

  const validateForm = () => {
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);
    return !emailError && !passwordError;
  };

// ...existing code...
  const handleOnSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error("Please fix the errors below");
      return;
    }

    setIsLoading(true);

    try {
      const res = await axios.post("http://localhost:3000/api/users/login", {
        email: email.trim(),
        password
      });

      toast.success("Login Successful");
      const user = res.data.user;
      const token = res.data.token;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("ID", user._id);
      setUser(user);
      setToken(token);

      switch (user.role) {
        case "farmer":
          navigate("/farmer/orders");
          break;
        case "buyer":
          navigate("/buyerHome/");
          break;
        case "admin":
          navigate("/users_management/");
          break;
        case "tool dealer":
          navigate("/");
          break;
        case "agricultural inspector":
          navigate("/instructor");
          break;
        case "customer":
          navigate("/");
          break;
        default:
          navigate("/");
      }
    } catch (err) {
      console.error("Login error:", err);
      if (err.response) {
        const errorMessage =
          err.response.data?.error ||
          err.response.data?.message ||
          "Login failed";
        if (err.response.status === 401) {
          toast.error("Invalid email or password");
        } else if (err.response.status === 404) {
          toast.error("User not found");
        } else if (err.response.status === 429) {
          toast.error("Too many login attempts. Please try again later");
        } else {
          toast.error(errorMessage);
        }
      } else if (err.request) {
        toast.error("Network error. Please check your connection and try again");
      } else {
        toast.error("An unexpected error occurred. Please try again");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-grow flex justify-center items-center bg-cover bg-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-green-900/70 to-green-800/70 z-10"></div>
        <div
          className="absolute inset-0 bg-cover bg-center animate-[backgroundScroll_30s_linear_infinite]"
          style={{ backgroundImage: "url('/loginbg.jpg')" }}
        ></div>

        {/* Floating animated circles */}
        <div className="absolute top-20 left-20 w-24 h-24 bg-yellow-200/20 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-32 h-32 bg-green-300/20 rounded-full blur-xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-amber-300/20 rounded-full blur-xl animate-pulse delay-500"></div>

        <div className="z-20 w-full max-w-md px-4">
          <form
            onSubmit={handleOnSubmit}
            className="bg-white/20 backdrop-blur-lg p-8 rounded-2xl shadow-2xl border border-white/30 transform hover:scale-[1.01] transition-all duration-300"
          >
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                <img src="/agrologo.png" alt="AgroVista Logo" className="w-24 h-auto" />
              </div>
              <h2 className="text-4xl font-bold text-white mb-2">Welcome Back</h2>
              <p className="text-green-100">Sign in to your AgroVista account</p>
            </div>

            <div className="space-y-5">
              {[{
                label: "Email",
                value: email,
                setValue: setEmail,
                type: "email",
                icon: (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-black"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                ),
              }, {
                label: "Password",
                value: password,
                setValue: setPassword,
                type: "password",
                icon: (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-black"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                ),
              }].map(({ label, value, setValue, type, icon }, idx) => (
                <div key={idx} className="relative">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2">{icon}</div>
                  <input
                    type={type}
                    placeholder={label}
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    className="w-full p-3 pl-10 rounded-lg bg-white/30 text-white placeholder-green-100 outline-none border border-white/30 focus:border-green-300 focus:ring-2 focus:ring-green-300/50 transition-all"
                    required
                  />
                </div>
              ))}
            </div>

            <div className="mt-6">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-green-600 to-green-500 text-white py-3 rounded-lg font-semibold text-lg hover:from-green-700 hover:to-green-600 transition-all duration-300 shadow-lg hover:shadow-green-500/30 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Signing in...
                  </span>
                ) : (
                  "Sign in now"
                )}
              </button>
              <p className="text-sm text-white text-center mt-4">
                Don't have an account?{' '}
                <Link to="/users/" className="underline hover:text-green-300 font-medium">
                  Sign up
                </Link>
              </p>
              <p className="text-sm text-white text-center mt-4">
                By clicking on "Sign in now" you agree to our{' '}
                <button type="button" className="underline hover:text-green-300" style={{background: 'none', border: 'none', padding: 0, color: 'inherit', cursor: 'pointer'}}>Terms of Service</button> and{' '}
                <button type="button" className="underline hover:text-green-300" style={{background: 'none', border: 'none', padding: 0, color: 'inherit', cursor: 'pointer'}}>Privacy Policy</button>.
              </p>
            </div>
          </form>
        </div>
      </div>
      <style>{`
        @keyframes backgroundScroll {
          0% { background-position: 0% 0%; }
          100% { background-position: 100% 100%; }
        }
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }
      `}</style>
    </div>
  );
}
// ...existing code...
