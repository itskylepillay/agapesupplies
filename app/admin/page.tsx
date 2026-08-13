"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";

type Section = {
  id: number;
  name: string;
  created_at: string;
};

type Product = {
  id: number;
  name: string;
  description: string;
  image_url: string | null;
  section_id: number;
  created_at: string;
  sections?: {
    name: string;
  } | null;
};

export default function AdminPage() {
  const router = useRouter();

  const [sections, setSections] = useState<Section[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);
  const [error, setError] = useState("");

  // MOBILE MENU
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    checkUser();
  }, []);

  // =========================================================
  // CHECK LOGIN
  // =========================================================

  async function checkUser() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.replace("/admin/login");
      return;
    }

    await Promise.all([
      loadSections(),
      loadProducts(),
    ]);

    setLoading(false);
  }

  // =========================================================
  // LOAD SECTIONS
  // =========================================================

  async function loadSections() {
    const { data, error } = await supabase
      .from("sections")
      .select("*")
      .order("created_at", {
        ascending: true,
      });

    if (error) {
      console.error(error);

      setError(
        "Some dashboard information could not be loaded."
      );

      return;
    }

    setSections(data || []);
  }

  // =========================================================
  // LOAD PRODUCTS
  // =========================================================

  async function loadProducts() {
    const { data, error } = await supabase
      .from("products")
      .select(`
        *,
        sections (
          name
        )
      `)
      .order("created_at", {
        ascending: false,
      });

    if (error) {
      console.error(error);

      setError(
        "Some dashboard information could not be loaded."
      );

      return;
    }

    setProducts((data as Product[]) || []);
  }

  // =========================================================
  // NAVIGATION
  // =========================================================

  function navigateTo(path: string) {
    setMobileMenuOpen(false);
    router.push(path);
  }

  // =========================================================
  // LOGOUT
  // =========================================================

  async function logout() {
    setLoggingOut(true);

    await supabase.auth.signOut();

    router.replace("/admin/login");
  }

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <main className="loading-page">

        <div className="loading-box">

          <div className="loading-logo">
            A
          </div>

          <div className="loading-line"></div>

          <p>Loading your dashboard...</p>

        </div>

        <style jsx>{`

          .loading-page {
            min-height: 100vh;
            background: #f5f7fa;
            display: flex;
            align-items: center;
            justify-content: center;
            font-family:
              Arial,
              Helvetica,
              sans-serif;
          }

          .loading-box {
            text-align: center;
            animation:
              appear 0.6s ease both;
          }

          .loading-logo {
            width: 54px;
            height: 54px;
            margin: 0 auto 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #24549a;
            color: white;
            border-radius: 13px;
            font-size: 30px;
            font-weight: 800;
            font-style: italic;
          }

          .loading-line {
            width: 45px;
            height: 2px;
            background: #24549a;
            margin: 0 auto 15px;
            animation:
              loading 1.2s ease-in-out infinite;
          }

          .loading-box p {
            color: #718096;
            font-size: 13px;
          }

          @keyframes appear {

            from {
              opacity: 0;
              transform:
                translateY(12px);
            }

            to {
              opacity: 1;
              transform:
                translateY(0);
            }

          }

          @keyframes loading {

            0% {
              transform:
                scaleX(0.5);
              opacity: 0.4;
            }

            50% {
              transform:
                scaleX(1);
              opacity: 1;
            }

            100% {
              transform:
                scaleX(0.5);
              opacity: 0.4;
            }

          }

        `}</style>

      </main>
    );
  }

  // =========================================================
  // DASHBOARD
  // =========================================================

  return (
    <main className="admin-page">

      {/* =====================================================
          HEADER
      ====================================================== */}

      <header className="admin-header">

        <div className="header-inner">

          {/* BRAND */}

          <button
            className="brand"
            onClick={() =>
              navigateTo("/admin")
            }
          >

            <div className="brand-mark">
              A
            </div>

            <div className="brand-name">

              <strong>
                Agape
              </strong>

              <span>
                SUPPLIES
              </span>

            </div>

          </button>

          {/* DESKTOP NAVIGATION */}

          <nav className="admin-nav">

            <button
              className="active"
              onClick={() =>
                navigateTo("/admin")
              }
            >
              Dashboard
            </button>

            <button
              onClick={() =>
                navigateTo("/admin/products")
              }
            >
              Products
            </button>

            <button
              onClick={() =>
                navigateTo("/admin/sections")
              }
            >
              Sections
            </button>

            <button
              onClick={() =>
                navigateTo("/")
              }
            >
              View Website
            </button>

          </nav>

          {/* ADMIN STATUS */}

          <div className="admin-status">

            <span className="status-dot"></span>

            <span>
              Admin
            </span>

          </div>

          {/* DESKTOP LOGOUT */}

          <button
            className="logout-button"
            onClick={logout}
            disabled={loggingOut}
          >
            {loggingOut
              ? "Signing out..."
              : "Sign out"}
          </button>

          {/* MOBILE MENU BUTTON */}

          <button
            className={`mobile-menu-button ${
              mobileMenuOpen
                ? "open"
                : ""
            }`}
            onClick={() =>
              setMobileMenuOpen(
                !mobileMenuOpen
              )
            }
            aria-label="Toggle navigation"
            aria-expanded={
              mobileMenuOpen
            }
          >

            <span></span>
            <span></span>
            <span></span>

          </button>

        </div>

        {/* =================================================
            MOBILE NAVIGATION
        ================================================== */}

        <div
          className={`mobile-navigation ${
            mobileMenuOpen
              ? "mobile-navigation-open"
              : ""
          }`}
        >

          <div className="mobile-navigation-inner">

            <button
              className="mobile-nav-item active"
              onClick={() =>
                navigateTo("/admin")
              }
            >

              <span className="mobile-nav-number">
                01
              </span>

              <span>
                Dashboard
              </span>

              <span className="mobile-nav-arrow">
                →
              </span>

            </button>

            <button
              className="mobile-nav-item"
              onClick={() =>
                navigateTo(
                  "/admin/products"
                )
              }
            >

              <span className="mobile-nav-number">
                02
              </span>

              <span>
                Products
              </span>

              <span className="mobile-nav-arrow">
                →
              </span>

            </button>

            <button
              className="mobile-nav-item"
              onClick={() =>
                navigateTo(
                  "/admin/sections"
                )
              }
            >

              <span className="mobile-nav-number">
                03
              </span>

              <span>
                Sections
              </span>

              <span className="mobile-nav-arrow">
                →
              </span>

            </button>

            <button
              className="mobile-nav-item"
              onClick={() =>
                navigateTo("/")
              }
            >

              <span className="mobile-nav-number">
                04
              </span>

              <span>
                View Website
              </span>

              <span className="mobile-nav-arrow">
                →
              </span>

            </button>

            <div className="mobile-menu-divider"></div>

            <button
              className="mobile-signout"
              onClick={logout}
              disabled={loggingOut}
            >

              <span>
                {loggingOut
                  ? "Signing out..."
                  : "Sign out"}
              </span>

              <span>
                →
              </span>

            </button>

          </div>

        </div>

      </header>

      {/* =====================================================
          CONTENT
      ====================================================== */}

      <div className="dashboard-content">

        {/* ===================================================
            WELCOME
        ==================================================== */}

        <section className="welcome-section">

          <div className="welcome-text">

            <p className="eyebrow">
              ADMIN DASHBOARD
            </p>

            <h1>
              Hi, Kandy.
              <br />

              <span>
                Welcome to Agape Supplies.
              </span>
            </h1>

            <p className="welcome-description">
              Manage your products, organise your
              catalogue and keep your website up to
              date from one place.
            </p>

          </div>

          <div className="welcome-decoration">

            <div className="decoration-square square-one"></div>

            <div className="decoration-square square-two"></div>

            <div className="decoration-line"></div>

          </div>

        </section>

        {/* ===================================================
            ERROR
        ==================================================== */}

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {/* ===================================================
            STATISTICS
        ==================================================== */}

        <section className="stats-grid">

          <div className="stat-card">

            <div>

              <p>
                Total Products
              </p>

              <strong>
                {products.length}
              </strong>

            </div>

            <div className="stat-number">
              01
            </div>

          </div>

          <div className="stat-card">

            <div>

              <p>
                Total Sections
              </p>

              <strong>
                {sections.length}
              </strong>

            </div>

            <div className="stat-number">
              02
            </div>

          </div>

          <div className="stat-card">

            <div>

              <p>
                Catalogue Status
              </p>

              <strong className="active-text">
                Active
              </strong>

            </div>

            <div className="status-circle"></div>

          </div>

        </section>

        {/* ===================================================
            QUICK ACTIONS
        ==================================================== */}

        <section className="section-block">

          <div className="section-heading">

            <div>

              <p className="eyebrow">
                QUICK ACTIONS
              </p>

              <h2>
                Manage your catalogue
              </h2>

              <p>
                Jump directly to the area you
                need to manage.
              </p>

            </div>

          </div>

          <div className="quick-actions">

            <button
              className="action-card"
              onClick={() =>
                navigateTo(
                  "/admin/products"
                )
              }
            >

              <div className="action-number">
                01
              </div>

              <div className="action-content">

                <h3>
                  Products
                </h3>

                <p>
                  Add new products, upload
                  images and manage your
                  existing catalogue.
                </p>

                <span>
                  Manage Products →
                </span>

              </div>

            </button>

            <button
              className="action-card"
              onClick={() =>
                navigateTo(
                  "/admin/sections"
                )
              }
            >

              <div className="action-number">
                02
              </div>

              <div className="action-content">

                <h3>
                  Sections
                </h3>

                <p>
                  Create and organise the
                  categories used across
                  your product catalogue.
                </p>

                <span>
                  Manage Sections →
                </span>

              </div>

            </button>

            <button
              className="action-card"
              onClick={() =>
                navigateTo("/")
              }
            >

              <div className="action-number">
                03
              </div>

              <div className="action-content">

                <h3>
                  Website
                </h3>

                <p>
                  Visit the public Agape
                  Supplies website and see
                  your catalogue.
                </p>

                <span>
                  View Website →
                </span>

              </div>

            </button>

          </div>

        </section>

        {/* ===================================================
            RECENT PRODUCTS
        ==================================================== */}

        <section className="section-block">

          <div className="section-heading heading-with-button">

            <div>

              <p className="eyebrow">
                CATALOGUE
              </p>

              <h2>
                Recent Products
              </h2>

              <p>
                The latest products added
                to Agape Supplies.
              </p>

            </div>

            <button
              className="outline-button"
              onClick={() =>
                navigateTo(
                  "/admin/products"
                )
              }
            >
              View All Products
            </button>

          </div>

          {products.length === 0 ? (

            <div className="empty-products">

              <div className="empty-line"></div>

              <h3>
                No products yet
              </h3>

              <p>
                Your recently added products
                will appear here.
              </p>

              <button
                onClick={() =>
                  navigateTo(
                    "/admin/products"
                  )
                }
              >
                Add Your First Product
              </button>

            </div>

          ) : (

            <div className="recent-products">

              {products
                .slice(0, 4)
                .map(
                  (
                    product,
                    index
                  ) => (

                    <article
                      key={
                        product.id
                      }
                      className="recent-product"
                      style={{
                        animationDelay:
                          `${index * 0.08}s`,
                      }}
                    >

                      <div className="recent-image">

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

                      <div className="recent-details">

                        <span className="product-section">
                          {product.sections
                            ?.name ||
                            "Unassigned"}
                        </span>

                        <h3>
                          {product.name}
                        </h3>

                        <p>
                          {product.description ||
                            "No description available."}
                        </p>

                        <button
                          onClick={() =>
                            navigateTo(
                              "/admin/products"
                            )
                          }
                        >
                          Manage Product →
                        </button>

                      </div>

                    </article>

                  )
                )}

            </div>

          )}

        </section>

        {/* ===================================================
            SECTIONS OVERVIEW
        ==================================================== */}

        <section className="section-block">

          <div className="section-heading heading-with-button">

            <div>

              <p className="eyebrow">
                ORGANISATION
              </p>

              <h2>
                Product Sections
              </h2>

              <p>
                An overview of how your
                catalogue is organised.
              </p>

            </div>

            <button
              className="outline-button"
              onClick={() =>
                navigateTo(
                  "/admin/sections"
                )
              }
            >
              Manage Sections
            </button>

          </div>

          {sections.length === 0 ? (

            <div className="empty-sections">
              No sections have been created yet.
            </div>

          ) : (

            <div className="section-overview">

              {sections.map(
                (
                  section,
                  index
                ) => {

                  const productCount =
                    products.filter(
                      (product) =>
                        product.section_id ===
                        section.id
                    ).length;

                  return (
                    <button
                      key={
                        section.id
                      }
                      className="overview-item"
                      onClick={() =>
                        navigateTo(
                          "/admin/sections"
                        )
                      }
                      style={{
                        animationDelay:
                          `${index * 0.06}s`,
                      }}
                    >

                      <div className="overview-icon">

                        {section.name
                          .charAt(0)
                          .toUpperCase()}

                      </div>

                      <div className="overview-info">

                        <strong>
                          {section.name}
                        </strong>

                        <span>
                          {productCount}{" "}
                          {productCount === 1
                            ? "product"
                            : "products"}
                        </span>

                      </div>

                      <span className="overview-arrow">
                        →
                      </span>

                    </button>
                  );
                }
              )}

            </div>

          )}

        </section>

      </div>

      {/* =====================================================
          FOOTER
      ====================================================== */}

      <footer className="admin-footer">

        <span>
          Agape Supplies
        </span>

        <span>
          Administration Portal
        </span>

      </footer>

      {/* =====================================================
          STYLES
      ====================================================== */}

      <style jsx>{`

        * {
          box-sizing: border-box;
        }

        .admin-page {
          min-height: 100vh;
          background: #f5f7fa;
          color: #172b4d;
          font-family:
            Arial,
            Helvetica,
            sans-serif;
        }

        /* =====================================================
           HEADER
        ====================================================== */

        .admin-header {
          position: sticky;
          top: 0;
          z-index: 1000;
          background:
            rgba(255,255,255,0.96);
          backdrop-filter:
            blur(16px);
          border-bottom:
            1px solid #e4e9ef;
        }

        .header-inner {
          max-width: 1400px;
          min-height: 76px;
          margin: 0 auto;
          padding: 0 35px;
          display: flex;
          align-items: center;
          gap: 35px;
        }

        /* =====================================================
           BRAND
        ====================================================== */

        .brand {
          display: flex;
          align-items: center;
          gap: 11px;
          border: none;
          background: transparent;
          padding: 0;
          cursor: pointer;
        }

        .brand-mark {
          width: 42px;
          height: 42px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #24549a;
          color: #fff;
          font-size: 25px;
          font-weight: 800;
          font-style: italic;
        }

        .brand-name {
          text-align: left;
        }

        .brand-name strong {
          display: block;
          font-size: 21px;
          line-height: 18px;
          color: #172b4d;
        }

        .brand-name span {
          display: block;
          margin-top: 5px;
          color: #24549a;
          font-size: 7px;
          letter-spacing: 3px;
          font-weight: 800;
        }

        /* =====================================================
           DESKTOP NAV
        ====================================================== */

        .admin-nav {
          display: flex;
          align-items: center;
          gap: 3px;
          flex: 1;
        }

        .admin-nav button {
          border: none;
          background: transparent;
          color: #66758a;
          padding: 11px 14px;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
          transition:
            background 0.2s ease,
            color 0.2s ease;
        }

        .admin-nav button:hover {
          background: #f0f4f8;
          color: #24549a;
        }

        .admin-nav button.active {
          background: #edf3fb;
          color: #24549a;
        }

        /* =====================================================
           ADMIN STATUS
        ====================================================== */

        .admin-status {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #65758a;
          font-size: 11px;
          font-weight: 700;
        }

        .status-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #35a66f;
          box-shadow:
            0 0 0 4px
            rgba(53,166,111,0.12);
        }

        /* =====================================================
           LOGOUT
        ====================================================== */

        .logout-button {
          border: 1px solid #dfe4eb;
          background: white;
          color: #5e6d80;
          padding: 9px 14px;
          border-radius: 8px;
          font-size: 11px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .logout-button:hover {
          color: #b42318;
          border-color: #f1c5c0;
          background: #fffafa;
        }

        /* =====================================================
           MOBILE MENU BUTTON
        ====================================================== */

        .mobile-menu-button {
          display: none;
          width: 44px;
          height: 44px;
          padding: 0;
          border: 1px solid #e0e6ed;
          border-radius: 10px;
          background: white;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          gap: 5px;
          cursor: pointer;
          margin-left: auto;
        }

        .mobile-menu-button span {
          display: block;
          width: 20px;
          height: 2px;
          border-radius: 5px;
          background: #24549a;
          transition:
            transform 0.3s ease,
            opacity 0.2s ease;
        }

        /* HAMBURGER -> X */

        .mobile-menu-button.open
        span:nth-child(1) {
          transform:
            translateY(7px)
            rotate(45deg);
        }

        .mobile-menu-button.open
        span:nth-child(2) {
          opacity: 0;
        }

        .mobile-menu-button.open
        span:nth-child(3) {
          transform:
            translateY(-7px)
            rotate(-45deg);
        }

        /* =====================================================
           MOBILE NAVIGATION
        ====================================================== */

        .mobile-navigation {
          display: none;
        }

        /* =====================================================
           CONTENT
        ====================================================== */

        .dashboard-content {
          max-width: 1400px;
          margin: 0 auto;
          padding:
            55px 35px 80px;
        }

        /* =====================================================
           WELCOME
        ====================================================== */

        .welcome-section {
          position: relative;
          min-height: 270px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          overflow: hidden;
          padding:
            45px 50px;
          border-radius: 20px;
          background: #ffffff;
          border:
            1px solid #e4e9ef;
          box-shadow:
            0 10px 35px
            rgba(24,50,80,0.045);
          animation:
            fadeUp 0.55s ease both;
        }

        .welcome-text {
          position: relative;
          z-index: 2;
        }

        .eyebrow {
          margin:
            0 0 10px;
          color: #24549a;
          font-size: 10px;
          letter-spacing: 2.5px;
          font-weight: 800;
        }

        .welcome-section h1 {
          margin: 0;
          font-size: 43px;
          line-height: 1.13;
          letter-spacing: -1.8px;
          color: #172b4d;
        }

        .welcome-section h1 span {
          color: #6c7b8e;
          font-weight: 400;
        }

        .welcome-description {
          max-width: 580px;
          margin:
            17px 0 0;
          color: #758397;
          font-size: 14px;
          line-height: 1.7;
        }

        .welcome-decoration {
          position: absolute;
          right: 55px;
          top: 0;
          width: 330px;
          height: 100%;
          pointer-events: none;
        }

        .decoration-square {
          position: absolute;
          border:
            1px solid
            rgba(36,84,154,0.12);
          transform: rotate(45deg);
        }

        .square-one {
          width: 150px;
          height: 150px;
          right: 65px;
          top: 50px;
        }

        .square-two {
          width: 85px;
          height: 85px;
          right: 180px;
          top: 120px;
        }

        .decoration-line {
          position: absolute;
          width: 120px;
          height: 1px;
          background: #24549a;
          opacity: 0.35;
          right: 35px;
          top: 130px;
          transform: rotate(-45deg);
        }

        /* =====================================================
           ERROR
        ====================================================== */

        .error-message {
          margin-top: 25px;
          padding:
            14px 18px;
          border-radius: 10px;
          background: #fff3f2;
          border:
            1px solid #ffd6d1;
          color: #b42318;
          font-size: 12px;
          font-weight: 600;
          animation:
            fadeUp 0.3s ease both;
        }

        /* =====================================================
           STATS
        ====================================================== */

        .stats-grid {
          display: grid;
          grid-template-columns:
            repeat(3, 1fr);
          gap: 20px;
          margin-top: 25px;
        }

        .stat-card {
          min-height: 135px;
          padding: 25px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: white;
          border:
            1px solid #e4e9ef;
          border-radius: 15px;
          box-shadow:
            0 7px 25px
            rgba(24,50,80,0.035);
          animation:
            fadeUp 0.55s ease both;
          transition:
            transform 0.25s ease,
            box-shadow 0.25s ease;
        }

        .stat-card:hover {
          transform:
            translateY(-3px);
          box-shadow:
            0 12px 30px
            rgba(24,50,80,0.07);
        }

        .stat-card p {
          margin:
            0 0 9px;
          color: #7a889a;
          font-size: 11px;
          font-weight: 700;
        }

        .stat-card strong {
          font-size: 32px;
          color: #172b4d;
        }

        .stat-card strong.active-text {
          font-size: 22px;
          color: #2b8a60;
        }

        .stat-number {
          color: #dfe7f0;
          font-size: 34px;
          font-weight: 800;
        }

        .status-circle {
          width: 19px;
          height: 19px;
          border-radius: 50%;
          background: #35a66f;
          box-shadow:
            0 0 0 7px
            rgba(53,166,111,0.10);
        }

        /* =====================================================
           SECTIONS
        ====================================================== */

        .section-block {
          margin-top: 65px;
          animation:
            fadeUp 0.6s ease both;
        }

        .section-heading {
          margin-bottom: 25px;
        }

        .section-heading h2 {
          margin: 0;
          font-size: 25px;
          letter-spacing: -0.6px;
        }

        .section-heading >
        div >
        p:last-child {
          margin:
            8px 0 0;
          color: #7a889a;
          font-size: 13px;
        }

        .heading-with-button {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 25px;
        }

        .outline-button {
          border:
            1px solid #dce3eb;
          background: white;
          color: #52647a;
          padding:
            10px 16px;
          border-radius: 8px;
          font-size: 11px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .outline-button:hover {
          border-color: #24549a;
          color: #24549a;
        }

        /* =====================================================
           QUICK ACTIONS
        ====================================================== */

        .quick-actions {
          display: grid;
          grid-template-columns:
            repeat(3, 1fr);
          gap: 20px;
        }

        .action-card {
          position: relative;
          overflow: hidden;
          min-height: 225px;
          padding: 27px;
          background: white;
          border:
            1px solid #e4e9ef;
          border-radius: 15px;
          text-align: left;
          cursor: pointer;
          box-shadow:
            0 7px 25px
            rgba(24,50,80,0.035);
          transition:
            transform 0.25s ease,
            box-shadow 0.25s ease;
        }

        .action-card:hover {
          transform:
            translateY(-5px);
          box-shadow:
            0 15px 35px
            rgba(24,50,80,0.08);
        }

        .action-card::after {
          content: "";
          position: absolute;
          right: -35px;
          bottom: -35px;
          width: 110px;
          height: 110px;
          border:
            1px solid
            rgba(36,84,154,0.08);
          border-radius: 50%;
        }

        .action-number {
          color: #d6dfeb;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 1px;
          margin-bottom: 30px;
        }

        .action-content h3 {
          margin: 0;
          color: #172b4d;
          font-size: 20px;
        }

        .action-content p {
          max-width: 290px;
          margin:
            9px 0 20px;
          color: #788699;
          font-size: 12px;
          line-height: 1.65;
        }

        .action-content span {
          color: #24549a;
          font-size: 11px;
          font-weight: 800;
        }

        /* =====================================================
           RECENT PRODUCTS
        ====================================================== */

        .recent-products {
          display: grid;
          grid-template-columns:
            repeat(4, 1fr);
          gap: 20px;
        }

        .recent-product {
          background: white;
          border:
            1px solid #e4e9ef;
          border-radius: 14px;
          overflow: hidden;
          opacity: 0;
          animation:
            cardEnter 0.5s ease forwards;
          box-shadow:
            0 7px 25px
            rgba(24,50,80,0.035);
          transition:
            transform 0.25s ease,
            box-shadow 0.25s ease;
        }

        .recent-product:hover {
          transform:
            translateY(-4px);
          box-shadow:
            0 14px 30px
            rgba(24,50,80,0.08);
        }

        .recent-image {
          height: 180px;
          background: #edf1f5;
          overflow: hidden;
        }

        .recent-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition:
            transform 0.4s ease;
        }

        .recent-product:hover
        .recent-image img {
          transform:
            scale(1.04);
        }

        .no-image {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #8a96a5;
          font-size: 11px;
        }

        .recent-details {
          padding: 18px;
        }

        .product-section {
          color: #24549a;
          font-size: 9px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .recent-details h3 {
          margin:
            7px 0 0;
          color: #172b4d;
          font-size: 16px;
        }

        .recent-details p {
          margin:
            8px 0 16px;
          color: #788699;
          font-size: 11px;
          line-height: 1.6;
          display:
            -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient:
            vertical;
          overflow: hidden;
        }

        .recent-details button {
          border: none;
          background: transparent;
          color: #24549a;
          padding: 0;
          font-size: 10px;
          font-weight: 800;
          cursor: pointer;
        }

        /* =====================================================
           EMPTY PRODUCTS
        ====================================================== */

        .empty-products {
          padding:
            65px 25px;
          background: white;
          border:
            1px solid #e4e9ef;
          border-radius: 15px;
          text-align: center;
        }

        .empty-line {
          width: 45px;
          height: 2px;
          margin:
            0 auto 18px;
          background: #24549a;
        }

        .empty-products h3 {
          margin: 0;
          font-size: 19px;
        }

        .empty-products p {
          margin:
            8px 0 18px;
          color: #788699;
          font-size: 12px;
        }

        .empty-products button {
          border: none;
          background: #24549a;
          color: white;
          padding:
            11px 17px;
          border-radius: 8px;
          font-size: 11px;
          font-weight: 700;
          cursor: pointer;
        }

        /* =====================================================
           SECTION OVERVIEW
        ====================================================== */

        .section-overview {
          display: grid;
          grid-template-columns:
            repeat(2, 1fr);
          gap: 12px;
        }

        .overview-item {
          display: flex;
          align-items: center;
          gap: 14px;
          width: 100%;
          padding: 17px;
          border:
            1px solid #e4e9ef;
          border-radius: 11px;
          background: white;
          text-align: left;
          cursor: pointer;
          opacity: 0;
          animation:
            cardEnter 0.45s ease forwards;
          transition:
            transform 0.2s ease,
            border-color 0.2s ease;
        }

        .overview-item:hover {
          transform:
            translateX(3px);
          border-color:
            #c9d7e8;
        }

        .overview-icon {
          flex-shrink: 0;
          width: 39px;
          height: 39px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 9px;
          background: #edf3fb;
          color: #24549a;
          font-size: 15px;
          font-weight: 800;
        }

        .overview-info {
          flex: 1;
        }

        .overview-info strong {
          display: block;
          color: #172b4d;
          font-size: 13px;
        }

        .overview-info span {
          display: block;
          margin-top: 4px;
          color: #8995a5;
          font-size: 10px;
        }

        .overview-arrow {
          color: #24549a;
          font-size: 18px;
        }

        .empty-sections {
          padding:
            35px;
          border:
            1px solid #e4e9ef;
          border-radius: 12px;
          background: white;
          color: #7a889a;
          text-align: center;
          font-size: 12px;
        }

        /* =====================================================
           FOOTER
        ====================================================== */

        .admin-footer {
          max-width: 1400px;
          margin: 0 auto;
          padding:
            25px 35px 35px;
          display: flex;
          justify-content: space-between;
          border-top:
            1px solid #e2e7ed;
          color: #98a3b1;
          font-size: 10px;
          letter-spacing: 0.5px;
        }

        /* =====================================================
           ANIMATIONS
        ====================================================== */

        @keyframes fadeUp {

          from {
            opacity: 0;
            transform:
              translateY(20px);
          }

          to {
            opacity: 1;
            transform:
              translateY(0);
          }

        }

        @keyframes cardEnter {

          from {
            opacity: 0;
            transform:
              translateY(15px);
          }

          to {
            opacity: 1;
            transform:
              translateY(0);
          }

        }

        /* =====================================================
           TABLET
        ====================================================== */

        @media (max-width: 1100px) {

          .recent-products {
            grid-template-columns:
              repeat(2, 1fr);
          }

          .quick-actions {
            grid-template-columns:
              repeat(3, 1fr);
          }

        }

        /* =====================================================
           MOBILE NAVIGATION
        ====================================================== */

        @media (max-width: 850px) {

          .header-inner {
            min-height: 70px;
            padding:
              12px 20px;
            gap: 15px;
          }

          /*
           * Hide the desktop navigation.
           */

          .admin-nav {
            display: none;
          }

          /*
           * Hide desktop status.
           */

          .admin-status {
            display: none;
          }

          /*
           * Hide desktop logout.
           */

          .logout-button {
            display: none;
          }

          /*
           * Show hamburger.
           */

          .mobile-menu-button {
            display: flex;
          }

          /*
           * Mobile dropdown.
           */

          .mobile-navigation {
            display: block;
            max-height: 0;
            overflow: hidden;
            opacity: 0;
            background: white;
            border-top:
              1px solid transparent;
            transform:
              translateY(-10px);
            transition:
              max-height 0.45s ease,
              opacity 0.3s ease,
              transform 0.45s ease,
              border-color 0.3s ease;
          }

          /*
           * OPEN STATE
           */

          .mobile-navigation-open {
            max-height: 500px;
            opacity: 1;
            transform:
              translateY(0);
            border-top:
              1px solid #edf0f4;
          }

          .mobile-navigation-inner {
            padding:
              10px 20px 20px;
          }

          /*
           * Individual mobile links.
           */

          .mobile-nav-item {
            width: 100%;
            min-height: 58px;
            display: flex;
            align-items: center;
            gap: 15px;
            border: none;
            border-bottom:
              1px solid #edf0f4;
            background: transparent;
            color: #53657b;
            padding:
              0 5px;
            text-align: left;
            font-size: 14px;
            font-weight: 700;
            cursor: pointer;
            transition:
              color 0.2s ease,
              padding-left 0.25s ease;
          }

          .mobile-nav-item:hover {
            color: #24549a;
            padding-left: 10px;
          }

          .mobile-nav-item.active {
            color: #24549a;
          }

          .mobile-nav-number {
            width: 25px;
            color: #b8c4d2;
            font-size: 9px;
            font-weight: 800;
          }

          .mobile-nav-item.active
          .mobile-nav-number {
            color: #24549a;
          }

          .mobile-nav-arrow {
            margin-left: auto;
            color: #24549a;
            font-size: 18px;
            opacity: 0.6;
            transition:
              transform 0.2s ease;
          }

          .mobile-nav-item:hover
          .mobile-nav-arrow {
            transform:
              translateX(4px);
          }

          .mobile-menu-divider {
            height: 1px;
            background: #e8edf2;
            margin:
              10px 0;
          }

          .mobile-signout {
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: space-between;
            border: none;
            background: transparent;
            color: #b42318;
            padding:
              13px 5px;
            font-size: 12px;
            font-weight: 700;
            cursor: pointer;
          }

          .dashboard-content {
            padding:
              35px 20px 60px;
          }

          .welcome-section {
            padding:
              35px;
          }

          .welcome-decoration {
            opacity: 0.4;
          }

          .stats-grid {
            grid-template-columns:
              1fr;
          }

          .quick-actions {
            grid-template-columns:
              1fr;
          }

        }

        /* =====================================================
           SMALL MOBILE
        ====================================================== */

        @media (max-width: 600px) {

          .header-inner {
            padding:
              12px 15px;
          }

          .brand-mark {
            width: 39px;
            height: 39px;
            font-size: 22px;
          }

          .brand-name strong {
            font-size: 19px;
          }

          .brand-name span {
            font-size: 6px;
          }

          .mobile-navigation-inner {
            padding:
              8px 15px 18px;
          }

          .dashboard-content {
            padding:
              25px 15px 50px;
          }

          .welcome-section {
            min-height: auto;
            padding:
              30px 25px;
          }

          .welcome-section h1 {
            font-size: 34px;
          }

          .welcome-decoration {
            display: none;
          }

          .recent-products {
            grid-template-columns:
              1fr;
          }

          .section-overview {
            grid-template-columns:
              1fr;
          }

          .heading-with-button {
            align-items: flex-start;
            flex-direction: column;
          }

          .admin-footer {
            padding:
              20px 15px;
          }

        }

      `}</style>

    </main>
  );
}