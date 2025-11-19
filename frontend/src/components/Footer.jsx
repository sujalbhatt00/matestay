import React from 'react';
import { Mail, Phone, MapPin, Instagram, Linkedin } from "lucide-react";
import { Link } from 'react-router-dom';

const FooterLink = ({ to, children }) => (
  <li>
    <Link to={to} className="hover:text-primary transition-colors">
      {children}
    </Link>
  </li>
);

const ContactItem = ({ Icon, children }) => (
  <li className="flex items-start gap-3">
    <Icon className="h-5 w-5 text-primary mt-0.5" />
    <div className="flex flex-col gap-1">
      {children}
    </div>
  </li>
);

const SocialIcon = ({ href, Icon, title }) => (
  <a 
    href={href} 
    target="_blank" 
    rel="noreferrer"
    title={title}
    className="p-2 rounded-lg bg-muted hover:bg-primary hover:text-primary-foreground transition-colors"
  >
    <Icon className="h-5 w-5" />
  </a>
);

const TeamSocials = ({ name, linkedin, instagram }) => (
  <div className="flex items-center justify-between w-full border border-border py-2 px-3 rounded-lg hover:bg-muted/50 transition">
    <span className="font-medium text-sm text-foreground">{name}</span>
    <div className="flex items-center gap-3">
      <SocialIcon href={linkedin.href} Icon={Linkedin} title={linkedin.title} />
      <SocialIcon href={instagram.href} Icon={Instagram} title={instagram.title} />
    </div>
  </div>
);

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const team = {
    sujal: {
      name: "Sujal",
      linkedin: { href: "https://www.linkedin.com/in/sujal-b-139067249/", title: "Sujal on LinkedIn" },
      instagram: { href: "https://www.instagram.com/sujalbhatt00", title: "Sujal on Instagram" },
    },
    shashank: {
      name: "Shashank",
      linkedin: { href: "https://www.linkedin.com/in/shashank-kumar-70742b292/", title: "Shashank on LinkedIn" },
      instagram: { href: "https://www.instagram.com/shashank__.kumar/", title: "Shashank on Instagram" },
    },
  };

  const emails = [
    { href: "mailto:matestaypvt@gmail.com", label: "matestaypvt@gmail.com" },
    { href: "mailto:shashankmuz3@gmail.com", label: "shashankmuz3@gmail.com" },
    { href: "mailto:sujalbhatt500@gmail.com", label: "sujalbhatt500@gmail.com" },
  ];

  const phones = [
    { number: "+91 8979312715" },
    { number: "+91 9304923385" },
  ];

  return (
    <footer className="bg-card border-t border-border pt-16 pb-8 mt-auto">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">

        {/* TOP GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">

          {/* BRAND */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <img src="/Logo.png" width={42} alt="Logo" />
              <span className="text-2xl font-semibold tracking-tight text-foreground">Matestay</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Making roommate finding simple, safe, and trustworthy.  
              Your comfort and safety are our priority.
            </p>
          </div>

          {/* COMPANY LINKS */}
          <div>
            <h4 className="font-semibold mb-4 text-foreground">Company</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <FooterLink to="/about">About Us</FooterLink>
              <FooterLink to="/contact">Contact Support</FooterLink>
              <FooterLink to="/careers">Careers</FooterLink>
              <FooterLink to="/blog">Blog</FooterLink>
            </ul>
          </div>

          {/* TEAM */}
          <div>
            <h4 className="font-semibold mb-4 text-foreground">Founding Team</h4>
            <div className="space-y-3">
              <TeamSocials {...team.sujal} />
              <TeamSocials {...team.shashank} />
            </div>
          </div>

          {/* CONTACT */}
          <div>
            <h4 className="font-semibold mb-4 text-foreground">Contact</h4>
            <ul className="space-y-4 text-sm text-muted-foreground">

              <ContactItem Icon={MapPin}>
                <span>Dehradun, Uttarakhand, India</span>
              </ContactItem>

              <ContactItem Icon={Phone}>
                {phones.map((p, i) => <span key={i}>{p.number}</span>)}
              </ContactItem>

              <ContactItem Icon={Mail}>
                {emails.map((m, i) => (
                  <a key={i} href={m.href} className="hover:text-primary transition-colors">
                    {m.label}
                  </a>
                ))}
              </ContactItem>

            </ul>
          </div>
        </div>


        {/* SEPARATOR */}
        <div className="border-t border-border mb-6"></div>

        {/* BOTTOM SECTION */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">

          {/* COPYRIGHT */}
          <div className="text-sm text-muted-foreground text-center md:text-left">
            © {currentYear} Matestay Private Limited.  
            <span className="block text-xs mt-1">Designed & Built by Matestay Team</span>
          </div>

          {/* LEGAL LINKS */}
          <div className="flex gap-4 sm:gap-6 text-sm text-muted-foreground">
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
