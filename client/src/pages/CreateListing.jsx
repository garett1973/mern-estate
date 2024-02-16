import { useState } from "react";
import {
  getStorage,
  uploadBytesResumable,
  ref,
  getDownloadURL,
} from "firebase/storage";
import { app } from "../firebase";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function CreateListing() {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    imageUrls: [],
    name: "",
    description: "",
    address: "",
    type: "rent",
    bedrooms: 1,
    bathrooms: 1,
    regularPrice: 0,
    discountedPrice: 0,
    parking: false,
    furnished: false,
    offer: false,
  });
  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [formError, setFormError] = useState(false);
  const [formUploading, setFormUploading] = useState(false);

  const handleImageSubmit = (e) => {
    if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
      setUploading(true);
      const promises = [];

      for (let i = 0; i < files.length; i++) {
        promises.push(storeImage(files[i]));
      }
      Promise.all(promises)
        .then((urls) => {
          setFormData({
            ...formData,
            imageUrls: formData.imageUrls.concat(urls), // keeps already uploaded images and adds new ones
          });
          setImageUploadError(false);
          setUploading(false);
        })
        .catch((error) => {
          setImageUploadError("Image upload failed (3 mb max)");
          setUploading(false);
          setTimeout(() => {
            setImageUploadError(false);
          }, 3000);
        });
    } else {
      setImageUploadError("Max 6 images per listing");
      setUploading(false);
      setTimeout(() => {
        setImageUploadError(false);
      }, 3000);
    }
  };

  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + "-" + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // progress
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  };

  const handleRemoveImage = (index) => (e) => {
    e.preventDefault();
    const urls = formData.imageUrls;
    urls.splice(index, 1);
    setFormData({
      ...formData,
      imageUrls: urls,
    });
  };

  const handleChange = (e) => {
    if (e.target.id === "sale" || e.target.id === "rent") {
      setFormData({
        ...formData,
        type: e.target.id,
      });
    }

    if (
      e.target.id === "parking" ||
      e.target.id === "furnished" ||
      e.target.id === "offer"
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.checked,
      });
    }

    if (
      e.target.type === "number" ||
      e.target.type === "text" ||
      e.target.type === "textarea"
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.imageUrls.length === 0) {
        setFormError("Please upload at least one image");
        setTimeout(() => {
          setFormError(false);
        }, 3000);
        return;
      }

      if (+formData.regularPrice < +formData.discountedPrice) {
        setFormError("Discount price cannot be higher than regular price");
        setTimeout(() => {
          setFormError(false);
        }, 3000);
        return;
      }

      setFormUploading(true);
      setFormError(false);

      const res = await fetch("/api/listing/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          userRef: currentUser._id,
        }),
      });
      const data = await res.json();
      setFormUploading(false);

      if (data.success === false) {
        setFormError(data.message);
        setTimeout(() => {
          setFormError(false);
        }, 3000);
      } else {
        setFormError(false);
        setFormData({
          imageUrls: [],
          name: "",
          description: "",
          address: "",
          type: "rent",
          bedrooms: 1,
          bathrooms: 1,
          regularPrice: 0,
          discountedPrice: 0,
          parking: false,
          furnished: false,
          offer: false,
        });
        setFiles([]);
        setImageUploadError(false);
        navigate(`/listing/${data._id}`);
      }
    } catch (error) {
      setFormError(error.message);
      setFormUploading(false);
      setTimeout(() => {
        setFormError(false);
      }, 3000);
    }
  };

  return (
    <main className="w-full md:w-3/4 mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">
        Create Listing
      </h1>
      <form onSubmit={handleSubmit}>
        <div className="w-full flex flex-col gap-4">
          <div className="w-full flex flex-col md:flex-row gap-4">
            <div className="w-full md:w-1/2 flex flex-col gap-4 py-3 px-6 md:px-3">
              <input
                onChange={handleChange}
                type="text"
                id="name"
                name="name"
                placeholder="Name"
                className="border border-gray-300 p-2 rounded-md"
                value={formData.name}
                required
              />
              <textarea
                onChange={handleChange}
                name="description"
                id="description"
                cols="30"
                rows="3"
                placeholder="Description"
                className="border border-gray-300 p-2 rounded-md"
                value={formData.description}
                required
              ></textarea>
              <input
                onChange={handleChange}
                type="text"
                id="address"
                name="address"
                placeholder="Address"
                className="border border-gray-300 p-2 rounded-md"
                value={formData.address}
                required
              />
              <div className="w-full flex gap-6 flex-wrap">
                <div className="flex gap-2">
                  <input
                    onChange={handleChange}
                    type="checkbox"
                    id="sale"
                    className="w-5"
                    checked={formData.type === "sale"}
                  />
                  <span>Sell</span>
                </div>
                <div className="flex gap-2">
                  <input
                    onChange={handleChange}
                    type="checkbox"
                    id="rent"
                    className="w-5"
                    checked={formData.type === "rent"}
                  />
                  <span>Rent</span>
                </div>
                <div className="flex gap-2">
                  <input
                    onChange={handleChange}
                    type="checkbox"
                    id="parking"
                    className="w-5"
                    checked={formData.parking}
                  />
                  <span>Parking spot</span>
                </div>
                <div className="flex gap-2">
                  <input
                    onChange={handleChange}
                    type="checkbox"
                    id="furnished"
                    className="w-5"
                    checked={formData.furnished}
                  />
                  <span>Furnished</span>
                </div>
                <div className="flex gap-2">
                  <input
                    onChange={handleChange}
                    type="checkbox"
                    id="offer"
                    className="w-5"
                    checked={formData.offer}
                  />
                  <span>Offer</span>
                </div>
              </div>
              <div className="w-full flex gap-6 flex-wrap">
                <div className="w-full flex flex-col gap-4">
                  <div className="w-full flex gap-6">
                    <div className="flex gap-2">
                      <input
                        onChange={handleChange}
                        type="number"
                        id="bedrooms"
                        min="1"
                        max="10"
                        name="bedrooms"
                        className="border border-gray-300 p-2 rounded-md"
                        required
                        value={formData.bedrooms}
                      />
                      <span className="my-auto">Beds</span>
                    </div>
                    <div className="flex gap-2">
                      <input
                        onChange={handleChange}
                        type="number"
                        id="bathrooms"
                        min="1"
                        max="10"
                        name="bathrooms"
                        className="border border-gray-300 p-2 rounded-md"
                        required
                        value={formData.bathrooms}
                      />
                      <span className="my-auto">Baths</span>
                    </div>
                  </div>
                  <div className="w-full flex flex-col xl:flex-row gap-6">
                    <div className="flex gap-2">
                      <input
                        onChange={handleChange}
                        type="number"
                        id="regularPrice"
                        min="0"
                        step={0.01}
                        name="regularPrice"
                        className="border border-gray-300 p-2 rounded-md w-1/2"
                        value={formData.regularPrice}
                      />
                      <div className="flex flex-col items-center">
                        <span className="my-auto">Regular price</span>
                        {formData.type === "rent" ? (
                          <span className="text-xs">($/month)</span>
                        ) : (
                          <span className="text-xs">($)</span>
                        )}
                      </div>
                    </div>
                    {formData.offer ? (
                      <div className="flex gap-2">
                        <input
                          onChange={handleChange}
                          type="number"
                          id="discountedPrice"
                          min="0"
                          step={0.01}
                          name="discountedPrice"
                          className="border border-gray-300 p-2 rounded-md w-1/2"
                          value={formData.discountedPrice}
                        />
                        <div className="flex flex-col items-center">
                          <span className="my-auto">Discount price</span>
                          {formData.type === "rent" ? (
                            <span className="text-xs">($/month)</span>
                          ) : (
                            <span className="text-xs">($)</span>
                          )}
                        </div>
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full md:w-1/2 flex flex-col gap-4 py-3 px-6 md:px-3">
              <label htmlFor="image" className="mt-2">
                <span className="text-gray-800 font-semibold mr-1">
                  Images:
                </span>
                <span className="text-gray-800">
                  The first image will be the cover (max 6 images)
                </span>
              </label>
              <div className="w-full flex flex-col md:flex-row gap-2">
                <input
                  onChange={(e) => {
                    setFiles(e.target.files);
                  }}
                  type="file"
                  multiple
                  id="image"
                  name="image"
                  placeholder="Image"
                  className="border border-gray-300 p-2 rounded-md w-full"
                />
                <button
                  type="button"
                  disabled={uploading || formUploading}
                  accept="image/*"
                  onClick={handleImageSubmit}
                  className="border border-green-700 text-green-700 py-2 px-3 rounded-md uppercase hover:shadow-lg disabled:opacity-50"
                >
                  {uploading ? "Uploading..." : "Upload"}
                </button>
              </div>
              <div>
                {imageUploadError ? (
                  <span className="text-red-500">{imageUploadError}</span>
                ) : null}
              </div>
              {formData.imageUrls.length > 0 &&
                formData.imageUrls.map((url, index) => (
                  <div key={index} className="flex justify-between">
                    <img
                      key={index}
                      src={url}
                      alt="uploaded"
                      className="w-40 h-20 object-cover rounded-lg shadow-lg"
                    />
                    <button
                      type="button"
                      onClick={handleRemoveImage(index)}
                      className="border border-red-700 text-red-700 py-2 px-3 rounded-md uppercase hover:shadow-lg disabled:opacity-50 my-auto"
                    >
                      Delete
                    </button>
                  </div>
                ))}
            </div>
          </div>
          <div className="w-full md:w-1/2 px-6 mx-auto">
            <button
              disabled={formUploading || uploading}
              type="submit"
              className="w-full bg-blue-500 text-white py-2 px-3 rounded-md mx-auto uppercase hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed mb-4"
            >
              {formUploading ? "Uploading..." : "Create Listing"}
            </button>
            {formError ? (
              <span className="text-red-500">{formError}</span>
            ) : null}
          </div>
        </div>
      </form>
    </main>
  );
}
