import { UserPlus, Search, MessageSquare, Home } from "lucide-react";

const steps = [
  {
    icon: UserPlus,
    title: "Create Profile",
    description: "Sign up and tell us about yourself, your lifestyle, and preferences",
  },
  {
    icon: Search,
    title: "Browse & Match",
    description: "Explore verified profiles and get AI-powered compatibility scores",
  },
  {
    icon: MessageSquare,
    title: "Connect & Chat",
    description: "Message potential flatmates and discuss your living arrangement",
  },
  {
    icon: Home,
    title: "Move In",
    description: "Finalize the details and start your new shared living experience",
  },
];

const Steps = () => {
  return (
    <section className="relative py-20 px-6 overflow-hidden">

      <div className="container mx-auto max-w-6xl relative z-10">
        {/* Heading */}
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-4xl md:text-5xl font-bold drop-shadow-[0_0_10px_#03c2eb]">
            How It <span className="text-[#03c2eb]">Works</span>
          </h2>
          <p className="text-xl text-[#8cccd9] max-w-2xl mx-auto">
            Four simple steps to find your perfect flatmate
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 relative">
          {/* Connection line (desktop only) */}
          <div className="hidden lg:block absolute top-20 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#03c2eb]/40 to-transparent" />

          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div
                key={index}
                className="relative flex flex-col items-center text-center space-y-4 group"
              >
                {/* Step number glow background */}
                <div className="absolute -top-6 -left-6 text-8xl font-bold text-[#03c2eb]/5 select-none">
                  {index + 1}
                </div>

                {/* Icon box */}
                <div className="relative z-10 w-24 h-24 rounded-3xl bg-black/10 backdrop-blur-md border border-white/20 shadow-lg flex items-center justify-center group-hover:scale-110 transition-all duration-300">
                  <Icon className="w-12 h-12 text-[#03c2eb]" />
                </div>

                {/* Step content */}
                <div className="space-y-2">
                  <div className="text-sm font-semibold text-[#03c2eb]">
                    Step {index + 1}
                  </div>
                  <h3 className="text-2xl font-bold">{step.title}</h3>
                  <p className="text-white/70 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Steps;
