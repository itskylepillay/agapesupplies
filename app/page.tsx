"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import HeroCarousel from "@/components/HeroCarousel";
import { supabase } from "@/lib/supabase";

type Section = {
  id: number;
  name: string;
  description: string;
  image_url: string;
  created_at: string;
};

export default function Home() {
  const [sections, setSections] = useState<Section[]>([]);
  const [loadingSections, setLoadingSections] = useState(true);

  // =========================================================
  // LOAD FIRST 6 SECTIONS FROM SUPABASE
  // =========================================================

  useEffect(() => {
    async function loadSections() {
      const { data, error } = await supabase
        .from("sections")
        .select("*")
        .order("name", { ascending: true })
        .limit(6);

      if (error) {
        console.error(
          "Could not load homepage sections:",
          error
        );

        setSections([]);
      } else {
        setSections(data || []);
      }

      setLoadingSections(false);
    }

    loadSections();
  }, []);

  return (
    <>
      {/* =====================================================
          HERO
      ====================================================== */}

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
            <Link
              href="/quote"
              className="primary-button"
            >
              Request a Quote
            </Link>

            <Link
              href="/products"
              className="secondary-button"
            >
              Explore Products
            </Link>
          </div>
        </div>

        <div className="hero-card">
          <div className="hero-image-container">
            <HeroCarousel />
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

      {/* =====================================================
          ABOUT
      ====================================================== */}

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

          <Link
            href="/about"
            className="text-link"
          >
            Learn More About Us →
          </Link>
        </div>
      </section>

      {/* =====================================================
          PRODUCTS / SECTIONS PREVIEW
      ====================================================== */}

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

        {/* =================================================
            DYNAMIC SECTIONS
        ================================================== */}

        {loadingSections ? (
          <div className="homepage-sections-loading">
            <div className="homepage-section-spinner"></div>
          </div>
        ) : sections.length > 0 ? (
          <div className="homepage-sections-grid">

            {sections.map((section) => (
              <Link
                href={`/products?section=${section.id}`}
                key={section.id}
                className="homepage-section-card"
              >

                {/* IMAGE */}

                <div className="homepage-section-image">
                  {section.image_url ? (
                    <img
                      src={section.image_url}
                      alt={section.name}
                      className="homepage-section-image-file"
                    />
                  ) : (
                    <div className="homepage-section-letter">
                      {section.name
                        .charAt(0)
                        .toUpperCase()}
                    </div>
                  )}
                </div>

                {/* CONTENT */}

                <div className="homepage-section-content">

                  <h3>
                    {section.name}
                  </h3>

                  <p>
                    {section.description}
                  </p>

                  <span className="homepage-section-link">
                    View Products →
                  </span>

                </div>

              </Link>
            ))}

          </div>
        ) : (
          <div className="homepage-sections-empty">
            <p>
              Product sections will appear here.
            </p>
          </div>
        )}

        <div className="center-button">
          <Link
            href="/products"
            className="primary-button"
          >
            View All Products
          </Link>
        </div>
      </section>

      {/* =====================================================
          WHY CHOOSE AGAPE
      ====================================================== */}

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

      {/* =====================================================
          CTA
      ====================================================== */}

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

      {/* =====================================================
          HOMEPAGE DYNAMIC SECTION STYLES
      ====================================================== */}

      <style jsx>{`

        /* =====================================================
           HERO CAROUSEL
        ====================================================== */

        .hero-image-container {
          border: none !important;
          outline: none !important;
          box-shadow: none !important;
        }

        .hero-image-container :global(*) {
          outline: none !important;
        }

        .hero-image-container :global(img) {
          border: none !important;
          outline: none !important;
        }


        /* =====================================================
           SECTION GRID
        ====================================================== */

        .homepage-sections-grid {
          width: 100%;
          display: grid;
          grid-template-columns: repeat(
            3,
            minmax(0, 1fr)
          );
          gap: 20px;
          margin-top: 35px;
        }


        /* =====================================================
           SECTION CARD

           Completely separate from your old
           .product-card styles.
        ====================================================== */

        .homepage-section-card {
          width: 100%;
          min-width: 0;
          display: flex;
          flex-direction: column;

          background: #ffffff;

          border: 1px solid #d9e0e8;

          text-decoration: none;
          color: inherit;

          overflow: hidden;

          transition:
            transform 0.25s ease,
            box-shadow 0.25s ease,
            border-color 0.25s ease;
        }

        .homepage-section-card:hover {
          transform: translateY(-4px);

          border-color: #c5d1df;

          box-shadow:
            0 12px 30px rgba(24, 50, 80, 0.08);
        }


        /* =====================================================
           IMAGE AREA

           Every image gets the EXACT SAME box.
        ====================================================== */

        .homepage-section-image {
          width: 100%;
          height: 175px;

          flex-shrink: 0;

          display: flex;
          align-items: center;
          justify-content: center;

          background: #ffffff;

          overflow: hidden;

          padding: 12px 20px;
        }


        /* =====================================================
           ACTUAL SECTION IMAGE

           IMPORTANT:
           max-width/max-height prevents the uploaded
           image from taking over the card.
        ====================================================== */

        .homepage-section-image-file {
          display: block;

          width: auto !important;
          height: auto !important;

          max-width: 88% !important;
          max-height: 145px !important;

          object-fit: contain !important;
          object-position: center !important;

          margin: 0 auto !important;

          border: none !important;
          outline: none !important;

          transition:
            transform 0.3s ease;
        }

        .homepage-section-card:hover
        .homepage-section-image-file {
          transform: scale(1.03);
        }


        /* =====================================================
           FALLBACK LETTER
        ====================================================== */

        .homepage-section-letter {
          width: 75px;
          height: 75px;

          display: flex;
          align-items: center;
          justify-content: center;

          border-radius: 14px;

          background: #edf3fb;

          color: #24549a;

          font-size: 30px;
          font-weight: 800;
        }


        /* =====================================================
           SECTION CONTENT
        ====================================================== */

        .homepage-section-content {
          padding: 0 24px 24px;
        }


        .homepage-section-content h3 {
          margin: 0;

          color: #172b4d;

          font-size: 21px;

          line-height: 1.3;

          font-weight: 500;

          letter-spacing: -0.3px;
        }


        .homepage-section-content p {
          margin: 16px 0 0;

          color: #52647a;

          font-size: 14px;

          line-height: 1.7;
        }


        /* =====================================================
           VIEW PRODUCTS
        ====================================================== */

        .homepage-section-link {
          display: inline-block;

          margin-top: 18px;

          color: #24549a;

          font-size: 12px;

          font-weight: 700;
        }


        /* =====================================================
           LOADING
        ====================================================== */

        .homepage-sections-loading {
          width: 100%;

          min-height: 220px;

          display: flex;

          align-items: center;

          justify-content: center;
        }


        .homepage-section-spinner {
          width: 28px;
          height: 28px;

          border: 3px solid #e5eaf1;

          border-top-color: #24549a;

          border-radius: 50%;

          animation:
            homepageSpin 0.8s linear infinite;
        }


        /* =====================================================
           EMPTY
        ====================================================== */

        .homepage-sections-empty {
          width: 100%;

          padding: 50px 20px;

          text-align: center;

          color: #718096;

          font-size: 13px;
        }


        /* =====================================================
           ANIMATION
        ====================================================== */

        @keyframes homepageSpin {
          to {
            transform: rotate(360deg);
          }
        }


        /* =====================================================
           TABLET
        ====================================================== */

        @media (max-width: 950px) {

          .homepage-sections-grid {
            grid-template-columns:
              repeat(2, minmax(0, 1fr));
          }

        }


        /* =====================================================
           MOBILE
        ====================================================== */

        @media (max-width: 600px) {

          .homepage-sections-grid {
            grid-template-columns: 1fr;

            gap: 18px;
          }

          .homepage-section-image {
            height: 190px;
          }

          .homepage-section-image-file {
            max-height: 160px !important;
          }

          .homepage-section-content {
            padding: 0 20px 22px;
          }

          .homepage-section-content h3 {
            font-size: 19px;
          }

        }

      `}</style>

    </>
  );
}