import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import { FiUser, FiMail, FiLock } from "react-icons/fi";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    console.log("Submitting form");
    setSubmitting(true);

    try {
      const res = await register(name, email, password);

      console.log(res);

      if (res.success) {
        toast.success("Account created successfully");
        navigate("/events");
      } else {
        toast.error(res.message || "Registration failed");
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
      
      <h1 className="text-3xl font-bold mb-1 text-white">Create your account</h1>
      <p className="text-white mb-7">Takes about 20 seconds.</p>

      
      <form onSubmit={handleSubmit} className="space-y-4">

        
        <div className="flex flex-col gap-1">
          <label className="text-sm text-gray-300">Name</label>

          <div className="relative">
            <FiUser className="absolute left-3 top-3.5 text-gray-400" />

            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Jordan Lee"
              className="w-full pl-10 rounded-md border border-gray-700 bg-[#1a1b24] px-3 py-2 text-white outline-none focus:border-yellow-400"
            />
          </div>
        </div>

        
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
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 6 characters"
              className="w-full pl-10 rounded-md border border-gray-700 bg-[#1a1b24] px-3 py-2 text-white outline-none focus:border-yellow-400"
            />
          </div>
        </div>

        
        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-md bg-yellow-400 text-black font-semibold py-2 hover:bg-yellow-300 disabled:opacity-60 disabled:cursor-not-allowed transition"
        >
          {submitting ? "Creating account..." : "Create account"}
        </button>
      </form>

      
      <p className="mt-5 text-sm text-gray-400">
        Already have an account?{" "}
        <Link
          to="/login"
          className="text-yellow-400 font-semibold hover:underline"
        >
          Log in
        </Link>
      </p>
    </div>
    </div>
  );
}