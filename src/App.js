import { useState } from "react";

// ─── CONSTANTS ────────────────────────────────────────────────────
const ADMIN_PASSWORD = "iagg260897";

const SIZES = [
  { label: "30 ml", price: 100 },
  { label: "60 ml", price: 150 },
  { label: "100 ml", price: 280 },
];

const ESSENCES = {
  dama: [
    "La Bomba · Carolina Herrera",
    "J'adore · Dior",
    "Libre · YSL",
    "Cosmic · Kylie Jenner",
    "BFF · KKW",
    "Sugar Pink · Aquolina",
  ],
  caballero: [
    "Bad Boy · Carolina Herrera",
    "L'Immensite · Louis Vuitton",
    "Dylan Blue · Versace",
    "Aventus · Creed",
    "Polo 67 · Ralph Lauren",
    "Stronger With You · Armani",
  ],
};

const BANK_INFO = {
  clabe: "722969010020014265",
  banco: "Mercado Pago",
  beneficiario: "Iryán Garza",
  linkPago: "https://link.mercadopago.com.mx/scentlab",
};

const WA_NUMBER = "5218125206737"; // <-- cambia por tu número real con código de país sin +

const STATUS_META = {
  "Pendiente":      { color: "#b8a060", bg: "#1a1500" },
  "Confirmado":     { color: "#6090c8", bg: "#001525" },
  "En preparación": { color: "#a070c0", bg: "#150020" },
  "Enviado":        { color: "#50a8d0", bg: "#001520" },
  "Entregado":      { color: "#60b870", bg: "#001500" },
  "Cancelado":      { color: "#c06060", bg: "#1a0000" },
};

const STATUS_MSG = {
  "Pendiente":      "Recibimos tu pedido. Pronto confirmaremos el pago. ⏳",
  "Confirmado":     "¡Pago confirmado! Tu pedido está en cola. ✅",
  "En preparación": "Tu fragancia está siendo preparada con cuidado. 🧪",
  "Enviado":        "¡Tu pedido va en camino! La entrega tarda 7-15 días hábiles. 📦",
  "Entregado":      "¡Tu pedido fue entregado! Gracias por elegir SCENTLAB. 🌹",
  "Cancelado":      "Tu pedido fue cancelado. Escríbenos si tienes dudas.",
};

const initialProducts = [
  { id: 1, essence: "La Bomba · Carolina Herrera", gender: "dama",      size: "30 ml",  price: 100, stock: 10 },
  { id: 2, essence: "Bad Boy · Carolina Herrera",  gender: "caballero", size: "30 ml",  price: 100, stock: 10 },
  { id: 3, essence: "J'adore · Dior",              gender: "dama",      size: "60 ml",  price: 150, stock: 8  },
  { id: 4, essence: "Dylan Blue · Versace",         gender: "caballero", size: "60 ml",  price: 150, stock: 8  },
  { id: 5, essence: "Libre · YSL",                 gender: "dama",      size: "100 ml", price: 280, stock: 5  },
  { id: 6, essence: "Aventus · Creed",              gender: "caballero", size: "100 ml", price: 280, stock: 5  },
];

// ─── LOGO SVG ─────────────────────────────────────────────────────
const Logo = ({ size = "md" }) => {
  const scale = size === "lg" ? 1.6 : size === "sm" ? 0.7 : 1;
  return (
    <div style={{ textAlign: "center", lineHeight: 1, transform: `scale(${scale})`, transformOrigin: "center" }}>
      <div style={{ fontFamily: "'Didact Gothic', sans-serif", fontSize: 9, letterSpacing: 8, color: "#7a7060", marginBottom: 3, textTransform: "uppercase" }}>
        EST. &nbsp;◎&nbsp; 2025
      </div>
      <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, letterSpacing: 9, color: "#e8e0d0", fontWeight: 600 }}>
        SCENTLAB
      </div>
    </div>
  );
};

