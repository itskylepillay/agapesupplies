import Link from "next/link";

const products = [
  {
    icon: "🦺",
    title: "Safety Wear",
    description:
      "Protect your workforce with quality PPE including safety boots, hard hats, gloves, reflective clothing, eye protection, hearing protection and respiratory equipment.",
  },
  {
    icon: "🚧",
    title: "Road Safety",
    description:
      "Traffic cones, road signs, barriers, bollards, speed humps, convex mirrors and traffic management solutions.",
  },
  {
    icon: "📦",
    title: "Storage Solutions",
    description:
      "Plastic storage bins, tote boxes, crates, shelving systems, warehouse storage and organisation products.",
  },
  {
    icon: "🔐",
    title: "Steel & Plastic Lockers",
    description:
      "Secure storage solutions for schools, offices, factories, gyms and industrial facilities.",
  },
  {
    icon: "♻️",
    title: "Waste Management",
    description:
      "Wheelie bins, recycling bins, monkey-proof bins, outdoor litter bins and commercial waste solutions.",
  },
  {
    icon: "🛒",
    title: "Material Handling Equipment",
    description:
      "Platform trolleys, pallet trucks, sack trucks, drum handling equipment and warehouse transport solutions.",
  },
  {
    icon: "🌳",
    title: "Facility & Outdoor Products",
    description:
      "Garden tools, benches, outdoor furniture, maintenance equipment and public facility products.",
  },
  {
    icon: "⚙️",
    title: "General Industrial Supplies",
    description:
      "A comprehensive range of industrial products sourced from trusted manufacturers to meet your operational requirements.",
  },
];

export default function ProductsPage() {
  return (
    <>
      <section className="page-banner">
        <p className="eyebrow">
          OUR PRODUCT RANGE
        </p>

        <h1>
          Everything Your
          Workplace Needs
        </h1>

        <p>
          Quality industrial products sourced
          from trusted manufacturers.
        </p>
      </section>

      <section className="products-page">
        <div className="section-heading center">
          <p className="section-label">
            COMPLETE SUPPLY SOLUTIONS
          </p>

          <h2>
            Products for Every
            Workplace
          </h2>

          <p>
            Explore our range of dependable
            industrial supply solutions.
          </p>
        </div>

        <div className="product-grid full">
          {products.map((product) => (
            <article
              className="product-card"
              key={product.title}
            >
              <div className="product-icon">
                {product.icon}
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
      </section>

      <section className="product-cta">
        <h2>
          Can&apos;t Find What You Need?
        </h2>

        <p>
          Contact us for product sourcing
          and bulk supply enquiries.
        </p>

        <Link
          href="/quote"
          className="primary-button"
        >
          Request a Quote
        </Link>
      </section>
    </>
  );
}