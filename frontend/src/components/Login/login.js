import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate, Link } from "react-router-dom";
import Footer from "../Footer/Footer";
import Header from "../Header/Header";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  function handleOnSubmit(e) {
    e.preventDefault();
    setIsLoading(true);

    axios
      .post(`http://localhost:3000/api/users/login`, { email, password })
      .then((res) => {
        toast.success("Login Successful");
        const user = res.data.user;

        localStorage.setItem("token", res.data.token);
        localStorage.setItem("ID", res.data.user._id); // Set ID to localStorage
        localStorage.setItem("user", JSON.stringify(user));

        // Navigate based on role
        if (user.role === "farmer") {
          navigate("/farmer/"); // Navigate to farmer home page
        } else if (user.role === "buyer") {
          navigate("/buyerHome/"); // Navigate to buyer home page
        } else if (user.role === "admin") {
          navigate("/adminDashboard/"); // Navigate to buyer home page
        } else if (user.role === "tool dealer") {
          navigate("/"); // Navigate to tool dealer home page
        } else if (user.role === "agricultural inspector") {
          navigate("/"); // Navigate to agricultural inspector home page
        } else if (user.role === "customer") {
          navigate(`/buyer/:buyerId`); // Navigate to customer home page
        }
        else {
          navigate("/"); // Default fallback route if no role matches
        }
      })
      .catch((err) => {
        toast.error(err.response?.data?.error || "An error occurred");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-grow flex justify-center items-center bg-cover bg-center relative overflow-hidden">
        {/* Background with overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-green-900/70 to-green-800/70 z-10"></div>
        <div
          className="absolute inset-0 bg-cover bg-center animate-[backgroundScroll_30s_linear_infinite]"
          style={{ backgroundImage: "url('/loginbg.jpg')" }}
        ></div>

        {/* Floating elements */}
        <div className="absolute top-20 left-20 w-24 h-24 bg-yellow-200/20 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-32 h-32 bg-green-300/20 rounded-full blur-xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-amber-300/20 rounded-full blur-xl animate-pulse delay-500"></div>

        {/* Login form */}
        <div className="z-20 w-full max-w-md px-4">
          <form
            onSubmit={handleOnSubmit}
            className="bg-white/20 backdrop-blur-lg p-8 rounded-2xl shadow-2xl border border-white/30 transform hover:scale-[1.01] transition-all duration-300"
          >
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                <img src="/agrologo.png" alt="logo" className="w-24 h-auto" />
              </div>
              <h2 className="text-4xl font-bold text-white mb-2">
                Welcome Back
              </h2>
              <p className="text-green-100">
                Sign in to your AgroVista account
              </p>
            </div>

            <div className="space-y-5">
              {[
                {
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
                },
                {
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
                },
              ].map(({ label, value, setValue, type, icon }, idx) => (
                <div key={idx} className="relative">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                    {icon}
                  </div>
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
                  <span className="flex items-center">
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
                  "Sign In"
                )}
              </button>
            </div>

            <div className="mt-6 text-center">
              <p className="text-green-100">
                Don't have an account?{" "}
                <Link
                  to="/users/"
                  className="text-white font-semibold hover:text-green-300 transition-colors"
                >
                  Register here
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
      

      <style>
        {`
          @keyframes backgroundScroll {
            0% { background-position: 0% 0%; }
            100% { background-position: 100% 100%; }
          }
          
          @keyframes float {
            0% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
            100% { transform: translateY(0px); }
          }
        `}
      </style>
        
      <Footer />

    </div>
  );
}