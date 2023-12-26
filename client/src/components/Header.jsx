import { FaSearch } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

export default function Header() {
  const { currentUser } = useSelector((state) => state.user);
  return (
    <header className="bg-slate-200 shadow-md">
      <div className="flex justify-between items-center max-w-6xl mx-auto p-3">
        <Link to="/">
          <h1 className="font-bold text-sm sm:text-xl flex flex-wrap">
            <span className="text-slate-500">Virgis</span>
            <span className="text-slate-700">Estate</span>
          </h1>
        </Link>
        <form className="bg-slate-100 flex rounded-lg">
          <div className="flex items-center justify-between px-3 py-2 border border-slate-300 rounded w-24 sm:w-64">
            <input
              className="text-slate-700 bg-transparent rounded rounded-lg focus:outline-none"
              type="text"
              placeholder="Search..."
            />
            <FaSearch className="text-slate-500" />
          </div>
        </form>
        <ul className="flex gap-4">
          <Link to="/">
            <li className="hidden sm:inline text-slate-700 hover:underline hover:cursor-pointer">
              Home
            </li>
          </Link>
          <Link to="/about">
            <li className="hidden sm:inline text-slate-700 hover:underline hover:cursor-pointer">
              About
            </li>
          </Link>
          <Link to="/profile">
            {currentUser ? (
              <img
                src={currentUser.avatar || null}
                alt="user"
                className="w-8 h-8 rounded-full border-2 border-slate-500"
              />
            ) : (
              <li className="hidden sm:inline text-slate-700 hover:underline hover:cursor-pointer">
                Sign In
              </li>
            )}
          </Link>
        </ul>
      </div>
    </header>
  );
}
