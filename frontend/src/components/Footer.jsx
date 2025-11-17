import { Mail, Phone, MapPin, Instagram, Linkedin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-card border-t border-border py-14 mt-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">

        {/* GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <img src="/Logo.png" width={40} alt="Matestay" />
              <span className="text-xl font-bold">Matestay</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Helping you find roommates and safe living spaces with 
              trust, transparency, and comfort.
            </p>

            {/* Social */}
            <div className="mt-5">
              <h4 className="font-semibold mb-3 text-primary">Follow Us</h4>
              <div className="flex items-center gap-5">
                <a
                  href="https://www.instagram.com/sujalbhatt00"
                  target="_blank"
                  className="hover:text-primary"
                >
                  <Instagram className="h-5 w-5" />
                </a>

                <a
                  href="https://www.linkedin.com/in/sujal-b-139067249/"
                  target="_blank"
                  className="hover:text-primary"
                >
                  <Linkedin className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4 text-primary">Quick Links</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="/about" className="hover:text-primary">About Us</a></li>
              <li><a href="/contact" className="hover:text-primary">Contact</a></li>
              <li><a href="/help" className="hover:text-primary">Help Center</a></li>
              <li><a href="/privacy" className="hover:text-primary">Privacy Policy</a></li>
              <li><a href="/terms" className="hover:text-primary">Terms & Conditions</a></li>
            </ul>
          </div>

          {/* Browse */}
          <div>
            <h4 className="font-semibold mb-4 text-primary">Explore</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="/find-roommates" className="hover:text-primary">Find Roommates</a></li>
              <li><a href="" className="hover:text-primary">Search Properties</a></li>
              <li><a href="/" className="hover:text-primary">Messages</a></li>
            </ul>
          </div>
        </div>

        {/* CONTACT SECTION */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            <span>sujalbhatt500@gmail.com & matestaypvt@gmail.com</span>
          </div>

          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4" />
            <span>+91 8979312715</span>
          </div>

          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            <span>Dehradun, Uttarakhand, India</span>
          </div>
        </div>

        {/* BOTTOM */}
        <div className="border-t border-border mt-10 pt-6 text-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} <strong>Matestay</strong> Private Limited
          </p>
          <p className="text-xs mt-1 text-muted-foreground">
            Designed & Built by <span className="font-semibold text-primary">Matestay team </span>
          </p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
