import { FaCheckCircle } from "react-icons/fa";
import { AiFillDollarCircle } from "react-icons/ai";

export const getCheckedBagLabels = (itiner) => {
  // Lista de opciones de equipaje en amenities
  const baggageOptions = [
    {
      descriptions: ["FIRST CHECKED BAG", "CHECKED BAG FIRST"],
      label: "1st checked bag",
    },
    {
      descriptions: ["SECOND CHECKED BAG", "CHECKED BAG SECOND", "SECOND BAG"],
      label: "2nd checked bag",
    },
  ];

  // Buscar equipaje de cabina en amenities
  const amenities =
    itiner.travelerPricings[0].fareDetailsBySegment[0].amenities || []; //devuleve esta estructura [{inf},{inf},{inf}]
  const carryOnFromAmenities = amenities.find((amenity) =>
    ["CARRY16KG 35LB UPTO46LI 118LCM"].includes(amenity.description)
  );

  // Extraemos el equipaje de cabina desde includedCabinBags
  const { includedCabinBags, includedCheckedBags } =
    itiner.travelerPricings[0].fareDetailsBySegment[0] || {};

  // Definimos la etiqueta de equipaje de cabina, priorizando `includedCabinBags`
  let cabinBagLabel = null;
  let cabinBagChargeable = false;

  // Opción general para aerolíneas que usan `includedCabinBags`
  if (includedCabinBags?.quantity === 2) {
    cabinBagLabel = "Carry-on bag up to 10kg and 1 personal item";
    cabinBagChargeable = false; // Gratis
  } else if (includedCabinBags?.quantity === 1) {
    cabinBagLabel = "Carry-on bag up to 10kg";
    cabinBagChargeable = false; // Gratis
  } else if (includedCheckedBags?.quantity === 0) {
    // Caso específico para Spirit: No incluye maleta facturada, pero se cobra el carry-on
    cabinBagLabel = "Carry-on bag up to 10kg";
    cabinBagChargeable = true; // Cobrable
  } else if (carryOnFromAmenities) {
    // Si no hay info en `includedCabinBags` ni en `includedCheckedBags`, buscamos en `amenities`
    cabinBagLabel = "Carry-on bag up to 16kg (35LB)";
    cabinBagChargeable = carryOnFromAmenities.isChargeable; // Revisamos si es cobrable o no
  }

  // Buscar equipaje facturado en amenities
  const checkedBagLabels = baggageOptions
    .map(({ descriptions, label }) => {
      const amenity = amenities.find((amenity) =>
        descriptions.includes(amenity.description)
      );

      return amenity ? (
        <div
          key={label}
          style={{ display: "flex", alignItems: "center", gap: "8px" }}
        >
          {amenity.isChargeable ? (
            <AiFillDollarCircle style={{ color: "black" }} />
          ) : (
            <FaCheckCircle style={{ color: "green" }} />
          )}
          <span>{label}</span>
        </div>
      ) : null;
    })
    .filter(Boolean); // Elimina valores nulos

  // Si existe equipaje de cabina, lo agregamos con su icono correspondiente
  if (cabinBagLabel) {
    checkedBagLabels.unshift(
      <div
        key="cabinBag"
        style={{ display: "flex", alignItems: "center", gap: "8px" }}
      >
        {cabinBagChargeable ? (
          <AiFillDollarCircle style={{ color: "black" }} />
        ) : (
          <FaCheckCircle style={{ color: "green" }} />
        )}
        <span>{cabinBagLabel}</span>
      </div>
    );
  }

  return checkedBagLabels;
};