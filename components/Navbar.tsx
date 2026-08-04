"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const pathname = usePathname();

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <header className="navbar">
      <div className="nav-container">
       
<Link href="/" className="logo" onClick={closeMenu}>
  <Image
    src="/agape-logo.png"
    alt="Agape Supplies"
    width={230}
    height={100}
    className="agape-logo-image"
    priority
  />
</Link>
        <button
          className="menu-button"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Open navigation menu"
        >
          {menuOpen ? "✕" : "☰"}
        </button>

        <nav className={menuOpen ? "nav-links active" : "nav-links"}>
          <Link
            href="/"
            onClick={closeMenu}
            className={pathname === "/" ? "active-link" : ""}
          >
            Home
          </Link>

          <Link
            href="/about"
            onClick={closeMenu}
            className={pathname === "/about" ? "active-link" : ""}
          >
            About Us
          </Link>

          <Link
            href="/products"
            onClick={closeMenu}
            className={pathname === "/products" ? "active-link" : ""}
          >
            Products
          </Link>

          <Link
            href="/contact"
            onClick={closeMenu}
            className={pathname === "/contact" ? "active-link" : ""}
          >
            Contact
          </Link>

          <Link
            href="/quote"
            className={`nav-quote ${
              pathname === "/quote" ? "active-quote" : ""
            }`}
            onClick={closeMenu}
          >
            Request a Quote
          </Link>
        </nav>
      </div>
    </header>
  );
}