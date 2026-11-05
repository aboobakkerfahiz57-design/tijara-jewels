
import React, { Suspense, lazy, useMemo, useState } from "react";
import {
  Search, ShoppingBag, Menu, X, Heart, ChevronRight,
  ChevronDown, Plus, Minus, ArrowRight, Sparkles,
  Truck, ShieldCheck, RotateCcw, MessageCircle, Send,
  Instagram, UserRound, SlidersHorizontal, Star
} from "lucide-react";

// Load the existing admin dashboard only when the /admin route is opened.
// Supports either a default export or a named AdminApp export from AdminApp.tsx.
const AdminDashboard = lazy(async () => {
  const module = await import("./admin/AdminApp");
  const exports = module as unknown as {
    default?: React.ComponentType;
    AdminApp?: React.ComponentType;
  };
  const Dashboard = exports.default ?? exports.AdminApp;
  if (!Dashboard) {
    throw new Error("AdminApp.tsx must export its dashboard as default or as AdminApp.");
  }
  return { default: Dashboard };
});

type Product = {
  id: number;
  name: string;
  category: string;
  price: number;
  oldPrice?: number;
  label?: string;
  image: string;
};

const products: Product[] = [
  {
    id: 1, name: "Golden Butterfly Necklace",
    category: "Necklaces", price: 499, oldPrice: 699,
    label: "BESTSELLER",
    image: "https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=700"
  },
  {
    id: 2, name: "Pearl Elegance Earrings",
    category: "Earrings", price: 349, oldPrice: 449,
    label: "NEW",
    image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=700"
  },
  {
    id: 3, name: "Classic Charm Bracelet",
    category: "Bracelets", price: 399,
    image: "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=700"
  },
  {
    id: 4, name: "Everyday Gold Ring",
    category: "Rings", price: 299, oldPrice: 399,
    image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=700"
  },
  {
    id: 5, name: "Elegant Layered Chain",
    category: "Necklaces", price: 599,
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=700"
  },
  {
    id: 6, name: "Floral Fashion Earrings",
    category: "Earrings", price: 279,
    image: "https://images.unsplash.com/photo-1630019852942-f89202989a59?w=700"
  },
  {
    id: 7, name: "Chic Hair Claw Clip",
    category: "Hair Accessories", price: 199,
    image: "https://images.unsplash.com/photo-1590736969955-71cc94901144?w=700"
  },
  {
    id: 8, name: "Pearl Gift Set",
    category: "Gift Sets", price: 799, oldPrice: 999,
    label: "GIFT PICK",
    image: "https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=700"
  }
];

const categories = [
  "All", "Necklaces", "Earrings", "Bracelets",
  "Rings", "Hair Accessories", "Gift Sets"
];

