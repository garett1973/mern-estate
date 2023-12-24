import { Link } from "react-router-dom";

export default function SignUp() {
  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-center text-3xl my-7 font-semibold">Sign Up</h1>
      <form className="flex flex-col items-center">
        <input
          className="w-full md:w-3/4 border-2 border-gray-400 rounded-lg px-3 py-2 my-2"
          id="username"
          type="text"
          placeholder="Username"
        />
        <input
          className="w-full md:w-3/4 border-2 border-gray-400 rounded-lg px-3 py-2 my-2"
          id="email"
          type="text"
          placeholder="Email"
        />
        <input
          className="w-full md:w-3/4 border-2 border-gray-400 rounded-lg px-3 py-2 my-2"
          id="password"
          type="password"
          placeholder="Password"
        />
        <input
          className="w-full md:w-3/4 border-2 border-gray-400 rounded-lg px-3 py-2 my-2"
          id="confirmPassword"
          type="password"
          placeholder="Confirm Password"
        />
        <button
          className="w-full md:w-3/4 uppercase border-2 border-gray-400 rounded-lg px-3 py-2 my-2 bg-gray-400 hover:bg-gray-500 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          id="signUp_submit"
          type="submit"
        >
          Sign Up
        </button>
      </form>
      <div>
        <p className="text-center my-2">
          Already have an account?{" "}
          <Link to={"/signin"} className="text-blue-500 hover:text-blue-700">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
