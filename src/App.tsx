
import { useMemo, useState } from "react";
import {
  Search,
  ShoppingBag,
  Menu,
  X,
  Heart,
  ArrowRight,
  ChevronDown,
  Plus,
  Minus,
  Sparkles,
  Truck,
  ShieldCheck,
  RotateCcw,
  Instagram,
  Mail,
  Gem,
} from "lucide-react";

type Product = {
  id: number;
  name: string;
  category: string;
  price: number;
  oldPrice?: number;
  image: string;
  label?: string;
};

type CartItem = {
  product: Product;
  quantity: number;
};

const categories = [
  "All",
  "Trendy Jewellery",
  "Korean Accessories",
  "Hair Accessories",
  "Fashion Accessories",
  "Gift Sets",
];

const products: Product[] = [
  {
    id: 1,
    name: "Golden Butterfly Earrings",
    category: "Trendy Jewellery",
    price: 399,
    oldPrice: 599,
    image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=700",
    label: "BESTSELLER",
  },
  {
    id: 2,
    name: "Elegant Pearl Necklace",
    category: "Trendy Jewellery",
    price: 549,
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=700",
    label: "NEW",
  },
  {
    id: 3,
    name: "Minimal Gold Bracelet",
    category: "Trendy Jewellery",
    price: 349,
    oldPrice: 449,
    image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=700",
  },
  {
    id: 4,
    name: "Floral Korean Earrings",
    category: "Korean Accessories",
    price: 299,
    image: "https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=700",
  },
  {
    id: 5,
    name: "Pearl Hair Clip",
    category: "Hair Accessories",
    price: 199,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=700",
  },
  {
    id: 6,
    name: "Classic Mini Handbag",
    category: "Fashion Accessories",
    price: 899,
    oldPrice: 1199,
    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=700",
    label: "POPULAR",
  },
  {
    id: 7,
    name: "Charming Heart Pendant",
    category: "Korean Accessories",
    price: 379,
    image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=700",
  },
  {
    id: 8,
    name: "Elegant Jewellery Gift Set",
    category: "Gift Sets",
    price: 999,
    oldPrice: 1299,
    image: "https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=700",
    label: "GIFT PICK",
  },
];

const categoryImages = [
  {
    name: "Trendy Jewellery",
    image: "https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=600",
  },
  {
    name: "Korean Accessories",
    image: "https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=600",
  },
  {
    name: "Hair Accessories",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600",
  },
  {
    name: "Fashion Accessories",
    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600",
  },
];

const money = (amount: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);

