import { useState,useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import { FiMail, FiLock } from "react-icons/fi";

export default function Login() {

  const { user, login } = useAuth();

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

   useEffect(() => {
    if (user) {
      navigate("/events");
    }
  }, [user, navigate]);


  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await login(email, password);

      if (res.success) {
        toast.success("Login successful",{
          className:"text-md,font-bold"
        });
        
      } else {
        toast.error(res.message || "Login failed",
          {className:"text-md font -bold"});
      }
    } catch (err) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-[#0f0f17] via-[#12131c] to-[#0a0a12] px-4">
     <div className="w-full max-w-md">
      <h1 className="text-3xl font-bold mb-1 text-white">Welcome back</h1>
      <p className="text-white mb-7">
        Log in to reserve and book seats.
      </p>

      
      <form onSubmit={handleSubmit} className="space-y-4">

       
        <div className="flex flex-col gap-1">
          <label className="text-sm text-gray-300">Email</label>

          <div className="relative">
            <FiMail className="absolute left-3 top-3.5 text-gray-400" />

            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full pl-10 rounded-md border border-gray-700 bg-[#1a1b24] px-3 py-2 text-white outline-none focus:border-yellow-400"
            />
          </div>
        </div>

       
        <div className="flex flex-col gap-1">
          <label className="text-sm text-gray-300">Password</label>

          <div className="relative">
            <FiLock className="absolute left-3 top-3.5 text-gray-400" />

            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full pl-10 rounded-md border border-gray-700 bg-[#1a1b24] px-3 py-2 text-white outline-none focus:border-yellow-400"
            />
          </div>
        </div>

      
        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-md bg-yellow-400 text-black font-semibold py-2 hover:bg-yellow-300 disabled:opacity-60 disabled:cursor-not-allowed transition"
        >
          {submitting ? "Logging in..." : "Log in"}
        </button>
      </form>

      <p className="mt-5 text-sm text-gray-400">
        New here?{" "}
        <Link
          to="/register"
          className="text-yellow-400 font-semibold hover:underline"
        >
          Create an account
        </Link>
      </p>
    </div>
    </div>
  );
}