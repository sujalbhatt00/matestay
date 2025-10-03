import { ArrowRight } from "lucide-react";

const Ready = () => {
    return (
        <section className="py-20 px-4">
            <div className="container mx-auto max-w-4xl">
                <div className="relative overflow-hidden p-12 md:p-16 rounded-3xl text-center space-y-8 bg-black/10 backdrop-blur-md border border-white/20 shadow-[0_0_20px_6px_rgba(0,140,204,0.3)]">

                    {/* Animated background glow */}
                    <div className="absolute inset-0 bg-gradient-radial from-[#03c2eb]/10 to-transparent opacity-50 animate-pulse" />

                    <div className="relative z-10 space-y-8">
                        {/* Heading */}
                        <h2 className="text-4xl md:text-6xl font-bold drop-shadow-[0_0_10px_#03c2eb]">
                            Ready to Find Your
                            <span className="block text-[#03c2eb]">Perfect Match?</span>
                        </h2>

                        {/* Subtext */}
                        <p className="text-xl text-[#8cccd9] max-w-2xl mx-auto">
                            Join thousands of happy flatmates who found their ideal living situation through our platform
                        </p>

                        {/* Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                            {/* Primary button */}
                            <button className="cursor-pointer flex items-center justify-center text-lg px-8 py-4 rounded-xl bg-[#03c2eb] hover:bg-[#0c9fb8] text-black font-semibold shadow-lg border border-[#03c2eb]/30 hover:border-[#03c2eb]/50 transition-all duration-300 group">
                                Get Started Now
                                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                            </button>

                            {/* Outline button */}
                            <button className="cursor-pointer flex items-center justify-center text-lg px-8 py-4 rounded-xl bg-transparent border border-[#03c2eb]/30 hover:border-[#03c2eb]/50 text-white font-semibold shadow-md transition-all duration-300">
                                Learn More
                            </button>
                        </div>

                        {/* Bottom badges */}
                        <div className="flex flex-wrap items-center justify-center gap-8 pt-8 text-sm text-[#8cccd9]">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-[#03c2eb] shadow-[0_0_6px_#03c2eb]" />
                                <span>Free to join</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-[#03c2eb] shadow-[0_0_6px_#03c2eb]" />
                                <span>No credit card</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-[#03c2eb] shadow-[0_0_6px_#03c2eb]" />
                                <span>Start today</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Ready;
