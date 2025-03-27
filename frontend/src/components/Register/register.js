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

    if (!firstName.trim()) newErrors.firstName = "First Name is required";
    if (!lastName.trim()) newErrors.lastName = "Last Name is required";
    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Invalid email format";
    }
    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
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
        });
    }
  };

  return (
    <div
      className="w-full h-screen flex justify-center items-center bg-cover bg-center"
      style={{ backgroundImage: "url('/bg.jpg')" }}
    >
      <form
        onSubmit={handleOnSubmit}
        className="w-[420px] bg-white/30 backdrop-blur-lg p-8 rounded-xl shadow-xl border border-white/10"
      >
        <div className="text-center">
          <img
            src="/agrologo.png"
            alt="logo"
            className="w-[80px] h-[50px] mx-auto bg-cover mb-5"
          />
          <h2 className="text-3xl font-bold text-green-900">Register</h2>
        </div>
        <div className="mt-6 space-y-4">
          {[
            {
              label: "First Name",
              value: firstName,
              setValue: setFirstName,
              error: errors.firstName,
            },
            {
              label: "Last Name",
              value: lastName,
              setValue: setLastName,
              error: errors.lastName,
            },
            {
              label: "Email",
              value: email,
              setValue: setEmail,
              type: "email",
              error: errors.email,
            },
            {
              label: "Password",
              value: password,
              setValue: setPassword,
              type: "password",
              error: errors.password,
            },
            {
              label: "Address",
              value: address,
              setValue: setAddress,
              error: errors.address,
            },
            {
              label: "Phone",
              value: phone,
              setValue: setPhone,
              error: errors.phone,
            },
          ].map(({ label, value, setValue, type = "text", error }, idx) => (
            <div key={idx}>
              <input
                type={type}
                placeholder={label}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className={`w-full p-3 rounded-lg bg-white/20 text-green-900 placeholder-green-700 outline-none border ${
                  error ? "border-red-500" : "border-transparent"
                }`}
              />
              {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
            </div>
          ))}
        </div>
        <button
          type="submit"
          className="mt-6 w-full bg-green-600 text-white py-3 rounded-lg font-semibold text-lg hover:bg-green-700 transition-all"
        >
          Register
        </button>
      </form>
    </div>
  );
}
