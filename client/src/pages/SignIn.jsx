import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function SignIn() {
  const [formState, setFormState] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (event) => {
    const { id, value } = event.target;
    setFormState((prevState) => ({
      ...prevState,
      [id]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setLoading(true);
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        body: JSON.stringify(formState),
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();
      if (!data.success) {
        setError(data.message);
        setLoading(false);
        return;
      } else {
        setError(null);
        setLoading(false);
        navigate("/");
      }
    } catch (err) {
      setLoading(false);
      setError(err.message);
    }
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-center text-3xl my-7 font-semibold">Sign In</h1>
      <form onSubmit={handleSubmit} className="flex flex-col items-center">
        <input
          className="w-full md:w-3/4 border-2 border-gray-400 rounded-lg px-3 py-2 my-2"
          onChange={handleChange}
          id="email"
          type="text"
          placeholder="Email"
        />
        <input
          className="w-full md:w-3/4 border-2 border-gray-400 rounded-lg px-3 py-2 my-2"
          onChange={handleChange}
          id="password"
          type="password"
          placeholder="Password"
        />
        <button
          disabled={loading}
          className="w-full md:w-3/4 uppercase border-2 border-gray-400 rounded-lg px-3 py-2 my-2 bg-gray-400 hover:bg-gray-500 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          id="signUp_submit"
          type="submit"
        >
          {loading ? "Loading..." : "Sign In"}
        </button>
      </form>
      <div>
        <p className="text-center my-2">
          Not registered?{" "}
          <Link to={"/signup"} className="text-blue-500 hover:text-blue-700">
            Sign Up
          </Link>
        </p>
      </div>
      {error && <div className="text-center text-red-500 my-2">{error}</div>}
    </div>
  );
}
