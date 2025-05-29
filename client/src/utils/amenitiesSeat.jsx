import { FaCheckCircle } from "react-icons/fa";
import { AiFillDollarCircle } from "react-icons/ai";

export const getSeatLabels = (itiner) => {
    const seatOptions = [
      {
        descriptions: [
          "BASIC SEAT",
          "ADVANCE SEAT SELECTION",
          "PRE RESERVED SEAT ASSIGNMENT",
        ],
        label: "Seat choice",
      },
    ];
    const amenity =
      itiner.travelerPricings[0].fareDetailsBySegment[0].amenities?.find(
        (amenity) =>
          seatOptions.some((option) =>
            option.descriptions.includes(amenity.description)
          )
      );
  
    const seatLabel = amenity
      ? seatOptions.find((option) =>
          option.descriptions.includes(amenity.description)
        )?.label
      : "Seat choice";
  
    const isChargeable = amenity ? amenity.isChargeable : true; // Asumimos que es cobrable si no está definido
  
    return (
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        {isChargeable ? (
          <AiFillDollarCircle style={{ color: "black" }} />
        ) : (
          <FaCheckCircle style={{ color: "green" }} />
        )}
        <span>{seatLabel}</span>
      </div>
    );
  };