// ─── MAIN APP ─────────────────────────────────────────────────────
export default function App() {
  const [mode, setMode] = useState("client"); // client | admin
  const [adminUnlocked, setAdminUnlocked] = useState(false);
  const [pwInput, setPwInput] = useState("");
  const [pwError, setPwError] = useState(false);

  // Client state
  const [clientStep, setClientStep] = useState("catalog"); // catalog | build | cart | confirm | track
  const [gender, setGender] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedEssence, setSelectedEssence] = useState("");
  const [cart, setCart] = useState([]);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [placedOrder, setPlacedOrder] = useState(null);
  const [trackId, setTrackId] = useState("");
  const [trackResult, setTrackResult] = useState(null);
  const [showPayModal, setShowPayModal] = useState(false);
  const [copiedClabe, setCopiedClabe] = useState(false);

  // Admin state
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState(initialProducts);
  const [adminTab, setAdminTab] = useState("orders");
  const [newP, setNewP] = useState({ essence: "", gender: "dama", size: "30 ml", price: 100, stock: 0 });
  const [stockDelta, setStockDelta] = useState({});
  const [editP, setEditP] = useState(null);

  // ── Derived ──
  const cartTotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const cartCount = cart.reduce((s, i) => s + i.qty, 0);

  const currentPrice = selectedSize ? SIZES.find(s => s.label === selectedSize)?.price : null;

  // ── Admin login ──
  const tryAdminLogin = () => {
    if (pwInput === ADMIN_PASSWORD) { setAdminUnlocked(true); setPwError(false); }
    else { setPwError(true); setPwInput(""); }
  };

  // ── Cart ops ──
  const addToCart = () => {
    if (!gender || !selectedSize || !selectedEssence) return;
    const price = currentPrice;
    const id = `${selectedEssence}|${selectedSize}|${gender}`;
    setCart(prev => {
      const ex = prev.find(i => i.id === id);
      if (ex) return prev.map(i => i.id === id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { id, essence: selectedEssence, size: selectedSize, gender, price, qty: 1 }];
    });
    setClientStep("cart");
  };

  const removeItem = (id) => setCart(prev => prev.filter(i => i.id !== id));
  const updateQty = (id, qty) => { if (qty < 1) return removeItem(id); setCart(prev => prev.map(i => i.id === id ? { ...i, qty } : i)); };

  // ── Place order ──
  const placeOrder = () => {
    if (!customerName.trim() || !customerPhone.trim()) return;
    const order = {
      id: `SL-${Date.now().toString().slice(-6)}`,
      customer: customerName,
      phone: customerPhone,
      items: [...cart],
      total: cartTotal,
      date: new Date().toLocaleString("es-MX"),
      status: "Pendiente",
    };
    setOrders(prev => [order, ...prev]);
    // Discount stock
    setProducts(prev => prev.map(p => {
      const item = cart.find(c => `${p.essence}|${p.size}|${p.gender}` === c.id);
      return item ? { ...p, stock: Math.max(0, p.stock - item.qty) } : p;
    }));
    setPlacedOrder(order);
    setCart([]);
    setClientStep("confirm");
  };

  // ── WhatsApp ──
  const sendWA = (order) => {
    const items = order.items.map(i => `• ${i.essence} (${i.size}, ${i.gender}) ×${i.qty} = $${(i.price * i.qty).toLocaleString("es-MX")}`).join("\n");
    const msg = encodeURIComponent(
`🌹 *SCENTLAB — Nuevo Pedido #${order.id}*
━━━━━━━━━━━━━━━━
👤 Cliente: ${order.customer}
📱 Tel: ${order.phone}
📅 Fecha: ${order.date}

🛍️ *Productos:*
${items}

💰 *Total: $${order.total.toLocaleString("es-MX")} MXN*
━━━━━━━━━━━━━━━━
💳 *DATOS DE PAGO:*
CLABE: ${BANK_INFO.clabe}
Banco: ${BANK_INFO.banco}
Beneficiario: ${BANK_INFO.beneficiario}

🔗 Pago con tarjeta:
${BANK_INFO.linkPago}
━━━━━━━━━━━━━━━━
📦 Entrega estimada: 7 a 15 días hábiles.
Gracias por elegir SCENTLAB ✨`
    );
    window.open(`https://wa.me/${WA_NUMBER}?text=${msg}`, "_blank");
  };

  // ── Track order ──
  const doTrack = () => {
    const found = orders.find(o => o.id.toLowerCase() === trackId.trim().toLowerCase());
    setTrackResult(found || null);
  };

  // ── Admin ops ──
  const addProduct = () => {
    if (!newP.essence.trim()) return;
    setProducts(prev => [...prev, { ...newP, id: Date.now(), price: parseFloat(newP.price) || 0, stock: parseInt(newP.stock) || 0 }]);
    setNewP({ essence: "", gender: "dama", size: "30 ml", price: 100, stock: 0 });
  };

  const applyDelta = (id) => {
    const d = parseInt(stockDelta[id] || 0); if (isNaN(d)) return;
    setProducts(prev => prev.map(p => p.id === id ? { ...p, stock: Math.max(0, p.stock + d) } : p));
    setStockDelta(prev => ({ ...prev, [id]: "" }));
  };

  const copyClabe = () => {
    navigator.clipboard.writeText(BANK_INFO.clabe).catch(() => {});
    setCopiedClabe(true);
    setTimeout(() => setCopiedClabe(false), 2000);
  };

  // ─────────────────────────── RENDER ──────────────────────────────
  return (
    <div style={{ fontFamily: "'Didact Gothic', sans-serif", minHeight: "100vh", background: "#070707", color: "#d8d0c0" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Didact+Gothic&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 3px; } ::-webkit-scrollbar-thumb { background: #222; }
        body { background: #070707; }
        .btn { cursor: pointer; border: none; transition: all .18s; font-family: 'Didact Gothic', sans-serif; }
        .btn:active { transform: scale(.97); }
        input, select, textarea { background: transparent; border: none; border-bottom: 1px solid #252520; color: #d8d0c0; font-family: 'Didact Gothic', sans-serif; font-size: 15px; padding: 10px 4px; outline: none; width: 100%; transition: border-color .2s; }
        input:focus, select:focus, textarea:focus { border-bottom-color: #c8a840; }
        input::placeholder { color: #2e2e28; }
        select option { background: #111; color: #d8d0c0; }
        .gold { color: #c8a840; }
        .muted { color: #4a4540; font-size: 11px; letter-spacing: 2px; text-transform: uppercase; }
        .card { background: #0d0d0b; border: 1px solid #181810; }
        .card-hover { transition: border-color .25s, transform .25s; }
        .card-hover:hover { border-color: #2a2418; transform: translateY(-3px); }
        .primary-btn { background: #e8e0d0; color: #070707; font-size: 11px; letter-spacing: 2.5px; text-transform: uppercase; padding: 14px 28px; font-weight: bold; }
        .primary-btn:hover { background: #fff; }
        .primary-btn:disabled { background: #151510; color: #252520; cursor: not-allowed; }
        .gold-btn { background: transparent; border: 1px solid #c8a840; color: #c8a840; font-size: 10px; letter-spacing: 2px; text-transform: uppercase; padding: 10px 20px; }
        .gold-btn:hover { background: #c8a840; color: #070707; }
        .ghost-btn { background: transparent; border: 1px solid #1e1e18; color: #555; font-size: 10px; letter-spacing: 1.5px; text-transform: uppercase; padding: 8px 14px; }
        .ghost-btn:hover { border-color: #c8a840; color: #c8a840; }
        .danger-btn { background: transparent; border: 1px solid #2a1010; color: #885050; font-size: 10px; letter-spacing: 1.5px; text-transform: uppercase; padding: 8px 14px; }
        .danger-btn:hover { background: #0f0505; }
        .tab-btn { background: none; border: none; font-family: 'Didact Gothic', sans-serif; font-size: 11px; letter-spacing: 2px; text-transform: uppercase; cursor: pointer; padding: 10px 18px; color: #333; transition: color .2s; position: relative; }
        .tab-btn.on { color: #c8a840; }
        .tab-btn.on::after { content: ''; position: absolute; bottom: 0; left: 18px; right: 18px; height: 1px; background: #c8a840; }
        .gender-pill { padding: 10px 22px; font-size: 11px; letter-spacing: 2px; text-transform: uppercase; cursor: pointer; border: 1px solid #1e1e18; background: transparent; color: #444; transition: all .2s; }
        .gender-pill.sel { border-color: #c8a840; color: #c8a840; background: #0d0d00; }
        .size-pill { padding: 12px 18px; font-size: 13px; cursor: pointer; border: 1px solid #1e1e18; background: transparent; color: #444; transition: all .2s; text-align: center; }
        .size-pill.sel { border-color: #c8a840; color: #c8a840; background: #0d0d00; }
        .size-pill:hover:not(.sel) { border-color: #333; color: #888; }
        label.lbl { font-size: 9px; letter-spacing: 3px; text-transform: uppercase; color: #3a3428; display: block; margin-bottom: 8px; }
        .divider { border: none; border-top: 1px solid #111; margin: 20px 0; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: translateY(0); } }
        .fu { animation: fadeUp .4s ease both; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,.85); z-index: 100; display: flex; align-items: center; justify-content: center; padding: 24px; }
        .modal { background: #0d0d0b; border: 1px solid #2a2418; max-width: 500px; width: 100%; padding: 36px; }
        .status-badge { display: inline-block; font-size: 9px; letter-spacing: 2.5px; text-transform: uppercase; padding: 5px 14px; border: 1px solid; }
        .wa-btn { background: #1a3a1a; border: 1px solid #254a25; color: #60c060; font-size: 11px; letter-spacing: 2px; text-transform: uppercase; padding: 12px 24px; width: 100%; }
        .wa-btn:hover { background: #204820; }
        .track-input { font-size: 18px; letter-spacing: 2px; text-align: center; border-bottom: 1px solid #252520 !important; padding: 12px 4px !important; }
        .copy-btn { background: transparent; border: 1px solid #2a2418; color: #887840; font-size: 10px; letter-spacing: 1.5px; padding: 6px 12px; text-transform: uppercase; white-space: nowrap; }
        .copy-btn:hover { border-color: #c8a840; color: #c8a840; }
        .admin-lock { max-width: 360px; margin: 120px auto; text-align: center; }
      `}</style>

      {/* ═══════════════ HEADER ═══════════════ */}
      <header style={{ background: "#050505", borderBottom: "1px solid #0e0e08", position: "sticky", top: 0, zIndex: 30 }}>
        <div style={{ maxWidth: 1000, margin: "0 auto", padding: "22px 24px 0" }}>
          <Logo />
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 20, borderTop: "1px solid #0e0e08", paddingTop: 0 }}>
            {/* Client nav */}
            {mode === "client" && (
              <div style={{ display: "flex" }}>
                {[
                  { key: "catalog", label: "Catálogo" },
                  { key: "cart",    label: `Carrito${cartCount > 0 ? ` (${cartCount})` : ""}` },
                  { key: "track",   label: "Mi Pedido" },
                ].map(({ key, label }) => (
                  <button key={key} className={`tab-btn ${clientStep === key ? "on" : ""}`} onClick={() => setClientStep(key)}>{label}</button>
                ))}
              </div>
            )}
            {mode === "admin" && adminUnlocked && (
              <div style={{ display: "flex" }}>
                {[{ key: "orders", label: "Pedidos" }, { key: "stock", label: "Stock" }].map(({ key, label }) => (
                  <button key={key} className={`tab-btn ${adminTab === key ? "on" : ""}`} onClick={() => setAdminTab(key)}>{label}</button>
                ))}
              </div>
            )}
            {mode === "admin" && !adminUnlocked && <div />}
            {/* Mode switcher */}
            <button className="btn ghost-btn" style={{ fontSize: 9, letterSpacing: 2, marginBottom: 2 }}
              onClick={() => { setMode(m => m === "client" ? "admin" : "client"); setAdminUnlocked(false); setPwInput(""); setPwError(false); }}>
              {mode === "client" ? "Admin ↗" : "← Tienda"}
            </button>
          </div>
        </div>
      </header>

      <main style={{ maxWidth: 1000, margin: "0 auto", padding: "52px 24px 100px" }}>

        {/* ══════════════ CLIENT MODE ══════════════ */}
        {mode === "client" && (
          <>
            {/* ── CATALOG / BUILD ── */}
            {(clientStep === "catalog" || clientStep === "build") && (
              <div className="fu">
                <p className="muted" style={{ marginBottom: 36 }}>Seleccioná tu fragancia</p>

                {/* Step 1: Gender */}
                <div style={{ marginBottom: 40 }}>
                  <label className="lbl">Colección</label>
                  <div style={{ display: "flex", gap: 2 }}>
                    {["dama", "caballero"].map(g => (
                      <button key={g} className={`btn gender-pill ${gender === g ? "sel" : ""}`} onClick={() => { setGender(g); setSelectedEssence(""); setClientStep("build"); }}>
                        {g === "dama" ? "♀ Dama" : "♂ Caballero"}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Step 2: Size */}
                {gender && (
                  <div style={{ marginBottom: 40 }} className="fu">
                    <label className="lbl">Tamaño</label>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 2, maxWidth: 360 }}>
                      {SIZES.map(s => (
                        <button key={s.label} className={`btn size-pill ${selectedSize === s.label ? "sel" : ""}`} onClick={() => setSelectedSize(s.label)}>
                          <div style={{ fontSize: 16, fontFamily: "'Playfair Display', serif", fontStyle: "italic", marginBottom: 4 }}>{s.label}</div>
                          <div style={{ fontSize: 18, color: selectedSize === s.label ? "#c8a840" : "#555", fontFamily: "'Playfair Display', serif" }}>${s.price}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Step 3: Essence */}
                {gender && selectedSize && (
                  <div style={{ marginBottom: 40 }} className="fu">
                    <label className="lbl">Esencia</label>
                    <div style={{ maxWidth: 420 }}>
                      <select value={selectedEssence} onChange={e => setSelectedEssence(e.target.value)} style={{ fontSize: 17, fontFamily: "'Playfair Display', serif", fontStyle: selectedEssence ? "italic" : "normal", padding: "12px 4px" }}>
                        <option value="">— Elegí tu esencia —</option>
                        {ESSENCES[gender].map(e => <option key={e} value={e}>{e}</option>)}
                      </select>
                    </div>
                  </div>
                )}

                {/* Summary card */}
                {gender && selectedSize && selectedEssence && (
                  <div className="card fu" style={{ maxWidth: 420, padding: "28px 28px 24px", marginBottom: 32 }}>
                    <div style={{ width: 24, height: 1, background: "#c8a840", marginBottom: 20 }} />
                    <div style={{ fontSize: 9, letterSpacing: 3, color: "#4a4030", marginBottom: 8, textTransform: "uppercase" }}>{gender} · {selectedSize}</div>
                    <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontStyle: "italic", color: "#d8d0c0", marginBottom: 6 }}>{selectedEssence}</div>
                    <div style={{ fontSize: 26, color: "#c8a840", fontFamily: "'Playfair Display', serif", marginBottom: 20 }}>${currentPrice?.toLocaleString("es-MX")}</div>
                    <button className="btn primary-btn" style={{ width: "100%" }} onClick={addToCart}>
                      Agregar al carrito
                    </button>
                  </div>
                )}

                {/* Products grid hint */}
                <div style={{ marginTop: 60, borderTop: "1px solid #0e0e08", paddingTop: 40 }}>
                  <p className="muted" style={{ marginBottom: 28 }}>Disponibilidad actual</p>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 2 }}>
                    {products.map(p => (
                      <div key={p.id} className="card card-hover" style={{ padding: "22px 20px" }}>
                        <div style={{ width: 18, height: 1, background: p.stock > 0 ? "#c8a840" : "#2a2a20", marginBottom: 16 }} />
                        <div style={{ fontSize: 9, letterSpacing: 2.5, color: "#3a3428", marginBottom: 6, textTransform: "uppercase" }}>{p.gender} · {p.size}</div>
                        <div style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontSize: 15, color: "#a09880", marginBottom: 6, lineHeight: 1.4 }}>{p.essence}</div>
                        <div style={{ fontSize: 16, color: "#c8a840" }}>${p.price.toLocaleString("es-MX")}</div>
                        <div style={{ marginTop: 10, fontSize: 9, letterSpacing: 2, textTransform: "uppercase", color: p.stock > 0 ? "#507050" : "#705050" }}>
                          {p.stock > 0 ? `${p.stock} disponibles` : "Agotado"}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ── CART ── */}
            {clientStep === "cart" && (
              <div className="fu" style={{ maxWidth: 600, margin: "0 auto" }}>
                <p className="muted" style={{ marginBottom: 32 }}>Tu carrito</p>
                {cart.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "80px 0", color: "#1e1e18" }}>
                    <div style={{ fontSize: 38, marginBottom: 12, opacity: .3 }}>🛒</div>
                    <div style={{ fontSize: 10, letterSpacing: 4, textTransform: "uppercase" }}>Carrito vacío</div>
                  </div>
                ) : (
                  <>
                    {cart.map(item => (
                      <div key={item.id} style={{ display: "flex", alignItems: "center", gap: 16, padding: "20px 0", borderBottom: "1px solid #0e0e08" }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 9, letterSpacing: 2.5, color: "#3a3428", marginBottom: 4, textTransform: "uppercase" }}>{item.gender} · {item.size}</div>
                          <div style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontSize: 18, color: "#c8c0b0" }}>{item.essence}</div>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <button className="btn" style={{ background: "none", border: "1px solid #1a1a14", color: "#333", width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center" }} onClick={() => updateQty(item.id, item.qty - 1)}>−</button>
                          <span style={{ fontSize: 14, minWidth: 20, textAlign: "center", color: "#888" }}>{item.qty}</span>
                          <button className="btn" style={{ background: "none", border: "1px solid #1a1a14", color: "#333", width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center" }} onClick={() => updateQty(item.id, item.qty + 1)}>+</button>
                        </div>
                        <div style={{ minWidth: 70, textAlign: "right", fontSize: 17, color: "#c8a840" }}>${(item.price * item.qty).toLocaleString("es-MX")}</div>
                        <button className="btn" style={{ background: "none", border: "none", color: "#252520", fontSize: 14 }} onClick={() => removeItem(item.id)}>✕</button>
                      </div>
                    ))}

                    <div style={{ paddingTop: 32 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 32 }}>
                        <span style={{ fontSize: 9, letterSpacing: 4, color: "#3a3428", textTransform: "uppercase" }}>Total</span>
                        <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 30, color: "#e8e0d0" }}>${cartTotal.toLocaleString("es-MX")}</span>
                      </div>
                      <div style={{ marginBottom: 20 }}>
                        <label className="lbl">Tu nombre</label>
                        <input placeholder="Nombre completo..." value={customerName} onChange={e => setCustomerName(e.target.value)} />
                      </div>
                      <div style={{ marginBottom: 32 }}>
                        <label className="lbl">WhatsApp / Teléfono</label>
                        <input placeholder="10 dígitos..." value={customerPhone} onChange={e => setCustomerPhone(e.target.value)} />
                      </div>

                      {/* Payment info preview */}
                      <div className="card" style={{ padding: "20px 24px", marginBottom: 24, borderColor: "#1a1810" }}>
                        <div style={{ fontSize: 9, letterSpacing: 3, color: "#4a4030", marginBottom: 14, textTransform: "uppercase" }}>Opciones de pago</div>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                          <div>
                            <div style={{ fontSize: 12, color: "#888", marginBottom: 2 }}>CLABE · {BANK_INFO.banco}</div>
                            <div style={{ fontSize: 14, color: "#c8c0b0", letterSpacing: 1 }}>{BANK_INFO.clabe}</div>
                          </div>
                          <button className="btn copy-btn" onClick={copyClabe}>{copiedClabe ? "✓ Copiado" : "Copiar"}</button>
                        </div>
                        <div style={{ fontSize: 11, color: "#3a3428", marginBottom: 12 }}>Beneficiario: {BANK_INFO.beneficiario}</div>
                        <a href={BANK_INFO.linkPago} target="_blank" rel="noreferrer" style={{ color: "#6a90c8", fontSize: 12, letterSpacing: 1, textDecoration: "none", borderBottom: "1px solid #1a2a3a", paddingBottom: 2 }}>
                          Pagar con tarjeta →
                        </a>
                      </div>

                      <div style={{ fontSize: 10, color: "#2e2e28", letterSpacing: 1, marginBottom: 24, lineHeight: 1.8, textAlign: "center", textTransform: "uppercase" }}>
                        Entrega estimada: 7 a 15 días hábiles
                      </div>

                      <button className="btn primary-btn" style={{ width: "100%", marginBottom: 12 }} disabled={!customerName.trim() || !customerPhone.trim()} onClick={placeOrder}>
                        Confirmar pedido
                      </button>
                      <button className="btn" style={{ background: "none", border: "none", color: "#2e2e28", fontSize: 11, letterSpacing: 2, width: "100%", padding: 10, textTransform: "uppercase", cursor: "pointer" }} onClick={() => setClientStep("catalog")}>
                        ← Seguir comprando
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* ── CONFIRM ── */}
            {clientStep === "confirm" && placedOrder && (
              <div className="fu" style={{ maxWidth: 520, margin: "0 auto", textAlign: "center" }}>
                <div style={{ width: 48, height: 1, background: "#c8a840", margin: "0 auto 32px" }} />
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 32, fontStyle: "italic", color: "#e8e0d0", marginBottom: 8 }}>Pedido recibido</div>
                <div style={{ fontSize: 10, letterSpacing: 3, color: "#4a4030", marginBottom: 32, textTransform: "uppercase" }}>#{placedOrder.id}</div>

                <div className="card" style={{ padding: "24px 28px", marginBottom: 28, textAlign: "left" }}>
                  <div style={{ fontSize: 9, letterSpacing: 3, color: "#3a3428", marginBottom: 16, textTransform: "uppercase" }}>Resumen</div>
                  {placedOrder.items.map(i => (
                    <div key={i.id} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #0e0e08" }}>
                      <span style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontSize: 15, color: "#a09880" }}>{i.essence} <span style={{ fontSize: 11, fontStyle: "normal", color: "#3a3428" }}>({i.size})</span></span>
                      <span style={{ color: "#c8a840" }}>${(i.price * i.qty).toLocaleString("es-MX")}</span>
                    </div>
                  ))}
                  <div style={{ display: "flex", justifyContent: "space-between", paddingTop: 14 }}>
                    <span style={{ fontSize: 9, letterSpacing: 3, color: "#3a3428", textTransform: "uppercase" }}>Total</span>
                    <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, color: "#c8a840" }}>${placedOrder.total.toLocaleString("es-MX")}</span>
                  </div>
                </div>

                <div className="card" style={{ padding: "20px 24px", marginBottom: 24, textAlign: "left", borderColor: "#1a1810" }}>
                  <div style={{ fontSize: 9, letterSpacing: 3, color: "#3a3428", marginBottom: 12, textTransform: "uppercase" }}>Realiza tu pago</div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                    <div>
                      <div style={{ fontSize: 11, color: "#555", marginBottom: 2 }}>{BANK_INFO.banco} · CLABE</div>
                      <div style={{ fontSize: 15, color: "#c8c0b0", letterSpacing: 1 }}>{BANK_INFO.clabe}</div>
                    </div>
                    <button className="btn copy-btn" onClick={copyClabe}>{copiedClabe ? "✓" : "Copiar"}</button>
                  </div>
                  <div style={{ fontSize: 11, color: "#444", marginBottom: 14 }}>Beneficiario: {BANK_INFO.beneficiario}</div>
                  <a href={BANK_INFO.linkPago} target="_blank" rel="noreferrer" style={{ display: "block", textAlign: "center", padding: "10px", border: "1px solid #1a2a3a", color: "#6a90c8", fontSize: 11, letterSpacing: 2, textDecoration: "none", textTransform: "uppercase" }}>
                    Pagar con tarjeta →
                  </a>
                </div>

                <div style={{ fontSize: 10, color: "#2e2e28", letterSpacing: 1, marginBottom: 28, lineHeight: 2, textTransform: "uppercase" }}>
                  Entrega estimada · 7 a 15 días hábiles<br />
                  Guarda tu número de pedido: <span style={{ color: "#c8a840" }}>#{placedOrder.id}</span>
                </div>

                <button className="btn wa-btn" onClick={() => sendWA(placedOrder)} style={{ marginBottom: 12, borderRadius: 0 }}>
                  <span style={{ fontSize: 16, marginRight: 10 }}>💬</span> Enviar confirmación por WhatsApp
                </button>
                <button className="btn ghost-btn" style={{ width: "100%", marginTop: 8 }} onClick={() => { setClientStep("catalog"); setPlacedOrder(null); }}>
                  Volver a la tienda
                </button>
              </div>
            )}

            {/* ── TRACK ── */}
            {clientStep === "track" && (
              <div className="fu" style={{ maxWidth: 520, margin: "0 auto" }}>
                <p className="muted" style={{ marginBottom: 40 }}>Seguimiento de pedido</p>
                <div style={{ marginBottom: 32 }}>
                  <label className="lbl">Número de pedido</label>
                  <input className="track-input" placeholder="SL-XXXXXX" value={trackId} onChange={e => setTrackId(e.target.value)} onKeyDown={e => e.key === "Enter" && doTrack()} />
                  <div style={{ fontSize: 10, color: "#252520", marginTop: 8, letterSpacing: 1 }}>ej: SL-123456 · lo recibiste al confirmar</div>
                </div>
                <button className="btn primary-btn" style={{ width: "100%", marginBottom: 32 }} onClick={doTrack}>Buscar pedido</button>

                {trackResult === null && trackId && (
                  <div style={{ textAlign: "center", color: "#3a2020", fontSize: 12, letterSpacing: 2, textTransform: "uppercase" }}>
                    Pedido no encontrado
                  </div>
                )}

                {trackResult && (
                  <div className="fu card" style={{ padding: "28px 28px 24px" }}>
                    <div style={{ width: 24, height: 1, background: "#c8a840", marginBottom: 20 }} />
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
                      <div>
                        <div style={{ fontSize: 9, letterSpacing: 3, color: "#3a3428", marginBottom: 6, textTransform: "uppercase" }}>#{trackResult.id}</div>
                        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontStyle: "italic" }}>{trackResult.customer}</div>
                      </div>
                      <span className="status-badge" style={{ color: STATUS_META[trackResult.status]?.color, borderColor: STATUS_META[trackResult.status]?.color + "55", background: STATUS_META[trackResult.status]?.bg }}>
                        {trackResult.status}
                      </span>
                    </div>

                    {/* Status message */}
                    <div style={{ background: "#0a0a08", border: "1px solid #181810", padding: "14px 18px", marginBottom: 20, fontSize: 13, color: "#888", lineHeight: 1.6 }}>
                      {STATUS_MSG[trackResult.status]}
                    </div>

                    <hr className="divider" />
                    {trackResult.items.map(i => (
                      <div key={i.id} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #0a0a08" }}>
                        <span style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontSize: 15, color: "#907860" }}>{i.essence} <span style={{ fontSize: 11, fontStyle: "normal", color: "#3a3428" }}>({i.size} · {i.gender})</span></span>
                        <span style={{ color: "#c8a840" }}>${(i.price * i.qty).toLocaleString("es-MX")}</span>
                      </div>
                    ))}
                    <hr className="divider" />
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={{ fontSize: 9, letterSpacing: 3, color: "#3a3428", textTransform: "uppercase" }}>Total</span>
                      <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, color: "#c8a840" }}>${trackResult.total.toLocaleString("es-MX")}</span>
                    </div>
                    <div style={{ marginTop: 16, fontSize: 10, color: "#2a2a20", letterSpacing: 1, textTransform: "uppercase" }}>{trackResult.date}</div>
                  </div>
                )}
              </div>
            )}
          </>
        )}

        {/* ══════════════ ADMIN MODE ══════════════ */}
        {mode === "admin" && (
          <>
            {!adminUnlocked ? (
              <div className="admin-lock fu">
                <div style={{ width: 32, height: 1, background: "#c8a840", margin: "0 auto 28px" }} />
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontStyle: "italic", marginBottom: 8, color: "#d8d0c0" }}>Panel de administración</div>
                <div style={{ fontSize: 10, letterSpacing: 3, color: "#3a3428", marginBottom: 36, textTransform: "uppercase" }}>Acceso restringido</div>
                <input type="password" placeholder="Contraseña..." value={pwInput} onChange={e => setPwInput(e.target.value)} onKeyDown={e => e.key === "Enter" && tryAdminLogin()} style={{ textAlign: "center", fontSize: 18, letterSpacing: 4, marginBottom: 20 }} />
                {pwError && <div style={{ fontSize: 10, color: "#a06060", letterSpacing: 2, textTransform: "uppercase", marginBottom: 16 }}>Contraseña incorrecta</div>}
                <button className="btn primary-btn" style={{ width: "100%" }} onClick={tryAdminLogin}>Ingresar</button>
              </div>
            ) : (
              <>
                {/* ── ADMIN ORDERS ── */}
                {adminTab === "orders" && (
                  <div className="fu">
                    <p className="muted" style={{ marginBottom: 32 }}>Pedidos · {orders.length} total</p>
                    {orders.length === 0 ? (
                      <div style={{ textAlign: "center", padding: "80px 0", color: "#1a1a14" }}>
                        <div style={{ fontSize: 10, letterSpacing: 4, textTransform: "uppercase" }}>Sin pedidos aún</div>
                      </div>
                    ) : (
                      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                        {orders.map(o => (
                          <div key={o.id} className="card" style={{ padding: "24px 28px" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16, marginBottom: 18 }}>
                              <div>
                                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontStyle: "italic", marginBottom: 4 }}>{o.customer}</div>
                                <div style={{ fontSize: 9, letterSpacing: 2.5, color: "#3a3428", textTransform: "uppercase" }}>#{o.id} · {o.date}</div>
                                <div style={{ fontSize: 11, color: "#444", marginTop: 4 }}>📱 {o.phone}</div>
                              </div>
                              <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
                                <span className="status-badge" style={{ color: STATUS_META[o.status]?.color, borderColor: STATUS_META[o.status]?.color + "55", background: STATUS_META[o.status]?.bg }}>
                                  {o.status}
                                </span>
                                <select value={o.status} onChange={e => updateStatus(o.id, e.target.value)} style={{ fontSize: 11, padding: "7px 10px", letterSpacing: 1, border: "1px solid #1e1e14", borderBottom: "1px solid #1e1e14" }}>
                                  {Object.keys(STATUS_META).map(s => <option key={s}>{s}</option>)}
                                </select>
                              </div>
                            </div>
                            <hr className="divider" style={{ margin: "12px 0" }} />
                            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 8 }}>
                              {o.items.map(i => (
                                <div key={i.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                                  <span style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontSize: 15, color: "#907860" }}>
                                    {i.essence} <span style={{ fontSize: 10, fontStyle: "normal", color: "#3a3428", letterSpacing: 2 }}>{i.size} · {i.gender}</span> ×{i.qty}
                                  </span>
                                  <span style={{ color: "#605040", fontSize: 14 }}>${(i.price * i.qty).toLocaleString("es-MX")}</span>
                                </div>
                              ))}
                            </div>
                            <hr className="divider" style={{ margin: "12px 0" }} />
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                              <span style={{ fontSize: 9, letterSpacing: 3, color: "#3a3428", textTransform: "uppercase" }}>Total</span>
                              <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, color: "#c8a840" }}>${o.total.toLocaleString("es-MX")}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* ── ADMIN STOCK ── */}
                {adminTab === "stock" && (
                  <div className="fu">
                    <p className="muted" style={{ marginBottom: 32 }}>Gestión de stock y esencias</p>

                    {/* Add new */}
                    <div className="card" style={{ padding: "24px 28px", marginBottom: 36, borderColor: "#1a1810" }}>
                      <div style={{ fontSize: 9, letterSpacing: 3, color: "#3a3428", marginBottom: 24, textTransform: "uppercase" }}>Nueva esencia</div>
                      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr auto", gap: 20, alignItems: "end" }}>
                        <div>
                          <label className="lbl">Esencia / Nombre</label>
                          <input placeholder="ej: Chance · Chanel" value={newP.essence} onChange={e => setNewP({ ...newP, essence: e.target.value })} />
                        </div>
                        <div>
                          <label className="lbl">Colección</label>
                          <select value={newP.gender} onChange={e => setNewP({ ...newP, gender: e.target.value })}>
                            <option value="dama">Dama</option>
                            <option value="caballero">Caballero</option>
                          </select>
                        </div>
                        <div>
                          <label className="lbl">Tamaño</label>
                          <select value={newP.size} onChange={e => setNewP({ ...newP, size: e.target.value, price: SIZES.find(s => s.label === e.target.value)?.price || newP.price })}>
                            {SIZES.map(s => <option key={s.label}>{s.label}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="lbl">Precio $</label>
                          <input type="number" value={newP.price} onChange={e => setNewP({ ...newP, price: e.target.value })} />
                        </div>
                        <div>
                          <label className="lbl">Stock</label>
                          <input type="number" placeholder="0" value={newP.stock} onChange={e => setNewP({ ...newP, stock: e.target.value })} />
                        </div>
                        <button className="btn primary-btn" style={{ padding: "10px 18px", whiteSpace: "nowrap", fontSize: 9, letterSpacing: 2 }} onClick={addProduct}>+ Agregar</button>
                      </div>
                    </div>

                    {/* Products */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                      {products.map(p => (
                        <div key={p.id} className="card" style={{ padding: "18px 24px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
                            <div style={{ flex: 1, minWidth: 180 }}>
                              <div style={{ fontSize: 9, letterSpacing: 2.5, color: "#3a3428", textTransform: "uppercase", marginBottom: 4 }}>{p.gender} · {p.size}</div>
                              <div style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontSize: 17 }}>{p.essence}</div>
                            </div>
                            <div style={{ fontSize: 16, color: "#c8a840", minWidth: 70 }}>${p.price.toLocaleString("es-MX")}</div>
                            <div style={{ fontSize: 10, letterSpacing: 2, textTransform: "uppercase", color: p.stock > 0 ? "#507050" : "#705050", minWidth: 80 }}>
                              {p.stock} UNID.
                            </div>
                            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                              <input type="number" placeholder="±0" value={stockDelta[p.id] || ""} onChange={e => setStockDelta({ ...stockDelta, [p.id]: e.target.value })} style={{ width: 64, textAlign: "center" }} />
                              <button className="btn ghost-btn" onClick={() => applyDelta(p.id)}>Aplicar</button>
                            </div>
                            <button className="btn danger-btn" onClick={() => setProducts(prev => prev.filter(x => x.id !== p.id))}>Borrar</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </main>

      <footer style={{ borderTop: "1px solid #0a0a08", padding: 24, textAlign: "center" }}>
        <div style={{ fontSize: 9, letterSpacing: 5, color: "#161612", textTransform: "uppercase" }}>SCENTLAB · EST. 2025</div>
      </footer>
    </div>
  );

  function updateStatus(orderId, status) {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
  }
}
