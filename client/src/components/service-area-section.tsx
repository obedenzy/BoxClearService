
import { MapPin } from "lucide-react";

const serviceAreas = [
  "Columbus", "Bexley", "Dublin", "Gahanna", "Grandview Heights",
  "Grove City", "Hilliard", "Reynoldsburg", "Upper Arlington",
  "Westerville", "Whitehall", "Worthington", "Delaware",
  "Powell", "Sunbury", "Lancaster", "Pickerington"
];

export default function ServiceAreaSection() {
  return (
    <section className="py-16 bg-[#37474F]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-[#FFFFF0] mb-4">Service Areas</h2>
          <p className="text-[#FFFFF0]/80 text-lg max-w-2xl mx-auto">
            BoxClear provides eco-friendly cardboard and box removal services throughout Greater Columbus and surrounding areas.
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 text-[#FFFFF0]">
          {serviceAreas.map((area) => (
            <div key={area} className="flex items-center space-x-2 p-3 rounded-lg bg-[#FFFFF0]/5">
              <MapPin className="h-4 w-4 text-[#00C853]" />
              <span>{area}</span>
            </div>
          ))}
        </div>
        <p className="text-[#FFFFF0]/60 text-sm text-center mt-8">
          Don't see your area listed? Contact us to check if we service your location.
        </p>
      </div>
    </section>
  );
}
