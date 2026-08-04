export default function QuotePage() {
  const email = "kandy@agapesupplies.co.za";

  const emailSubject =
    "Request for a Quote - Agape Supplies";

  const emailBody = `Hello Agape Supplies,

I would like to request a quotation.

Company Name:

Contact Person:

Phone Number:

Email Address:

Product Required:

Quantity:

Delivery Address:

Additional Information:

Thank you.`;

  const whatsappNumber =
  "27615986056";

  const whatsappMessage = `Hello Agape Supplies, I would like to request a quotation.

`;

  return (
    <>
      <section className="page-banner">
        <p className="eyebrow">
          REQUEST A QUOTE
        </p>

        <h1>
          Let&apos;s Find the Right
          Solution for You
        </h1>

        <p>
          Contact our team for a competitive
          quotation.
        </p>
      </section>

      <section className="quote-section">
        <div className="quote-intro">
          <p className="section-label">
            GET STARTED
          </p>

          <h2>
            Looking for Quality
            Industrial Products?
          </h2>

          <p>
            Choose your preferred contact method.
            Our team is ready to assist with
            quotations, product sourcing and
            bulk supply enquiries.
          </p>

          <div className="quote-details">
            <div>
              <span>✓</span>
              Competitive quotations
            </div>

            <div>
              <span>✓</span>
              Product sourcing
            </div>

            <div>
              <span>✓</span>
              Bulk supply enquiries
            </div>
          </div>
        </div>

        <div className="quote-options">
          <div className="quote-option">
            <div className="quote-icon">
              ✉
            </div>

            <h3>
              Request via Email
            </h3>

            <p>
              Send us your product requirements
              and our team will respond with a
              competitive quotation.
            </p>

            <a
              href={`mailto:${email}?subject=${encodeURIComponent(
                emailSubject
              )}&body=${encodeURIComponent(
                emailBody
              )}`}
              className="primary-button full-button"
            >
              Email Us
            </a>
          </div>

          <div className="quote-option">
            <div className="quote-icon">
              💬
            </div>

            <h3>
              Request via WhatsApp
            </h3>

            <p>
              Send your quote request directly
              through WhatsApp for quick and
              convenient assistance.
            </p>

            <a
              href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
                whatsappMessage
              )}`}
              target="_blank"
              rel="noreferrer"
              className="whatsapp-button full-button"
            >
              Chat on WhatsApp
            </a>
          </div>
        </div>
      </section>

      <section className="quote-note">
        <h2>
          What Should I Include?
        </h2>

        <p>
          Please provide the product required,
          quantity, company details and delivery
          information so we can prepare an
          accurate quotation.
        </p>
      </section>
    </>
  );
}