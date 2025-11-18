import React from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Briefcase, Laptop, Zap, Mail, Rocket } from 'lucide-react';

const Careers = () => {
  return (
    <div className="container mx-auto px-4 py-12 pt-32 min-h-screen">
      
      {/* Hero Section */}
      <div className="text-center max-w-3xl mx-auto mb-20">
        <Badge className="mb-4" variant="secondary">Join Our Journey</Badge>
        <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
          Help us shape the future of shared living.
        </h1>
        <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
          We are a small, passionate team building Matestay to connect people and places. 
          While our team is currently full, we are always looking for like-minded innovators to keep on our radar.
        </p>
      </div>

      {/* Culture / Values Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
        <div className="p-8 bg-card rounded-2xl border border-border shadow-sm hover:shadow-md transition-all">
          <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
            <Laptop className="h-6 w-6 text-primary" />
          </div>
          <h3 className="text-xl font-bold mb-2">Remote-First Culture</h3>
          <p className="text-muted-foreground">
            We believe in output over hours. Work from Dehradun, Delhi, or your living room. We value autonomy and trust.
          </p>
        </div>

        <div className="p-8 bg-card rounded-2xl border border-border shadow-sm hover:shadow-md transition-all">
          <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
            <Rocket className="h-6 w-6 text-primary" />
          </div>
          <h3 className="text-xl font-bold mb-2">Impact Driven</h3>
          <p className="text-muted-foreground">
            We aren't just building an app; we're solving a real housing problem for students and professionals in India.
          </p>
        </div>

        <div className="p-8 bg-card rounded-2xl border border-border shadow-sm hover:shadow-md transition-all">
          <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
            <Zap className="h-6 w-6 text-primary" />
          </div>
          <h3 className="text-xl font-bold mb-2">Fast Growth</h3>
          <p className="text-muted-foreground">
            Join a startup environment where your ideas matter. We move fast, break things, and learn together.
          </p>
        </div>
      </div>

      {/* "No Openings" / Talent Pool CTA */}
      <div className="max-w-4xl mx-auto">
        <div className="bg-secondary/30 border border-border rounded-3xl p-8 md:p-12 text-center relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />
          
          <div className="relative z-10">
            <div className="bg-background w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border">
               <Briefcase className="h-8 w-8 text-muted-foreground" />
            </div>
            
            <h2 className="text-3xl font-bold mb-4">No open positions right now</h2>
            <p className="text-muted-foreground max-w-lg mx-auto mb-8">
              However, things change fast at a startup! If you are a developer, designer, or marketer who loves what we do, we'd love to see your portfolio.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" className="bg-[#5b5dda] hover:bg-[#4a4ab5] rounded-full w-full sm:w-auto" asChild>
                <a href="mailto:matestaypvt@gmail.com">
                  <Mail className="mr-2 h-4 w-4" /> Email Your Resume
                </a>
              </Button>
              <Button variant="outline" size="lg" className="rounded-full w-full sm:w-auto" asChild>
                <a href="https://www.linkedin.com/in/shashank-kumar-70742b292/" target="_blank" rel="noreferrer">
                  Connect on LinkedIn
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Careers;