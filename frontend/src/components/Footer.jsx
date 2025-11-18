import React from 'react';
import { Mail, Phone, MapPin, Instagram, Linkedin } from "lucide-react";
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-card border-t border-border pt-16 pb-8 mt-auto">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Section: Brand & Socials */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          
          {/* Brand Column */}
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <img src="/Logo.png" width={40} alt="Matestay" />
              <span className="text-2xl font-bold tracking-tight">Matestay</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed mb-6">
              Connecting you with the perfect roommates and safe living spaces. Trust, transparency, and comfort are at our core.
            </p>
            
            {/* Social Icons with Labels */}
            <div className="flex flex-col gap-3">
              {/* Shashank */}
              <div className="flex items-center gap-3">
                <span className="text-xs font-medium text-muted-foreground w-16">Shashank:</span>
                <a href="https://www.linkedin.com/in/shashank-kumar-70742b292/" target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-primary transition-colors" title="Shashank on LinkedIn">
                  <Linkedin className="h-5 w-5" />
                </a>
                <a href="https://www.instagram.com/shashank__.kumar/" target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-primary transition-colors" title="Shashank on Instagram">
                  <Instagram className="h-5 w-5" />
                </a>
              </div>
              
              {/* Sujal */}
              <div className="flex items-center gap-3">
                <span className="text-xs font-medium text-muted-foreground w-16">Sujal:</span>
                <a href="https://www.linkedin.com/in/sujal-b-139067249/" target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-primary transition-colors" title="Sujal on LinkedIn">
                  <Linkedin className="h-5 w-5" />
                </a>
                <a href="https://www.instagram.com/sujalbhatt00" target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-primary transition-colors" title="Sujal on Instagram">
                  <Instagram className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4 text-foreground">Company</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link to="/about" className="hover:text-primary transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-primary transition-colors">Contact Support</Link></li>
              <li><Link to="/careers" className="hover:text-primary transition-colors">Careers</Link></li>
              <li><Link to="/blog" className="hover:text-primary transition-colors">Blog</Link></li>
            </ul>
          </div>

          {/* Explore */}
          <div>
            <h4 className="font-semibold mb-4 text-foreground">Explore</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link to="/find-roommates" className="hover:text-primary transition-colors">Find Roommates</Link></li>
              <li><Link to="/properties/search" className="hover:text-primary transition-colors">Browse Properties</Link></li>
              <li><Link to="/premium" className="hover:text-primary transition-colors">Go Premium</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold mb-4 text-foreground">Contact</h4>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <span>Dehradun, Uttarakhand, India</span>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div className="flex flex-col gap-1">
                  <span>+91 8979312715</span>
                  <span>+91 9304923385</span> {/* <-- Added New Number */}
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div className="flex flex-col gap-1">
                   <a href="mailto:matestaypvt@gmail.com" className="hover:text-primary transition-colors">matestaypvt@gmail.com</a>
                   <a href="mailto:shashankmuz3@gmail.com" className="hover:text-primary transition-colors">shashankmuz3@gmail.com</a>
                   <a href="mailto:sujalbhatt500@gmail.com" className="hover:text-primary transition-colors">sujalbhatt500@gmail.com</a>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section: Copyright & Legal */}
        <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground text-center md:text-left">
            © {new Date().getFullYear()} <strong>Matestay Private Limited</strong>. All rights reserved. <br />
                <div className="flex flex-row gap-1">
                   <a href="mailto:shashankmuz3@gmail.com" className="hover:text-primary transition-colors">shashankmuz3@gmail.com</a>
                </div>
          </p>
          
          
          <div className="flex gap-6 text-sm text-muted-foreground">
            <Link to="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-primary transition-colors">Terms of Service</Link>
            <Link to="/cookies" className="hover:text-primary transition-colors">Cookie Policy</Link>
          </div>
        </div>
        
        <div className="mt-4 text-center">
           <p className="text-xs text-muted-foreground">
             Designed & Built with ❤️ by <span className="font-medium text-primary">Shashank, Sujal & MateStay Team</span>
           </p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;