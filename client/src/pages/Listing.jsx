import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Navigation } from "swiper/modules";
import "swiper/css/bundle";
import { useSelector } from "react-redux";
import {
  FaBath,
  FaBed,
  FaChair,
  FaMapMarkerAlt,
  FaParking,
  FaShare,
} from "react-icons/fa";

export default function Listing() {
  SwiperCore.use([Navigation]);
  const { listingId } = useParams();
  const [loading, setLoading] = useState(true); // [1]
  const [listingError, setListingError] = useState(false);
  const [listing, setListing] = useState(null);
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/listing/get-listing/${listingId}`);
        const resp = await response.json();
        const data = resp.data;
        if (resp.success === false) {
          setListingError(resp.message);
          setTimeout(() => {
            setListingError(false);
            setLoading(false);
          }, 3000);
        } else {
          setListing(data);
          setLoading(false);
        }
      } catch (error) {
        setListingError(error.message);
        setTimeout(() => {
          setListingError(false);
          setLoading(false);
        }, 3000);
      }
    };
    fetchListing();
  }, []);
  return (
    <main>
      {loading && (
        <p className="text-center my-7 text-2xl text-green-700">Loading...</p>
      )}
      {listingError && (
        <p className="text-center my-7 text-2xl text-red-700">
          Something went wrong retrieving listing data...
        </p>
      )}
      {listing && !listingError && !loading && (
        <>
          <Swiper navigation>
            {listing.imageUrls.map((imageUrl, index) => (
              <SwiperSlide key={index}>
                <div
                  className="h-[550px]"
                  style={{
                    background: `url(${imageUrl}) center no-repeat`,
                    backgroundSize: "cover",
                  }}
                >
                  <img src={imageUrl} alt="" />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
          <div className="fixed top-[13%] right-[3%] z-10 border rounded-full w-12 h-12 flex justify-center items-center bg-slate-100 cursor-pointer">
            <FaShare
              className="text-slate-500"
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                setCopied(true);
                setTimeout(() => {
                  setCopied(false);
                }, 2000);
              }}
            />
          </div>
          {copied && (
            <p className="fixed top-[23%] right-[5%] z-10 rounded-md bg-slate-100 p-2">
              Link copied!
            </p>
          )}
          <div className="flex flex-col max-w-4xl mx-auto p-3 my-7 gap-4">
            <p className="text-2xl font-semibold">
              {listing.name} - ${" "}
              {listing.offer
                ? listing.discountedPrice.toLocaleString("en-US")
                : listing.regularPrice.toLocaleString("en-US")}
              {listing.type === "rent" && " / month"}
            </p>
            <p className="flex items-center mt-6 gap-2 text-slate-600 my-2 text-sm">
              <FaMapMarkerAlt className="text-green-700" />
              {listing.address}
            </p>
            <div className="flex gap-4">
              <p className="bg-red-900 w-full max-w-[200px] text-white text-center p-1 rounded-md">
                {listing.type === "rent" ? "For Rent" : "For Sale"}
              </p>
              {listing.offer && (
                <p className="bg-green-900 w-full max-w-[200px] text-white text-center p-1 rounded-md">
                  ${+listing.regularPrice - +listing.discountedPrice}
                </p>
              )}
            </div>
            <p className="text-slate-800">
              <span className="font-semibold text-black">Description</span> -{" "}
              {listing.description}
            </p>
            <ul className="whitespace-nowrap text-green-800 font-semibold flex flex-wrap items-center gap-4 sm:gap-6">
              <li className="flex items-center gap-2 ">
                <FaBed className="text-lg" />
                {listing.bedrooms > 1
                  ? `${listing.bedrooms} bedrooms`
                  : "1 bedroom"}
              </li>
              <li className="flex items-center gap-2 ">
                <FaBath className="text-lg" />
                {listing.bathrooms > 1
                  ? `${listing.bathrooms} bathrooms`
                  : "1 bathroom"}
              </li>
              <li className="flex items-center gap-2 ">
                <FaParking className="text-lg" />
                {listing.parking ? "Parking available" : "No parking"}
              </li>
              <li className="flex items-center gap-2 ">
                <FaChair className="text-lg" />
                {listing.furnished ? "Furnished" : "Unfurnished"}
              </li>
            </ul>
          </div>
        </>
      )}
    </main>
  );
}
