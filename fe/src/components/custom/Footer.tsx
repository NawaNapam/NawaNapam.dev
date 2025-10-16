import Image from "next/image";

export default function Footer() {
  return (
    <footer className="border-t border-border/5 py-12 sm:py-16 mt-20 sm:mt-24 bg-gradient-to-b from-background via-background/95 to-background/90 backdrop-blur-md">
      <div className="container px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row gap-10 sm:gap-16 lg:gap-20">
          {/* Brand Section */}
          <div className="w-full sm:w-[320px] lg:w-[360px]">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-border/5 shadow-lg">
                <Image
                  src="/images/logo.jpg"
                  alt="Nawa Napam Logo"
                  width={40}
                  height={40}
                  className="object-cover w-full h-full"
                />
              </div>
              <h4 className="vfont text-xl font-semibold bg-gradient-to-r from-rose-500 via-pink-500 to-rose-500 bg-clip-text text-transparent">
                Nawa Napam
              </h4>
            </div>
            <p className="text-muted-foreground/90 text-sm leading-relaxed">
              A romantic space to meet, match and chat in a safe and vibrant
              community where hearts connect and relationships bloom.
            </p>
          </div>

          {/* Navigation & Contact Section */}
          <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 gap-8 sm:gap-12">
            <nav>
              <h5 className="font-semibold text-base text-foreground mb-4">
                Quick Links
              </h5>
              <ul className="space-y-2.5">
                <li>
                  <a
                    href="#"
                    className="text-sm text-muted-foreground hover:text-primary transition-all duration-200 inline-flex items-center hover:translate-x-1"
                  >
                    Safety Guidelines
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-sm text-muted-foreground hover:text-primary transition-all duration-200 inline-flex items-center hover:translate-x-1"
                  >
                    Premium Features
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-sm text-muted-foreground hover:text-primary transition-all duration-200 inline-flex items-center hover:translate-x-1"
                  >
                    Support Center
                  </a>
                </li>
              </ul>
            </nav>

            <nav>
              <h5 className="font-semibold text-base text-foreground mb-4">
                Legal
              </h5>
              <ul className="space-y-2.5">
                <li>
                  <a
                    href="#"
                    className="text-sm text-muted-foreground hover:text-primary transition-all duration-200 inline-flex items-center hover:translate-x-1"
                  >
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-sm text-muted-foreground hover:text-primary transition-all duration-200 inline-flex items-center hover:translate-x-1"
                  >
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-sm text-muted-foreground hover:text-primary transition-all duration-200 inline-flex items-center hover:translate-x-1"
                  >
                    Cookie Policy
                  </a>
                </li>
              </ul>
            </nav>

            <div>
              <h5 className="font-semibold text-base text-foreground mb-4">
                Contact Us
              </h5>
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Have questions? We&apos;re here to help you find love.
                </p>
                <a
                  href="mailto:support@nawanapam.com"
                  className="text-sm text-primary hover:text-primary/90 transition-all duration-200 inline-flex items-center hover:translate-x-1"
                >
                  support@nawanapam.com
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-8 border-t border-border/5 text-center">
          <p className="text-sm text-muted-foreground/75">
            © {new Date().getFullYear()} Nawa Napam. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
