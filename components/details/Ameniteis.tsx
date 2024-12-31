export default function Amenities({ amenities }: { amenities: string[] }) {
  const renderIcon = (name: string) => {
    switch (name.toLowerCase()) {
      case "beach":
        return <i className="fa-solid fa-umbrella-beach"></i>;
      case "pool":
        return <i className="fa-solid fa-person-swimming"></i>;
      case "wi-fi":
        return <i className="fa-solid fa-wifi"></i>;
      case "kitchen":
        return <i className="fa-solid fa-sink"></i>;
      default:
        return <i className="fa-solid fa-question-circle"></i>; 
    }
  };

  return (
    <div className="amenities-grid grid grid-cols-2 gap-4">
      {amenities.map((amenity, index) => (
        <div key={index} className="flex items-center gap-2">
          {renderIcon(amenity)}
          <span className="text-violet-700">{amenity}</span>
        </div>
      ))}
    </div>
  );
}