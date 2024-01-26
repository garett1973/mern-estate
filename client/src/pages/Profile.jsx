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
import { Link } from "react-router-dom";
import { set } from "mongoose";

export default function Profile() {
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const fileRef = useRef(null);
  const [file, setFile] = useState(undefined);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState(false);
  const [getListingsError, setGetListingsError] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const [userListings, setUserListings] = useState([]); // [{}, {}, {}
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
      console.log(data);
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

  const handleShowListings = async () => {
    try {
      setGetListingsError(false);
      const res = await fetch(`/api/user/listings/${loggedInUser._id}`);
      const data = await res.json();
      if (data.success === false) {
        setGetListingsError(true);
        setTimeout(() => {
          setGetListingsError(false);
        }, 5000);
        return;
      }
      setUserListings(data.listings);
    } catch (error) {
      setGetListingsError(true);
      setTimeout(() => {
        setGetListingsError(false);
      }, 5000);
    }
  };

  const handleListingDelete = async (id) => {
    try {
      const res = await fetch(`/api/listing/delete/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success === false) {
        console.log(data.message);
        return;
      }
      setUserListings(userListings.filter((listing) => listing._id !== id));
    } catch (error) {
      console.log(error.message);
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
            formData.avatar
              ? formData.avatar
              : currentUser.avatar
              ? currentUser.avatar
              : loggedInUser.avatar
              ? loggedInUser.avatar
              : ""
          }
          alt="user"
          className="w-24 h-24 object-cover rounded-full self-center cursor-pointer my-3"
        />
        <p className="w-full  mx-auto">
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
          className="w-full  border-2 border-gray-400 rounded-lg px-3 py-2 mx-auto"
          id="username"
          defaultValue={
            currentUser.username ? currentUser.username : loggedInUser.username
          }
          type="text"
          placeholder="Username"
        />
        <input
          onChange={handleChange}
          className="w-full  border-2 border-gray-400 rounded-lg px-3 py-2 mx-auto"
          id="email"
          defaultValue={
            currentUser.email ? currentUser.email : loggedInUser.email
          }
          type="email"
          placeholder="Email"
        />
        <input
          onChange={handleChange}
          className="w-full  border-2 border-gray-400 rounded-lg px-3 py-2 mx-auto"
          id="password"
          type="password"
          placeholder="Password"
        />
        <input
          onChange={handleChange}
          className="w-full  border-2 border-gray-400 rounded-lg px-3 py-2 mx-auto"
          id="passwordConfirm"
          type="password"
          placeholder="Confirm Password"
        />
        <button
          disabled={loading}
          className="w-full  uppercase border-2 border-gray-400 rounded-lg px-3 py-2 mt-2 bg-gray-400 hover:bg-gray-500 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed mx-auto"
          id="signUp_submit"
          type="submit"
        >
          {loading ? "Loading..." : "Update Profile"}
        </button>
        <Link
          to={"/create-listing"}
          className="w-full  uppercase border-2 border-green-400 rounded-lg px-3 py-2 mb-2 bg-green-400 hover:bg-green-500 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed mx-auto text-center"
        >
          Create Listing
        </Link>
      </form>
      <div className="w-3/4 mx-auto flex justify-between mt-2">
        <span onClick={handleDelete} className="text-red-700 cursor-pointer">
          Delete Account
        </span>
        <span onClick={handleSignout} className="text-red-700 cursor-pointer">
          Sign Out
        </span>
      </div>
      <p className="w-full  mx-auto mt-2">
        {error ? <span className="text-red-700">{error}</span> : ""}
      </p>
      <p className="w-full  mx-auto mt-2">
        {updateSuccess ? (
          <span className="text-green-700">Profile updated</span>
        ) : (
          ""
        )}
      </p>
      <p className="w-full  mx-auto mt-2">
        {deleteSuccess ? (
          <span className="text-green-700">User deleted</span>
        ) : (
          ""
        )}
      </p>
      <div className="w-3/4 mx-auto flex justify-around my-2">
        <span
          onClick={handleShowListings}
          className="text-green-700 cursor-pointer"
        >
          Show all listings
        </span>
      </div>
      <p className="w-full  mx-auto mt-2">
        {getListingsError ? (
          <span className="text-red-700">Error getting listings</span>
        ) : (
          ""
        )}
      </p>
      {userListings && userListings.length > 0 && (
        <div className="">
          <h1 className="text-3xl font-semibold text-center my-7">
            Your Listings
          </h1>
          {userListings.map((listing) => (
            <div
              key={listing._id}
              className="w-full mx-auto mt-2 flex justify-between p-3 border border-gray-300 p-2 rounded-md w-full items-center"
            >
              <Link to={`/listing/${listing._id}`} className="flex">
                <img
                  src={listing.imageUrls[0]}
                  alt="listing"
                  className="w-20 object-cover rounded-lg shadow-lg"
                />
                <p className="my-auto px-4 font-semibold truncate">
                  {listing.name}
                </p>
              </Link>
              <div className="flex flex-col items-center">
                <button
                  onClick={() => handleListingDelete(listing._id)}
                  className="text-red-500 uppercase hover:text-red-700 mb-1"
                >
                  Delete
                </button>
                <Link
                  to={`/update-listing/${listing._id}`}
                  className="text-green-500 uppercase hover:text-green-700"
                >
                  <button>Edit</button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
