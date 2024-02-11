export default function Search() {
  return (
    <div className="flex flex-col md:flex-row">
      <div className="p-7 border-b-2 md:border-r-2 md:min-h-screen">
        <form className="flex flex-col gap-8">
          <div className="flex items-center gap-2">
            <label className="whitespace-nowrap">Search Term:</label>
            <input
              type="text"
              placeholder="Search..."
              id="searchTerm"
              className="border border-gray-300 rounded-lg p-2 w-64"
            />
          </div>
          <div className="flex gap-2 items-center flex-wrap">
            <label className="mr-ė font-semibold">Type:</label>
            <div className="flex gap-2">
              <input type="checkbox" id="all" className="w-5" />
              <span>Rent</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="rent" className="w-5" />
              <span>Sale</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="sale" className="w-5" />
              <span>Rent & Sale</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="offer" className="w-5" />
              <span>Offer</span>
            </div>
          </div>
          <div className="flex gap-2 items-center flex-wrap">
            <label className="mr-ė font-semibold">Amenities:</label>
            <div className="flex gap-2">
              <input type="checkbox" id="parking" className="w-5" />
              <span>Parking</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="furnished" className="w-5" />
              <span>Furnished</span>
            </div>
          </div>
          <div className="flex gap-2 items-center flex-wrap">
            <label className="font-semibold">Sort:</label>
            <select id="sort_order" className="border rounded-lg p-3">
              <option value="price">Price High to Low</option>
              <option value="price">Price Low to High</option>
              <option value="createdAt">Newest</option>
              <option value="createdAt">Oldest</option>
            </select>
          </div>
          <div>
            <button
              type="submit"
              className="w-full bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 p-3"
            >
              Search
            </button>
          </div>
        </form>
      </div>
      <div className="">
        <h2 className="text-3xl font-semibold border-b p-3 text-slate-700 mt-5">
          Search Results:
        </h2>
      </div>
    </div>
  );
}
