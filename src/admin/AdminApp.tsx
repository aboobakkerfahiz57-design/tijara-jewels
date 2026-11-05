
import React, { useMemo, useState } from "react";

type Product = {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
  status: "Published" | "Draft";
};

type Order = {
  id: string;
  customer: string;
  date: string;
  total: number;
  status: string;
};

const initialProducts: Product[] = [
  { id: 1, name: "Pearl Elegance Necklace", category: "Necklaces", price: 499, stock: 24, status: "Published" },
  { id: 2, name: "Golden Butterfly Earrings", category: "Earrings", price: 299, stock: 18, status: "Published" },
  { id: 3, name: "Korean Bow Bracelet", category: "Bracelets", price: 249, stock: 32, status: "Published" },
  { id: 4, name: "Crystal Hair Claw", category: "Hair Accessories", price: 199, stock: 12, status: "Draft" },
];

const initialOrders: Order[] = [
  { id: "TIJ-1001", customer: "Sample Customer", date: "05 Nov 2026", total: 798, status: "Pending confirmation" },
  { id: "TIJ-1002", customer: "Demo Customer", date: "04 Nov 2026", total: 499, status: "Confirmed" },
  { id: "TIJ-1003", customer: "Test Customer", date: "03 Nov 2026", total: 299, status: "Delivered" },
];

const money = (amount: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);

const navItems = [
  ["Overview", "⌂"],
  ["Products", "◇"],
  ["Orders", "▤"],
  ["Inventory", "▦"],
  ["Customers", "♙"],
  ["Promotions", "✧"],
  ["Delivery", "➜"],
  ["Finance", "₹"],
  ["Reports", "▥"],
  ["Staff", "♧"],
  ["Settings", "⚙"],
];

