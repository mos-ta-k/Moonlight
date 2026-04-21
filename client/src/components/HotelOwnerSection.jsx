import { assets } from "../assets/assets";

const HotelOwnerSection = ({ owner, hotelContact }) => {
  return (
    <div className="mt-20 p-8 bg-gray-50 rounded-2xl shadow-sm">
      <div className="flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-10">
        {/* Owner Image and Basic Info */}
        <div className="flex flex-col items-center md:items-start shrink-0">
          <div className="mt-4 text-center md:text-left">
            <h3 className="text-xl font-semibold text-gray-800">
              {owner?.username || "Hotel Owner"}
            </h3>
            <p className="text-sm text-gray-500 mt-1">Hotel Owner</p>
            <div className="flex items-center justify-center md:justify-start gap-1 mt-2">
              {[...Array(5)].map((_, i) => (
                <img
                  key={i}
                  src={assets.starIconFilled}
                  alt="star"
                  className="w-4 h-4"
                />
              ))}
              <span className="text-sm text-gray-600 ml-1">(5.0)</span>
            </div>
          </div>
        </div>

        {/* Contact and Details */}
        <div className="grow space-y-4">
          <div className="space-y-2">
            <h4 className="font-semibold text-gray-800">Contact Information</h4>
            <div className="flex items-center gap-2 text-gray-600">
              <svg
                className="w-5 h-5 text-primary"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M2.003 5.884L10.332 3.539c.469-.145.98-.145 1.448 0l8.329 2.345c.571.161.899.722.767 1.288l-1.83 8.523c-.078.363-.39.645-.765.645H4.831c-.375 0-.687-.282-.765-.645L2.236 7.172c-.132-.566.196-1.127.767-1.288z" />
              </svg>
              <span>{hotelContact || "Contact available upon booking"}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <svg
                className="w-5 h-5 text-primary"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M19 13h-6v6h6v-6zm0-6h-6v6h6V7zM5 19h6v-6H5v6zm0-6h6V7H5v6zm0-6h6V1H5v6z" />
              </svg>
              <span>24/7 Support Available</span>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold text-gray-800">
              Why Choose This Hotel?
            </h4>
            <ul className="text-gray-600 text-sm space-y-1">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                Professional management with years of experience
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                Highly-rated by guests for cleanliness and service
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                Quick response to guest inquiries and concerns
              </li>
            </ul>
          </div>

          <button className="bg-primary hover:bg-primary-dull transition-all text-white px-6 py-2.5 rounded-lg cursor-pointer">
            Message Owner
          </button>
        </div>
      </div>
    </div>
  );
};

export default HotelOwnerSection;
