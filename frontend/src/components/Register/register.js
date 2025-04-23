import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate, Link } from "react-router-dom";
import Footer from "../footer";

export default function RegisterPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};

    if (!firstName.trim()) {
      newErrors.firstName = "First Name is required";
    } else if (!/^[A-Za-z]+$/.test(firstName)) {
      newErrors.firstName = "First Name must contain only letters";
    }
    if (!lastName.trim()) {
      newErrors.lastName = "Last Name is required";
    } else if (!/^[A-Za-z]+$/.test(lastName)) {
      newErrors.lastName = "Last Name must contain only letters";
    }
    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Invalid email format";
    }
    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    } else if (
      !/[A-Z]/.test(password) ||
      !/\d/.test(password) ||
      !/[!@#$%^&*]/.test(password)
    ) {
      newErrors.password =
        "Password must contain at least 1 uppercase letter, 1 number, and 1 special character";
    }

    if (!address.trim()) newErrors.address = "Address is required";
    if (!phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\d{10}$/.test(phone)) {
      newErrors.phone = "Phone number must be 10 digits";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleOnSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      setIsLoading(true);
      axios
        .post("http://localhost:3000/api/users/", {
          email,
          firstName,
          lastName,
          password,
          address,
          phone,
        })
        .then(() => {
          toast.success("Registration Successful");
          navigate("/users/login");
        })
        .catch((err) => {
          toast.error(err?.response?.data?.error || "An error occurred");
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-grow flex justify-center items-center bg-cover bg-center relative overflow-hidden py-10">
        {/* Background with overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-green-900/70 to-green-800/70 z-10"></div>
        <div className="absolute inset-0 bg-cover bg-center animate-[backgroundScroll_30s_linear_infinite]" 
             style={{ backgroundImage: "url('/bg.jpg')" }}></div>
        
        {/* Floating elements*/}
        <div className="absolute top-20 left-20 w-24 h-24 bg-yellow-200/20 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-32 h-32 bg-green-300/20 rounded-full blur-xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-amber-300/20 rounded-full blur-xl animate-pulse delay-500"></div>
        
        {/* Register form */}
        <div className="z-20 w-full max-w-md px-4">
          <form
            onSubmit={handleOnSubmit}
            className="bg-white/20 backdrop-blur-lg p-8 rounded-2xl shadow-2xl border border-white/30 transform hover:scale-[1.01] transition-all duration-300"
          >
            <div className="text-center mb-6">
              <div className="flex justify-center mb-4">
                <img
                  src="/agrologo.png"
                  alt="logo"
                  className="w-24 h-auto"
                />
              </div>
              <h2 className="text-4xl font-bold text-white mb-2">Join AgroVista</h2>
              <p className="text-green-100">Create your account to get started</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                {
                  label: "First Name",
                  value: firstName,
                  setValue: setFirstName,
                  error: errors.firstName,
                  icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  )
                },
                {
                  label: "Last Name",
                  value: lastName,
                  setValue: setLastName,
                  error: errors.lastName,
                  icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  )
                },
                {
                  label: "Email",
                  value: email,
                  setValue: setEmail,
                  type: "email",
                  error: errors.email,
                  icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  )
                },
                {
                  label: "Password",
                  value: password,
                  setValue: setPassword,
                  type: "password",
                  error: errors.password,
                  icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  )
                },
                {
                  label: "Address",
                  value: address,
                  setValue: setAddress,
                  error: errors.address,
                  icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  )
                },
                {
                  label: "Phone",
                  value: phone,
                  setValue: setPhone,
                  error: errors.phone,
                  icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  )
                },
              ].map(({ label, value, setValue, type = "text", error, icon }, idx) => (
                <div key={idx} className={`${idx >= 4 ? "md:col-span-2" : ""}`}>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                      {icon}
                    </div>
                    <input
                      type={type}
                      placeholder={label}
                      value={value}
                      onChange={(e) => setValue(e.target.value)}
                      className={`w-full p-3 pl-10 rounded-lg bg-white/30 text-white placeholder-green-100 outline-none border ${
                        error ? "border-red-500" : "border-white/30"
                      } focus:border-green-300 focus:ring-2 focus:ring-green-300/50 transition-all`}
                      required
                    />
                  </div>
                  {error && <p className="text-red-300 text-sm mt-1">{error}</p>}
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
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating account...
                  </span>
                ) : (
                  "Create Account"
                )}
              </button>
            </div>
            
            <div className="mt-6 text-center">
              <p className="text-green-100">
                Already have an account?{" "}
                <Link to="/users/login/" className="text-white font-semibold hover:text-green-300 transition-colors">
                  Sign in here
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
      <Footer />
      
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
    </div>
  );
}
