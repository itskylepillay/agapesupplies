"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

type Section = {
  id: number;
  name: string;
  description: string;
  image_url: string;
  created_at: string;
};

type Product = {
  id: number;
  name: string;
  description: string;
  image_url: string;
  section_id: number;
};

export default function SectionsPage() {
  const router = useRouter();

  const [sections, setSections] = useState<Section[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  const [newSection, setNewSection] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newImage, setNewImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");

  const [selectedSection, setSelectedSection] =
    useState<Section | null>(null);

  const [loading, setLoading] = useState(true);
  const [loadingProducts, setLoadingProducts] =
    useState(false);
  const [adding, setAdding] = useState(false);

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<
    "success" | "error" | ""
  >("");

  // MOBILE MENU
  const [menuOpen, setMenuOpen] = useState(false);

  // =========================================================
  // LOAD SECTIONS
  // =========================================================

  async function loadSections() {
    setLoading(true);

    const { data, error } = await supabase
      .from("sections")
      .select("*")
      .order("name", { ascending: true });

    if (error) {
      console.error(error);

      showMessage(
        "Could not load sections.",
        "error"
      );
    } else {
      setSections(data || []);
    }

    setLoading(false);
  }

  useEffect(() => {
    loadSections();
  }, []);

  // =========================================================
  // MESSAGE
  // =========================================================

  function showMessage(
    text: string,
    type: "success" | "error"
  ) {
    setMessage(text);
    setMessageType(type);

    setTimeout(() => {
      setMessage("");
      setMessageType("");
    }, 4500);
  }

  // =========================================================
  // IMAGE SELECT
  // =========================================================

  function handleImageChange(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = e.target.files?.[0];

    if (!file) {
      setNewImage(null);
      setImagePreview("");
      return;
    }

    // Keep image uploads reasonable
    if (!file.type.startsWith("image/")) {
      showMessage(
        "Please select an image file.",
        "error"
      );

      e.target.value = "";
      setNewImage(null);
      setImagePreview("");
      return;
    }

    setNewImage(file);

    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
  }

  // =========================================================
  // ADD SECTION
  // =========================================================

  async function addSection() {
    const sectionName = newSection.trim();
    const sectionDescription = newDescription.trim();

    if (!sectionName) {
      showMessage(
        "Please enter a section name.",
        "error"
      );
      return;
    }

    if (!sectionDescription) {
      showMessage(
        "Please enter a section description.",
        "error"
      );
      return;
    }

    if (!newImage) {
      showMessage(
        "Please select a section image.",
        "error"
      );
      return;
    }

    setAdding(true);

    const { data: existingSection } =
      await supabase
        .from("sections")
        .select("id")
        .ilike("name", sectionName)
        .maybeSingle();

    if (existingSection) {
      showMessage(
        "A section with this name already exists.",
        "error"
      );

      setAdding(false);
      return;
    }

    // =====================================================
    // UPLOAD SECTION IMAGE
    // =====================================================

    const fileExtension =
      newImage.name.split(".").pop() || "jpg";

    const fileName = `${Date.now()}-${Math.random()
      .toString(36)
      .substring(2)}.${fileExtension}`;

    const filePath = fileName;

    const { error: uploadError } =
      await supabase.storage
        .from("section-images")
        .upload(filePath, newImage);

    if (uploadError) {
      console.error(uploadError);

      showMessage(
        "Could not upload the section image.",
        "error"
      );

      setAdding(false);
      return;
    }

    // =====================================================
    // GET PUBLIC IMAGE URL
    // =====================================================

    const {
      data: publicImageData,
    } = supabase.storage
      .from("section-images")
      .getPublicUrl(filePath);

    const imageUrl =
      publicImageData.publicUrl;

    // =====================================================
    // CREATE SECTION
    // =====================================================

    const { error } = await supabase
      .from("sections")
      .insert({
        name: sectionName,
        description: sectionDescription,
        image_url: imageUrl,
      });
if (error) {
  console.error("SECTION INSERT ERROR:", error);

  // Remove uploaded image if section creation failed
  await supabase.storage
    .from("section-images")
    .remove([filePath]);

  showMessage(
    `Could not add the section: ${error.message}`,
    "error"
  );
}
     else {
      setNewSection("");
      setNewDescription("");
      setNewImage(null);
      setImagePreview("");

      showMessage(
        "Section created successfully.",
        "success"
      );

      await loadSections();
    }

    setAdding(false);
  }

  // =========================================================
  // OPEN SECTION
  // =========================================================

  async function openSection(section: Section) {
    setSelectedSection(section);
    setProducts([]);
    setLoadingProducts(true);

    const { data, error } = await supabase
      .from("products")
      .select(
        "id, name, description, image_url, section_id"
      )
      .eq("section_id", section.id)
      .order("id", { ascending: false });

    if (error) {
      console.error(error);

      showMessage(
        "Could not load the products in this section.",
        "error"
      );

      setLoadingProducts(false);
      return;
    }

    setProducts(data || []);
    setLoadingProducts(false);
  }

  // =========================================================
  // RENAME SECTION
  // =========================================================

  async function renameSection(
    section: Section
  ) {
    const newName = window.prompt(
      "Enter the new section name:",
      section.name
    );

    if (newName === null) {
      return;
    }

    const trimmedName = newName.trim();

    if (!trimmedName) {
      showMessage(
        "Section name cannot be empty.",
        "error"
      );
      return;
    }

    const { data: existingSection } =
      await supabase
        .from("sections")
        .select("id")
        .ilike("name", trimmedName)
        .neq("id", section.id)
        .maybeSingle();

    if (existingSection) {
      showMessage(
        "Another section already has this name.",
        "error"
      );
      return;
    }

    const { error } = await supabase
      .from("sections")
      .update({
        name: trimmedName,
      })
      .eq("id", section.id);

    if (error) {
      console.error(error);

      showMessage(
        "Could not rename the section.",
        "error"
      );

      return;
    }

    if (
      selectedSection &&
      selectedSection.id === section.id
    ) {
      setSelectedSection({
        ...selectedSection,
        name: trimmedName,
      });
    }

    showMessage(
      "Section renamed successfully.",
      "success"
    );

    await loadSections();
  }

  // =========================================================
  // DELETE SECTION
  // =========================================================

  async function deleteSection(
    section: Section
  ) {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${section.name}"?`
    );

    if (!confirmed) {
      return;
    }

    const {
      data: sectionProducts,
      error: productError,
    } = await supabase
      .from("products")
      .select("id")
      .eq("section_id", section.id)
      .limit(1);

    if (productError) {
      console.error(productError);

      showMessage(
        "Could not check whether this section contains products.",
        "error"
      );

      return;
    }

    if (
      sectionProducts &&
      sectionProducts.length > 0
    ) {
      showMessage(
        "This section contains products. Delete or move those products before deleting the section.",
        "error"
      );

      return;
    }

    // =====================================================
    // DELETE SECTION IMAGE FROM STORAGE
    // =====================================================

    if (section.image_url) {
      try {
        const imageUrl = new URL(
          section.image_url
        );

        const bucketMarker =
          "/storage/v1/object/public/section-images/";

        const imagePath =
          imageUrl.pathname.split(
            bucketMarker
          )[1];

        if (imagePath) {
          await supabase.storage
            .from("section-images")
            .remove([imagePath]);
        }
      } catch (imageError) {
        console.error(
          "Could not remove section image:",
          imageError
        );
      }
    }

    // =====================================================
    // DELETE SECTION
    // =====================================================

    const { error } = await supabase
      .from("sections")
      .delete()
      .eq("id", section.id);

    if (error) {
      console.error(error);

      showMessage(
        "Could not delete the section.",
        "error"
      );

      return;
    }

    if (
      selectedSection &&
      selectedSection.id === section.id
    ) {
      setSelectedSection(null);
      setProducts([]);
    }

    showMessage(
      "Section deleted successfully.",
      "success"
    );

    await loadSections();
  }

  // =========================================================
  // NAVIGATION HELPER
  // =========================================================

  function navigateTo(path: string) {
    setMenuOpen(false);
    router.push(path);
  }

  // =========================================================
  // PAGE
  // =========================================================

  return (
    <main className="admin-page">

      {/* =====================================================
          HEADER
      ====================================================== */}

      <header className="admin-header">
        <div className="header-inner">

          <button
            type="button"
            className="brand"
            onClick={() => navigateTo("/admin")}
          >
            <div className="brand-mark">
              A
            </div>

            <div className="brand-text">
              <strong>Agape</strong>
              <span>SUPPLIES</span>
            </div>
          </button>

          <nav className="admin-nav desktop-nav">

            <button
              type="button"
              className="nav-button"
              onClick={() => navigateTo("/admin")}
            >
              <span>Dashboard</span>
            </button>

            <button
              type="button"
              className="nav-button"
              onClick={() =>
                navigateTo("/admin/products")
              }
            >
              <span>Products</span>
            </button>

            <button
              type="button"
              className="nav-button active"
              onClick={() =>
                navigateTo("/admin/sections")
              }
            >
              <span>Sections</span>
            </button>

            <button
              type="button"
              className="nav-button"
              onClick={() => navigateTo("/")}
            >
              <span>View Website</span>
            </button>

          </nav>

          <div className="admin-label">
            <span className="status-dot"></span>
            Admin
          </div>

          {/* HAMBURGER */}

          <button
            type="button"
            className={`hamburger ${
              menuOpen ? "open" : ""
            }`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle navigation menu"
            aria-expanded={menuOpen}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>

        </div>

        {/* MOBILE MENU */}

        <div
          className={`mobile-menu ${
            menuOpen ? "mobile-menu-open" : ""
          }`}
        >

          <button
            type="button"
            className="mobile-nav-button"
            onClick={() => navigateTo("/admin")}
          >
            Dashboard
          </button>

          <button
            type="button"
            className="mobile-nav-button"
            onClick={() =>
              navigateTo("/admin/products")
            }
          >
            Products
          </button>

          <button
            type="button"
            className="mobile-nav-button active"
            onClick={() =>
              navigateTo("/admin/sections")
            }
          >
            Sections
          </button>

          <button
            type="button"
            className="mobile-nav-button"
            onClick={() => navigateTo("/")}
          >
            View Website
          </button>

        </div>
      </header>

      {/* =====================================================
          MAIN CONTENT
      ====================================================== */}

      <div className="content">

        {/* ===================================================
            PAGE INTRO
        ==================================================== */}

        <section className="page-intro">

          <div>
            <p className="eyebrow">
              ADMINISTRATION
            </p>

            <h1>
              {selectedSection
                ? selectedSection.name
                : "Sections"}
            </h1>

            <p className="intro-text">
              {selectedSection
                ? `Manage the products inside ${selectedSection.name}.`
                : "Organise your Agape Supplies products into clear website sections."}
            </p>
          </div>

          <div className="section-count">

            <span>
              {selectedSection
                ? products.length
                : sections.length}
            </span>

            <small>
              {selectedSection
                ? products.length === 1
                  ? "Product"
                  : "Products"
                : sections.length === 1
                ? "Section"
                : "Sections"}
            </small>

          </div>

        </section>

        {/* ===================================================
            MESSAGE
        ==================================================== */}

        {message && (
          <div
            className={`message ${
              messageType === "success"
                ? "success"
                : "error"
            }`}
          >
            {message}
          </div>
        )}

        {/* ===================================================
            SECTION DETAIL VIEW
        ==================================================== */}

        {selectedSection ? (

          <section className="detail-view">

            <button
              type="button"
              className="back-button"
              onClick={() => {
                setSelectedSection(null);
                setProducts([]);
              }}
            >
              <span>←</span>
              Back to Sections
            </button>

            <div className="detail-header">

              <div className="detail-section-info">

                {selectedSection.image_url && (
                  <div className="detail-section-image">
                    <img
                      src={selectedSection.image_url}
                      alt={selectedSection.name}
                    />
                  </div>
                )}

                <div>
                  <p className="eyebrow">
                    SECTION
                  </p>

                  <h2>
                    {selectedSection.name}
                  </h2>

                  {selectedSection.description && (
                    <p>
                      {selectedSection.description}
                    </p>
                  )}

                  <p>
                    Products currently assigned
                    to this section.
                  </p>
                </div>

              </div>

              <button
                type="button"
                className="add-product-button"
                onClick={() =>
                  router.push(
                    `/admin/products?section=${selectedSection.id}`
                  )
                }
              >
                Add Product
              </button>

            </div>

            {loadingProducts ? (

              <div className="loading-products">

                <div className="spinner"></div>

                <p>
                  Loading products...
                </p>

              </div>

            ) : products.length === 0 ? (

              <div className="empty-state">

                <div className="empty-line"></div>

                <h3>
                  No products in this section
                </h3>

                <p>
                  Products assigned to{" "}
                  {selectedSection.name}
                  {" "}will appear here.
                </p>

                <button
                  type="button"
                  onClick={() =>
                    router.push(
                      "/admin/products"
                    )
                  }
                >
                  Add Product
                </button>

              </div>

            ) : (

              <div className="products-grid">

                {products.map(
                  (product, index) => (

                    <article
                      key={product.id}
                      className="product-card"
                      style={{
                        animationDelay:
                          `${index * 0.05}s`,
                      }}
                    >

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

                      <div className="product-details">

                        <h3>
                          {product.name}
                        </h3>

                        <p>
                          {product.description}
                        </p>

                        <div className="product-footer">

                          <span>
                            {selectedSection.name}
                          </span>

                          <button
                            type="button"
                            onClick={() =>
                              router.push(
                                "/admin/products"
                              )
                            }
                          >
                            Manage
                          </button>

                        </div>

                      </div>

                    </article>

                  )
                )}

              </div>

            )}

          </section>

        ) : (

          <>

            {/* =================================================
               ADD SECTION
            ================================================== */}

            <section className="add-section-card">

              <div className="add-section-heading">

                <div>
                  <p className="eyebrow">
                    ORGANISATION
                  </p>

                  <h2>
                    Create a Section
                  </h2>

                  <p>
                    Sections help organise your
                    products on the website.
                  </p>
                </div>

              </div>

              <div className="add-section-form">

                <input
                  type="text"
                  placeholder="Example: Road Safety"
                  value={newSection}
                  onChange={(e) =>
                    setNewSection(
                      e.target.value
                    )
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      addSection();
                    }
                  }}
                />

                <textarea
                  placeholder="Section description"
                  value={newDescription}
                  onChange={(e) =>
                    setNewDescription(
                      e.target.value
                    )
                  }
                />

                <div className="image-upload-area">

                  <label
                    htmlFor="section-image"
                    className="image-upload-label"
                  >
                    Choose Section Photo
                  </label>

                  <input
                    id="section-image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                  />

                  {imagePreview && (
                    <div className="image-preview">
                      <img
                        src={imagePreview}
                        alt="Section preview"
                      />
                    </div>
                  )}

                </div>

                <button
                  type="button"
                  onClick={addSection}
                  disabled={adding}
                >
                  {adding
                    ? "Creating..."
                    : "Create Section"}
                </button>

              </div>

            </section>

            {/* =================================================
               SECTION LIST
            ================================================== */}

            <section className="sections-area">

              <div className="sections-heading">

                <div>
                  <p className="eyebrow">
                    CATALOGUE
                  </p>

                  <h2>
                    Your Sections
                  </h2>
                </div>

                <button
                  type="button"
                  className="refresh-button"
                  onClick={loadSections}
                  disabled={loading}
                >
                  Refresh
                </button>

              </div>

              {loading ? (

                <div className="loading-state">

                  <div className="spinner"></div>

                  <p>
                    Loading sections...
                  </p>

                </div>

              ) : sections.length === 0 ? (

                <div className="empty-state">

                  <div className="empty-line"></div>

                  <h3>
                    No sections yet
                  </h3>

                  <p>
                    Create your first product
                    section above.
                  </p>

                </div>

              ) : (

                <div className="sections-grid">

                  {sections.map(
                    (section, index) => (

                      <article
                        key={section.id}
                        className="section-card"
                        style={{
                          animationDelay:
                            `${index * 0.06}s`,
                        }}
                      >

                        <button
                          type="button"
                          className="section-main"
                          onClick={() =>
                            openSection(
                              section
                            )
                          }
                        >

                          {section.image_url ? (

                            <div className="section-image">
                              <img
                                src={
                                  section.image_url
                                }
                                alt={
                                  section.name
                                }
                              />
                            </div>

                          ) : (

                            <div className="section-icon">
                              {section.name
                                .charAt(0)
                                .toUpperCase()}
                            </div>

                          )}

                          <div className="section-info">

                            <h3>
                              {section.name}
                            </h3>

                            {section.description && (
                              <p>
                                {
                                  section.description
                                }
                              </p>
                            )}

                            <span>
                              Open section
                            </span>

                          </div>

                          <div className="arrow">
                            →
                          </div>

                        </button>

                        <div className="section-actions">

                          <button
                            type="button"
                            onClick={() =>
                              renameSection(
                                section
                              )
                            }
                          >
                            Rename
                          </button>

                          <button
                            type="button"
                            className="delete"
                            onClick={() =>
                              deleteSection(
                                section
                              )
                            }
                          >
                            Delete
                          </button>

                        </div>

                      </article>

                    )
                  )}

                </div>

              )}

            </section>
          </>

        )}

      </div>

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
          font-family: Arial, Helvetica, sans-serif;
        }

        /* =====================================================
           HEADER
        ====================================================== */

        .admin-header {
          position: sticky;
          top: 0;
          z-index: 1000;
          width: 100%;
          background: rgba(255, 255, 255, 0.96);
          backdrop-filter: blur(15px);
          border-bottom: 1px solid #e5e9ef;
        }

        .header-inner {
          max-width: 1400px;
          min-height: 76px;
          margin: 0 auto;
          padding: 0 35px;
          display: flex;
          align-items: center;
          gap: 45px;
        }

        .brand {
          flex-shrink: 0;
          border: none;
          background: transparent;
          display: flex;
          align-items: center;
          gap: 11px;
          cursor: pointer;
          padding: 0;
          margin: 0;
          text-align: left;
        }

        .brand-mark {
          width: 42px;
          height: 42px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #24549a;
          color: white;
          font-size: 25px;
          font-weight: 800;
          font-style: italic;
        }

        .brand-text {
          text-align: left;
        }

        .brand-text strong {
          display: block;
          font-size: 21px;
          line-height: 19px;
          color: #172b4d;
        }

        .brand-text span {
          display: block;
          margin-top: 4px;
          color: #24549a;
          font-size: 7px;
          letter-spacing: 3px;
          font-weight: 700;
        }

        /* =====================================================
           NAVIGATION FIX
        ====================================================== */

        .admin-nav {
          display: flex;
          align-items: center;
          gap: 4px;
          flex: 1;
          min-width: 0;
        }

        .admin-nav .nav-button {
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          flex: 0 0 auto;
          width: auto;
          height: auto;
          min-width: max-content;
          border: none;
          outline: none;
          background: transparent;
          padding: 11px 15px;
          margin: 0;
          border-radius: 8px;
          color: #637083;
          font-family: inherit;
          font-size: 13px;
          line-height: 1.2;
          font-weight: 600;
          cursor: pointer;
          transition:
            background 0.2s ease,
            color 0.2s ease;
          text-align: center;
          white-space: nowrap;
        }

        .admin-nav .nav-button span {
          position: relative;
          display: block;
          pointer-events: none;
        }

        .admin-nav .nav-button:hover {
          background: #f0f4f8;
          color: #24549a;
        }

        .admin-nav .nav-button.active {
          background: #edf3fb;
          color: #24549a;
        }

        .admin-nav .nav-button:focus-visible {
          outline: 2px solid #24549a;
          outline-offset: 2px;
        }

        .admin-label {
          flex-shrink: 0;
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 9px 13px;
          border-radius: 30px;
          background: #f5f7fa;
          color: #506176;
          font-size: 12px;
          font-weight: 700;
        }

        .status-dot {
          width: 7px;
          height: 7px;
          background: #35a66f;
          border-radius: 50%;
          box-shadow:
            0 0 0 4px rgba(53,166,111,0.12);
        }

        /* =====================================================
           HAMBURGER MENU
        ====================================================== */

        .hamburger {
          display: none;
          width: 42px;
          height: 42px;
          padding: 9px;
          border: 1px solid #e1e6ed;
          border-radius: 9px;
          background: white;
          cursor: pointer;

          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 5px;

          margin-left: auto;

          transition:
            background 0.2s ease,
            border-color 0.2s ease;
        }

        .hamburger:hover {
          background: #f5f7fa;
          border-color: #24549a;
        }

        .hamburger span {
          display: block;
          width: 19px;
          height: 2px;
          border-radius: 2px;
          background: #172b4d;

          transition:
            transform 0.25s ease,
            opacity 0.2s ease;
        }

        .hamburger.open span:nth-child(1) {
          transform: translateY(7px) rotate(45deg);
        }

        .hamburger.open span:nth-child(2) {
          opacity: 0;
        }

        .hamburger.open span:nth-child(3) {
          transform: translateY(-7px) rotate(-45deg);
        }

        /* =====================================================
           MOBILE MENU
        ====================================================== */

        .mobile-menu {
          display: none;
        }

        /* =====================================================
           CONTENT
        ====================================================== */

        .content {
          max-width: 1400px;
          margin: 0 auto;
          padding: 55px 35px 80px;
        }

        .page-intro {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 30px;
          margin-bottom: 38px;
          animation: fadeUp 0.5s ease both;
        }

        .eyebrow {
          margin: 0 0 9px;
          color: #24549a;
          font-size: 10px;
          letter-spacing: 2.5px;
          font-weight: 800;
        }

        .page-intro h1 {
          margin: 0;
          font-size: 43px;
          line-height: 1.1;
          letter-spacing: -1.5px;
        }

        .intro-text {
          margin: 13px 0 0;
          max-width: 580px;
          color: #718096;
          font-size: 14px;
          line-height: 1.7;
        }

        .section-count {
          min-width: 125px;
          padding: 18px 22px;
          border-radius: 13px;
          background: white;
          border: 1px solid #e6eaf0;
          text-align: center;
          box-shadow:
            0 5px 20px rgba(24,50,80,0.04);
        }

        .section-count span {
          display: block;
          font-size: 30px;
          font-weight: 800;
          color: #24549a;
        }

        .section-count small {
          color: #8290a3;
          font-size: 11px;
        }

        /* =====================================================
           MESSAGE
        ====================================================== */

        .message {
          padding: 14px 18px;
          margin-bottom: 25px;
          border-radius: 10px;
          font-size: 13px;
          font-weight: 600;
          animation: fadeUp 0.3s ease both;
        }

        .message.success {
          color: #216e4e;
          background: #ecfdf5;
          border: 1px solid #c6f0dd;
        }

        .message.error {
          color: #b42318;
          background: #fff3f2;
          border: 1px solid #ffd7d3;
        }

        /* =====================================================
           ADD SECTION
        ====================================================== */

        .add-section-card {
          background: white;
          border: 1px solid #e6eaf0;
          border-radius: 18px;
          padding: 32px;
          margin-bottom: 55px;
          box-shadow:
            0 8px 30px rgba(24,50,80,0.04);
          animation: fadeUp 0.6s ease both;
        }

        .add-section-heading h2,
        .sections-heading h2,
        .detail-header h2 {
          margin: 0;
          font-size: 24px;
          letter-spacing: -0.5px;
        }

        .add-section-heading p:last-child,
        .detail-header p {
          margin: 8px 0 0;
          color: #7b8798;
          font-size: 13px;
        }

        .add-section-form {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-top: 27px;
        }

        .add-section-form input,
        .add-section-form textarea {
          width: 100%;
          border: 1px solid #dce2ea;
          background: #fbfcfd;
          color: #172b4d;
          border-radius: 9px;
          padding: 14px;
          outline: none;
          font-size: 13px;
          font-family: inherit;
        }

        .add-section-form textarea {
          min-height: 100px;
          resize: vertical;
        }

        .add-section-form input:focus,
        .add-section-form textarea:focus {
          background: white;
          border-color: #24549a;
          box-shadow:
            0 0 0 4px rgba(36,84,154,0.08);
        }

        .image-upload-area {
          display: flex;
          align-items: center;
          gap: 15px;
          flex-wrap: wrap;
          padding: 5px 0;
        }

        .image-upload-area input[type="file"] {
          display: none;
        }

        .image-upload-label {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border: 1px solid #dce2ea;
          background: white;
          color: #52647a;
          padding: 11px 16px;
          border-radius: 9px;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .image-upload-label:hover {
          border-color: #24549a;
          color: #24549a;
          background: #f5f8fc;
        }

        .image-preview {
          width: 90px;
          height: 65px;
          border-radius: 8px;
          overflow: hidden;
          border: 1px solid #e1e6ed;
          background: #edf1f5;
        }

        .image-preview img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .add-section-form button,
        .add-product-button {
          align-self: flex-start;
          border: none;
          background: #24549a;
          color: white;
          padding: 13px 21px;
          border-radius: 9px;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .add-section-form button:hover,
        .add-product-button:hover {
          background: #1d457e;
          transform: translateY(-1px);
        }

        .add-section-form button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        /* =====================================================
           SECTIONS
        ====================================================== */

        .sections-heading {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 25px;
        }

        .refresh-button {
          border: 1px solid #dce2ea;
          background: white;
          color: #52647a;
          padding: 10px 15px;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
        }

        .sections-grid {
          display: grid;
          grid-template-columns:
            repeat(auto-fill, minmax(300px, 1fr));
          gap: 20px;
        }

        .section-card {
          background: white;
          border: 1px solid #e6eaf0;
          border-radius: 14px;
          overflow: hidden;
          box-shadow:
            0 5px 22px rgba(24,50,80,0.04);
          opacity: 0;
          animation: cardEnter 0.5s ease forwards;
          transition:
            transform 0.25s ease,
            box-shadow 0.25s ease;
        }

        .section-card:hover {
          transform: translateY(-4px);
          box-shadow:
            0 14px 35px rgba(24,50,80,0.09);
        }

        .section-main {
          width: 100%;
          border: none;
          background: white;
          padding: 23px;
          display: flex;
          align-items: center;
          gap: 16px;
          text-align: left;
          cursor: pointer;
        }

        .section-icon {
          flex-shrink: 0;
          width: 48px;
          height: 48px;
          border-radius: 11px;
          background: #edf3fb;
          color: #24549a;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 19px;
          font-weight: 800;
        }

        .section-image {
          flex-shrink: 0;
          width: 70px;
          height: 70px;
          border-radius: 11px;
          overflow: hidden;
          background: #edf1f5;
        }

        .section-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .section-info {
          flex: 1;
          min-width: 0;
        }

        .section-info h3 {
          margin: 0;
          color: #172b4d;
          font-size: 16px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .section-info p {
          margin: 6px 0 0;
          color: #718096;
          font-size: 11px;
          line-height: 1.5;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .section-info span {
          display: block;
          margin-top: 6px;
          color: #8995a5;
          font-size: 10px;
        }

        .arrow {
          color: #24549a;
          font-size: 20px;
          transition: transform 0.2s ease;
        }

        .section-main:hover .arrow {
          transform: translateX(4px);
        }

        .section-actions {
          display: flex;
          gap: 18px;
          padding: 12px 23px;
          border-top: 1px solid #edf0f4;
        }

        .section-actions button {
          border: none;
          background: transparent;
          padding: 0;
          color: #52647a;
          font-size: 11px;
          font-weight: 700;
          cursor: pointer;
        }

        .section-actions button:hover {
          color: #24549a;
        }

        .section-actions button.delete {
          color: #b42318;
        }

        /* =====================================================
           DETAIL VIEW
        ====================================================== */

        .back-button {
          border: none;
          background: transparent;
          color: #52647a;
          padding: 0;
          margin-bottom: 30px;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
        }

        .back-button:hover {
          color: #24549a;
        }

        .back-button span {
          margin-right: 8px;
          font-size: 16px;
        }

        .detail-header {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 25px;
          margin-bottom: 30px;
          animation: fadeUp 0.4s ease both;
        }

        .detail-section-info {
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .detail-section-image {
          flex-shrink: 0;
          width: 120px;
          height: 100px;
          border-radius: 12px;
          overflow: hidden;
          background: #edf1f5;
        }

        .detail-section-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        /* =====================================================
           PRODUCTS
        ====================================================== */

        .products-grid {
          display: grid;
          grid-template-columns:
            repeat(auto-fill, minmax(275px, 1fr));
          gap: 22px;
        }

        .product-card {
          background: white;
          border: 1px solid #e6eaf0;
          border-radius: 14px;
          overflow: hidden;
          box-shadow:
            0 5px 22px rgba(24,50,80,0.04);
          opacity: 0;
          animation: cardEnter 0.5s ease forwards;
          transition:
            transform 0.25s ease,
            box-shadow 0.25s ease;
        }

        .product-card:hover {
          transform: translateY(-5px);
          box-shadow:
            0 14px 35px rgba(24,50,80,0.10);
        }

        .product-image {
          height: 215px;
          background: #edf1f5;
          overflow: hidden;
        }

        .product-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.4s ease;
        }

        .product-card:hover img {
          transform: scale(1.04);
        }

        .no-image {
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #8995a5;
          font-size: 12px;
        }

        .product-details {
          padding: 20px;
        }

        .product-details h3 {
          margin: 0;
          color: #172b4d;
          font-size: 17px;
        }

        .product-details p {
          margin: 9px 0 18px;
          color: #718096;
          font-size: 12px;
          line-height: 1.65;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .product-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 14px;
          border-top: 1px solid #edf0f4;
        }

        .product-footer span {
          color: #65758b;
          font-size: 10px;
          font-weight: 700;
        }

        .product-footer button {
          border: none;
          background: transparent;
          color: #24549a;
          font-size: 11px;
          font-weight: 700;
          cursor: pointer;
        }

        /* =====================================================
           EMPTY / LOADING
        ====================================================== */

        .empty-state {
          background: white;
          border: 1px solid #e6eaf0;
          border-radius: 16px;
          padding: 70px 30px;
          text-align: center;
        }

        .empty-line {
          width: 50px;
          height: 2px;
          background: #24549a;
          margin: 0 auto 22px;
        }

        .empty-state h3 {
          margin: 0;
          color: #172b4d;
          font-size: 20px;
        }

        .empty-state p {
          color: #7b8798;
          font-size: 13px;
          margin: 9px 0 20px;
        }

        .empty-state button {
          border: none;
          background: #24549a;
          color: white;
          padding: 11px 18px;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
        }

        .loading-state,
        .loading-products {
          background: white;
          border: 1px solid #e6eaf0;
          border-radius: 16px;
          padding: 60px;
          text-align: center;
          color: #7b8798;
          font-size: 13px;
        }

        .spinner {
          width: 26px;
          height: 26px;
          border: 3px solid #e6edf5;
          border-top-color: #24549a;
          border-radius: 50%;
          margin: 0 auto 14px;
          animation: spin 0.8s linear infinite;
        }

        /* =====================================================
           ANIMATIONS
        ====================================================== */

        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(18px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes cardEnter {
          from {
            opacity: 0;
            transform: translateY(15px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        /* =====================================================
           RESPONSIVE
        ====================================================== */

        @media (max-width: 900px) {

          .header-inner {
            min-height: 70px;
            padding: 12px 20px;
            gap: 15px;
            flex-wrap: nowrap;
          }

          .desktop-nav {
            display: none;
          }

          .admin-label {
            margin-left: auto;
          }

          .hamburger {
            display: flex;
          }

          .mobile-menu {
            display: flex;
            flex-direction: column;

            background: white;
            border-top: 1px solid #e5e9ef;

            padding: 8px 20px 15px;

            max-height: 0;
            overflow: hidden;
            opacity: 0;

            transition:
              max-height 0.3s ease,
              opacity 0.25s ease,
              padding 0.3s ease;
          }

          .mobile-menu-open {
            max-height: 300px;
            opacity: 1;
            padding: 10px 20px 18px;
          }

          .mobile-nav-button {
            width: 100%;
            border: none;
            background: transparent;

            color: #637083;

            padding: 14px 15px;
            border-radius: 8px;

            text-align: left;

            font-family: inherit;
            font-size: 13px;
            font-weight: 600;

            cursor: pointer;

            transition:
              background 0.2s ease,
              color 0.2s ease;
          }

          .mobile-nav-button:hover {
            background: #f0f4f8;
            color: #24549a;
          }

          .mobile-nav-button.active {
            background: #edf3fb;
            color: #24549a;
          }

          .content {
            padding: 40px 20px 60px;
          }

        }

        @media (max-width: 650px) {

          .content {
            padding: 30px 15px 50px;
          }

          .page-intro {
            align-items: flex-start;
            flex-direction: column;
          }

          .page-intro h1 {
            font-size: 34px;
          }

          .add-section-card {
            padding: 22px;
          }

          .sections-heading {
            align-items: flex-start;
            gap: 15px;
          }

          .detail-header {
            align-items: flex-start;
            flex-direction: column;
          }

          .detail-section-info {
            align-items: flex-start;
            flex-direction: column;
          }

          .admin-label {
            display: none;
          }

        }

      `}</style>

    </main>
  );
}