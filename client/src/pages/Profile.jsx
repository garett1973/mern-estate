import { useSelector } from "react-redux";
import { useRef, useState, useEffect } from "react";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { app } from "../firebase";
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
  signoutUserStart,
  signoutUserSuccess,
  signoutUserFailure,
} from "../redux/user/userSlice.js";
import { useDispatch } from "react-redux";

export default function Profile() {
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const fileRef = useRef(null);
  const [file, setFile] = useState(undefined);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const dispatch = useDispatch();

  const loggedInUser = currentUser.user;

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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      dispatch(updateUserStart());
      const res = await fetch(
        `/api/user/update/${
          currentUser._id ? currentUser._id : loggedInUser._id
        }`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        setTimeout(() => {
          dispatch(updateUserFailure(""));
        }, 4000);
        return;
      }
      dispatch(updateUserSuccess(data.user));
      setUpdateSuccess(true);
      setTimeout(() => {
        setUpdateSuccess(false);
      }, 4000);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  };

  const handleDelete = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(
        `/api/user/delete/${
          currentUser._id ? currentUser._id : loggedInUser._id
        }`,
        {
          method: "DELETE",
        }
      );
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        setTimeout(() => {
          dispatch(deleteUserFailure(""));
        }, 4000);
        return;
      }
      dispatch(deleteUserSuccess(data.user));
      setDeleteSuccess(true);
      setTimeout(() => {
        setDeleteSuccess(false);
      }, 4000);
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  const handleSignout = async () => {
    try {
      dispatch(signoutUserStart());
      const res = await fetch("/api/auth/signout", {
        method: "POST",
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(signoutUserFailure(data.message));
        return;
      }
      dispatch(signoutUserSuccess(data));
    } catch (error) {
      dispatch(signoutUserFailure(error.message));
    }
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          onChange={(e) => setFile(e.target.files[0])}
          type="file"
          ref={fileRef}
          hidden
          accept="image/.*"
        />
        <img
          onClick={() => fileRef.current.click()}
          src={
            formData.avatar || currentUser.avatar
              ? currentUser.avatar
              : loggedInUser.avatar
          }
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
          onChange={handleChange}
          className="w-full md:w-3/4 border-2 border-gray-400 rounded-lg px-3 py-2 mx-auto"
          id="username"
          defaultValue={
            currentUser.username ? currentUser.username : loggedInUser.username
          }
          type="text"
          placeholder="Username"
        />
        <input
          onChange={handleChange}
          className="w-full md:w-3/4 border-2 border-gray-400 rounded-lg px-3 py-2 mx-auto"
          id="email"
          defaultValue={
            currentUser.email ? currentUser.email : loggedInUser.email
          }
          type="email"
          placeholder="Email"
        />
        <input
          onChange={handleChange}
          className="w-full md:w-3/4 border-2 border-gray-400 rounded-lg px-3 py-2 mx-auto"
          id="password"
          type="password"
          placeholder="Password"
        />
        <input
          onChange={handleChange}
          className="w-full md:w-3/4 border-2 border-gray-400 rounded-lg px-3 py-2 mx-auto"
          id="passwordConfirm"
          type="password"
          placeholder="Confirm Password"
        />
        <button
          disabled={loading}
          className="w-full md:w-3/4 uppercase border-2 border-gray-400 rounded-lg px-3 py-2 my-2 bg-gray-400 hover:bg-gray-500 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed mx-auto"
          id="signUp_submit"
          type="submit"
        >
          {loading ? "Loading..." : "Update Profile"}
        </button>
      </form>
      <div className="w-3/4 mx-auto flex justify-between mt-2">
        <span onClick={handleDelete} className="text-red-700 cursor-pointer">
          Delete Account
        </span>
        <span onClick={handleSignout} className="text-red-700 cursor-pointer">
          Sign Out
        </span>
      </div>
      <p className="w-full md:w-3/4 mx-auto mt-2">
        {error ? (
          <span className="text-red-700">{error}</span>
        ) : (
          <span className="text-green-700">{currentUser.message}</span>
        )}
      </p>
      <p className="w-full md:w-3/4 mx-auto mt-2">
        {updateSuccess ? (
          <span className="text-green-700">Profile updated</span>
        ) : (
          ""
        )}
      </p>
      <p className="w-full md:w-3/4 mx-auto mt-2">
        {deleteSuccess ? (
          <span className="text-green-700">User deleted</span>
        ) : (
          ""
        )}
      </p>
    </div>
  );
}
