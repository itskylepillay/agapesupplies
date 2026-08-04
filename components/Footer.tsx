import Link from "next/link";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">

        <div className="footer-brand">
          <h2>AGAPE SUPPLIES</h2>

          <p>
            Your trusted end-to-end supply solutions partner.
          </p>

          <p>
            Quality industrial products, dependable service
            and long-term business partnerships.
          </p>
        </div>

        <div className="footer-links">
          <h3>Quick Links</h3>

          <Link href="/">Home</Link>
          <Link href="/about">About Us</Link>
          <Link href="/products">Products</Link>
          <Link href="/contact">Contact</Link>
          <Link href="/quote">Request a Quote</Link>
        </div>

        <div className="footer-contact">
          <h3>Contact Us</h3>

          <p>Phone: 0615986056</p>

          <p>Email: <a href="mailto:kandy@agapesupplies.co.za">kandy@agapesupplies.co.za</a></p>

          <p>
            Monday–Friday
            <br />
            8:00 AM – 5:00 PM
          </p>
        </div>

      </div>

      <div className="footer-bottom">
        <p>
          © {new Date().getFullYear()}  Agape Supplies (Pty) Ltd. All rights reserved.
Designed and Developed by OrcaHalo Studios
        </p>
      </div>
    </footer>
  );
}