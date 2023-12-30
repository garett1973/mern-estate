import React from "react";

export default function CreateListing() {
  return (
    <main className="w-full md:w-3/4 mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">
        Create a Listing
      </h1>
      <form>
        <div className="w-full flex flex-col gap-4">
          <div className="w-full flex flex-col md:flex-row gap-4">
            <div className="w-full md:w-1/2 flex flex-col gap-4 py-3 px-6 md:px-3">
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Name"
                className="border border-gray-300 p-2 rounded-md"
              />
              <textarea
                name="description"
                id="description"
                cols="30"
                rows="3"
                placeholder="Description"
                className="border border-gray-300 p-2 rounded-md"
              ></textarea>
              <input
                type="text"
                id="address"
                name="address"
                placeholder="Address"
                className="border border-gray-300 p-2 rounded-md"
              />
              <div className="w-full flex gap-6 flex-wrap">
                <div className="flex gap-2">
                  <input type="checkbox" id="sale" className="w-5" />
                  <span>Sell</span>
                </div>
                <div className="flex gap-2">
                  <input type="checkbox" id="rent" className="w-5" />
                  <span>Rent</span>
                </div>
                <div className="flex gap-2">
                  <input type="checkbox" id="parking" className="w-5" />
                  <span>Parking spot</span>
                </div>
                <div className="flex gap-2">
                  <input type="checkbox" id="furnishing" className="w-5" />
                  <span>Furnished</span>
                </div>
                <div className="flex gap-2">
                  <input type="checkbox" id="offer" className="w-5" />
                  <span>Offer</span>
                </div>
              </div>
              <div className="w-full flex gap-6 flex-wrap">
                <div className="w-full flex flex-col gap-4">
                  <div className="w-full flex gap-6">
                    <div className="flex gap-2">
                      <input
                        type="number"
                        id="bedrooms"
                        min="1"
                        max="10"
                        defaultValue={1}
                        name="bedrooms"
                        className="border border-gray-300 p-2 rounded-md"
                        required
                      />
                      <span className="my-auto">Beds</span>
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        id="bathrooms"
                        min="1"
                        max="10"
                        defaultValue={1}
                        name="bathrooms"
                        className="border border-gray-300 p-2 rounded-md"
                        required
                      />
                      <span className="my-auto">Baths</span>
                    </div>
                  </div>
                  <div className="w-full flex gap-6">
                    <div className="flex gap-2">
                      <input
                        type="number"
                        id="regularPrice"
                        min="1"
                        max="10"
                        step={0.01}
                        defaultValue={1}
                        name="regularPrice"
                        className="border border-gray-300 p-2 rounded-md"
                      />
                      <div className="flex flex-col items-center">
                        <span className="my-auto">Regular price</span>
                        <span className="text-xs">($/month)</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        id="discountPrice"
                        min="1"
                        max="10"
                        step={0.01}
                        defaultValue={1}
                        name="discountPrice"
                        className="border border-gray-300 p-2 rounded-md"
                      />
                    </div>
                    <div className="flex flex-col items-center">
                      <span className="my-auto">Discount price</span>
                      <span className="text-xs">($/month)</span>
                    </div>
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
                  type="file"
                  id="image"
                  name="image"
                  placeholder="Image"
                  className="border border-gray-300 p-2 rounded-md w-full"
                />
                <button className="border border-green-700 text-green-700 py-2 px-3 rounded-md uppercase hover:shadow-lg disabled:opacity-50">
                  Upload
                </button>
              </div>
            </div>
          </div>
          <div className="w-full md:w-1/2 px-6 mx-auto">
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 px-3 rounded-md mx-auto uppercase hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Create Listing
            </button>
          </div>
        </div>
      </form>
    </main>
  );
}
