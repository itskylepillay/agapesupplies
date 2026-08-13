"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

type Section = {
  id: number;
  name: string;
  image_url: string | null;
};

type Product = {
  id: number;
  name: string;
  description: string;
  image_url: string;
  section_id: number;
};

export default function ProductsPage() {
  const [sections, setSections] = useState<Section[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedSection, setSelectedSection] =
    useState<Section | null>(null);

  const [loading, setLoading] = useState(true);

  // =========================================================
  // LOAD SECTIONS + PRODUCTS
  // =========================================================

  useEffect(() => {
    loadProductsAndSections();
  }, []);

  async function loadProductsAndSections() {
    setLoading(true);

    // -------------------------------------------------------
    // LOAD SECTIONS
    // -------------------------------------------------------

  const {
  data: sectionData,
  error: sectionError,
} = await supabase
  .from("sections")
  .select("id, name, image_url")
  .order("name", { ascending: true });

    if (sectionError) {
      console.error(
        "Sections error:",
        sectionError
      );
    } else {
      setSections(sectionData || []);
    }

    // -------------------------------------------------------
    // LOAD PRODUCTS
    // -------------------------------------------------------

    const {
      data: productData,
      error: productError,
    } = await supabase
      .from("products")
      .select(
        "id, name, description, image_url, section_id"
      )
      .order("id", { ascending: false });

    if (productError) {
      console.error(
        "Products error:",
        productError
      );
    } else {
      setProducts(productData || []);
    }

    setLoading(false);
  }

  // =========================================================
  // GET PRODUCTS FOR SELECTED SECTION
  // =========================================================

  function getProductsForSection(
    sectionId: number
  ) {
    return products.filter(
      (product) =>
        product.section_id === sectionId
    );
  }

  // =========================================================
  // SECTION ICONS
  // =========================================================

  function getSectionIcon(sectionName: string) {
    const name = sectionName.toLowerCase();

    if (
      name.includes("safety wear") ||
      name.includes("ppe") ||
      name.includes("protective")
    ) {
      return "🦺";
    }

    if (
      name.includes("road safety") ||
      name.includes("traffic")
    ) {
      return "🚧";
    }

    if (
      name.includes("storage")
    ) {
      return "📦";
    }

    if (
      name.includes("locker")
    ) {
      return "🔐";
    }

    if (
      name.includes("waste") ||
      name.includes("recycling")
    ) {
      return "♻️";
    }

    if (
      name.includes("handling") ||
      name.includes("material")
    ) {
      return "🛒";
    }

    if (
      name.includes("facility") ||
      name.includes("outdoor") ||
      name.includes("garden")
    ) {
      return "🌳";
    }

    if (
      name.includes("industrial")
    ) {
      return "⚙️";
    }

    // Default icon for new sections
    return "📦";
  }

  // =========================================================
  // OPEN SECTION
  // =========================================================

  function openSection(section: Section) {
    setSelectedSection(section);

    // Scroll back to the top of the products area
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  // =========================================================
  // BACK TO SECTIONS
  // =========================================================

  function backToSections() {
    setSelectedSection(null);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  // =========================================================
  // SELECTED SECTION PRODUCTS
  // =========================================================

  const selectedProducts = selectedSection
    ? getProductsForSection(
        selectedSection.id
      )
    : [];

  // =========================================================
  // PAGE
  // =========================================================

  return (
    <>
      {/* =====================================================
          SECTION VIEW
          THIS IS WHAT THE USER SEES FIRST
      ====================================================== */}

      {!selectedSection && (
        <>
          {/* =================================================
              PAGE BANNER
          ================================================== */}

          <section className="page-banner products-banner">
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

          {/* =================================================
              SECTIONS
          ================================================== */}

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
                Choose a product category to
                explore our range.
              </p>

            </div>

            {/* =================================================
                LOADING
            ================================================== */}

            {loading && (
              <div className="products-loading">
                <p>
                  Loading product categories...
                </p>
              </div>
            )}

            {/* =================================================
                NO SECTIONS
            ================================================== */}

            {!loading &&
              sections.length === 0 && (
                <div className="products-empty">

                  <h3>
                    Products Coming Soon
                  </h3>

                  <p>
                    We are currently updating
                    our product catalogue.
                  </p>

                </div>
              )}

            {/* =================================================
                SECTION GRID
            ================================================== */}

            {!loading &&
              sections.length > 0 && (

                <div className="sections-grid">

                  {sections.map((section) => (
                    <button
                      key={section.id}
                      type="button"
                      className="section-card"
                      onClick={() =>
                        openSection(section)
                      }
                    >

                     <div className="section-icon">
  {section.image_url ? (
    <img
      src={section.image_url}
      alt={section.name}
    />
  ) : (
    getSectionIcon(section.name)
  )}
</div>

                      <h3>
                        {section.name}
                      </h3>

                      <p>
                        Explore our range of{" "}
                        {section.name.toLowerCase()}{" "}
                        products.
                      </p>

                      <span className="section-arrow">
                        View Products →
                      </span>

                    </button>
                  ))}

                </div>
              )}

          </section>

          {/* =================================================
              CTA
          ================================================== */}

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
      )}

      {/* =====================================================
          SELECTED SECTION VIEW

          EVERYTHING ABOVE DISAPPEARS WHEN A SECTION IS OPENED
      ====================================================== */}

      {selectedSection && (
        <section className="selected-section-page">

          {/* =================================================
              BACK BUTTON
          ================================================== */}

          <button
            type="button"
            className="back-button"
            onClick={backToSections}
          >
            ← Back to All Sections
          </button>

          {/* =================================================
              SECTION HEADER
          ================================================== */}

          <div className="selected-section-header">

            <div className="selected-section-icon">
              {getSectionIcon(
                selectedSection.name
              )}
            </div>

            <div>

              <p className="section-label">
                PRODUCT CATEGORY
              </p>

              <h1>
                {selectedSection.name}
              </h1>

              <p>
                Explore our available products
                in this category.
              </p>

            </div>

          </div>

          {/* =================================================
              PRODUCTS
          ================================================== */}

          {selectedProducts.length === 0 ? (

            <div className="no-products">

              <div className="no-products-icon">
                📦
              </div>

              <h2>
                No Products Available Yet
              </h2>

              <p>
                There are currently no products
                available in this section.
              </p>

              <button
                type="button"
                onClick={backToSections}
                className="back-products-button"
              >
                Back to Sections
              </button>

            </div>

          ) : (

            <div className="product-grid">

              {selectedProducts.map(
                (product) => (

                  <article
                    className="product-card"
                    key={product.id}
                  >

                    {/* PRODUCT IMAGE */}

                    <div className="product-image">

                      {product.image_url ? (

                        <img
                          src={
                            product.image_url
                          }
                          alt={
                            product.name
                          }
                        />

                      ) : (

                        <div className="no-image">
                          No Image
                        </div>

                      )}

                    </div>

                    {/* PRODUCT INFORMATION */}

                    <div className="product-content">

                      <h3>
                        {product.name}
                      </h3>

                      <p>
                        {product.description}
                      </p>

                    </div>

                  </article>

                )
              )}

            </div>

          )}

        </section>
      )}

      {/* =====================================================
          PAGE-SPECIFIC STYLES
      ====================================================== */}

      <style jsx>{`

        /* =====================================================
           SECTION GRID
        ====================================================== */

        .sections-grid {
          display: grid;
          grid-template-columns:
            repeat(
              auto-fill,
              minmax(260px, 1fr)
            );
          gap: 25px;
          margin-top: 55px;
        }

        /* =====================================================
           SECTION CARD

           ONLY THESE CARDS HAVE A HOVER EFFECT
        ====================================================== */

        .section-card {
          position: relative;
          min-height: 280px;
          padding: 35px 30px;
          background: white;
          border: 1px solid #dce3eb;
          border-radius: 0;
          text-align: left;
          cursor: pointer;
          font-family: inherit;

          display: flex;
          flex-direction: column;
          align-items: flex-start;

          transition:
            transform 0.25s ease,
            box-shadow 0.25s ease,
            border-color 0.25s ease,
            background 0.25s ease;
        }

        .section-card:hover {
          transform: translateY(-7px);
          border-color: #24549a;
          box-shadow:
            0 15px 35px
            rgba(24, 50, 80, 0.12);
          background: #ffffff;
        }

        .section-card:focus-visible {
          outline: 3px solid
            rgba(36, 84, 154, 0.25);
          outline-offset: 3px;
        }

      .section-icon {
  width: 110px;
  height: 110px;

  display: flex;
  align-items: center;
  justify-content: center;

  margin: 0 auto 28px;

  overflow: hidden;

  transition:
    transform 0.25s ease;
}

.section-icon img {
  width: 100%;
  height: 100%;

  object-fit: cover;
  object-position: center;

  display: block;

  border-radius: 12px;
}
        .section-card:hover
        .section-icon {
          transform: translateY(-3px);
        }

        .section-card h3 {
          margin: 0;

          color: #172b4d;

          font-size: 22px;
          line-height: 1.25;
          font-weight: 500;

          text-align: left;
        }

        .section-card p {
          margin: 12px 0 0;

          color: #52647a;

          font-size: 13px;
          line-height: 1.7;

          max-width: 300px;
        }

        .section-arrow {
          margin-top: auto;
          padding-top: 22px;

          color: #24549a;

          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.3px;
        }

        /* =====================================================
           SELECTED SECTION PAGE
        ====================================================== */

        .selected-section-page {
          max-width: 1400px;
          margin: 0 auto;

          padding: 55px 35px 90px;

          min-height: 70vh;
        }

        /* =====================================================
           BACK BUTTON
        ====================================================== */

        .back-button {
          border: none;
          background: transparent;

          padding: 0;
          margin-bottom: 45px;

          color: #24549a;

          font-family: inherit;
          font-size: 13px;
          font-weight: 700;

          cursor: pointer;

          transition:
            color 0.2s ease;
        }

        .back-button:hover {
          color: #172b4d;
        }

        /* =====================================================
           SELECTED SECTION HEADER
        ====================================================== */

        .selected-section-header {
          display: flex;
          align-items: center;
          gap: 25px;

          margin-bottom: 50px;

          padding-bottom: 30px;

          border-bottom:
            1px solid #e5e9ef;
        }

        .selected-section-icon {
          width: 90px;
          height: 90px;

          flex-shrink: 0;

          display: flex;
          align-items: center;
          justify-content: center;

          background: #f5f8fc;

          font-size: 50px;
        }

        .selected-section-header h1 {
          margin: 0;

          color: #172b4d;

          font-size: 38px;
          line-height: 1.15;

          letter-spacing: -1px;
        }

        .selected-section-header p:last-child {
          margin: 10px 0 0;

          color: #718096;

          font-size: 13px;
          line-height: 1.6;
        }

        /* =====================================================
           PRODUCT GRID
        ====================================================== */

        .product-grid {
          display: grid;

          grid-template-columns:
            repeat(
              auto-fill,
              minmax(250px, 1fr)
            );

          gap: 25px;
        }

        /* =====================================================
           PRODUCT CARD

           IMPORTANT:
           NO HOVER EFFECT HERE.
        ====================================================== */

        .product-card {
          background: white;

          border:
            1px solid #e6eaf0;

          border-radius: 14px;

          overflow: hidden;
        }

        /* No transform */
        /* No box shadow on hover */
        /* No image zoom on hover */

        .product-image {
          width: 100%;
          height: 220px;

          background: #edf1f5;

          overflow: hidden;
        }

        .product-image img {
          width: 100%;
          height: 100%;

          object-fit: cover;

          display: block;
        }

        .product-content {
          padding: 20px;
        }

        .product-content h3 {
          margin: 0;

          color: #172b4d;

          font-size: 17px;
          line-height: 1.3;
        }

        .product-content p {
          margin: 10px 0 0;

          color: #718096;

          font-size: 12px;
          line-height: 1.65;
        }

        /* =====================================================
           NO IMAGE
        ====================================================== */

        .no-image {
          width: 100%;
          height: 100%;

          display: flex;
          align-items: center;
          justify-content: center;

          color: #8995a5;

          font-size: 12px;
        }

        /* =====================================================
           NO PRODUCTS
        ====================================================== */

        .no-products {
          padding: 80px 30px;

          background: white;

          border:
            1px solid #e6eaf0;

          text-align: center;
        }

        .no-products-icon {
          font-size: 40px;
          margin-bottom: 20px;
        }

        .no-products h2 {
          margin: 0;

          color: #172b4d;

          font-size: 22px;
        }

        .no-products p {
          margin: 10px 0 25px;

          color: #718096;

          font-size: 13px;
        }

        .back-products-button {
          border: none;

          background: #24549a;

          color: white;

          padding: 11px 18px;

          border-radius: 8px;

          font-family: inherit;

          font-size: 12px;
          font-weight: 700;

          cursor: pointer;
        }

        /* =====================================================
           LOADING
        ====================================================== */

        .products-loading {
          padding: 70px 20px;

          text-align: center;

          color: #718096;
        }

        /* =====================================================
           EMPTY
        ====================================================== */

        .products-empty {
          padding: 70px 20px;

          text-align: center;

          background: white;

          border:
            1px solid #e6eaf0;

          border-radius: 16px;
        }

        .products-empty h3 {
          margin: 0;

          color: #172b4d;

          font-size: 20px;
        }

        .products-empty p {
          margin-top: 10px;

          color: #718096;

          font-size: 13px;
        }

        /* =====================================================
           RESPONSIVE
        ====================================================== */

        @media (max-width: 900px) {

          .sections-grid {
            grid-template-columns:
              repeat(
                2,
                minmax(0, 1fr)
              );
          }

          .selected-section-page {
            padding:
              45px 25px 70px;
          }

        }

        @media (max-width: 600px) {

          .sections-grid {
            grid-template-columns: 1fr;
            gap: 18px;
          }

          .section-card {
            min-height: 240px;
            padding: 28px 25px;
          }

          .section-icon {
            margin-bottom: 20px;
          }

          .selected-section-page {
            padding:
              35px 15px 60px;
          }

          .selected-section-header {
            align-items: flex-start;
            flex-direction: column;
            gap: 18px;
          }

          .selected-section-header h1 {
            font-size: 30px;
          }

          .selected-section-icon {
            width: 70px;
            height: 70px;
            font-size: 40px;
          }

          .product-grid {
            grid-template-columns: 1fr;
          }

          .product-image {
            height: 240px;
          }

        }

      `}</style>
    </>
  );
}