export default function App() {
  const [cart, setCart] = useState<{ product: Product; quantity: number }[]>([]);
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [cartOpen, setCartOpen] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [sentMessages, setSentMessages] = useState<string[]>([]);
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [customer, setCustomer] = useState({
    name: "", phone: "", alternatePhone: "",
    house: "", street: "", landmark: "",
    city: "", state: "", pincode: ""
  });

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory =
        category === "All" || product.category === category;
      const matchesSearch =
        product.name.toLowerCase().includes(search.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [category, search]);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity, 0
  );

  function addToCart(product: Product) {
    setCart((current) => {
      const existing = current.find((item) => item.product.id === product.id);
      if (existing) {
        return current.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...current, { product, quantity: 1 }];
    });
    setCartOpen(true);
  }

  function changeQuantity(id: number, amount: number) {
    setCart((current) =>
      current
        .map((item) =>
          item.product.id === id
            ? { ...item, quantity: item.quantity + amount }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  }

  function toggleWishlist(id: number) {
    setWishlist((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id]
    );
  }

  function sendMessage() {
    if (!message.trim()) return;
    setSentMessages((current) => [...current, message.trim()]);
    setMessage("");
  }

  // Keep all hooks above this route check so React hook order stays consistent.
  const currentPath = window.location.pathname.replace(/\/+$/, "") || "/";
  if (currentPath === "/admin" || currentPath.startsWith("/admin/")) {
    return (
      <Suspense fallback={<div style={{ padding: 32, fontFamily: "Arial, sans-serif" }}>Loading TIJARA Admin...</div>}>
        <AdminDashboard />
      </Suspense>
    );
  }

  function submitOrder(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    alert(
      "Your checkout details have been entered. Order submission will be activated after the secure Supabase connection is completed."
    );
  }

  return (
    <div className="tijara-app">
      <div className="announcement">
        <Sparkles size={13} />
        <span>YOUR EVERYDAY ELEGANCE STARTS HERE</span>
        <Sparkles size={13} />
      </div>

      <header className="site-header">
        <button
          className="icon-button mobile-menu-button"
          onClick={() => setMobileMenu(!mobileMenu)}
          aria-label="Toggle menu"
        >
          {mobileMenu ? <X /> : <Menu />}
        </button>

        <a href="#" className="brand">
          <span className="brand-emblem">T</span>
          <span className="brand-name">TIJARA</span>
          <span className="brand-subtitle">JEWELS & ACCESSORIES</span>
        </a>

        <nav className={`main-nav ${mobileMenu ? "nav-open" : ""}`}>
          <a href="#home" onClick={() => setMobileMenu(false)}>Home</a>
          <a href="#shop" onClick={() => setMobileMenu(false)}>Shop</a>
          <a href="#collections" onClick={() => setMobileMenu(false)}>Collections</a>
          <a href="#about" onClick={() => setMobileMenu(false)}>Our Story</a>
          <a href="#contact" onClick={() => setMobileMenu(false)}>Contact</a>
        </nav>

        <div className="header-actions">
          <div className="header-search">
            <Search size={17} />
            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                document.getElementById("shop")?.scrollIntoView();
              }}
              placeholder="Search..."
              aria-label="Search products"
            />
          </div>
          <button className="icon-button wishlist-button" aria-label="Wishlist">
            <Heart size={20} />
            {wishlist.length > 0 && <span className="count-badge">{wishlist.length}</span>}
          </button>
          <button
            className="icon-button"
            onClick={() => setCartOpen(true)}
            aria-label="Shopping cart"
          >
            <ShoppingBag size={21} />
            {cartCount > 0 && <span className="count-badge">{cartCount}</span>}
          </button>
        </div>
      </header>

      <main>
        <section className="hero" id="home">
          <div className="hero-content">
            <span className="eyebrow">THE ART OF EVERYDAY ELEGANCE</span>
            <h1>Little Details.<br /><em>Beautiful</em> You.</h1>
            <p>
              Discover jewellery and accessories that make
              every moment a little more special.
            </p>
            <a href="#shop" className="primary-button">
              EXPLORE COLLECTION <ArrowRight size={16} />
            </a>
            <div className="hero-note">
              <span>✦</span> Curated with love. Styled by you.
            </div>
          </div>
          <div className="hero-image">
            <img
              src="https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=1200"
              alt="Elegant jewellery collection"
            />
            <div className="hero-image-caption">
              <span>THE NEW EDIT</span>
              <strong>Elegance in every detail</strong>
            </div>
          </div>
          <div className="hero-decoration">T</div>
        </section>

        <section className="benefits">
          <div><Truck /><span>Delivery Across India</span></div>
          <div><ShieldCheck /><span>Quality-Focused Collections</span></div>
          <div><RotateCcw /><span>Customer-Friendly Support</span></div>
        </section>

        <section className="categories-section" id="collections">
          <div className="section-heading">
            <span className="eyebrow">FIND YOUR FAVOURITE</span>
            <h2>Shop by <em>Collection</em></h2>
            <p>Thoughtfully selected pieces for every style.</p>
          </div>
          <div className="category-grid">
            {[
              { name: "Necklaces", image: "photo-1599643478518-a784e5dc4c8f" },
              { name: "Earrings", image: "photo-1535632066927-ab7c9ab60908" },
              { name: "Bracelets", image: "photo-1573408301185-9146fe634ad0" },
              { name: "Hair Accessories", image: "photo-1590736969955-71cc94901144" }
            ].map((item) => (
              <button
                className="category-card"
                key={item.name}
                onClick={() => {
                  setCategory(item.name);
                  document.getElementById("shop")?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                <img
                  src={`https://images.unsplash.com/${item.image}?w=600`}
                  alt={item.name}
                />
                <span>{item.name}</span>
                <ChevronRight size={17} />
              </button>
            ))}
          </div>
        </section>

        <section className="shop-section" id="shop">
          <div className="section-heading">
            <span className="eyebrow">THE TIJARA SELECTION</span>
            <h2>Our <em>Collections</em></h2>
            <p>Discover pieces that feel uniquely yours.</p>
          </div>

          <div className="shop-toolbar">
            <div className="category-filters">
              {categories.map((item) => (
                <button
                  key={item}
                  className={category === item ? "filter-active" : ""}
                  onClick={() => setCategory(item)}
                >
                  {item}
                </button>
              ))}
            </div>
            <span className="product-count">
              {filteredProducts.length} products
            </span>
          </div>

          <div className="product-grid">
            {filteredProducts.map((product) => (
              <article className="product-card" key={product.id}>
                <div className="product-image-wrap">
                  <img src={product.image} alt={product.name} />
                  {product.label && <span className="product-label">{product.label}</span>}
                  <button
                    className={`product-heart ${wishlist.includes(product.id) ? "hearted" : ""}`}
                    onClick={() => toggleWishlist(product.id)}
                    aria-label="Add to wishlist"
                  >
                    <Heart size={18} fill={wishlist.includes(product.id) ? "currentColor" : "none"} />
                  </button>
                  <button
                    className="quick-add"
                    onClick={() => addToCart(product)}
                  >
                    <Plus size={16} /> ADD TO BAG
                  </button>
                </div>
                <div className="product-info">
                  <span>{product.category}</span>
                  <h3>{product.name}</h3>
                  <div className="product-price">
                    <strong>₹{product.price.toLocaleString("en-IN")}</strong>
                    {product.oldPrice && (
                      <del>₹{product.oldPrice.toLocaleString("en-IN")}</del>
                    )}
                  </div>
                </div>
              </article>
            ))}
            {filteredProducts.length === 0 && (
              <div className="empty-products">
                <Search size={28} />
                <h3>No products found</h3>
                <p>Try another search or category.</p>
                <button onClick={() => { setSearch(""); setCategory("All"); }}>
                  Clear filters
                </button>
              </div>
            )}
          </div>
        </section>

        <section className="brand-story" id="about">
          <div className="story-image">
            <img
              src="https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=900"
              alt="Jewellery details"
            />
          </div>
          <div className="story-content">
            <span className="eyebrow">A LITTLE ABOUT US</span>
            <h2>Made for your<br /><em>kind of beautiful.</em></h2>
            <p>
              At TIJARA, we believe the smallest details can make
              the biggest difference. Our collection brings together
              jewellery and fashion accessories for everyday moments,
              celebrations and everything in between.
            </p>
            <a href="#shop" className="text-link">
              DISCOVER TIJARA <ArrowRight size={16} />
            </a>
          </div>
        </section>

        <section className="newsletter">
          <Sparkles size={24} />
          <span className="eyebrow">A LITTLE SOMETHING SPECIAL</span>
          <h2>Stay close to <em>the sparkle.</em></h2>
          <p>Follow our journey and discover new collections and updates.</p>
          <a
            className="primary-button"
            href="https://www.instagram.com/tijarajewels.shop/"
            target="_blank"
            rel="noreferrer"
          >
            <Instagram size={17} /> FOLLOW TIJARA
          </a>
        </section>
      </main>

      <footer className="site-footer" id="contact">
        <div className="footer-main">
          <div className="footer-brand">
            <span className="brand-emblem">T</span>
            <h2>TIJARA</h2>
            <span>JEWELS & ACCESSORIES</span>
            <p>Everyday elegance, thoughtfully curated.</p>
          </div>
          <div>
            <h3>EXPLORE</h3>
            <a href="#home">Home</a>
            <a href="#shop">Shop All</a>
            <a href="#collections">Collections</a>
            <a href="#about">Our Story</a>
          </div>
          <div>
            <h3>CUSTOMER CARE</h3>
            <a href="#contact">Contact & Enquiries</a>
            <a href="#contact">Shipping Policy</a>
            <a href="#contact">Returns & Exchanges</a>
            <a href="#contact">Privacy Policy</a>
          </div>
          <div>
            <h3>CONNECT WITH US</h3>
            <p>Questions about a product or order?</p>
            <p>Send us an enquiry through our website.</p>
            <a
              href="https://www.instagram.com/tijarajewels.shop/"
              target="_blank"
              rel="noreferrer"
            >
              <Instagram size={16} /> Instagram
            </a>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} TIJARA Jewels & Accessories.</span>
          <span>Made with care. Styled with elegance.</span>
        </div>
      </footer>

      {cartOpen && (
        <div className="overlay" onClick={() => setCartOpen(false)}>
          <aside className="side-drawer" onClick={(e) => e.stopPropagation()}>
            <div className="drawer-header">
              <h2>Your Shopping Bag ({cartCount})</h2>
              <button onClick={() => setCartOpen(false)} aria-label="Close cart"><X /></button>
            </div>
            {cart.length === 0 ? (
              <div className="empty-cart">
                <ShoppingBag size={40} />
                <h3>Your bag is waiting</h3>
                <p>Discover something beautiful.</p>
                <button className="primary-button" onClick={() => setCartOpen(false)}>CONTINUE SHOPPING</button>
              </div>
            ) : (
              <>
                <div className="cart-items">
                  {cart.map((item) => (
                    <div className="cart-item" key={item.product.id}>
                      <img src={item.product.image} alt={item.product.name} />
                      <div className="cart-item-info">
                        <h3>{item.product.name}</h3>
                        <strong>₹{item.product.price.toLocaleString("en-IN")}</strong>
                        <div className="quantity-control">
                          <button onClick={() => changeQuantity(item.product.id, -1)}><Minus size={13} /></button>
                          <span>{item.quantity}</span>
                          <button onClick={() => changeQuantity(item.product.id, 1)}><Plus size={13} /></button>
                        </div>
                      </div>
                      <button className="remove-item" onClick={() => changeQuantity(item.product.id, -item.quantity)}>Remove</button>
                    </div>
                  ))}
                </div>
                <div className="cart-summary">
                  <div><span>Subtotal</span><strong>₹{subtotal.toLocaleString("en-IN")}</strong></div>
                  <small>Shipping charges will be calculated at checkout.</small>
                  <button
                    className="primary-button full-button"
                    onClick={() => { setCartOpen(false); setCheckoutOpen(true); }}
                  >
                    PROCEED TO CHECKOUT <ArrowRight size={16} />
                  </button>
                </div>
              </>
            )}
          </aside>
        </div>
      )}

      {checkoutOpen && (
        <div className="overlay" onClick={() => setCheckoutOpen(false)}>
          <section className="checkout-modal" onClick={(e) => e.stopPropagation()}>
            <div className="drawer-header">
              <h2>Guest Checkout</h2>
              <button onClick={() => setCheckoutOpen(false)} aria-label="Close checkout"><X /></button>
            </div>
            <p className="checkout-note">No account is required. Please enter your delivery details.</p>
            <form onSubmit={submitOrder}>
              <label>Full name<input required value={customer.name} onChange={(e) => setCustomer({...customer, name:e.target.value})} /></label>
              <label>Mobile number<input required type="tel" pattern="[0-9]{10}" placeholder="10-digit mobile number" value={customer.phone} onChange={(e) => setCustomer({...customer, phone:e.target.value})} /></label>
              <label>Alternate number (optional)<input type="tel" value={customer.alternatePhone} onChange={(e) => setCustomer({...customer, alternatePhone:e.target.value})} /></label>
              <label>House / Building<input required value={customer.house} onChange={(e) => setCustomer({...customer, house:e.target.value})} /></label>
              <label>Street / Locality<input required value={customer.street} onChange={(e) => setCustomer({...customer, street:e.target.value})} /></label>
              <label>Landmark (optional)<input value={customer.landmark} onChange={(e) => setCustomer({...customer, landmark:e.target.value})} /></label>
              <div className="form-two">
                <label>City<input required value={customer.city} onChange={(e) => setCustomer({...customer, city:e.target.value})} /></label>
                <label>State<input required value={customer.state} onChange={(e) => setCustomer({...customer, state:e.target.value})} /></label>
              </div>
              <label>PIN code<input required pattern="[0-9]{6}" value={customer.pincode} onChange={(e) => setCustomer({...customer, pincode:e.target.value})} /></label>
              <div className="payment-choice">
                <strong>Payment method</strong>
                <span>Cash on Delivery (COD)</span>
              </div>
              <div className="checkout-total"><span>Order subtotal</span><strong>₹{subtotal.toLocaleString("en-IN")}</strong></div>
              <button className="primary-button full-button" type="submit">CONTINUE WITH COD</button>
              <small className="pending-note">Your order will remain pending until the TIJARA team confirms it.</small>
            </form>
          </section>
        </div>
      )}

      <button className="chat-fab" onClick={() => setChatOpen(!chatOpen)} aria-label="Customer support chat">
        {chatOpen ? <X /> : <MessageCircle />}
      </button>

      {chatOpen && (
        <div className="chat-window">
          <div className="chat-header">
            <div><strong>TIJARA Support</strong><small>How can we help you?</small></div>
            <button onClick={() => setChatOpen(false)}><X size={18} /></button>
          </div>
          <div className="chat-body">
            <div className="chat-welcome">Hello! Welcome to TIJARA. How may we help you today?</div>
            {sentMessages.map((text, index) => <div className="chat-user-message" key={index}>{text}</div>)}
            <small>This is a preview chat. AI support will be connected later.</small>
          </div>
          <div className="chat-input">
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Type your message..."
            />
            <button onClick={sendMessage} aria-label="Send message"><Send size={18} /></button>
          </div>
        </div>
      )}
    </div>
  );
}
