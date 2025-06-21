// src/pages/LoginPage.jsx
import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate, Link } from "react-router-dom";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const navigate = useNavigate();

  // Validation functions
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      return "Email is required";
    }
    if (!emailRegex.test(email)) {
      return "Please enter a valid email address";
    }
    return "";
  };

  const validatePassword = (password) => {
    if (!password) {
      return "Password is required";
    }
    if (password.length < 6) {
      return "Password must be at least 6 characters long";
    }
    return "";
  };

  const validateRememberMe = (rememberMe) => {
    if (!rememberMe) {
      return "Please check 'Remember Me' to proceed";
    }
    return "";
  };

  // Handle input changes with validation
  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);

    if (touched.email) {
      setErrors((prev) => ({
        ...prev,
        email: validateEmail(value),
      }));
    }
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);

    if (touched.password) {
      setErrors((prev) => ({
        ...prev,
        password: validatePassword(value),
      }));
    }
  };

  // Handle input blur (when user leaves the field)
  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));

    if (field === "email") {
      setErrors((prev) => ({
        ...prev,
        email: validateEmail(email),
      }));
    } else if (field === "password") {
      setErrors((prev) => ({
        ...prev,
        password: validatePassword(password),
      }));
    }
  };

  // Validate all fields
  const validateForm = () => {
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);

    const newErrors = {
      email: emailError,
      password: passwordError,
    };

    setErrors(newErrors);
    setTouched({ email: true, password: true });

    return !emailError && !passwordError;
  };

  const handleOnSubmit = async (e) => {
    e.preventDefault();

    // Validate form before submission
    if (!validateForm()) {
      toast.error("Please fix the errors below");
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post(
        `http://localhost:3000/api/users/login`,
        {
          email: email.trim(),
          password,
        }
      );

      toast.success("Login Successful");
      const user = response.data.user;

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("ID", response.data.user._id);
      localStorage.setItem("user", JSON.stringify(user));

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
          navigate("/welcome");
          break;
        case "agricultural inspector":
        case "customer":
        default:
          navigate("/");
      }
    } catch (err) {
      console.error("Login error:", err);

      // Handle different types of errors
      if (err.response) {
        // Server responded with error status
        const errorMessage =
          err.response.data?.error ||
          err.response.data?.message ||
          "Login failed";

        // Handle specific error cases
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
        // Network error
        toast.error(
          "Network error. Please check your connection and try again"
        );
      } else {
        // Other error
        toast.error("An unexpected error occurred. Please try again");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center relative"
      style={{ backgroundImage: "url('/loginbg.jpg')" }}
    >
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
            It is a long established fact that a reader will be distracted by
            the readable content of a page.
          </p>
          <div className="flex space-x-4">
            {["facebook", "twitter", "instagram", "youtube"].map((icon) => (
              <a
                key={icon}
                href="#"
                className="text-white hover:text-green-300 transition duration-300"
              >
                <i className={`fab fa-${icon} text-xl`}></i>
              </a>
            ))}
          </div>
        </div>

        {/* Login Form */}
        <div className="w-full lg:w-1/2 p-10 bg-white/20">
          <h2 className="text-3xl font-semibold text-white mb-6 text-center">
            Sign in
          </h2>

          <form onSubmit={handleOnSubmit} className="space-y-6" noValidate>
            {/* Email Input */}
            <div>
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={handleEmailChange}
                onBlur={() => handleBlur("email")}
                className={`w-full px-4 py-3 rounded bg-white/70 text-black placeholder-gray-600 focus:outline-none focus:ring-2 transition-all ${
                  errors.email && touched.email
                    ? "focus:ring-red-400 ring-2 ring-red-400"
                    : "focus:ring-green-400"
                }`}
                aria-invalid={errors.email && touched.email ? "true" : "false"}
                aria-describedby={
                  errors.email && touched.email ? "email-error" : undefined
                }
              />
              {errors.email && touched.email && (
                <p
                  id="email-error"
                  className="text-red-300 text-sm mt-1 flex items-center"
                >
                  <span className="mr-1">⚠️</span>
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password Input */}
            <div>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={handlePasswordChange}
                onBlur={() => handleBlur("password")}
                className={`w-full px-4 py-3 rounded bg-white/70 text-black placeholder-gray-600 focus:outline-none focus:ring-2 transition-all ${
                  errors.password && touched.password
                    ? "focus:ring-red-400 ring-2 ring-red-400"
                    : "focus:ring-green-400"
                }`}
                aria-invalid={
                  errors.password && touched.password ? "true" : "false"
                }
                aria-describedby={
                  errors.password && touched.password
                    ? "password-error"
                    : undefined
                }
              />
              {errors.password && touched.password && (
                <p
                  id="password-error"
                  className="text-red-300 text-sm mt-1 flex items-center"
                >
                  <span className="mr-1">⚠️</span>
                  {errors.password}
                </p>
              )}
            </div>

            <div className="flex justify-between items-center text-white">
              <label className="flex items-center space-x-2">
                <input type="checkbox" className="accent-green-500" />
                <span className="text-sm">Remember Me</span>
              </label>
              <Link to="/forgot-password" className="text-sm hover:underline">
                Lost your password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 rounded font-semibold transition-all ${
                isLoading
                  ? "bg-gray-500 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700 active:bg-green-800"
              } text-white`}
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
              By clicking on "Sign in now" you agree to our{" "}
              <a href="#" className="underline hover:text-green-300">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="#" className="underline hover:text-green-300">
                Privacy Policy
              </a>
              .
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
