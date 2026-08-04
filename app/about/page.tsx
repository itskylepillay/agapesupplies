const values = [
  "Integrity",
  "Reliability",
  "Quality",
  "Customer Commitment",
  "Innovation",
  "Professional Service",
];

export default function AboutPage() {
  return (
    <>
      <section className="page-banner about-banner">
        <p className="eyebrow">
          GET TO KNOW US
        </p>

        <h1>
          About Agape Supplies
        </h1>

        <p>
          Dependable workplace solutions
          for businesses across South Africa.
        </p>
      </section>

      <section className="about-content">
        <div className="about-text">
          <p className="section-label">
            ABOUT AGAPE
          </p>

          <h2>
            Your Reliable Industrial
            Supply Partner
          </h2>

          <p>
            Agape Supplies is a South African industrial
            supply company committed to providing businesses
            with dependable workplace solutions.
          </p>

          <p>
            We understand that every organisation requires
            quality products, competitive pricing and
            reliable service to keep operations running
            efficiently.
          </p>

          <p>
            By working with trusted manufacturers and
            suppliers, we offer a broad range of industrial
            products designed to support businesses across
            multiple industries.
          </p>

          <p>
            Whether you&apos;re purchasing safety wear,
            storage solutions, road safety equipment,
            warehouse products or waste management systems,
            our focus is on delivering value, reliability
            and long-term partnerships.
          </p>
        </div>

        <div className="about-highlight">
          <div>
            <span>✓</span>

            <h3>
              Quality Products
            </h3>

            <p>
              Sourced from trusted suppliers.
            </p>
          </div>

          <div>
            <span>✓</span>

            <h3>
              Reliable Service
            </h3>

            <p>
              Support you can depend on.
            </p>
          </div>

          <div>
            <span>✓</span>

            <h3>
              Long-Term Partnerships
            </h3>

            <p>
              Built around customer commitment.
            </p>
          </div>
        </div>
      </section>

      <section className="vision-mission">
        <article>
          <div className="large-icon">
            👁
          </div>

          <p className="section-label">
            OUR VISION
          </p>

          <h2>
            Building Trust Across
            South Africa
          </h2>

          <p>
            To become one of South Africa&apos;s most
            trusted industrial supply companies by
            delivering innovative solutions and
            exceptional customer service.
          </p>
        </article>

        <article>
          <div className="large-icon">
            🎯
          </div>

          <p className="section-label">
            OUR MISSION
          </p>

          <h2>
            Simplifying Procurement
          </h2>

          <p>
            To simplify procurement by providing
            businesses with quality products through
            one reliable supplier.
          </p>
        </article>
      </section>

      <section className="values-section">
        <div className="section-heading center">
          <p className="section-label">
            WHAT GUIDES US
          </p>

          <h2>
            Our Core Values
          </h2>
        </div>

        <div className="values-grid">
          {values.map((value, index) => (
            <div
              className="value-card"
              key={value}
            >
              <span>
                0{index + 1}
              </span>

              <h3>
                {value}
              </h3>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}