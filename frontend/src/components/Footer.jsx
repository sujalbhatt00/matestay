import React from 'react';
import { Mail, Phone, MapPin, Instagram, Linkedin, Facebook } from "lucide-react";
import { Link } from 'react-router-dom';

// Utility component for list items to reduce repetition
const FooterLink = ({ to, children }) => (
  <li>
    <Link to={to} className="hover:text-primary transition-colors">
      {children}
    </Link>
  </li>
);

// Utility component for Contact Info items
const ContactItem = ({ Icon, children, className = "" }) => (
  <li className={`flex items-start gap-3 ${className}`}>
    <Icon className="h-5 w-5 text-primary shrink-0 mt-0.5" />
    <div className="flex flex-col gap-1">
      {children}
    </div>
  </li>
);

// New Utility component for Social Icons (used in the team links)
const SocialIcon = ({ href, Icon, title }) => (
  <a 
    href={href} 
    target="_blank" 
    rel="noreferrer" 
    className="text-muted-foreground hover:text-primary transition-colors" 
    title={title}
  >
    <Icon className="h-5 w-5" />
  </a>
);

// New Utility component for the Team link rows
const TeamSocials = ({ name, linkedin, instagram }) => (
    <div className="flex items-center gap-3">
        <span className="text-sm font-medium text-muted-foreground w-20 shrink-0">{name}:</span>
        <SocialIcon href={linkedin.href} Icon={Linkedin} title={linkedin.title} />
        <SocialIcon href={instagram.href} Icon={Instagram} title={instagram.title} />
    </div>
);


const Footer = () => {
  const currentYear = new Date().getFullYear();

  // Consolidated Team Social Links
  const teamSocials = {
    sujal: {
      name: "Sujal",
      linkedin: { href: "https://www.linkedin.com/in/sujal-b-139067249/", title: "Sujal on LinkedIn" },
      instagram: { href: "https://www.instagram.com/sujalbhatt00", title: "Sujal on Instagram" },
    },
    shashank: {
      name: "Shashank",
      linkedin: { href: "https://www.linkedin.com/in/shashank-kumar-70742b292/", title: "Shashank on LinkedIn" },
      instagram: { href: "https://www.instagram.com/shashank__.kumar/", title: "Shashank on Instagram" },
    }
  };

  // General Company Social Links (using new array for the 'Follow Us' section)
  const companySocials = [
    // Add company-level links here (e.g., Facebook/general LinkedIn)
    // { href: "https://facebook.com/matestay", Icon: Facebook, title: "Matestay on Facebook" },
    // You might add the main founder/company links here if they are not personal:
    // { href: teamSocials.sujal.linkedin.href, Icon: Linkedin, title: "Sujal's LinkedIn" },
  ];

  // Consolidated Email list
  const emails = [
    { href: "mailto:matestaypvt@gmail.com", label: "matestaypvt@gmail.com" },
    { href: "mailto:shashankmuz3@gmail.com", label: "shashankmuz3@gmail.com" },
    { href: "mailto:sujalbhatt500@gmail.com", label: "sujalbhatt500@gmail.com" },
  ];

  // Consolidated Phone list
  const phones = [
    { number: "+91 8979312715" },
    { number: "+91 9304923385" },
  ];

  return (
    <footer className="bg-card border-t border-border pt-16 pb-8 mt-auto">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">

        {/* Top Section: Brand, Navigation, Team Socials, Contact (4 columns) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">

          {/* 1. Brand & Mission Column */}
          <div className="col-span-1 lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <img src="/Logo.png" width={40} alt="Matestay Logo" />
              <span className="text-2xl font-bold tracking-tight text-foreground">Matestay</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed mb-6">
              Connecting you with the perfect roommates and safe living spaces. Trust, transparency, and comfort are at our core.
            </p>
          </div>

          {/* 2. Quick Links (Company) */}
          <div>
            <h4 className="font-semibold mb-4 text-foreground">Company</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <FooterLink to="/about">About Us</FooterLink>
              <FooterLink to="/contact">Contact Support</FooterLink>
              <FooterLink to="/careers">Careers</FooterLink>
              <FooterLink to="/blog">Blog</FooterLink>
            </ul>
          </div>
          
          {/* 3. Team Socials (New Column) */}
          <div>
            <h4 className="font-semibold mb-4 text-foreground">Meet the Team</h4>
            <div className="space-y-3 text-sm text-muted-foreground">
                {/* Sujal's links */}
                <TeamSocials 
                    name={teamSocials.sujal.name} 
                    linkedin={teamSocials.sujal.linkedin} 
                    instagram={teamSocials.sujal.instagram} 
                />
                {/* Shashank's links */}
                <TeamSocials 
                    name={teamSocials.shashank.name} 
                    linkedin={teamSocials.shashank.linkedin} 
                    instagram={teamSocials.shashank.instagram} 
                />
            </div>
          </div>

          {/* 4. Contact Info */}
          <div>
            <h4 className="font-semibold mb-4 text-foreground">Contact</h4>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <ContactItem Icon={MapPin}>
                <span>Dehradun, Uttarakhand, India</span>
              </ContactItem>

              <ContactItem Icon={Phone}>
                {phones.map((phone, index) => (
                  <span key={index}>{phone.number}</span>
                ))}
              </ContactItem>

              <ContactItem Icon={Mail}>
                {emails.map((mail, index) => (
                  <a key={index} href={mail.href} className="hover:text-primary transition-colors">
                    {mail.label}
                  </a>
                ))}
              </ContactItem>
            </ul>
          </div>
        </div>

        {/* --- Separator --- */}
        <div className="border-t border-border pt-8"></div>


        {/* Bottom Section: Copyright & Legal Links */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mt-6">
            
            {/* Copyright / Design Note */}
            <div className="flex flex-col items-start gap-2 text-sm text-muted-foreground text-center md:text-left">
                <p>
                    © {currentYear} **Matestay Private Limited**. All rights reserved.
                </p>
                <p className="text-xs">
                    Designed & Built by <span className="font-medium text-primary">MateStay Team</span>
                </p>
            </div>


            {/* Legal Links (moved up) */}
            <div className="flex gap-4 sm:gap-6 text-sm text-muted-foreground order-last md:order-none">
                <FooterLink to="/privacy">Privacy Policy</FooterLink>
                <FooterLink to="/terms">Terms of Service</FooterLink>
                <FooterLink to="/cookies">Cookie Policy</FooterLink>
            </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;