export default function App() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [liked, setLiked] = useState<number[]>([]);
  const [notice, setNotice] = useState("");

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory =
        activeCategory === "All" ||
        product.category === activeCategory;

      const matchesSearch = product.name
        .toLowerCase()
        .includes(search.toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, search]);

  const cartCount = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const cartTotal = cart.reduce(
    (total, item) =>
      total + item.product.price * item.quantity,
    0
  );

  function addToCart(product: Product) {
    setCart((current) => {
      const existing = current.find(
        (item) => item.product.id === product.id
      );

      if (existing) {
        return current.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...current, { product, quantity: 1 }];
    });

    setNotice(`${product.name} added to your bag`);
    window.setTimeout(() => setNotice(""), 2500);
  }

  function updateQuantity(id: number, change: number) {
    setCart((current) =>
      current
        .map((item) =>
          item.product.id === id
            ? { ...item, quantity: item.quantity + change }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  }

  function toggleLike(id: number) {
    setLiked((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id]
    );
  }

  function goToShop(category = "All") {
    setActiveCategory(category);
    setMobileMenuOpen(false);
    document.getElementById("shop")?.scrollIntoView({
      behavior: "smooth",
    });
  }

  return (
    <div className="tijara-site">
      <div className="announcement">
        <Sparkles size={13} />
        <span>DISCOVER YOUR EVERYDAY ELEGANCE</span>
        <span className="announcement-divider">|</span>
        <span>DELIVERING ACROSS INDIA</span>
      </div>

      <header className="site-header">
        <button
          className="mobile-menu-button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X /> : <Menu />}
        </button>

        <a className="brand" href="#home">
          <div className="brand-symbol">
            <span>T</span>
            <Sparkles size={13} />
          </div>
          <div className="brand-name">
            <strong>TIJARA</strong>
            <small>JEWELS & ACCESSORIES</small>
          </div>
        </a>

        <nav className={`main-nav ${mobileMenuOpen ? "open" : ""}`}>
          <a href="#home" onClick={() => setMobileMenuOpen(false)}>
            HOME
          </a>
          <a href="#categories" onClick={() => setMobileMenuOpen(false)}>
            COLLECTIONS
          </a>
          <a href="#shop" onClick={() => setMobileMenuOpen(false)}>
            SHOP
          </a>
          <a href="#about" onClick={() => setMobileMenuOpen(false)}>
            OUR STORY
          </a>
          <a href="#footer" onClick={() => setMobileMenuOpen(false)}>
            CONTACT
          </a>
        </nav>

        <div className="header-actions">
          <div className="search-box">
            <Search size={17} />
            <input
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                document.getElementById("shop")?.scrollIntoView({
                  behavior: "smooth",
                });
              }}
              placeholder="Search jewellery..."
              aria-label="Search products"
            />
          </div>

          <button
            className="icon-button cart-button"
            onClick={() => setCartOpen(true)}
            aria-label="Open shopping bag"
          >
            <ShoppingBag size={21} />
            {cartCount > 0 && (
              <span className="cart-count">{cartCount}</span>
            )}
          </button>
        </div>
      </header>

      <main>
        <section className="hero" id="home">
          <div className="hero-content">
            <span className="eyebrow">
              <Sparkles size={14} /> THE ART OF EVERYDAY ELEGANCE
            </span>

            <h1>
              A Little
              <br />
              <em>Luxury.</em>
              <br />
              A Lot of You.
            </h1>

            <p>
              Discover beautiful jewellery and thoughtful accessories
              that make every moment feel special.
            </p>

            <div className="hero-actions">
              <button
                className="primary-button"
                onClick={() => goToShop()}
              >
                EXPLORE COLLECTION <ArrowRight size={16} />
              </button>
              <a href="#categories" className="text-link">
                Discover more
              </a>
            </div>

            <div className="hero-note">
              <span className="hero-note-line" />
              <span>BEAUTY IN EVERY DETAIL</span>
            </div>
          </div>

          <div className="hero-image">
            <img
              src="https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=1200"
              alt="Elegant jewellery collection"
            />
            <div className="hero-image-caption">
              <span>THE NEW COLLECTION</span>
              <strong>Elegance, Reimagined.</strong>
            </div>
            <div className="hero-decoration">T</div>
          </div>

          <div className="hero-side-text">TIJARA — EST. 2026</div>
        </section>

        <section className="benefits">
          <div>
            <Truck />
            <span>
              <strong>DELIVERY ACROSS INDIA</strong>
              <small>Bringing beauty to your doorstep</small>
            </span>
          </div>
          <div>
            <ShieldCheck />
            <span>
              <strong>CAREFULLY SELECTED</strong>
              <small>Collections made with care</small>
            </span>
          </div>
          <div>
            <RotateCcw />
            <span>
              <strong>CUSTOMER CARE</strong>
              <small>We're here to help</small>
            </span>
          </div>
          <div>
            <Gem />
            <span>
              <strong>STYLE THAT SPEAKS</strong>
              <small>Made for your moments</small>
            </span>
          </div>
        </section>

        <section className="categories-section" id="categories">
          <div className="section-heading">
            <div>
              <span className="eyebrow">EXPLORE OUR WORLD</span>
              <h2>Shop by <em>Collection</em></h2>
            </div>
            <p>
              Find the little details that make your style
              uniquely yours.
            </p>
          </div>

          <div className="category-grid">
            {categoryImages.map((category, index) => (
              <button
                className="category-card"
                key={category.name}
                onClick={() => goToShop(category.name)}
              >
                <img src={category.image} alt={category.name} />
                <div className="category-overlay">
                  <span>0{index + 1}</span>
                  <strong>{category.name}</strong>
                  <small>
                    EXPLORE COLLECTION <ArrowRight size={14} />
                  </small>
                </div>
              </button>
            ))}
          </div>
        </section>

        <section className="products-section" id="shop">
          <div className="section-heading">
            <div>
              <span className="eyebrow">HANDPICKED FOR YOU</span>
              <h2>Our <em>Favourites</em></h2>
            </div>
            <p>
              Beautiful finds to complement every version of you.
            </p>
          </div>

          <div className="shop-toolbar">
            <div className="category-filters">
              {categories.map((category) => (
                <button
                  key={category}
                  className={
                    activeCategory === category ? "filter active" : "filter"
                  }
                  onClick={() => setActiveCategory(category)}
                >
                  {category}
                </button>
              ))}
            </div>
            <span className="product-count">
              {filteredProducts.length} PRODUCTS
            </span>
          </div>

          <div className="product-grid">
            {filteredProducts.map((product) => (
              <article className="product-card" key={product.id}>
                <div className="product-image">
                  <img src={product.image} alt={product.name} />

                  {product.label && (
                    <span className="product-label">{product.label}</span>
                  )}

                  <button
                    className={`wishlist-button ${
                      liked.includes(product.id) ? "liked" : ""
                    }`}
                    onClick={() => toggleLike(product.id)}
                    aria-label="Add to wishlist"
                  >
                    <Heart
                      size={18}
                      fill={
                        liked.includes(product.id)
                          ? "currentColor"
                          : "none"
                      }
                    />
                  </button>

                  <button
                    className="quick-add"
                    onClick={() => addToCart(product)}
                  >
                    <Plus size={16} /> ADD TO BAG
                  </button>
                </div>

                <div className="product-information">
                  <span>{product.category}</span>
                  <h3>{product.name}</h3>
                  <div className="product-prices">
                    <strong>{money(product.price)}</strong>
                    {product.oldPrice && (
                      <del>{money(product.oldPrice)}</del>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="empty-results">
              <Search size={32} />
              <h3>No products found</h3>
              <p>Try another search or choose a different collection.</p>
              <button
                className="primary-button"
                onClick={() => {
                  setSearch("");
                  setActiveCategory("All");
                }}
              >
                VIEW ALL PRODUCTS
              </button>
            </div>
          )}

          <div className="view-all">
            <button
              className="outline-button"
              onClick={() => {
                setActiveCategory("All");
                setSearch("");
              }}
            >
              VIEW ALL COLLECTIONS <ArrowRight size={16} />
            </button>
          </div>
        </section>

        <section className="story-section" id="about">
          <div className="story-image">
            <img
              src="https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=1000"
              alt="Jewellery details"
            />
          </div>

          <div className="story-content">
            <span className="eyebrow">THE TIJARA EXPERIENCE</span>
            <h2>
              Your Style.
              <br />
              Your Story.
              <br />
              <em>Your TIJARA.</em>
            </h2>
            <p>
              At TIJARA, we believe that style lives in the details.
              Every piece is an opportunity to express who you are,
              celebrate your moments and feel confident in your own
              beautiful way.
            </p>
            <a href="#categories" className="story-link">
              EXPLORE OUR COLLECTIONS <ArrowRight size={16} />
            </a>
          </div>
        </section>

        <section className="newsletter">
          <Sparkles size={20} />
          <span className="eyebrow">A LITTLE SOMETHING SPECIAL</span>
          <h2>Stay in the <em>Loop</em></h2>
          <p>
            Be the first to discover new collections, special
            launches and updates from TIJARA.
          </p>
          <a
            className="primary-button"
            href="https://www.instagram.com/tijarajewels.shop/"
            target="_blank"
            rel="noreferrer"
          >
            FOLLOW US ON INSTAGRAM <Instagram size={17} />
          </a>
        </section>
      </main>

      <footer className="site-footer" id="footer">
        <div className="footer-main">
          <div className="footer-brand">
            <a className="brand footer-logo" href="#home">
              <div className="brand-symbol">
                <span>T</span>
                <Sparkles size={13} />
              </div>
              <div className="brand-name">
                <strong>TIJARA</strong>
                <small>JEWELS & ACCESSORIES</small>
              </div>
            </a>
            <p>
              Discover your everyday elegance.
              <br />
              Jewellery and accessories for every style.
            </p>
          </div>

          <div className="footer-column">
            <h4>EXPLORE</h4>
            <a href="#home">Home</a>
            <a href="#categories">Collections</a>
            <a href="#shop">Shop</a>
            <a href="#about">Our Story</a>
          </div>

          <div className="footer-column">
            <h4>HELP & SUPPORT</h4>
            <a href="#footer">Contact Us</a>
            <a href="#footer">Shipping Policy</a>
            <a href="#footer">Return Policy</a>
            <a href="#footer">FAQs</a>
          </div>

          <div className="footer-column">
            <h4>CONNECT</h4>
            <a
              href="https://www.instagram.com/tijarajewels.shop/"
              target="_blank"
              rel="noreferrer"
            >
              <Instagram size={15} /> Instagram
            </a>
            <a href="mailto:hello@tijarajewels.com">
              <Mail size={15} /> Email
            </a>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© 2026 TIJARA JEWELS & ACCESSORIES.</span>
          <span>CRAFTED WITH ELEGANCE.</span>
        </div>
      </footer>

      {notice && <div className="toast">{notice}</div>}

      {cartOpen && (
        <div
          className="cart-backdrop"
          onClick={() => setCartOpen(false)}
        >
          <aside
            className="cart-drawer"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="cart-header">
              <div>
                <span className="eyebrow">YOUR SELECTION</span>
                <h2>Shopping Bag ({cartCount})</h2>
              </div>
              <button
                className="icon-button"
                onClick={() => setCartOpen(false)}
                aria-label="Close shopping bag"
              >
                <X />
              </button>
            </div>

            {cart.length === 0 ? (
              <div className="empty-cart">
                <ShoppingBag size={45} />
                <h3>Your bag is waiting</h3>
                <p>Discover something beautiful and add it to your bag.</p>
                <button
                  className="primary-button"
                  onClick={() => setCartOpen(false)}
                >
                  CONTINUE SHOPPING
                </button>
              </div>
            ) : (
              <>
                <div className="cart-items">
                  {cart.map((item) => (
                    <div className="cart-item" key={item.product.id}>
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                      />
                      <div className="cart-item-details">
                        <h4>{item.product.name}</h4>
                        <strong>{money(item.product.price)}</strong>
                        <div className="quantity-control">
                          <button
                            onClick={() =>
                              updateQuantity(item.product.id, -1)
                            }
                            aria-label="Decrease quantity"
                          >
                            <Minus size={13} />
                          </button>
                          <span>{item.quantity}</span>
                          <button
                            onClick={() =>
                              updateQuantity(item.product.id, 1)
                            }
                            aria-label="Increase quantity"
                          >
                            <Plus size={13} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="cart-summary">
                  <div>
                    <span>Subtotal</span>
                    <strong>{money(cartTotal)}</strong>
                  </div>
                  <small>Shipping and final charges are calculated at checkout.</small>
                  <button
                    className="primary-button checkout-button"
                    onClick={() => {
                      setCartOpen(false);
                      setNotice("Checkout will be available after store integration.");
                      window.setTimeout(() => setNotice(""), 3000);
                    }}
                  >
                    PROCEED TO CHECKOUT <ArrowRight size={16} />
                  </button>
                </div>
              </>
            )}
          </aside>
        </div>
      )}
    </div>
  );
}
