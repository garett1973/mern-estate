import { useSelector } from "react-redux";
import { useState } from "react";

export default function Profile() {
  const { currentUser } = useSelector((state) => state.user);
  const [formState, setFormState] = useState({
    username: "",
  });

  const handleChange = (event) => {
    const { id, value } = event.target;
    setFormState((prevState) => ({
      ...prevState,
      [id]: value,
    }));
  };
  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
      <form className="flex flex-col gap-4">
        <img
          src={currentUser.user.avatar}
          alt="user"
          className="w-24 h-24 object-cover rounded-full self-center cursor-pointer my-3"
        />
        <input
          className="w-full md:w-3/4 border-2 border-gray-400 rounded-lg px-3 py-2 mx-auto"
          onChange={handleChange}
          id="username"
          type="text"
          placeholder="Username"
        />
        <input
          className="w-full md:w-3/4 border-2 border-gray-400 rounded-lg px-3 py-2 mx-auto"
          onChange={handleChange}
          id="email"
          type="email"
          placeholder="Email"
        />
        <input
          className="w-full md:w-3/4 border-2 border-gray-400 rounded-lg px-3 py-2 mx-auto"
          onChange={handleChange}
          id="password"
          type="password"
          placeholder="Password"
        />
        <input
          className="w-full md:w-3/4 border-2 border-gray-400 rounded-lg px-3 py-2 mx-auto"
          onChange={handleChange}
          id="passwordConfirm"
          type="password"
          placeholder="Confirm Password"
        />
        <button
          className="w-full md:w-3/4 uppercase border-2 border-gray-400 rounded-lg px-3 py-2 my-2 bg-gray-400 hover:bg-gray-500 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed mx-auto"
          id="signUp_submit"
          type="submit"
        >
          Update Profile
        </button>
      </form>
      <div className="w-3/4 mx-auto flex justify-between mt-2">
        <span className="text-red-700 cursor-pointer">Delete Account</span>
        <span className="text-red-700 cursor-pointer">Sign Out</span>
      </div>
    </div>
  );
}
