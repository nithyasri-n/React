import { useNavigate, useParams } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const hotelMarker = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

function HotelDetails({ hotels }) {
  const navigate = useNavigate();
  const { hotelId } = useParams();

  const hotel = hotels.find((item) => String(item.id) === hotelId);

  if (!hotel) {
    return (
      <div className="details-page">
        <h2>Hotel not found!</h2>
        <button className="back-button" onClick={() => navigate("/")}>
          Back to Dashboard
        </button>
      </div>
    );
  }

  const latitude = Number(hotel.latitude);
  const longitude = Number(hotel.longitude);

  const hasValidCoordinates =
    hotel.latitude !== "" &&
    hotel.longitude !== "" &&
    Number.isFinite(latitude) &&
    Number.isFinite(longitude) &&
    latitude >= -90 &&
    latitude <= 90 &&
    longitude >= -180 &&
    longitude <= 180;

  const imageUrl = hotel.image
    ? hotel.image.startsWith("http")
      ? hotel.image
      : `https://react-nut7.onrender.com/uploads/${hotel.image}`
    : "https://placehold.co/600x400?text=No+Hotel+Image";

  return (
    <div className="details-page">
      <button
        type="button"
        onClick={() => navigate("/")}
        className="back-button"
      >
        ← Back to Dashboard
      </button>

      <div className="details-header">
        <div>
          <p className="breadcrumb">Dashboard / Hotels / Details</p>
          <h1>{hotel.name}</h1>
          <p>Complete property information</p>
        </div>
      </div>

      <div className="details-card">
        <img
          className="details-image"
          src={imageUrl}
          alt={hotel.name}
          onError={(e) => {
            e.currentTarget.src =
              "https://placehold.co/800x500?text=Image+Not+Available";
          }}
        />

        <div className="details-content">
          <h2>{hotel.name}</h2>

          <h1 className="details-price">
            ₹{hotel.price}
            <span> / day</span>
          </h1>

          <h3>About this property</h3>
          <p className="details-description">{hotel.description}</p>

          <div className="details-info-grid">
            <div className="detail-info-card">
              <span>Latitude</span>
              <strong>{hotel.latitude}</strong>
            </div>

            <div className="detail-info-card">
              <span>Longitude</span>
              <strong>{hotel.longitude}</strong>
            </div>
          </div>
        </div>
      </div>

      <div className="map-section">
        <h2>Hotel Location</h2>
        <p>Explore the location of this property on the map.</p>

        {hasValidCoordinates ? (
          <MapContainer
            center={[latitude, longitude]}
            zoom={13}
            scrollWheelZoom={true}
            className="hotel-map"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <Marker position={[latitude, longitude]} icon={hotelMarker}>
              <Popup>{hotel.name}</Popup>
            </Marker>
          </MapContainer>
        ) : (
          <p>Valid location coordinates are not available for this hotel.</p>
        )}
      </div>
    </div>
  );
}

export default HotelDetails;
