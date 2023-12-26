import { useSelector } from "react-redux";
import { useRef, useState, useEffect } from "react";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { app } from "../firebase";

export default function Profile() {
  const { currentUser } = useSelector((state) => state.user);
  const fileRef = useRef(null);
  const [file, setFile] = useState(undefined);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    passwordConfirm: "",
    avatar: "",
  });

  console.log(formData);

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = async (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + "-" + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadProgress(Math.round(progress));
      },
      (error) => {
        setUploadError(true);
        setTimeout(() => {
          setUploadError(false);
        }, 5000);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setFormData({ ...formData, avatar: downloadURL });
        });
      }
    );
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
      <form className="flex flex-col gap-4">
        <input
          onChange={(e) => setFile(e.target.files[0])}
          type="file"
          ref={fileRef}
          hidden
          accept="image/.*"
        />
        <img
          onClick={() => fileRef.current.click()}
          src={formData.avatar || currentUser.user.avatar}
          alt="user"
          className="w-24 h-24 object-cover rounded-full self-center cursor-pointer my-3"
        />
        <p className="w-full md:w-3/4 mx-auto">
          {uploadError ? (
            <span className="text-red-700">Error uploading file</span>
          ) : uploadProgress > 0 && uploadProgress < 100 ? (
            <span className="text-slate-700">{`Uploading... (${uploadProgress}%)`}</span>
          ) : uploadProgress === 100 ? (
            <span className="text-green-700">File uploaded</span>
          ) : (
            ""
          )}
        </p>
        <input
          className="w-full md:w-3/4 border-2 border-gray-400 rounded-lg px-3 py-2 mx-auto"
          id="username"
          type="text"
          placeholder="Username"
        />
        <input
          className="w-full md:w-3/4 border-2 border-gray-400 rounded-lg px-3 py-2 mx-auto"
          id="email"
          type="email"
          placeholder="Email"
        />
        <input
          className="w-full md:w-3/4 border-2 border-gray-400 rounded-lg px-3 py-2 mx-auto"
          id="password"
          type="password"
          placeholder="Password"
        />
        <input
          className="w-full md:w-3/4 border-2 border-gray-400 rounded-lg px-3 py-2 mx-auto"
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
