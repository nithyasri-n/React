import { useEffect, useState, useCallback } from "react";
import { Routes, Route } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import AddHotel from "./pages/AddHotel";
import HotelDetails from "./pages/HotelDetails";
import SEO from "./components/SEO";
import Toast from "./components/Toast";

import {
  fetchHotels,
  createHotel,
  updateHotel,
  deleteHotel,
} from "./features/hotels/hotelsSlice";

function App() {
  const dispatch = useDispatch();

  const hotels = useSelector((state) => state.hotels.hotels);

  const [toast, setToast] = useState(null);

  const showToast = useCallback((message, type = "success") => {
    const titles = {
      success: "Success!",
      error: "Something went wrong",
      info: "Notice",
    };

    setToast({
      id: Date.now(),
      title: titles[type] || "Notification",
      message,
      type,
    });
  }, []);

  const closeToast = useCallback(() => {
    setToast(null);
  }, []);

  useEffect(() => {
    dispatch(fetchHotels());
  }, [dispatch]);

  // Add hotel to PostgreSQL
  function addHotel(newHotel) {
    return dispatch(createHotel(newHotel)).unwrap();
  }

  // Update hotel in PostgreSQL
  function handleUpdateHotel(updatedHotel) {
    const { id, ...hotelData } = updatedHotel;

    return dispatch(updateHotel({ id, hotel: hotelData })).unwrap();
  }

  async function handleDeleteHotel(hotelId) {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this hotel?",
    );

    if (!confirmDelete) return;

    try {
      await dispatch(deleteHotel(hotelId)).unwrap();

      showToast("Hotel deleted successfully!", "success");
    } catch (error) {
      console.error("Hotel delete error:", error);

      showToast("Unable to delete hotel. Please try again.", "error");
    }
  }

  return (
    <>
      <Navbar />
      <SEO />

      <Toast toast={toast} onClose={closeToast} />

      <Routes>
        <Route
          path="/"
          element={
            <Dashboard
              hotels={hotels}
              onDelete={handleDeleteHotel}
              preview={true}
            />
          }
        />

        <Route
          path="/hotels"
          element={
            <Dashboard
              hotels={hotels}
              onDelete={handleDeleteHotel}
              preview={false}
            />
          }
        />

        <Route
          path="/add"
          element={
            <AddHotel
              hotels={hotels}
              onAddHotel={addHotel}
              onUpdateHotel={handleUpdateHotel}
              showToast={showToast}
            />
          }
        />

        <Route
          path="/edit/:hotelId"
          element={
            <AddHotel
              hotels={hotels}
              onAddHotel={addHotel}
              onUpdateHotel={handleUpdateHotel}
              showToast={showToast}
            />
          }
        />

        <Route
          path="/hotel/:hotelId"
          element={<HotelDetails hotels={hotels} />}
        />
      </Routes>
    </>
  );
}

export default App;
