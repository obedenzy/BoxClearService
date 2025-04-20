import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu, X, User, LogOut } from "lucide-react";

export default function Navbar() {
  const [location] = useLocation();
  const { user, logoutMutation } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  
  const handleLogout = () => {
    logoutMutation.mutate();
  };
  
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  
  return (
    <nav className={`bg-[#003D00] sticky top-0 z-50 transition-shadow ${isScrolled ? 'shadow-md' : ''}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="text-[#FFFFF0] font-bold text-xl font-sans">
                <span className="text-[#00C853]">Box</span>Clear
              </Link>
            </div>
            <div className="hidden md:ml-6 md:flex md:items-center md:space-x-4">
              <NavLink href="/" current={location === "/"}>Home</NavLink>
              <NavLink href="/services" current={location === "/services"}>Services</NavLink>
              <NavLink href="/booking" current={location === "/booking"}>Book Now</NavLink>
              <NavLink href="/about" current={location === "/about"}>About Us</NavLink>
              <NavLink href="/contact" current={location === "/contact"}>Contact</NavLink>
            </div>
          </div>
          
          <div className="hidden md:flex items-center">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="text-[#FFFFF0] hover:text-[#76FF03]">
                    <User className="h-5 w-5 mr-2" />
                    {user.firstName || user.username}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard">Dashboard</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Link href="/lookup-booking" className="text-[#FFFFF0] hover:text-[#76FF03] px-3 py-2 rounded-md text-sm font-medium">
                  Track Booking
                </Link>
                <Link href="/auth" className="text-[#FFFFF0] hover:text-[#76FF03] px-3 py-2 rounded-md text-sm font-medium">
                  Login
                </Link>
                <Link href="/auth" className="bg-[#00C853] hover:bg-[#76FF03] text-white px-4 py-2 rounded-md text-sm font-medium ml-2">
                  Sign Up
                </Link>
              </>
            )}
          </div>
          
          {/* Mobile menu button */}
          <div className="-mr-2 flex items-center md:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-[#FFFFF0] hover:text-[#76FF03]"
              onClick={toggleMenu}
            >
              <span className="sr-only">{isMenuOpen ? 'Close menu' : 'Open menu'}</span>
              {isMenuOpen ? (
                <X className="block h-6 w-6" />
              ) : (
                <Menu className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`md:hidden ${isMenuOpen ? 'block' : 'hidden'}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <MobileNavLink href="/" current={location === "/"} onClick={toggleMenu}>Home</MobileNavLink>
          <MobileNavLink href="/services" current={location === "/services"} onClick={toggleMenu}>Services</MobileNavLink>
          <MobileNavLink href="/booking" current={location === "/booking"} onClick={toggleMenu}>Book Now</MobileNavLink>
          <MobileNavLink href="/about" current={location === "/about"} onClick={toggleMenu}>About Us</MobileNavLink>
          <MobileNavLink href="/contact" current={location === "/contact"} onClick={toggleMenu}>Contact</MobileNavLink>
          
          {user ? (
            <>
              <MobileNavLink href="/dashboard" current={location === "/dashboard"} onClick={toggleMenu}>Dashboard</MobileNavLink>
              <button 
                onClick={() => {
                  handleLogout();
                  toggleMenu();
                }}
                className="text-[#FFFFF0] hover:text-[#76FF03] block px-3 py-2 rounded-md text-base font-medium w-full text-left"
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <MobileNavLink href="/lookup-booking" current={location === "/lookup-booking"} onClick={toggleMenu}>
                Track Booking
              </MobileNavLink>
              <MobileNavLink href="/auth" current={location === "/auth"} onClick={toggleMenu}>Login</MobileNavLink>
              <Link
                href="/auth"
                className="bg-[#00C853] text-white block px-3 py-2 rounded-md text-base font-medium"
                onClick={toggleMenu}
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

function NavLink({ href, current, children }: { href: string; current: boolean; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className={`relative px-3 py-2 rounded-md text-sm font-medium 
      ${current ? 'text-[#76FF03]' : 'text-[#FFFFF0] hover:text-[#76FF03]'}`}
    >
      {children}
      {current && (
        <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#76FF03] rounded-full" />
      )}
    </Link>
  );
}

function MobileNavLink({ href, current, onClick, children }: 
  { href: string; current: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className={`block px-3 py-2 rounded-md text-base font-medium 
      ${current ? 'text-[#76FF03]' : 'text-[#FFFFF0] hover:text-[#76FF03]'}`}
      onClick={onClick}
    >
      {children}
    </Link>
  );
}
