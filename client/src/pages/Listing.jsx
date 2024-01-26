import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Navigation } from "swiper/modules";
import "swiper/css/bundle";

export default function Listing() {
  SwiperCore.use([Navigation]);
  const { listingId } = useParams();
  const [loading, setLoading] = useState(true); // [1]
  const [listingError, setListingError] = useState(false);
  const [listing, setListing] = useState(null);
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
        </>
      )}
    </main>
  );
}