export default function AdminApp() {
  const [page, setPage] = useState("Overview");
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem("tijara_admin_products");
      return saved ? JSON.parse(saved) : initialProducts;
    } catch {
      return initialProducts;
    }
  });
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [productForm, setProductForm] = useState({
    name: "",
    category: "Necklaces",
    price: "",
    stock: "",
  });
  const [notice, setNotice] = useState("");

  const saveProducts = (next: Product[]) => {
    setProducts(next);
    localStorage.setItem("tijara_admin_products", JSON.stringify(next));
  };

  const filteredProducts = useMemo(
    () =>
      products.filter((product) =>
        `${product.name} ${product.category}`
          .toLowerCase()
          .includes(search.toLowerCase())
      ),
    [products, search]
  );

  const totalStock = products.reduce((sum, product) => sum + product.stock, 0);
  const pendingOrders = orders.filter(
    (order) => order.status === "Pending confirmation"
  ).length;
  const deliveredRevenue = orders
    .filter((order) => order.status === "Delivered")
    .reduce((sum, order) => sum + order.total, 0);

  const openNewProduct = () => {
    setEditingId(null);
    setProductForm({ name: "", category: "Necklaces", price: "", stock: "" });
    setShowForm(true);
  };

  const openEditProduct = (product: Product) => {
    setEditingId(product.id);
    setProductForm({
      name: product.name,
      category: product.category,
      price: String(product.price),
      stock: String(product.stock),
    });
    setShowForm(true);
  };

  const saveProduct = (event: React.FormEvent) => {
    event.preventDefault();

    if (!productForm.name.trim() || Number(productForm.price) <= 0) {
      setNotice("Enter a product name and a valid price.");
      return;
    }

    if (editingId !== null) {
      saveProducts(
        products.map((product) =>
          product.id === editingId
            ? {
                ...product,
                name: productForm.name.trim(),
                category: productForm.category,
                price: Number(productForm.price),
                stock: Math.max(0, Number(productForm.stock)),
              }
            : product
        )
      );
      setNotice("Product updated successfully.");
    } else {
      const next = [
        ...products,
        {
          id: Date.now(),
          name: productForm.name.trim(),
          category: productForm.category,
          price: Number(productForm.price),
          stock: Math.max(0, Number(productForm.stock)),
          status: "Draft" as const,
        },
      ];
      saveProducts(next);
      setNotice("Product added as a draft.");
    }

    setShowForm(false);
  };

  const togglePublish = (id: number) => {
    saveProducts(
      products.map((product) =>
        product.id === id
          ? {
              ...product,
              status:
                product.status === "Published" ? "Draft" : "Published",
            }
          : product
      )
    );
    setNotice("Product visibility updated.");
  };

  const deleteProduct = (id: number) => {
    if (!window.confirm("Delete this product?")) return;
    saveProducts(products.filter((product) => product.id !== id));
    setNotice("Product deleted.");
  };

  const updateOrder = (id: string, status: string) => {
    setOrders((current) =>
      current.map((order) =>
        order.id === id ? { ...order, status } : order
      )
    );
    setNotice("Demo order status updated.");
  };

  const cardStyle: React.CSSProperties = {
    background: "#fff",
    border: "1px solid #e9e8e4",
    borderRadius: 14,
    padding: 20,
  };

  const buttonStyle: React.CSSProperties = {
    border: 0,
    borderRadius: 9,
    background: "#17243c",
    color: "#fff",
    padding: "11px 17px",
    cursor: "pointer",
    fontWeight: 600,
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    boxSizing: "border-box",
    border: "1px solid #dededb",
    borderRadius: 8,
    padding: 11,
    fontSize: 14,
    background: "#fff",
    color: "#202633",
  };

  const heading = (title: string, subtitle: string) => (
    <div style={{ marginBottom: 25 }}>
      <h1 style={{ margin: 0, fontSize: 27, color: "#17243c" }}>{title}</h1>
      <p style={{ margin: "7px 0 0", color: "#858585" }}>{subtitle}</p>
    </div>
  );

  const statCard = (title: string, value: string | number, note: string) => (
    <div style={cardStyle}>
      <div style={{ color: "#777", fontSize: 13 }}>{title}</div>
      <div style={{ fontSize: 27, fontWeight: 700, color: "#17243c", margin: "12px 0 6px" }}>
        {value}
      </div>
      <div style={{ color: "#999", fontSize: 12 }}>{note}</div>
    </div>
  );

  const tableCell: React.CSSProperties = {
    padding: "14px 12px",
    borderBottom: "1px solid #efefec",
    textAlign: "left",
    fontSize: 13,
    whiteSpace: "nowrap",
  };

  const renderOverview = () => (
    <>
      {heading("Dashboard overview", "Welcome to your TIJARA business control centre.")}
      <div className="stats-grid">
        {statCard("Total products", products.length, "Products in this demo catalogue")}
        {statCard("Total stock units", totalStock, "Sample inventory quantity")}
        {statCard("Pending orders", pendingOrders, "Awaiting manual confirmation")}
        {statCard("Delivered sales", money(deliveredRevenue), "Demo delivered orders only")}
      </div>

      <div style={{ ...cardStyle, marginTop: 22 }}>
        <h3 style={{ marginTop: 0, color: "#17243c" }}>Recent orders</h3>
        {orders.slice(0, 4).map((order) => (
          <div className="order-row" key={order.id}>
            <div>
              <strong>{order.id}</strong>
              <div style={{ color: "#888", fontSize: 12, marginTop: 5 }}>{order.customer}</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <strong>{money(order.total)}</strong>
              <div style={{ color: "#92733e", fontSize: 12, marginTop: 5 }}>{order.status}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ ...cardStyle, marginTop: 18, background: "#fffaf0" }}>
        <strong style={{ color: "#7b5b24" }}>Demo mode</strong>
        <p style={{ color: "#7b6848", fontSize: 13, marginBottom: 0 }}>
          This dashboard currently uses sample orders and browser-stored product data.
          Real customer orders, secure staff accounts, payments and inventory will be
          connected to Supabase in a later stage.
        </p>
      </div>
    </>
  );

  const renderProducts = () => (
    <>
      <div className="page-heading">
        {heading("Products", "Create and manage your jewellery and accessories catalogue.")}
        <button style={buttonStyle} onClick={openNewProduct}>+ Add product</button>
      </div>

      <input
        style={{ ...inputStyle, maxWidth: 400, marginBottom: 18 }}
        placeholder="Search products or categories..."
        value={search}
        onChange={(event) => setSearch(event.target.value)}
      />

      <div style={{ ...cardStyle, overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ color: "#888", background: "#fafaf8" }}>
              {["Product", "Category", "Price", "Stock", "Status", "Actions"].map((item) => (
                <th key={item} style={tableCell}>{item}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product) => (
              <tr key={product.id}>
                <td style={tableCell}><strong>{product.name}</strong></td>
                <td style={tableCell}>{product.category}</td>
                <td style={tableCell}>{money(product.price)}</td>
                <td style={tableCell}>{product.stock}</td>
                <td style={tableCell}>
                  <span className={product.status === "Published" ? "status-green" : "status-grey"}>
                    {product.status}
                  </span>
                </td>
                <td style={tableCell}>
                  <div style={{ display: "flex", gap: 7 }}>
                    <button className="small-button" onClick={() => openEditProduct(product)}>Edit</button>
                    <button className="small-button" onClick={() => togglePublish(product.id)}>
                      {product.status === "Published" ? "Unpublish" : "Publish"}
                    </button>
                    <button className="small-button danger" onClick={() => deleteProduct(product.id)}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredProducts.length === 0 && (
              <tr><td style={tableCell} colSpan={6}>No products found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
      <p style={{ color: "#999", fontSize: 12 }}>
        Product photos and permanent online publishing will be connected to Supabase Storage later.
      </p>
    </>
  );

  const renderOrders = () => (
    <>
      {heading("Orders", "Review customer orders and manage confirmation statuses.")}
      <div style={{ ...cardStyle, overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead><tr>{["Order ID", "Customer", "Date", "Total", "Status", "Update"].map((item) => (
            <th key={item} style={tableCell}>{item}</th>
          ))}</tr></thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td style={tableCell}><strong>{order.id}</strong></td>
                <td style={tableCell}>{order.customer}</td>
                <td style={tableCell}>{order.date}</td>
                <td style={tableCell}>{money(order.total)}</td>
                <td style={tableCell}>{order.status}</td>
                <td style={tableCell}>
                  <select
                    style={inputStyle}
                    value={order.status}
                    onChange={(event) => updateOrder(order.id, event.target.value)}
                  >
                    {["Pending confirmation", "Confirmed", "Packing", "Dispatched", "Delivered", "Cancelled"].map((status) => (
                      <option key={status}>{status}</option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p style={{ color: "#999", fontSize: 12 }}>
        These are demonstration orders, not actual customer orders. Status changes are temporary.
      </p>
    </>
  );

  const renderSimplePage = () => {
    const descriptions: Record<string, string> = {
      Inventory: "Stock receiving, stock movements, damaged items and low-stock alerts.",
      Customers: "Customer records, contact history and repeat-customer information.",
      Promotions: "Campaigns, discount codes, banners and promotional schedules.",
      Delivery: "Delivery assignments, delivery proofs and COD cash handovers.",
      Finance: "Expenses, supplier payments, cash accounts and COD reconciliation.",
      Reports: "Sales, inventory, customer, delivery and financial reports.",
      Staff: "Staff accounts, roles, invitations and permissions.",
      Settings: "Store profile, COD settings, policies, tax and storefront configuration.",
    };

    return (
      <>
        {heading(page, descriptions[page] || "TIJARA business management.")}
        <div style={cardStyle}>
          <h3 style={{ color: "#17243c", marginTop: 0 }}>{page} module</h3>
          <p style={{ color: "#777", lineHeight: 1.7 }}>
            This module is included in the TIJARA admin dashboard structure.
            Its live database operations, secure permissions and workflows will be
            implemented during the Supabase integration stage.
          </p>
          <span className="status-grey">Module structure planned</span>
        </div>
      </>
    );
  };

  return (
    <div className="admin-shell">
      <style>{`
        * { box-sizing: border-box; }
        body { margin: 0; font-family: Inter, Arial, sans-serif; background: #f6f6f3; }
        button, input, select { font: inherit; }
        .admin-shell { min-height: 100vh; display: flex; color: #222; }
        .sidebar { width: 245px; flex-shrink: 0; background: #17243c; color: white; padding: 25px 15px; }
        .brand { padding: 5px 12px 25px; border-bottom: 1px solid #344056; margin-bottom: 20px; }
        .brand-name { font-family: Georgia, serif; font-size: 26px; letter-spacing: 3px; }
        .brand-sub { color: #c8b58c; font-size: 10px; letter-spacing: 2px; margin-top: 5px; }
        .nav-button { display: flex; width: 100%; gap: 12px; align-items: center; padding: 12px 14px; border: 0; border-radius: 8px; color: #d8dce5; background: transparent; text-align: left; cursor: pointer; margin: 3px 0; }
        .nav-button.active, .nav-button:hover { background: #2b3b59; color: white; }
        .main-area { flex: 1; min-width: 0; }
        .topbar { height: 68px; background: white; border-bottom: 1px solid #e9e8e4; display: flex; justify-content: space-between; align-items: center; padding: 0 30px; }
        .content { padding: 30px; max-width: 1500px; margin: auto; }
        .stats-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 15px; }
        .page-heading { display: flex; align-items: flex-start; justify-content: space-between; gap: 15px; }
        .order-row { display: flex; justify-content: space-between; align-items: center; padding: 14px 0; border-top: 1px solid #eee; }
        .small-button { padding: 7px 9px; border: 1px solid #ddd; background: white; border-radius: 6px; cursor: pointer; font-size: 12px; }
        .small-button:hover { background: #f1f1ed; }
        .small-button.danger { color: #a43b3b; }
        .status-green, .status-grey { display: inline-block; padding: 5px 9px; border-radius: 20px; font-size: 11px; }
        .status-green { background: #e5f4e9; color: #26733c; }
        .status-grey { background: #eee; color: #666; }
        .modal-backdrop { position: fixed; inset: 0; background: #10182799; display: flex; align-items: center; justify-content: center; padding: 18px; z-index: 10; }
        .modal { width: 100%; max-width: 480px; background: white; padding: 25px; border-radius: 14px; max-height: 90vh; overflow: auto; }
        .field { display: grid; gap: 7px; margin: 15px 0; font-size: 13px; color: #555; }
        @media(max-width: 900px) {
          .sidebar { width: 205px; }
          .stats-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
          .content { padding: 20px; }
        }
        @media(max-width: 620px) {
          .admin-shell { display: block; }
          .sidebar { width: 100%; padding: 12px; }
          .brand { padding: 8px; margin-bottom: 10px; }
          .brand-name { font-size: 21px; }
          .nav-list { display: flex; overflow-x: auto; gap: 5px; }
          .nav-button { width: auto; flex-shrink: 0; padding: 10px; }
          .nav-button span:last-child { display: none; }
          .topbar { padding: 0 16px; height: 55px; }
          .content { padding: 18px 13px; }
          .stats-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 9px; }
          .stats-grid > div { padding: 13px; }
          .page-heading { display: block; }
          .page-heading > button { margin-bottom: 16px; }
        }
      `}</style>

      <aside className="sidebar">
        <div className="brand">
          <div className="brand-name">TIJARA</div>
          <div className="brand-sub">JEWELS & ACCESSORIES</div>
          <div style={{ color: "#c9ced8", fontSize: 11, marginTop: 14 }}>BUSINESS CONTROL CENTRE</div>
        </div>

        <nav className="nav-list">
          {navItems.map(([label, symbol]) => (
            <button
              key={label}
              className={`nav-button ${page === label ? "active" : ""}`}
              onClick={() => {
                setPage(label);
                setSearch("");
                setNotice("");
              }}
            >
              <span style={{ width: 19, fontSize: 18 }}>{symbol}</span>
              <span>{label}</span>
            </button>
          ))}
        </nav>

        <div style={{ margin: "30px 10px 0", color: "#aab2c1", fontSize: 11 }}>
          TIJARA ADMIN · DEMO VERSION
        </div>
      </aside>

      <main className="main-area">
        <header className="topbar">
          <strong style={{ color: "#17243c" }}>{page}</strong>
          <span style={{ color: "#777", fontSize: 12 }}>Administrator · Demo</span>
        </header>

        <div className="content">
          {notice && (
            <div style={{ padding: 12, background: "#edf5ec", color: "#326b3d", borderRadius: 8, marginBottom: 18 }}>
              {notice}
              <button onClick={() => setNotice("")} style={{ float: "right", border: 0, background: "none", cursor: "pointer" }}>✕</button>
            </div>
          )}

          {page === "Overview" && renderOverview()}
          {page === "Products" && renderProducts()}
          {page === "Orders" && renderOrders()}
          {!["Overview", "Products", "Orders"].includes(page) && renderSimplePage()}
        </div>
      </main>

      {showForm && (
        <div className="modal-backdrop" onClick={() => setShowForm(false)}>
          <form className="modal" onSubmit={saveProduct} onClick={(event) => event.stopPropagation()}>
            <h2 style={{ marginTop: 0, color: "#17243c" }}>
              {editingId === null ? "Add new product" : "Edit product"}
            </h2>

            <label className="field">
              Product name
              <input
                style={inputStyle}
                required
                value={productForm.name}
                onChange={(event) => setProductForm({ ...productForm, name: event.target.value })}
                placeholder="Enter product name"
              />
            </label>

            <label className="field">
              Category
              <select
                style={inputStyle}
                value={productForm.category}
                onChange={(event) => setProductForm({ ...productForm, category: event.target.value })}
              >
                {["Necklaces", "Earrings", "Bracelets", "Rings", "Hair Accessories", "Bags", "Fashion Accessories", "Gift Sets"].map((category) => (
                  <option key={category}>{category}</option>
                ))}
              </select>
            </label>

            <label className="field">
              Selling price (₹)
              <input
                style={inputStyle}
                type="number"
                min="1"
                required
                value={productForm.price}
                onChange={(event) => setProductForm({ ...productForm, price: event.target.value })}
                placeholder="Example: 499"
              />
            </label>

            <label className="field">
              Stock quantity
              <input
                style={inputStyle}
                type="number"
                min="0"
                value={productForm.stock}
                onChange={(event) => setProductForm({ ...productForm, stock: event.target.value })}
                placeholder="Example: 20"
              />
            </label>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 22 }}>
              <button type="button" className="small-button" onClick={() => setShowForm(false)}>Cancel</button>
              <button type="submit" style={buttonStyle}>Save product</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
