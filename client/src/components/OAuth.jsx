import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { app } from "../firebase";
import { useDispatch } from "react-redux";
import { signInSuccess } from "../redux/user/userSlice";
import { useNavigate } from "react-router-dom";

export default function OAuth() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleGoogleClick = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);

      const result = await signInWithPopup(auth, provider);

      const res = await fetch("/api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: result.user.displayName,
          email: result.user.email,
          avatar: result.user.photoURL,
        }),
      });
      const data = await res.json();
      dispatch(signInSuccess(data));
      navigate("/");
    } catch (err) {
      console.log("Could not sign in with google.", err);
    }
  };
  return (
    <button
      onClick={handleGoogleClick}
      type="button"
      className="w-full md:w-3/4 uppercase border-2 border-gray-400 rounded-lg px-3 py-2 my-2 bg-red-500 hover:bg-red-700 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
    >
      Continue with Google
    </button>
  );
}
