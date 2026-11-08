import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function AddHotel({ hotels, onAddHotel, onUpdateHotel, showToast }) {
  const navigate = useNavigate();
  const { hotelId } = useParams();

  const isEditing = Boolean(hotelId);
  const selectedHotel = hotels.find((hotel) => String(hotel.id) === hotelId);

  const [hotel, setHotel] = useState({
    name: "",
    description: "",
    latitude: "",
    longitude: "",
    price: "",
    image: null,
  });

  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEditing && selectedHotel) {
      setHotel({
        name: selectedHotel.name ?? "",
        description: selectedHotel.description ?? "",
        latitude: selectedHotel.latitude ?? "",
        longitude: selectedHotel.longitude ?? "",
        price: selectedHotel.price ?? "",
        image: null,
      });

      setPreview(
        selectedHotel.image
          ? selectedHotel.image.startsWith("http")
            ? selectedHotel.image
            : `http://localhost:5000/uploads/${selectedHotel.image}`
          : "",
      );
    } else if (!isEditing) {
      setHotel({
        name: "",
        description: "",
        latitude: "",
        longitude: "",
        price: "",
        image: null,
      });
      setPreview("");
    }
  }, [hotelId, selectedHotel, isEditing]);

  function handleChange(e) {
    const { name, value } = e.target;

    setHotel((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  function handleImage(e) {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      showToast("Please select a valid image file.", "error");
      e.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showToast("Image size must be less than 5 MB.", "error");
      e.target.value = "";
      return;
    }

    setHotel((previous) => ({
      ...previous,
      image: file,
    }));

    setPreview(URL.createObjectURL(file));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (
      !hotel.name.trim() ||
      !hotel.description.trim() ||
      hotel.latitude === "" ||
      hotel.longitude === "" ||
      !Number.isFinite(Number(hotel.latitude)) ||
      !Number.isFinite(Number(hotel.longitude)) ||
      Number(hotel.latitude) < -90 ||
      Number(hotel.latitude) > 90 ||
      Number(hotel.longitude) < -180 ||
      Number(hotel.longitude) > 180 ||
      !Number.isFinite(Number(hotel.price)) ||
      Number(hotel.price) <= 0
    ) {
      showToast("Please fill in all fields with valid details.", "error");
      return;
    }

    if (!isEditing && !hotel.image) {
      showToast("Please upload a hotel image.", "error");
      return;
    }

    const hotelData = {
      ...hotel,
      name: hotel.name.trim(),
      description: hotel.description.trim(),
      latitude: Number(hotel.latitude),
      longitude: Number(hotel.longitude),
      price: Number(hotel.price),
    };

    try {
      setLoading(true);

      if (isEditing) {
        await onUpdateHotel({
          ...hotelData,
          id: selectedHotel.id,
        });

        showToast(
          "Your hotel details have been updated successfully!",
          "success",
        );
      } else {
        await onAddHotel(hotelData);

        showToast("Your new hotel has been added successfully!", "success");
      }

      navigate("/");
    } catch (error) {
      console.error("Hotel save error:", error);

      showToast(
        error?.message || "Unable to save hotel. Please try again.",
        "error",
      );
    } finally {
      setLoading(false);
    }
  }

  if (isEditing && !selectedHotel) {
    return (
      <div className="form-page">
        <h2>Hotel not found!</h2>

        <button
          type="button"
          className="back-button"
          onClick={() => navigate("/")}
        >
          ← Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="form-page">
      <div className="form-heading">
        <div>
          <button
            type="button"
            className="back-button"
            onClick={() => navigate("/")}
          >
            ← Back to Dashboard
          </button>

          <p className="breadcrumb">
            Dashboard / Hotels / {isEditing ? "Edit" : "Add"}
          </p>

          <h1>{isEditing ? "Edit Hotel" : "Add New Hotel"}</h1>

          <p>
            {isEditing
              ? "Update your hotel property details."
              : "Create a new property listing for your platform."}
          </p>
        </div>
      </div>

      <form className="hotel-form" onSubmit={handleSubmit}>
        <div className="form-section">
          <h3>Basic Information</h3>
          <p>Enter the essential details of your property.</p>

          <div className="form-grid">
            <div className="form-field full-width">
              <label>Hotel Name</label>
              <input
                name="name"
                value={hotel.name}
                onChange={handleChange}
                placeholder="e.g. Grand Palace Hotel"
                required
              />
            </div>

            <div className="form-field full-width">
              <label>Description</label>
              <textarea
                name="description"
                value={hotel.description}
                onChange={handleChange}
                placeholder="Describe your hotel..."
                required
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3>Property Image</h3>
          <p>Upload a beautiful image of your hotel.</p>

          <label className="upload-area">
            <input type="file" accept="image/*" onChange={handleImage} hidden />

            {preview ? (
              <img
                className="image-preview"
                src={preview}
                alt="Hotel preview"
              />
            ) : (
              <>
                <span className="upload-icon">📷</span>
                <strong>Click to upload image</strong>
                <span>PNG, JPG or WEBP (Max 5 MB)</span>
              </>
            )}
          </label>
        </div>

        <div className="form-section">
          <h3>Location Details</h3>
          <p>Enter the geographical coordinates of your hotel.</p>

          <div className="form-grid">
            <div className="form-field">
              <label>Latitude</label>
              <input
                type="number"
                step="any"
                name="latitude"
                value={hotel.latitude}
                onChange={handleChange}
                placeholder="e.g. 10.7905"
                required
              />
            </div>

            <div className="form-field">
              <label>Longitude</label>
              <input
                type="number"
                step="any"
                name="longitude"
                value={hotel.longitude}
                onChange={handleChange}
                placeholder="e.g. 78.7047"
                required
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3>Pricing</h3>
          <p>Set the daily room price.</p>

          <div className="form-field">
            <label>Price per day</label>

            <div className="price-input">
              <span>₹</span>
              <input
                type="number"
                name="price"
                value={hotel.price}
                onChange={handleChange}
                placeholder="Enter amount"
                min="1"
                required
              />
            </div>
          </div>
        </div>

        <div className="form-footer">
          <button type="submit" className="submit-btn" disabled={loading}>
            {loading
              ? "Saving..."
              : isEditing
                ? "Update Hotel →"
                : "Save Hotel →"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddHotel;
