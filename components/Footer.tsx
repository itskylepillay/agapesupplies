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
            Agape is more than a word,<br></br>its how we serve.<br></br><br></br> FAITH-DRIVEN<br></br>SERVICE-FOCUSED<br></br>SOLUTIONS THAT DELIVER.
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
          © {new Date().getFullYear()} Agape Supplies (Pty) Ltd. All rights reserved. {" "}
        
          <a
            href="https://www.google.com/search?client=ms-android-vivo-rvo3&hs=QI3&sca_esv=1e85827d6e1fa685&hl=en-ZA&cs=1&sxsrf=APpeQnskjX-QZuWM8cubL71ZKTWFIt6CSg%3A1785875380345&kgmid=%2Fg%2F11yyvywlv9&q=OrcaHalo%20Studios&shem=epsd1%2Cltae%2Crimspwouoe&shndl=30&source=sh%2Fx%2Floc%2Fact%2Fm1%2F4&kgs=42a572d2d7a35e7f"
            target="_blank"
            rel="noopener noreferrer"
            className="orcahalo-link"
          >
              Designed and Developed by OrcaHalo Studios
          </a>
        </p>
      </div>
    </footer>
  );
}