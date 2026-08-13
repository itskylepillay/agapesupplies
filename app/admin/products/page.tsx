"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

type Section = {
  id: number;
  name: string;
};

type Product = {
  id: number;
  name: string;
  description: string;
  image_url: string;
  section_id: number;
  sections: {
    name: string;
  }[];
};

export default function ProductsPage() {
  const router = useRouter();

  const [sections, setSections] = useState<Section[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [sectionId, setSectionId] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");

  const [loading, setLoading] = useState(false);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<
    "success" | "error" | ""
  >("");

  useEffect(() => {
    loadSections();
    loadProducts();
  }, []);

  // =========================================================
  // LOAD SECTIONS
  // =========================================================

  async function loadSections() {
    const { data, error } = await supabase
      .from("sections")
      .select("id, name")
      .order("name", { ascending: true });

    if (error) {
      console.error("Sections error:", error);
      showMessage("Could not load sections.", "error");
      return;
    }

    setSections(data || []);
  }

  // =========================================================
  // LOAD PRODUCTS
  // =========================================================

  async function loadProducts() {
    setLoadingProducts(true);

    const { data, error } = await supabase
      .from("products")
      .select(`
        id,
        name,
        description,
        image_url,
        section_id,
        sections (
          name
        )
      `)
      .order("id", { ascending: false });

    if (error) {
      console.error("Products error:", error);
      showMessage("Could not load products.", "error");
      setLoadingProducts(false);
      return;
    }

    setProducts((data as Product[]) || []);
    setLoadingProducts(false);
  }

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
  // IMAGE SELECTION
  // =========================================================

  function handleImageChange(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    const selectedFile = e.target.files?.[0] || null;

    setImage(selectedFile);

    if (selectedFile) {
      const previewUrl = URL.createObjectURL(selectedFile);
      setImagePreview(previewUrl);
    } else {
      setImagePreview("");
    }
  }

  // =========================================================
  // ADD PRODUCT
  // =========================================================

  async function handleAddProduct(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    setMessage("");
    setMessageType("");

    if (!name.trim()) {
      showMessage("Please enter a product name.", "error");
      return;
    }

    if (!description.trim()) {
      showMessage(
        "Please enter a product description.",
        "error"
      );
      return;
    }

    if (!sectionId) {
      showMessage("Please select a section.", "error");
      return;
    }

    if (!image) {
      showMessage(
        "Please select a product image.",
        "error"
      );
      return;
    }

    try {
      setLoading(true);

      // -------------------------------------------------------
      // CREATE UNIQUE IMAGE NAME
      // -------------------------------------------------------

      const extension = image.name.split(".").pop();

      const fileName =
        `products/${Date.now()}-${Math.random()
          .toString(36)
          .substring(2)}.${extension}`;

      // -------------------------------------------------------
      // UPLOAD IMAGE TO SUPABASE STORAGE
      // -------------------------------------------------------

      const { error: uploadError } =
        await supabase.storage
          .from("product-images")
          .upload(fileName, image);

      if (uploadError) {
        console.error(
          "Image upload error:",
          uploadError
        );

        showMessage(
          `Image upload failed: ${uploadError.message}`,
          "error"
        );

        return;
      }

      // -------------------------------------------------------
      // GET PUBLIC IMAGE URL
      // -------------------------------------------------------

      const { data: publicUrlData } =
        supabase.storage
          .from("product-images")
          .getPublicUrl(fileName);

      const imageUrl =
        publicUrlData.publicUrl;

      // -------------------------------------------------------
      // SAVE PRODUCT TO DATABASE
      // -------------------------------------------------------

      const { error: productError } =
        await supabase
          .from("products")
          .insert({
            name: name.trim(),
            description: description.trim(),
            image_url: imageUrl,
            section_id: Number(sectionId),
          });

      if (productError) {
        console.error(
          "Product error:",
          productError
        );

        showMessage(
          `Product could not be added: ${productError.message}`,
          "error"
        );

        return;
      }

      // -------------------------------------------------------
      // RESET FORM
      // -------------------------------------------------------

      setName("");
      setDescription("");
      setSectionId("");
      setImage(null);
      setImagePreview("");

      const fileInput =
        document.getElementById(
          "product-image"
        ) as HTMLInputElement | null;

      if (fileInput) {
        fileInput.value = "";
      }

      showMessage(
        "Product added successfully.",
        "success"
      );

      // -------------------------------------------------------
      // REFRESH PRODUCTS
      // -------------------------------------------------------

      await loadProducts();
    } catch (error) {
      console.error(error);

      showMessage(
        "Something unexpected went wrong.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  }

  // =========================================================
  // DELETE PRODUCT
  // =========================================================

  async function deleteProduct(product: Product) {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${product.name}"?`
    );

    if (!confirmed) {
      return;
    }

    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", product.id);

    if (error) {
      console.error(error);

      showMessage(
        `Could not delete product: ${error.message}`,
        "error"
      );

      return;
    }

    setProducts((currentProducts) =>
      currentProducts.filter(
        (item) => item.id !== product.id
      )
    );

    showMessage(
      "Product deleted successfully.",
      "success"
    );
  }

  // =========================================================
  // PAGE
  // =========================================================

  return (
    <main className="admin-page">

      {/* =====================================================
          ADMIN NAVIGATION
      ====================================================== */}

      <header className="admin-header">
  <div className="header-inner">

    {/* BRAND */}

    <button
      type="button"
      className="brand"
      onClick={() => router.push("/admin")}
    >
      <div className="brand-mark">
        A
      </div>

      <div className="brand-text">
        <strong>Agape</strong>
        <span>SUPPLIES</span>
      </div>
    </button>

    {/* DESKTOP NAVIGATION */}

    <nav className="admin-nav desktop-nav">

      <button
        type="button"
        className="nav-button"
        onClick={() => router.push("/admin")}
      >
        Dashboard
      </button>

      <button
        type="button"
        className="nav-button active"
        onClick={() => router.push("/admin/products")}
      >
        Products
      </button>

      <button
        type="button"
        className="nav-button"
        onClick={() => router.push("/admin/sections")}
      >
        Sections
      </button>

      <button
        type="button"
        className="nav-button"
        onClick={() => router.push("/")}
      >
        View Website
      </button>

    </nav>

    {/* ADMIN LABEL */}

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
      onClick={() => {
        setMenuOpen(false);
        router.push("/admin");
      }}
    >
      Dashboard
    </button>

    <button
      type="button"
      className="mobile-nav-button active"
      onClick={() => {
        setMenuOpen(false);
        router.push("/admin/products");
      }}
    >
      Products
    </button>

    <button
      type="button"
      className="mobile-nav-button"
      onClick={() => {
        setMenuOpen(false);
        router.push("/admin/sections");
      }}
    >
      Sections
    </button>

    <button
      type="button"
      className="mobile-nav-button"
      onClick={() => {
        setMenuOpen(false);
        router.push("/");
      }}
    >
      View Website
    </button>

  </div>
</header>

      {/* =====================================================
          CONTENT
      ====================================================== */}

      <div className="content">

        {/* PAGE INTRO */}

        <section className="page-intro">

          <div>

            <p className="eyebrow">
              ADMINISTRATION
            </p>

            <h1>
              Products
            </h1>

            <p className="intro-text">
              Add and manage the products displayed
              throughout the Agape Supplies website.
            </p>

          </div>

          <div className="product-count">

            <span>
              {products.length}
            </span>

            <small>
              {products.length === 1
                ? "Product"
                : "Products"}
            </small>

          </div>

        </section>

        {/* =====================================================
            MESSAGE
        ====================================================== */}

        {message && (
          <div
            className={`message ${
              messageType === "success"
                ? "success"
                : "error"
            }`}
          >
            <span>
              {message}
            </span>
          </div>
        )}

        {/* =====================================================
            ADD PRODUCT
        ====================================================== */}

        <section className="add-product-card">

          <div className="section-heading">

            <div>

              <p className="eyebrow">
                PRODUCT MANAGEMENT
              </p>

              <h2>
                Add a Product
              </h2>

              <p>
                Create a new product and assign it
                to one of your website sections.
              </p>

            </div>

          </div>

          <form
            onSubmit={handleAddProduct}
            className="product-form"
          >

            {/* LEFT SIDE */}

            <div className="form-fields">

              {/* NAME */}

              <div className="field">

                <label htmlFor="product-name">
                  Product Name
                </label>

                <input
                  id="product-name"
                  type="text"
                  value={name}
                  onChange={(e) =>
                    setName(e.target.value)
                  }
                  placeholder="Example: Safety Helmet"
                />

              </div>

              {/* DESCRIPTION */}

              <div className="field">

                <label htmlFor="product-description">
                  Description
                </label>

                <textarea
                  id="product-description"
                  value={description}
                  onChange={(e) =>
                    setDescription(
                      e.target.value
                    )
                  }
                  placeholder="Describe the product and its features..."
                  rows={7}
                />

              </div>

              {/* SECTION */}

              <div className="field">

                <label htmlFor="product-section">
                  Section
                </label>

                <select
                  id="product-section"
                  value={sectionId}
                  onChange={(e) =>
                    setSectionId(
                      e.target.value
                    )
                  }
                >

                  <option value="">
                    Select a section
                  </option>

                  {sections.map(
                    (section) => (
                      <option
                        key={section.id}
                        value={section.id}
                      >
                        {section.name}
                      </option>
                    )
                  )}

                </select>

                {sections.length === 0 && (
                  <p className="field-note">
                    No sections have been created yet.
                    Create a section before adding
                    products.
                  </p>
                )}

              </div>

            </div>

            {/* RIGHT SIDE — IMAGE */}

            <div className="image-upload-area">

              <label
                htmlFor="product-image"
                className="image-upload-box"
              >

                {imagePreview ? (
                  <div className="preview-container">

                    <img
                      src={imagePreview}
                      alt="Product preview"
                    />

                    <div className="change-image">
                      Change image
                    </div>

                  </div>
                ) : (
                  <div className="upload-placeholder">

                    <div className="upload-icon">
                      +
                    </div>

                    <strong>
                      Upload Product Image
                    </strong>

                    <span>
                      Click here to choose an image
                    </span>

                    <small>
                      JPG, PNG or WEBP
                    </small>

                  </div>
                )}

              </label>

              <input
                id="product-image"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleImageChange}
                className="hidden-file-input"
              />

              <button
                type="submit"
                disabled={loading}
                className="add-button"
              >
                {loading
                  ? "Adding Product..."
                  : "Add Product"}
              </button>

            </div>

          </form>

        </section>

        {/* =====================================================
            EXISTING PRODUCTS
        ====================================================== */}

        <section className="products-section">

          <div className="products-heading">

            <div>

              <p className="eyebrow">
                CATALOGUE
              </p>

              <h2>
                Existing Products
              </h2>

            </div>

            <button
              type="button"
              className="refresh-button"
              onClick={loadProducts}
              disabled={loadingProducts}
            >
              {loadingProducts
                ? "Loading..."
                : "Refresh"}
            </button>

          </div>

          {/* LOADING */}

          {loadingProducts ? (

            <div className="loading-grid">

              {[1, 2, 3].map(
                (item) => (
                  <div
                    key={item}
                    className="skeleton-card"
                  >

                    <div className="skeleton-image"></div>

                    <div className="skeleton-content">

                      <div className="skeleton-line"></div>

                      <div className="skeleton-line short"></div>

                      <div className="skeleton-line smaller"></div>

                    </div>

                  </div>
                )
              )}

            </div>

          ) : products.length === 0 ? (

            <div className="empty-state">

              <div className="empty-line"></div>

              <h3>
                No products yet
              </h3>

              <p>
                Your products will appear here
                once you add them.
              </p>

              <button
                type="button"
                onClick={() =>
                  window.scrollTo({
                    top: 0,
                    behavior: "smooth",
                  })
                }
              >
                Add your first product
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

                    {/* IMAGE */}

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

                      <div className="product-section-badge">

                        {product.sections?.[0]
                          ?.name ||
                          "Unassigned"}

                      </div>

                    </div>

                    {/* DETAILS */}

                    <div className="product-details">

                      <h3>
                        {product.name}
                      </h3>

                      <p>
                        {product.description}
                      </p>

                      <div className="product-footer">

                        <span className="section-name">

                          {product.sections?.[0]
                            ?.name ||
                            "Unknown section"}

                        </span>

                        <button
                          type="button"
                          className="delete-button"
                          onClick={() =>
                            deleteProduct(
                              product
                            )
                          }
                        >
                          Delete
                        </button>

                      </div>

                    </div>

                  </article>

                )
              )}

            </div>

          )}

        </section>

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
          background: rgba(255, 255, 255, 0.96);
          backdrop-filter: blur(15px);
          border-bottom: 1px solid #e5e9ef;
        }

        .header-inner {
          max-width: 1400px;
          margin: 0 auto;
          min-height: 76px;
          padding: 0 35px;
          display: flex;
          align-items: center;
          gap: 45px;
          position: relative;
          z-index: 10;
        }

        .brand {
          border: none;
          background: transparent;
          display: flex;
          align-items: center;
          gap: 11px;
          cursor: pointer;
          padding: 0;
          text-align: left;
          position: relative;
          z-index: 11;
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

        .admin-nav {
          display: flex;
          align-items: center;
          gap: 4px;
          flex: 1;
          position: relative;
          z-index: 10;
        }

        .nav-button {
          position: relative;
          z-index: 11;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border: none;
          background: transparent;
          padding: 11px 15px;
          margin: 0;
          border-radius: 8px;
          color: #637083;
          font-family: inherit;
          font-size: 13px;
          font-weight: 600;
          line-height: 1;
          cursor: pointer;
          pointer-events: auto;
          transition:
            background 0.2s ease,
            color 0.2s ease;
        }

        .nav-button:hover {
          background: #f0f4f8;
          color: #24549a;
        }

        .nav-button.active {
          background: #edf3fb;
          color: #24549a;
        }

        .nav-button:focus-visible {
          outline: 2px solid #24549a;
          outline-offset: 2px;
        }

        .admin-label {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 9px 13px;
          border-radius: 30px;
          background: #f5f7fa;
          color: #506176;
          font-size: 12px;
          font-weight: 700;
          position: relative;
          z-index: 11;
        }

        .status-dot {
          width: 7px;
          height: 7px;
          background: #35a66f;
          border-radius: 50%;
          box-shadow:
            0 0 0 4px
            rgba(53, 166, 111, 0.12);
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
          color: #172b4d;
        }

        .intro-text {
          margin: 13px 0 0;
          max-width: 580px;
          color: #718096;
          font-size: 14px;
          line-height: 1.7;
        }

        .product-count {
          min-width: 125px;
          padding: 18px 22px;
          border-radius: 13px;
          background: white;
          border: 1px solid #e6eaf0;
          text-align: center;
          box-shadow:
            0 5px 20px
            rgba(24, 50, 80, 0.04);
        }

        .product-count span {
          display: block;
          font-size: 30px;
          font-weight: 800;
          color: #24549a;
        }

        .product-count small {
          display: block;
          margin-top: 2px;
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
           ADD PRODUCT
        ====================================================== */

        .add-product-card {
          background: white;
          border: 1px solid #e6eaf0;
          border-radius: 18px;
          padding: 35px;
          margin-bottom: 60px;
          box-shadow:
            0 8px 30px
            rgba(24, 50, 80, 0.04);
          animation: fadeUp 0.6s ease both;
        }

        .section-heading {
          margin-bottom: 32px;
        }

        .section-heading h2,
        .products-heading h2 {
          margin: 0;
          color: #172b4d;
          font-size: 24px;
          letter-spacing: -0.5px;
        }

        .section-heading p:last-child {
          margin: 9px 0 0;
          color: #7b8798;
          font-size: 13px;
          line-height: 1.6;
        }

        .product-form {
          display: grid;
          grid-template-columns: 1.2fr 0.8fr;
          gap: 45px;
        }

        .form-fields {
          display: flex;
          flex-direction: column;
          gap: 21px;
        }

        .field {
          display: flex;
          flex-direction: column;
        }

        .field label {
          color: #344054;
          font-size: 12px;
          font-weight: 700;
          margin-bottom: 8px;
        }

        .field input,
        .field textarea,
        .field select {
          width: 100%;
          border: 1px solid #dce2ea;
          background: #fbfcfd;
          color: #172b4d;
          border-radius: 9px;
          padding: 13px 14px;
          outline: none;
          font-family: inherit;
          font-size: 13px;
          transition: all 0.2s ease;
        }

        .field textarea {
          resize: vertical;
          min-height: 130px;
        }

        .field input:focus,
        .field textarea:focus,
        .field select:focus {
          background: white;
          border-color: #24549a;
          box-shadow:
            0 0 0 4px
            rgba(36, 84, 154, 0.08);
        }

        .field-note {
          margin: 8px 0 0;
          color: #9a6b22;
          font-size: 11px;
        }

        /* =====================================================
           IMAGE UPLOAD
        ====================================================== */

        .image-upload-area {
          display: flex;
          flex-direction: column;
        }

        .image-upload-box {
          width: 100%;
          min-height: 300px;
          border: 1.5px dashed #cbd5e1;
          border-radius: 13px;
          background: #f9fafc;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          overflow: hidden;
          transition: all 0.25s ease;
        }

        .image-upload-box:hover {
          border-color: #24549a;
          background: #f5f8fc;
        }

        .upload-placeholder {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding: 25px;
        }

        .upload-icon {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: #eaf1fa;
          color: #24549a;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 28px;
          font-weight: 300;
          margin-bottom: 17px;
        }

        .upload-placeholder strong {
          color: #344054;
          font-size: 13px;
        }

        .upload-placeholder span {
          color: #7b8798;
          font-size: 11px;
          margin-top: 7px;
        }

        .upload-placeholder small {
          color: #a0a9b5;
          font-size: 10px;
          margin-top: 14px;
        }

        .hidden-file-input {
          display: none;
        }

        .preview-container {
          width: 100%;
          height: 300px;
          position: relative;
        }

        .preview-container img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .change-image {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          padding: 12px;
          text-align: center;
          background: rgba(20, 35, 55, 0.82);
          color: white;
          font-size: 12px;
          font-weight: 600;
        }

        .add-button {
          margin-top: 18px;
          border: none;
          border-radius: 9px;
          padding: 14px 22px;
          background: #24549a;
          color: white;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .add-button:hover:not(:disabled) {
          background: #1d457e;
          transform: translateY(-1px);
          box-shadow:
            0 8px 20px
            rgba(36, 84, 154, 0.2);
        }

        .add-button:disabled {
          opacity: 0.55;
          cursor: not-allowed;
        }

        /* =====================================================
           PRODUCTS
        ====================================================== */

        .products-heading {
          display: flex;
          align-items: center;
          justify-content: space-between;
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
          transition: all 0.2s ease;
        }

        .refresh-button:hover:not(:disabled) {
          border-color: #24549a;
          color: #24549a;
        }

        .refresh-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .products-grid {
          display: grid;
          grid-template-columns:
            repeat(
              auto-fill,
              minmax(275px, 1fr)
            );
          gap: 22px;
        }

        .product-card {
          background: white;
          border: 1px solid #e6eaf0;
          border-radius: 14px;
          overflow: hidden;
          box-shadow:
            0 5px 22px
            rgba(24, 50, 80, 0.04);
          opacity: 0;
          animation:
            cardEnter 0.5s ease forwards;
          transition:
            transform 0.25s ease,
            box-shadow 0.25s ease;
        }

        .product-card:hover {
          transform: translateY(-5px);
          box-shadow:
            0 14px 35px
            rgba(24, 50, 80, 0.10);
        }

        .product-image {
          height: 215px;
          position: relative;
          background: #edf1f5;
          overflow: hidden;
        }

        .product-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition:
            transform 0.4s ease;
        }

        .product-card:hover
        .product-image img {
          transform: scale(1.04);
        }

        .product-section-badge {
          position: absolute;
          left: 13px;
          top: 13px;
          max-width: calc(100% - 26px);
          padding: 7px 10px;
          border-radius: 6px;
          background:
            rgba(255, 255, 255, 0.93);
          backdrop-filter: blur(8px);
          color: #24549a;
          font-size: 10px;
          font-weight: 700;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
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
          line-height: 1.3;
        }

        .product-details > p {
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
          gap: 12px;
          padding-top: 14px;
          border-top: 1px solid #edf0f4;
        }

        .section-name {
          color: #65758b;
          font-size: 10px;
          font-weight: 700;
          max-width: 60%;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .delete-button {
          border: none;
          background: transparent;
          color: #b42318;
          padding: 6px 0;
          font-size: 11px;
          font-weight: 700;
          cursor: pointer;
          transition: color 0.2s ease;
        }

        .delete-button:hover {
          color: #7f1d1d;
          text-decoration: underline;
        }

        /* =====================================================
           EMPTY STATE
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

        /* =====================================================
           LOADING SKELETON
        ====================================================== */

        .loading-grid {
          display: grid;
          grid-template-columns:
            repeat(
              auto-fill,
              minmax(275px, 1fr)
            );
          gap: 22px;
        }

        .skeleton-card {
          background: white;
          border-radius: 14px;
          overflow: hidden;
          border: 1px solid #e6eaf0;
        }

        .skeleton-image {
          height: 215px;
          background: linear-gradient(
            90deg,
            #edf0f3,
            #f7f8f9,
            #edf0f3
          );
          background-size: 200% 100%;
          animation:
            skeleton 1.4s infinite;
        }

        .skeleton-content {
          padding: 20px;
        }

        .skeleton-line {
          height: 15px;
          border-radius: 4px;
          background: #edf0f3;
          margin-bottom: 12px;
          animation:
            skeleton 1.4s infinite;
        }

        .skeleton-line.short {
          width: 75%;
        }

        .skeleton-line.smaller {
          width: 45%;
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

        @keyframes skeleton {
          0% {
            background-position: 200% 0;
          }

          100% {
            background-position: -200% 0;
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

  .product-form {
    grid-template-columns: 1fr;
    gap: 30px;
  }

}


        /* =====================================================
   HAMBURGER MENU
===================================================== */

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

/* TURN HAMBURGER INTO X */

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
===================================================== */

.mobile-menu {
  display: none;
}


/* =====================================================
   RESPONSIVE NAVIGATION
===================================================== */

@media (max-width: 900px) {

  .header-inner {
    min-height: 70px;
    padding: 12px 20px;
    gap: 15px;
    flex-wrap: nowrap;
  }

  /* Hide desktop navigation */

  .desktop-nav {
    display: none;
  }

  /* Keep admin label */

  .admin-label {
    margin-left: auto;
  }

  /* Show hamburger */

  .hamburger {
    display: flex;
  }

  /* Mobile dropdown */

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

}

      `}</style>

    </main>
  );
}