import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";


import { useNavigate } from "react-router-dom";

export default function RegisterPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};

    // First Name Validation
    if (!firstName.trim()) {
      newErrors.firstName = "First Name is required";
    }

    // Last Name Validation
    if (!lastName.trim()) {
      newErrors.lastName = "Last Name is required";
    }

    // Email Validation
    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email is invalid";
    }

    // Password Validation
    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long";
    }

    // Address Validation
    if (!address.trim()) {
      newErrors.address = "Address is required";
    }

    // Phone Validation
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
      axios.post("http://localhost:3001/api/users/", {
        email: email,
        firstName: firstName,
        lastName: lastName,
        password: password,
        address: address,
        phone: phone
      }).then(() => {
        toast.success("Registration Success");
        navigate("/login");
      }).catch((err) => {
        toast.error(err?.response?.data?.error || "An error occurred");
      });
    }
  };

  return (
    <div className="bg-picture w-full h-screen flex justify-center items-center">
      <form onSubmit={handleOnSubmit}>
        <div className="w-[400px] min-h-[600px] backdrop-blur-xl rounded-2xl flex flex-col items-center py-10 relative">
          <img
            src="/logo.png"
            alt="logo"
            className="w-[100px] h-[100px] object-cover mb-6"
          />
          <div className="w-full px-10">
            <input
              type="text"
              placeholder="First Name"
              className={`input-field ${errors.firstName ? 'border-red-500' : ''}`}
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            {errors.firstName && (
              <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
            )}

            <input
              type="text"
              placeholder="Last Name"
              className={`input-field ${errors.lastName ? 'border-red-500' : ''}`}
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
            {errors.lastName && (
              <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
            )}

            <input
              type="email"
              placeholder="Email"
              className={`input-field ${errors.email ? 'border-red-500' : ''}`}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}

            <input
              type="password"
              placeholder="Password"
              className={`input-field ${errors.password ? 'border-red-500' : ''}`}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}

            <input
              type="text"
              placeholder="Address"
              className={`input-field ${errors.address ? 'border-red-500' : ''}`}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
            {errors.address && (
              <p className="text-red-500 text-sm mt-1">{errors.address}</p>
            )}

            <input
              type="text"
              placeholder="Phone"
              className={`input-field ${errors.phone ? 'border-red-500' : ''}`}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            {errors.phone && (
              <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
            )}
          </div>

          <button 
            type="submit"
            className="my-8 w-[300px] h-[50px] bg-[#efac38] text-2xl text-white rounded-lg hover:bg-[#d69530] transition duration-300"
          >
            Register
          </button>
        </div>
      </form>
    </div>
  );
}