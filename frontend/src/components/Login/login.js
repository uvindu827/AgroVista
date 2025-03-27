import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  function handleOnSubmit(e) {
    e.preventDefault();
    

    axios.post(`http://localhost:3000/api/users/login`, { email, password })
      .then((res) => {
        toast.success("Login Success")
        const user = res.data.user
        localStorage.setItem("token",res.data.token)
        if(user.role === "farmer"){
          navigate("/farmer/")
        }else{
          navigate("/")
        }
      })
      .catch((err) => {
        toast.error(err.response?.data?.error || "An error occurred");
      });
  }

  return (
    <div className="w-full h-screen flex justify-center items-center bg-cover bg-center animate-[backgroundScroll_30s_linear_infinite]" style={{ backgroundImage: "url('/loginbg.jpg')" }}>
      <form onSubmit={handleOnSubmit} className="w-[400px] bg-white/30 backdrop-blur-lg p-8 rounded-xl shadow-xl border border-white/10">
        <div className="text-center">
          <img src="/agrologo.png" alt="logo" className="w-[80px] h-[50px] mx-auto bg-cover mb-5" />
          <h2 className="text-3xl font-bold text-green-900">Login</h2>
        </div>
        <div className="mt-6 space-y-4">
          {[{ label: "Email", value: email, setValue: setEmail, type: "email" },
            { label: "Password", value: password, setValue: setPassword, type: "password" }
          ].map(({ label, value, setValue, type }, idx) => (
            <div key={idx}>
              <input
                type={type}
                placeholder={label}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="w-full p-3 rounded-lg bg-white/20 text-green-900 placeholder-green-700 outline-none border border-transparent"
              />
            </div>
          ))}
        </div>
        <button
          type="submit"
          className="mt-6 w-full bg-green-600 text-white py-3 rounded-lg font-semibold text-lg hover:bg-green-700 transition-all"
        >
          Login
        </button>
      </form>

      <style>
        {`@keyframes backgroundScroll {
          0% { background-position: 0% 0%; }
          100% { background-position: 100% 100%; }
        }`}
      </style>
    </div>
  );
}
