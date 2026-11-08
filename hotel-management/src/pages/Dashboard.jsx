import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  ArrowRight,
} from "lucide-react";

import HotelCard from "../components/HotelCard";
import { fetchHotelPage } from "../features/hotels/hotelsSlice";

function Dashboard({ hotels, onDelete, preview = false }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const pageHotels = useSelector((state) => state.hotels.pageHotels);
  const pageTotal = useSelector((state) => state.hotels.pageTotal);
  const pageLoading = useSelector((state) => state.hotels.pageLoading);

  const [searchTerm, setSearchTerm] = useState("");
  const [maxPrice, setMaxPrice] = useState(10000);
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = preview ? 3 : 6;
  const maximumSliderPrice = 10000;

  const averagePrice = hotels.length
    ? Math.round(
        hotels.reduce((total, hotel) => total + Number(hotel.price), 0) /
          hotels.length,
      )
    : 0;

  const totalPages = Math.max(1, Math.ceil(pageTotal / itemsPerPage));

  // Fetch data from the backend whenever filters or page change
  useEffect(() => {
    dispatch(
      fetchHotelPage({
        search: searchTerm,
        maxPrice,
        limit: itemsPerPage,
        offset: (currentPage - 1) * itemsPerPage,
      }),
    );
  }, [dispatch, searchTerm, maxPrice, currentPage, itemsPerPage, pageTotal]);

  // Keep the current page valid after deleting hotels
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  function handleSearchChange(value) {
    setSearchTerm(value);
    setCurrentPage(1);
  }

  function handlePriceChange(value) {
    setMaxPrice(Number(value));
    setCurrentPage(1);
  }

  function handleResetFilters() {
    setSearchTerm("");
    setMaxPrice(maximumSliderPrice);
    setCurrentPage(1);
  }

  function handleEdit(hotelId) {
    navigate(`/edit/${hotelId}`);
  }

  function handleView(hotelId) {
    navigate(`/hotel/${hotelId}`);
  }

  return (
    <div className="dashboard">
      <div className="section-title">
        <div>
          <h1>{preview ? "Dashboard" : "All Hotels"}</h1>
          <p>
            {preview
              ? "Welcome back! Here's your hotel overview."
              : "Explore and manage all your hotel properties."}
          </p>
        </div>
      </div>

      {/* Dashboard statistics */}
      <div className="stats-container">
        <div className="stats-card">
          <h3>Total Hotels</h3>
          <h1>{hotels.length}</h1>
          <p>Available properties</p>
        </div>

        <div className="stats-card">
          <h3>Average Price</h3>
          <h1>₹{averagePrice.toLocaleString("en-IN")}</h1>
          <p>Average price per day</p>
        </div>

        <div className="stats-card">
          <h3>Hotel Listings</h3>
          <h1>{hotels.length}</h1>
          <p>Total listed properties</p>
        </div>
      </div>

      <div className="section-title">
        <div>
          <h2>{preview ? "Featured Hotels" : "Hotel Listings"}</h2>
          <p>
            {preview
              ? "A quick look at some of your properties."
              : "Search, filter and manage all your properties."}
          </p>
        </div>
      </div>

      {/* Search and price filter */}
      <div className="filter-container">
        <div className="search-box">
          <Search size={19} />

          <input
            type="text"
            placeholder="Search hotel by title..."
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
          />
        </div>

        <div className="price-filter slider-filter">
          <div className="price-slider-heading">
            <label htmlFor="price-slider">Maximum Price</label>
            <strong>₹{maxPrice.toLocaleString("en-IN")}</strong>
          </div>

          <input
            id="price-slider"
            type="range"
            min="0"
            max={maximumSliderPrice}
            step="100"
            value={maxPrice}
            onChange={(e) => handlePriceChange(e.target.value)}
          />

          <div className="slider-labels">
            <span>₹0</span>
            <span>₹10,000</span>
          </div>
        </div>

        <button
          type="button"
          className="reset-filter-btn"
          onClick={handleResetFilters}
        >
          <RotateCcw size={16} />
          Reset
        </button>
      </div>

      <p className="result-count">
        Showing {pageHotels.length} of {pageTotal} matching hotels
      </p>

      {/* Hotel cards */}
      <div className="hotel-list">
        {pageLoading ? (
          <p>Loading hotels...</p>
        ) : pageHotels.length > 0 ? (
          pageHotels.map((hotel) => (
            <HotelCard
              key={hotel.id}
              hotel={hotel}
              onView={() => handleView(hotel.id)}
              onEdit={() => handleEdit(hotel.id)}
              onDelete={() => onDelete(hotel.id)}
            />
          ))
        ) : (
          <div className="no-results">
            <h3>No hotels found</h3>
            <p>Try changing your search or price filter.</p>

            <button type="button" onClick={handleResetFilters}>
              Clear Filters
            </button>
          </div>
        )}
      </div>

      {/* See More */}
      {preview && pageTotal > 3 && (
        <div className="see-more-container">
          <button
            type="button"
            className="see-more-btn"
            onClick={() => navigate("/hotels")}
          >
            See More Hotels
            <ArrowRight size={18} />
          </button>
        </div>
      )}

      {/* Pagination */}
      {!preview && pageTotal > itemsPerPage && (
        <div className="pagination">
          <button
            type="button"
            disabled={currentPage === 1 || pageLoading}
            onClick={() => setCurrentPage((page) => page - 1)}
          >
            <ChevronLeft size={18} />
            Previous
          </button>

          <div className="page-numbers">
            {Array.from({ length: totalPages }, (_, index) => index + 1).map(
              (page) => (
                <button
                  type="button"
                  key={page}
                  className={currentPage === page ? "active-page" : ""}
                  disabled={pageLoading}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </button>
              ),
            )}
          </div>

          <button
            type="button"
            disabled={currentPage === totalPages || pageLoading}
            onClick={() => setCurrentPage((page) => page + 1)}
          >
            Next
            <ChevronRight size={18} />
          </button>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
