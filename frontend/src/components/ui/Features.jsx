import { Shield, MessageCircle, Star, Zap, MapPin, Calendar } from "lucide-react";

const features = [
  {
    icon: Shield,
    title: "Verified Profiles",
    description:
      "All users go through a verification process for your safety and peace of mind",
  },
  {
    icon: MessageCircle,
    title: "Instant Chat",
    description:
      "Connect directly with potential flatmates through our real-time messaging system",
  },
  {
    icon: Star,
    title: "Smart Matching",
    description:
      "Our AI analyzes preferences and lifestyle to find your perfect match",
  },
  {
    icon: Zap,
    title: "Quick Setup",
    description:
      "Create your profile in minutes and start connecting immediately",
  },
  {
    icon: MapPin,
    title: "Location Based",
    description:
      "Find flatmates and properties in your preferred neighborhoods",
  },
  {
    icon: Calendar,
    title: "Flexible Terms",
    description:
      "Whether short-term or long-term, find arrangements that work for you",
  },
];

const Features = () => {
  return (
    <section className="py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Section Heading */}
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-4xl md:text-5xl font-bold">
            Why Choose <span className="text-[#03c2eb]">Flatmate</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Everything you need to find the perfect living situation
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="bg-black/5 backdrop-blur-lg border border-white/20 shadow-lg 
                           p-8 rounded-2xl space-y-4 
                           hover:shadow-[0_0_12px_rgba(3,194,235,0.6)] 
                           transition-all duration-300 hover:-translate-y-2 group"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="w-16 h-16 rounded-2xl bg-[#03c2eb]/10 flex items-center justify-center 
                                shadow-md transition-all duration-300 
                                group-hover:shadow-[0_0_12px_rgba(3,194,235,0.7)] 
                                group-hover:scale-110 mx-auto">
                  <Icon className="w-8 h-8 text-[#03c2eb]" />
                </div>
                <h3 className="text-2xl font-bold text-white">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;
