import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <header className="sticky top-0 z-10 border-b border-gray-700/40 bg-[#12131c]/80 backdrop-blur-md">
      <div className="flex h-16 items-center justify-between px-6 max-w-7xl mx-auto">
        

        <Link
          to="/events"
          className="flex items-center gap-2 text-white no-underline"
        >
          <span className="w-2.5 h-2.5 rounded-full bg-yellow-400 shadow-[0_0_12px_rgba(250,204,21,0.8)]" />

          <span className="text-lg font-bold tracking-tight">
            SortMyScene
          </span>
        </Link>

        {user && (
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-400">
              {user.name}
            </span>

            <button
              onClick={handleLogout}
              className="px-3 py-1.5 text-sm rounded-md border border-gray-600 text-gray-200 hover:bg-gray-800 transition"
            >
              Log out
            </button>
          </div>
        )}
      </div>
    </header>
  );
}