import { Eye, Pencil, Trash2 } from "lucide-react";

function HotelCard({ hotel, onView, onEdit, onDelete }) {
  const imageUrl = hotel.image
    ? hotel.image.startsWith("http")
      ? hotel.image
      : `https://react-nut7.onrender.com/uploads/${hotel.image}`
    : "https://placehold.co/600x400?text=No+Hotel+Image";

  return (
    <div className="hotel-card">
      <img
        src={imageUrl}
        alt={hotel.name}
        className="hotel-image"
        onError={(e) => {
          e.currentTarget.src =
            "https://placehold.co/600x400?text=Image+Not+Available";
        }}
      />

      <div className="hotel-info">
        <h3>{hotel.name}</h3>

        <h2>
          ₹{hotel.price} <span>/ day</span>
        </h2>

        <p>{hotel.description}</p>

        <div className="hotel-actions">
          <button type="button" onClick={onView}>
            <Eye size={16} />
            View
          </button>

          <button type="button" onClick={onEdit}>
            <Pencil size={16} />
            Edit
          </button>

          <button type="button" onClick={onDelete}>
            <Trash2 size={16} />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default HotelCard;
