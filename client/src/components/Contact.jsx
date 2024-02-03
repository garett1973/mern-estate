import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function Contact({ listing }) {
  const [landlord, setLandlord] = useState(null); // [1]
  const [landlordError, setLandlordError] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchLandlord = async () => {
      try {
        const response = await fetch(`/api/user/${listing.userRef}`);
        const resp = await response.json();
        const data = resp.user;
        if (resp.success === false) {
          setLandlordError(resp.message);
          setTimeout(() => {
            setLandlordError(false);
          }, 3000);
        } else {
          setLandlord(data);
        }
      } catch (error) {
        setLandlordError(error.message);
        setTimeout(() => {
          setLandlordError(false);
        }, 3000);
      }
    };
    fetchLandlord();
  }, []);

  const onChange = (e) => {
    setMessage(e.target.value);
  };

  return (
    <>
      {landlordError && (
        <p className="text-center my-7 text-2xl text-red-700">
          Something went wrong retrieving landlord data...
        </p>
      )}
      {landlord && !landlordError && (
        <div className="">
          <p>
            Contact <span className="font-semibold">{landlord.username}</span>{" "}
            for{" "}
            <span className="font-semibold">{listing.name.toLowerCase()}</span>
          </p>
          <textarea
            name="message"
            id="message"
            rows="2"
            placeholder="Type your message here..."
            className="w-full p-2 mt-2 border-2 border-gray-300 rounded-md"
            value={message}
            onChange={(e) => onChange(e)}
          ></textarea>
          <Link
            to={`mailto:${landlord.email}?subject=Regarding your listing: ${listing.name}&body=${message}`}
            className="block w-full my-1 text-center bg-slate-700 text-white rounded-md uppercase hover:opacity-95 p-3"
          >
            Send Message
          </Link>
        </div>
      )}
    </>
  );
}
