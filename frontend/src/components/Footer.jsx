import React from "react";
import { Mail, MapPin, Instagram, Linkedin } from "lucide-react";
import { Link } from "react-router-dom";

const FooterLink = ({ to, children }) => (
  <li>
    <Link
      to={to}
      className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
    >
      {children}
    </Link>
  </li>
);

const ContactItem = ({ Icon, children }) => (
  <li className="flex items-start gap-3 text-sm text-muted-foreground">
    <Icon className="h-5 w-5 text-primary mt-0.5" />
    <div>{children}</div>
  </li>
);

const SocialIcon = ({ href, Icon, title }) => (
  <a
    href={href}
    target="_blank"
    rel="noreferrer"
    title={title}
    className="p-2.5 rounded-xl bg-muted hover:bg-primary hover:text-primary-foreground transition-all duration-200"
  >
    <Icon className="h-5 w-5" />
  </a>
);

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-border bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

          {/* Brand Section */}
          <div className="lg:col-span-5 space-y-5">
            <div className="flex items-center gap-2">
              <img src="/Logo.png" width={40} alt="Logo" />
              <span className="text-xl font-semibold tracking-tight">
                Matestay
              </span>
            </div>

            <p className="text-sm text-muted-foreground max-w-sm leading-relaxed">
              Find roommates easily and safely. We focus on trust, comfort,
              and better shared living experiences.
            </p>

            <div className="flex gap-3 pt-2">
              <SocialIcon
                href="https://www.linkedin.com"
                Icon={Linkedin}
                title="LinkedIn"
              />
              <SocialIcon
                href="https://www.instagram.com"
                Icon={Instagram}
                title="Instagram"
              />
            </div>
          </div>

          {/* Links Section */}
          <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8">

            {/* Company */}
            <div>
              <h4 className="text-sm font-semibold mb-4 text-foreground">
                Company
              </h4>
              <ul className="space-y-3">
                <FooterLink to="/about">About Us</FooterLink>
                <FooterLink to="/contact">Contact</FooterLink>
                <FooterLink to="/careers">Careers</FooterLink>
                <FooterLink to="/blog">Blog</FooterLink>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-sm font-semibold mb-4 text-foreground">
                Contact
              </h4>
              <ul className="space-y-4">
                <ContactItem Icon={MapPin}>
                  Dehradun, Uttarakhand, India
                </ContactItem>

                <ContactItem Icon={Mail}>
                  <a
                    href="mailto:matestaypvt@gmail.com"
                    className="hover:text-foreground transition-colors"
                  >
                    imsujalbhatt2005@gmail.com
                  </a>
                </ContactItem>
              </ul>
            </div>

          </div>
        </div>

        {/* Divider */}
        <div className="h-px w-full bg-border my-8" />

        {/* Bottom */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3 text-sm text-muted-foreground">
          <p>© {currentYear} Matestay</p>
          <p className="text-xs opacity-80">
            Built for safer shared living.
          </p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;