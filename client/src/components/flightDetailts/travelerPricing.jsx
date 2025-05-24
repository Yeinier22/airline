export default function TravelerPricing({ itiner }) {
  const capitalizeFirstLetter = (str) => {
    const stringLowerCase = str.toLowerCase();
    return stringLowerCase.charAt(0).toUpperCase() + stringLowerCase.slice(1);
  };
  const cabinInfo = itiner.travelerPricings[0].fareDetailsBySegment[0].cabin;
  const cabin = capitalizeFirstLetter(cabinInfo);

  return (
    <div>
      <p>
        <strong>Cabin : {cabin}</strong>
      </p>
    </div>
  );
}
