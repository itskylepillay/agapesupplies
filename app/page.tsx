import Link from "next/link";

const products = [
  {
    icon: "/gloves.png",
    title: "Safety Wear",
    description:
      "Quality PPE including safety boots, hard hats, gloves, reflective clothing, eye protection, hearing protection and respiratory equipment.",
  },
  {
    icon: "/road.png",
    title: "Road Safety",
    description:
      "Traffic cones, road signs, barriers, bollards, speed humps, convex mirrors and traffic management solutions.",
  },
  {
    icon: "/safety.png",
    title: "Storage Solutions",
    description:
      "Plastic storage bins, tote boxes, crates, shelving systems and warehouse organisation products.",
  },
  {
    icon: "/locker.png",
    title: "Steel & Plastic Lockers",
    description:
      "Secure storage solutions for schools, offices, factories, gyms and industrial facilities.",
  },
  {
    icon: "/waste.png",
    title: "Waste Management",
    description:
      "Wheelie bins, recycling bins, monkey-proof bins, outdoor litter bins and commercial waste solutions.",
  },
  {
    icon: "/recycle.png",
    title: "Material Handling",
    description:
      "Platform trolleys, pallet trucks, sack trucks, drum handling equipment and warehouse transport solutions.",
  },
];

export default function Home() {
  return (
    <>
      <section className="hero">
        <div className="hero-content">
          <p className="eyebrow">
            AGAPE SUPPLIES (PTY) LTD
          </p>

          <h1>
            Your Trusted
            <span> End-to-End Supply</span>
            Solutions
          </h1>

          <p className="hero-text">
            Dependable industrial products and workplace
            solutions designed to keep your business
            operating efficiently.
          </p>

          <div className="hero-buttons">
            <Link href="/quote" className="primary-button">
              Request a Quote
            </Link>

            <Link href="/products" className="secondary-button">
              Explore Products
            </Link>
          </div>
        </div>

        <div className="hero-card">
          <div className="hero-image-container">
            <img
              src="/safety.jpg"
              alt="Industrial safety products"
              className="hero-image"
            />
          </div>

          <h2>
            Everything Your Workplace Needs
          </h2>

          <p>
            Quality products. Competitive pricing.
            Reliable service.
          </p>
        </div>
      </section>

      <section className="intro-section">
        <div className="section-heading">
          <p className="section-label">
            ABOUT AGAPE
          </p>

          <h2>
            Dependable Supply Solutions
            for Your Business
          </h2>
        </div>

        <div className="intro-content">
          <p>
            Agape Supplies is a South African industrial
            supply company committed to providing businesses
            with dependable workplace solutions.
          </p>

          <p>
            By working with trusted manufacturers and
            suppliers, we offer a broad range of industrial
            products designed to support businesses across
            multiple industries.
          </p>

          <Link href="/about" className="text-link">
            Learn More About Us →
          </Link>
        </div>
      </section>

      <section className="products-preview">
        <div className="section-heading center">
          <p className="section-label">
            OUR PRODUCTS
          </p>

          <h2>
            Everything Your Workplace Needs
          </h2>

          <p>
            A comprehensive range of dependable
            industrial products.
          </p>
        </div>

        <div className="product-grid">
          {products.map((product) => (
            <article
              className="product-card"
              key={product.title}
            >
              <div className="product-icon">
                <img
                  src={product.icon}
                  alt={product.title}
                  className="product-icon-image"
                />
              </div>

              <h3>
                {product.title}
              </h3>

              <p>
                {product.description}
              </p>
            </article>
          ))}
        </div>

        <div className="center-button">
          <Link
            href="/products"
            className="primary-button"
          >
            View All Products
          </Link>
        </div>
      </section>

      <section className="why-section">
        <div className="section-heading">
          <p className="section-label">
            WHY CHOOSE AGAPE
          </p>

          <h2>
            A Reliable Partner
            for Your Business
          </h2>
        </div>

        <div className="why-grid">
          <div className="why-card">
            <span>01</span>

            <h3>
              Quality Products
            </h3>

            <p>
              Products sourced from trusted
              manufacturers and suppliers.
            </p>
          </div>

          <div className="why-card">
            <span>02</span>

            <h3>
              Competitive Pricing
            </h3>

            <p>
              Dependable supply solutions
              designed to provide value.
            </p>
          </div>

          <div className="why-card">
            <span>03</span>

            <h3>
              Professional Service
            </h3>

            <p>
              Reliable support focused on
              long-term customer partnerships.
            </p>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div>
          <p className="section-label">
            LET&apos;S WORK TOGETHER
          </p>

          <h2>
            Looking for Quality
            Industrial Products?
          </h2>

          <p>
            Contact our team for quotations,
            product sourcing and bulk supply enquiries.
          </p>
        </div>

        <Link
          href="/quote"
          className="light-button"
        >
          Request a Quote
        </Link>
      </section>
    </>
  );
}