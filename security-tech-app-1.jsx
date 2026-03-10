import { useState, useRef, useCallback } from "react";

const initialInventory = [
  { id: 1, category: "Sensors", name: "PIR Motion Sensor", sku: "PIR-001", qty: 24, minQty: 5, unit: "pcs", cost: 18.5, brand: "DSC" },
  { id: 2, category: "Sensors", name: "Door/Window Contact", sku: "DWC-002", qty: 40, minQty: 10, unit: "pcs", cost: 8.0, brand: "Paradox" },
  { id: 3, category: "Sensors", name: "Smoke Detector", sku: "SMK-003", qty: 12, minQty: 4, unit: "pcs", cost: 32.0, brand: "Ajax" },
  { id: 4, category: "Sensors", name: "Glass Break Detector", sku: "GBD-004", qty: 8, minQty: 3, unit: "pcs", cost: 45.0, brand: "IDS" },
  { id: 5, category: "Sensors", name: "Vibration Sensor", sku: "VIB-005", qty: 6, minQty: 2, unit: "pcs", cost: 22.0, brand: "Texecom" },
  { id: 6, category: "Control Panels", name: "DSC Neo HS2032", sku: "DSC-HS2032", qty: 3, minQty: 1, unit: "pcs", cost: 120.0, brand: "DSC" },
  { id: 7, category: "Control Panels", name: "Paradox EVO192", sku: "PAR-EVO192", qty: 2, minQty: 1, unit: "pcs", cost: 185.0, brand: "Paradox" },
  { id: 8, category: "Control Panels", name: "Ajax Hub 2 Plus", sku: "AJAX-HUB2P", qty: 4, minQty: 1, unit: "pcs", cost: 210.0, brand: "Ajax" },
  { id: 9, category: "Consumables", name: "Alarm Cable 4-Core", sku: "CAB-4C-100", qty: 3, minQty: 1, unit: "roll", cost: 42.0, brand: "Generic" },
  { id: 10, category: "Consumables", name: "Alarm Cable 8-Core", sku: "CAB-8C-100", qty: 2, minQty: 1, unit: "roll", cost: 68.0, brand: "Generic" },
  { id: 11, category: "Consumables", name: "Cable Clips", sku: "CLIP-001", qty: 500, minQty: 100, unit: "pcs", cost: 0.05, brand: "Generic" },
  { id: 12, category: "Consumables", name: "Contact Adhesive Glue", sku: "GLU-001", qty: 8, minQty: 2, unit: "tube", cost: 6.5, brand: "Generic" },
  { id: 13, category: "Consumables", name: "Wall Plugs & Screws", sku: "SCR-001", qty: 300, minQty: 50, unit: "pcs", cost: 0.08, brand: "Generic" },
  { id: 14, category: "Keypads", name: "DSC LCD Keypad", sku: "DSC-LCD", qty: 5, minQty: 2, unit: "pcs", cost: 55.0, brand: "DSC" },
  { id: 15, category: "Keypads", name: "Paradox TM70 Keypad", sku: "PAR-TM70", qty: 3, minQty: 1, unit: "pcs", cost: 78.0, brand: "Paradox" },
  { id: 16, category: "Power", name: "12V 7Ah Battery", sku: "BAT-12V7", qty: 10, minQty: 3, unit: "pcs", cost: 18.0, brand: "Generic" },
  { id: 17, category: "Power", name: "Plug-in Transformer", sku: "TRF-16V", qty: 6, minQty: 2, unit: "pcs", cost: 22.0, brand: "DSC" },
];

const initialClients = [
  { id: 1, name: "ABC Retail Group", email: "facilities@abcretail.com", phone: "011-555-0101", address: "14 Commerce St, Johannesburg" },
  { id: 2, name: "SafeHome Properties", email: "maintenance@safehome.co.za", phone: "021-555-0202", address: "7 Estate Drive, Cape Town" },
  { id: 3, name: "Goldfields Security", email: "ops@goldfields.co.za", phone: "018-555-0303", address: "22 Mining Rd, Klerksdorp" },
];

const BRANDS = ["DSC", "Paradox", "Ajax", "IDS", "Texecom", "Generic"];
const CATEGORIES = ["Sensors", "Control Panels", "Keypads", "Consumables", "Power", "Other"];

const manuals = [
  { id: 1, brand: "DSC", title: "PowerSeries Neo Installation Manual", type: "Installation", size: "4.2 MB", uploaded: "2024-11-01" },
  { id: 2, brand: "DSC", title: "HS2032 Programming Guide", type: "Programming", size: "2.8 MB", uploaded: "2024-11-01" },
  { id: 3, brand: "Paradox", title: "EVO192 Installer Manual", type: "Installation", size: "5.1 MB", uploaded: "2024-10-15" },
  { id: 4, brand: "Ajax", title: "Hub 2 Plus User Manual", type: "User", size: "3.3 MB", uploaded: "2024-09-20" },
  { id: 5, brand: "IDS", title: "IDS 805 Programming Manual", type: "Programming", size: "2.1 MB", uploaded: "2024-08-05" },
  { id: 6, brand: "Texecom", title: "Premier Elite Series Manual", type: "Installation", size: "6.7 MB", uploaded: "2024-07-18" },
];

const TABS = ["Dashboard", "Inventory", "Scan Invoice", "Quotes", "Clients", "Manuals"];

const brandColors = {
  DSC: "#e63946", Paradox: "#f4a261", Ajax: "#2a9d8f", IDS: "#457b9d", Texecom: "#8338ec", Generic: "#6c757d",
};

export default function App() {
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [inventory, setInventory] = useState(initialInventory);
  const [clients, setClients] = useState(initialClients);
  const [manualsList, setManualsList] = useState(manuals);
  const [quotes, setQuotes] = useState([]);
  const [notification, setNotification] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");

  // Inventory modal
  const [showAddItem, setShowAddItem] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [newItem, setNewItem] = useState({ name: "", sku: "", category: "Sensors", brand: "DSC", qty: 0, minQty: 2, unit: "pcs", cost: 0 });

  // Invoice scan state
  const [scanText, setScanText] = useState("");
  const [scanResult, setScanResult] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [scanFile, setScanFile] = useState(null);

  // Quote builder
  const [quoteClient, setQuoteClient] = useState("");
  const [quoteItems, setQuoteItems] = useState([]);
  const [quoteNote, setQuoteNote] = useState("");
  const [quoteSending, setQuoteSending] = useState(false);
  const [showQuoteBuilder, setShowQuoteBuilder] = useState(false);

  // Manual upload
  const [uploadingManual, setUploadingManual] = useState(false);
  const [manualBrand, setManualBrand] = useState("DSC");
  const [manualTitle, setManualTitle] = useState("");
  const [manualType, setManualType] = useState("Installation");

  // Client modal
  const [showAddClient, setShowAddClient] = useState(false);
  const [newClient, setNewClient] = useState({ name: "", email: "", phone: "", address: "" });

  const fileInputRef = useRef();
  const manualFileRef = useRef();

  const notify = (msg, type = "success") => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 3500);
  };

  // --- INVENTORY ---
  const saveItem = () => {
    if (!newItem.name || !newItem.sku) { notify("Name and SKU required", "error"); return; }
    if (editItem) {
      setInventory(inv => inv.map(i => i.id === editItem.id ? { ...editItem, ...newItem } : i));
      notify("Item updated!");
    } else {
      setInventory(inv => [...inv, { ...newItem, id: Date.now() }]);
      notify("Item added!");
    }
    setShowAddItem(false); setEditItem(null);
    setNewItem({ name: "", sku: "", category: "Sensors", brand: "DSC", qty: 0, minQty: 2, unit: "pcs", cost: 0 });
  };

  const deleteItem = (id) => { setInventory(inv => inv.filter(i => i.id !== id)); notify("Item removed", "info"); };

  const openEdit = (item) => {
    setEditItem(item); setNewItem({ ...item }); setShowAddItem(true);
  };

  const adjustQty = (id, delta) => {
    setInventory(inv => inv.map(i => i.id === id ? { ...i, qty: Math.max(0, i.qty + delta) } : i));
  };

  // --- INVOICE SCAN ---
  const handleInvoiceFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setScanFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setScanText(ev.target.result);
    reader.readAsText(file);
  };

  const scanInvoice = async () => {
    if (!scanText.trim()) { notify("Paste invoice text or upload a file", "error"); return; }
    setScanning(true); setScanResult(null);
    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [{
            role: "user",
            content: `You are an inventory parser for a security alarm technician. Parse this invoice text and extract items with quantities used or purchased. 
            
Return ONLY valid JSON in this exact format, no explanation:
{
  "supplier": "supplier name or Unknown",
  "date": "date or today",
  "items": [
    {"name": "item name", "qty": number, "unit": "pcs/roll/tube/etc", "sku": "if found or empty"}
  ]
}

Invoice text:
${scanText}`
          }]
        })
      });
      const data = await response.json();
      const text = data.content?.map(b => b.text || "").join("") || "{}";
      const clean = text.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean);
      setScanResult(parsed);
    } catch (err) {
      notify("Could not parse invoice. Try again.", "error");
    }
    setScanning(false);
  };

  const applyInvoice = () => {
    if (!scanResult?.items?.length) return;
    let matched = 0;
    scanResult.items.forEach(si => {
      const found = inventory.find(i =>
        i.name.toLowerCase().includes(si.name.toLowerCase()) ||
        (si.sku && i.sku.toLowerCase() === si.sku.toLowerCase())
      );
      if (found) {
        setInventory(inv => inv.map(i => i.id === found.id ? { ...i, qty: Math.max(0, i.qty - si.qty) } : i));
        matched++;
      }
    });
    notify(`Updated ${matched} of ${scanResult.items.length} items from invoice`);
    setScanResult(null); setScanText(""); setScanFile(null);
  };

  // --- QUOTES ---
  const addQuoteItem = (invItem) => {
    setQuoteItems(qi => {
      const ex = qi.find(q => q.id === invItem.id);
      if (ex) return qi.map(q => q.id === invItem.id ? { ...q, qty: q.qty + 1 } : q);
      return [...qi, { ...invItem, qty: 1, markup: 30 }];
    });
  };

  const quoteTotal = quoteItems.reduce((s, i) => s + (i.cost * i.qty * (1 + i.markup / 100)), 0);

  const sendQuote = async () => {
    if (!quoteClient || quoteItems.length === 0) { notify("Select client and add items", "error"); return; }
    const client = clients.find(c => c.id === parseInt(quoteClient));
    setQuoteSending(true);
    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [{
            role: "user",
            content: `Generate a professional security installation quote email for this client.

Client: ${client?.name}
Email: ${client?.email}
Items:
${quoteItems.map(i => `- ${i.name} x${i.qty} @ R${(i.cost * (1 + i.markup / 100)).toFixed(2)} each`).join("\n")}
Total: R${quoteTotal.toFixed(2)}
Notes: ${quoteNote || "Standard installation"}

Return ONLY the email body text (no subject line), professional and concise, from "SecureTech Solutions".`
          }]
        })
      });
      const data = await response.json();
      const emailBody = data.content?.map(b => b.text || "").join("") || "";
      const newQuote = {
        id: Date.now(),
        client: client?.name,
        email: client?.email,
        items: [...quoteItems],
        total: quoteTotal,
        date: new Date().toLocaleDateString(),
        body: emailBody,
        status: "Sent"
      };
      setQuotes(q => [newQuote, ...q]);
      notify(`Quote sent to ${client?.name}!`);
      setShowQuoteBuilder(false); setQuoteItems([]); setQuoteClient(""); setQuoteNote("");
    } catch (err) { notify("Failed to generate quote", "error"); }
    setQuoteSending(false);
  };

  // --- MANUALS ---
  const handleManualUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!manualTitle) { notify("Enter a title first", "error"); return; }
    setUploadingManual(true);
    setTimeout(() => {
      setManualsList(m => [...m, {
        id: Date.now(), brand: manualBrand, title: manualTitle, type: manualType,
        size: `${(file.size / 1024 / 1024).toFixed(1)} MB`, uploaded: new Date().toLocaleDateString()
      }]);
      setManualTitle(""); setUploadingManual(false);
      notify("Manual uploaded successfully!");
    }, 1200);
  };

  // --- CLIENTS ---
  const saveClient = () => {
    if (!newClient.name || !newClient.email) { notify("Name and email required", "error"); return; }
    setClients(c => [...c, { ...newClient, id: Date.now() }]);
    notify("Client added!"); setShowAddClient(false);
    setNewClient({ name: "", email: "", phone: "", address: "" });
  };

  const filteredInventory = inventory.filter(i =>
    (categoryFilter === "All" || i.category === categoryFilter) &&
    (i.name.toLowerCase().includes(searchTerm.toLowerCase()) || i.sku.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const lowStock = inventory.filter(i => i.qty <= i.minQty);
  const totalValue = inventory.reduce((s, i) => s + i.qty * i.cost, 0);

  return (
    <div style={{ fontFamily: "'DM Sans', 'Segoe UI', sans-serif", background: "#0f1117", minHeight: "100vh", color: "#e8eaf0" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Space+Grotesk:wght@400;600;700&display=swap');
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 6px; } ::-webkit-scrollbar-track { background: #1a1d26; } ::-webkit-scrollbar-thumb { background: #2d3146; border-radius: 3px; }
        input, select, textarea { outline: none; font-family: inherit; }
        button { cursor: pointer; font-family: inherit; }
        .tab-btn { background: none; border: none; padding: 10px 18px; color: #7a7f99; font-size: 14px; font-weight: 500; border-radius: 8px; transition: all 0.2s; }
        .tab-btn:hover { color: #c8ccde; background: #1e2235; }
        .tab-btn.active { color: #fff; background: #242840; box-shadow: inset 0 0 0 1px #3d4268; }
        .card { background: #161928; border: 1px solid #232640; border-radius: 14px; padding: 20px; }
        .badge { display: inline-block; padding: 2px 9px; border-radius: 20px; font-size: 11px; font-weight: 600; }
        .btn-primary { background: #5865f2; color: #fff; border: none; padding: 9px 18px; border-radius: 8px; font-weight: 600; font-size: 14px; transition: background 0.2s; }
        .btn-primary:hover { background: #4752c4; }
        .btn-danger { background: #e63946; color: #fff; border: none; padding: 6px 12px; border-radius: 6px; font-size: 13px; }
        .btn-ghost { background: #1e2235; color: #a0a5bf; border: 1px solid #2d3146; padding: 7px 14px; border-radius: 7px; font-size: 13px; transition: all 0.2s; }
        .btn-ghost:hover { background: #262b40; color: #e0e3f0; }
        .input-field { background: #1a1d2e; border: 1px solid #2d3146; color: #e0e3f0; padding: 9px 13px; border-radius: 8px; font-size: 14px; width: 100%; transition: border 0.2s; }
        .input-field:focus { border-color: #5865f2; }
        .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.7); display: flex; align-items: center; justify-content: center; z-index: 100; backdrop-filter: blur(4px); }
        .modal { background: #161928; border: 1px solid #232640; border-radius: 16px; padding: 28px; width: 500px; max-width: 95vw; max-height: 90vh; overflow-y: auto; }
        .qty-btn { background: #1e2235; border: 1px solid #2d3146; color: #c0c5df; width: 28px; height: 28px; border-radius: 6px; font-size: 16px; display: flex; align-items: center; justify-content: center; }
        .qty-btn:hover { background: #262b40; }
        .stat-card { background: linear-gradient(135deg, #161928 0%, #1a1e32 100%); border: 1px solid #232640; border-radius: 14px; padding: 20px 24px; }
        .low-stock-row { background: rgba(230,57,70,0.08); border-left: 3px solid #e63946; }
        .search-input { background: #1a1d2e; border: 1px solid #2d3146; color: #e0e3f0; padding: 9px 13px 9px 38px; border-radius: 9px; font-size: 14px; width: 100%; }
        .search-wrap { position: relative; }
        .search-icon { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); opacity: 0.4; }
        .tag { display: inline-block; padding: 3px 10px; border-radius: 6px; font-size: 12px; font-weight: 600; }
        table { width: 100%; border-collapse: collapse; }
        th { text-align: left; padding: 10px 12px; font-size: 12px; text-transform: uppercase; letter-spacing: 0.06em; color: #5a5f7a; border-bottom: 1px solid #232640; }
        td { padding: 11px 12px; font-size: 14px; border-bottom: 1px solid #1a1d2e; }
        tr:hover td { background: #1c2035; }
        .brand-dot { width: 8px; height: 8px; border-radius: 50%; display: inline-block; margin-right: 6px; }
      `}</style>

      {/* NOTIFICATION */}
      {notification && (
        <div style={{ position: "fixed", top: 20, right: 20, zIndex: 999, background: notification.type === "error" ? "#e63946" : notification.type === "info" ? "#457b9d" : "#2a9d8f", color: "#fff", padding: "12px 20px", borderRadius: 10, fontWeight: 600, fontSize: 14, boxShadow: "0 4px 20px rgba(0,0,0,0.4)" }}>
          {notification.msg}
        </div>
      )}

      {/* HEADER */}
      <div style={{ background: "#0d1020", borderBottom: "1px solid #1e2235", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 60 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 32, height: 32, background: "linear-gradient(135deg, #5865f2, #2a9d8f)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>🛡️</div>
          <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 17, color: "#fff" }}>SecureTech</span>
          <span style={{ color: "#3d4268", fontSize: 14, marginLeft: 2 }}>/ Pro</span>
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          {lowStock.length > 0 && (
            <div style={{ background: "rgba(230,57,70,0.15)", border: "1px solid rgba(230,57,70,0.3)", color: "#e63946", padding: "5px 12px", borderRadius: 8, fontSize: 13, fontWeight: 600 }}>
              ⚠ {lowStock.length} low stock
            </div>
          )}
        </div>
      </div>

      {/* NAV */}
      <div style={{ background: "#0d1020", borderBottom: "1px solid #1e2235", padding: "0 20px", display: "flex", gap: 4, overflowX: "auto" }}>
        {TABS.map(t => (
          <button key={t} className={`tab-btn${activeTab === t ? " active" : ""}`} onClick={() => setActiveTab(t)}>
            {t === "Dashboard" ? "📊" : t === "Inventory" ? "📦" : t === "Scan Invoice" ? "🔍" : t === "Quotes" ? "📋" : t === "Clients" ? "👥" : "📚"} {t}
          </button>
        ))}
      </div>

      <div style={{ padding: "24px", maxWidth: 1200, margin: "0 auto" }}>

        {/* ===== DASHBOARD ===== */}
        {activeTab === "Dashboard" && (
          <div>
            <h2 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 24, fontWeight: 700, marginBottom: 20 }}>Overview</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px,1fr))", gap: 16, marginBottom: 28 }}>
              {[
                { label: "Total Items", value: inventory.length, icon: "📦", color: "#5865f2" },
                { label: "Low Stock Alerts", value: lowStock.length, icon: "⚠️", color: "#e63946" },
                { label: "Inventory Value", value: `R${totalValue.toFixed(0)}`, icon: "💰", color: "#2a9d8f" },
                { label: "Quotes Sent", value: quotes.length, icon: "📋", color: "#f4a261" },
                { label: "Clients", value: clients.length, icon: "👥", color: "#8338ec" },
                { label: "Manuals", value: manualsList.length, icon: "📚", color: "#457b9d" },
              ].map(s => (
                <div key={s.label} className="stat-card">
                  <div style={{ fontSize: 26, marginBottom: 8 }}>{s.icon}</div>
                  <div style={{ fontSize: 28, fontWeight: 700, color: s.color, fontFamily: "'Space Grotesk',sans-serif" }}>{s.value}</div>
                  <div style={{ fontSize: 13, color: "#5a5f7a", marginTop: 2 }}>{s.label}</div>
                </div>
              ))}
            </div>

            {lowStock.length > 0 && (
              <div className="card" style={{ marginBottom: 20 }}>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: "#e63946", marginBottom: 14 }}>⚠ Low Stock Items</h3>
                <table>
                  <thead><tr><th>Item</th><th>SKU</th><th>Current Qty</th><th>Min Qty</th><th>Brand</th></tr></thead>
                  <tbody>
                    {lowStock.map(i => (
                      <tr key={i.id} className="low-stock-row">
                        <td>{i.name}</td>
                        <td style={{ color: "#5a5f7a", fontSize: 13 }}>{i.sku}</td>
                        <td><span style={{ color: "#e63946", fontWeight: 700 }}>{i.qty} {i.unit}</span></td>
                        <td style={{ color: "#5a5f7a" }}>{i.minQty}</td>
                        <td><span className="brand-dot" style={{ background: brandColors[i.brand] }}></span>{i.brand}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <div className="card">
              <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 14 }}>Recent Quotes</h3>
              {quotes.length === 0 ? <p style={{ color: "#5a5f7a", fontSize: 14 }}>No quotes sent yet. Build one in the Quotes tab.</p> : (
                <table>
                  <thead><tr><th>Client</th><th>Date</th><th>Total</th><th>Status</th></tr></thead>
                  <tbody>
                    {quotes.slice(0, 5).map(q => (
                      <tr key={q.id}>
                        <td>{q.client}</td>
                        <td style={{ color: "#5a5f7a" }}>{q.date}</td>
                        <td style={{ fontWeight: 700, color: "#2a9d8f" }}>R{q.total.toFixed(2)}</td>
                        <td><span className="badge" style={{ background: "rgba(42,157,143,0.15)", color: "#2a9d8f" }}>{q.status}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

        {/* ===== INVENTORY ===== */}
        {activeTab === "Inventory" && (
          <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
              <h2 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 24, fontWeight: 700 }}>Inventory</h2>
              <button className="btn-primary" onClick={() => { setEditItem(null); setNewItem({ name: "", sku: "", category: "Sensors", brand: "DSC", qty: 0, minQty: 2, unit: "pcs", cost: 0 }); setShowAddItem(true); }}>+ Add Item</button>
            </div>
            <div style={{ display: "flex", gap: 12, marginBottom: 18, flexWrap: "wrap" }}>
              <div className="search-wrap" style={{ flex: 1, minWidth: 200 }}>
                <span className="search-icon">🔍</span>
                <input className="search-input" placeholder="Search items..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
              </div>
              <select className="input-field" style={{ width: "auto" }} value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)}>
                <option value="All">All Categories</option>
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="card" style={{ padding: 0, overflow: "hidden" }}>
              <table>
                <thead><tr><th>Item</th><th>SKU</th><th>Category</th><th>Brand</th><th>Qty</th><th>Min</th><th>Cost</th><th>Actions</th></tr></thead>
                <tbody>
                  {filteredInventory.map(item => (
                    <tr key={item.id} style={item.qty <= item.minQty ? { background: "rgba(230,57,70,0.05)" } : {}}>
                      <td style={{ fontWeight: 500 }}>{item.name}{item.qty <= item.minQty && <span style={{ color: "#e63946", fontSize: 11, marginLeft: 6 }}>LOW</span>}</td>
                      <td style={{ color: "#5a5f7a", fontSize: 12 }}>{item.sku}</td>
                      <td><span className="tag" style={{ background: "#1e2235", color: "#8a8fb0" }}>{item.category}</span></td>
                      <td><span className="brand-dot" style={{ background: brandColors[item.brand] || "#888" }}></span><span style={{ fontSize: 13 }}>{item.brand}</span></td>
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <button className="qty-btn" onClick={() => adjustQty(item.id, -1)}>−</button>
                          <span style={{ fontWeight: 700, color: item.qty <= item.minQty ? "#e63946" : "#e0e3f0", minWidth: 30, textAlign: "center" }}>{item.qty}</span>
                          <button className="qty-btn" onClick={() => adjustQty(item.id, 1)}>+</button>
                          <span style={{ fontSize: 12, color: "#5a5f7a" }}>{item.unit}</span>
                        </div>
                      </td>
                      <td style={{ color: "#5a5f7a", fontSize: 13 }}>{item.minQty}</td>
                      <td style={{ color: "#2a9d8f", fontWeight: 600 }}>R{item.cost.toFixed(2)}</td>
                      <td>
                        <div style={{ display: "flex", gap: 6 }}>
                          <button className="btn-ghost" style={{ padding: "5px 10px" }} onClick={() => openEdit(item)}>✏️</button>
                          <button className="btn-ghost" style={{ padding: "5px 10px" }} onClick={() => addQuoteItem(item)} title="Add to quote">📋</button>
                          <button className="btn-danger" style={{ padding: "5px 10px", borderRadius: 6 }} onClick={() => deleteItem(item.id)}>🗑</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ===== SCAN INVOICE ===== */}
        {activeTab === "Scan Invoice" && (
          <div>
            <h2 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 24, fontWeight: 700, marginBottom: 6 }}>Scan Invoice</h2>
            <p style={{ color: "#5a5f7a", fontSize: 14, marginBottom: 20 }}>Upload an invoice or paste text — AI will extract items and update your inventory.</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
              <div className="card">
                <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 14 }}>📄 Invoice Input</h3>
                <div style={{ marginBottom: 14 }}>
                  <label style={{ fontSize: 13, color: "#7a7f99", display: "block", marginBottom: 6 }}>Upload Invoice File (.txt, .csv)</label>
                  <input type="file" accept=".txt,.csv,.text" onChange={handleInvoiceFile} style={{ display: "none" }} ref={fileInputRef} />
                  <button className="btn-ghost" style={{ width: "100%", padding: "18px", border: "2px dashed #2d3146", borderRadius: 10, fontSize: 14 }} onClick={() => fileInputRef.current.click()}>
                    {scanFile ? `✅ ${scanFile.name}` : "📂 Click to upload file"}
                  </button>
                </div>
                <div style={{ textAlign: "center", color: "#3d4268", fontSize: 13, margin: "10px 0" }}>— or paste text below —</div>
                <textarea className="input-field" style={{ height: 200, resize: "vertical" }} placeholder="Paste invoice text here..." value={scanText} onChange={e => setScanText(e.target.value)} />
                <button className="btn-primary" style={{ marginTop: 12, width: "100%", padding: 12 }} onClick={scanInvoice} disabled={scanning}>
                  {scanning ? "🔄 Scanning..." : "🔍 Scan with AI"}
                </button>
              </div>

              <div className="card">
                <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 14 }}>📊 Parsed Results</h3>
                {!scanResult ? (
                  <div style={{ textAlign: "center", padding: "40px 0", color: "#3d4268" }}>
                    <div style={{ fontSize: 40, marginBottom: 10 }}>🤖</div>
                    <p style={{ fontSize: 14 }}>AI results will appear here</p>
                  </div>
                ) : (
                  <div>
                    <div style={{ marginBottom: 14, padding: "10px 14px", background: "#1a1d2e", borderRadius: 8 }}>
                      <div style={{ fontSize: 13, color: "#7a7f99" }}>Supplier: <span style={{ color: "#e0e3f0", fontWeight: 600 }}>{scanResult.supplier}</span></div>
                      <div style={{ fontSize: 13, color: "#7a7f99" }}>Date: <span style={{ color: "#e0e3f0" }}>{scanResult.date}</span></div>
                    </div>
                    <table>
                      <thead><tr><th>Item</th><th>Qty</th><th>Unit</th><th>Match</th></tr></thead>
                      <tbody>
                        {scanResult.items?.map((si, idx) => {
                          const match = inventory.find(i => i.name.toLowerCase().includes(si.name.toLowerCase()));
                          return (
                            <tr key={idx}>
                              <td style={{ fontSize: 13 }}>{si.name}</td>
                              <td style={{ fontWeight: 700 }}>{si.qty}</td>
                              <td style={{ color: "#5a5f7a", fontSize: 12 }}>{si.unit}</td>
                              <td>{match ? <span className="badge" style={{ background: "rgba(42,157,143,0.15)", color: "#2a9d8f" }}>✓ {match.name}</span> : <span className="badge" style={{ background: "rgba(230,57,70,0.15)", color: "#e63946" }}>No match</span>}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                    <button className="btn-primary" style={{ marginTop: 16, width: "100%" }} onClick={applyInvoice}>
                      ✅ Apply to Inventory
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ===== QUOTES ===== */}
        {activeTab === "Quotes" && (
          <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
              <h2 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 24, fontWeight: 700 }}>Quotes & Estimates</h2>
              <button className="btn-primary" onClick={() => setShowQuoteBuilder(true)}>+ New Quote</button>
            </div>

            {quotes.length === 0 ? (
              <div className="card" style={{ textAlign: "center", padding: "60px 0" }}>
                <div style={{ fontSize: 48, marginBottom: 12 }}>📋</div>
                <p style={{ color: "#5a5f7a" }}>No quotes yet. Click "New Quote" to build one.</p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {quotes.map(q => (
                  <div key={q.id} className="card">
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: 17 }}>{q.client}</div>
                        <div style={{ fontSize: 13, color: "#5a5f7a" }}>{q.email} · {q.date}</div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontWeight: 700, fontSize: 20, color: "#2a9d8f" }}>R{q.total.toFixed(2)}</div>
                        <span className="badge" style={{ background: "rgba(42,157,143,0.15)", color: "#2a9d8f" }}>{q.status}</span>
                      </div>
                    </div>
                    <div style={{ fontSize: 13, color: "#7a7f99", marginBottom: 10 }}>
                      {q.items.map(i => `${i.name} x${i.qty}`).join(", ")}
                    </div>
                    {q.body && (
                      <details style={{ marginTop: 8 }}>
                        <summary style={{ fontSize: 13, color: "#5865f2", cursor: "pointer" }}>View Email Body</summary>
                        <div style={{ background: "#1a1d2e", padding: 14, borderRadius: 8, marginTop: 8, fontSize: 13, lineHeight: 1.7, whiteSpace: "pre-wrap", color: "#c0c5df" }}>{q.body}</div>
                      </details>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ===== CLIENTS ===== */}
        {activeTab === "Clients" && (
          <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
              <h2 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 24, fontWeight: 700 }}>Clients</h2>
              <button className="btn-primary" onClick={() => setShowAddClient(true)}>+ Add Client</button>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px,1fr))", gap: 16 }}>
              {clients.map(c => (
                <div key={c.id} className="card">
                  <div style={{ fontSize: 32, marginBottom: 8 }}>🏢</div>
                  <div style={{ fontWeight: 700, fontSize: 17, marginBottom: 4 }}>{c.name}</div>
                  <div style={{ fontSize: 13, color: "#7a7f99", marginBottom: 2 }}>✉ {c.email}</div>
                  <div style={{ fontSize: 13, color: "#7a7f99", marginBottom: 2 }}>📞 {c.phone}</div>
                  <div style={{ fontSize: 13, color: "#5a5f7a" }}>📍 {c.address}</div>
                  <div style={{ marginTop: 14, display: "flex", gap: 8 }}>
                    <button className="btn-ghost" style={{ flex: 1, fontSize: 13 }} onClick={() => { setQuoteClient(c.id.toString()); setShowQuoteBuilder(true); setActiveTab("Quotes"); }}>📋 New Quote</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===== MANUALS ===== */}
        {activeTab === "Manuals" && (
          <div>
            <h2 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 24, fontWeight: 700, marginBottom: 20 }}>System Manuals</h2>
            <div className="card" style={{ marginBottom: 24 }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 14 }}>📤 Upload Manual</h3>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr auto", gap: 12, alignItems: "end" }}>
                <div>
                  <label style={{ fontSize: 12, color: "#7a7f99", display: "block", marginBottom: 5 }}>Brand</label>
                  <select className="input-field" value={manualBrand} onChange={e => setManualBrand(e.target.value)}>
                    {BRANDS.map(b => <option key={b}>{b}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 12, color: "#7a7f99", display: "block", marginBottom: 5 }}>Title</label>
                  <input className="input-field" placeholder="e.g. EVO192 Installer Manual" value={manualTitle} onChange={e => setManualTitle(e.target.value)} />
                </div>
                <div>
                  <label style={{ fontSize: 12, color: "#7a7f99", display: "block", marginBottom: 5 }}>Type</label>
                  <select className="input-field" value={manualType} onChange={e => setManualType(e.target.value)}>
                    {["Installation", "Programming", "User", "Wiring", "Datasheet"].map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <input type="file" accept=".pdf,.docx,.txt" ref={manualFileRef} onChange={handleManualUpload} style={{ display: "none" }} />
                  <button className="btn-primary" style={{ whiteSpace: "nowrap" }} onClick={() => manualFileRef.current.click()} disabled={uploadingManual}>
                    {uploadingManual ? "Uploading..." : "📂 Upload"}
                  </button>
                </div>
              </div>
            </div>

            {BRANDS.filter(b => manualsList.some(m => m.brand === b)).map(brand => (
              <div key={brand} style={{ marginBottom: 20 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                  <span className="brand-dot" style={{ background: brandColors[brand], width: 12, height: 12 }}></span>
                  <h3 style={{ fontWeight: 700, fontSize: 16 }}>{brand}</h3>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px,1fr))", gap: 12 }}>
                  {manualsList.filter(m => m.brand === brand).map(m => (
                    <div key={m.id} className="card" style={{ display: "flex", alignItems: "center", gap: 14 }}>
                      <div style={{ fontSize: 32 }}>📄</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 3 }}>{m.title}</div>
                        <div style={{ fontSize: 12, color: "#7a7f99" }}>
                          <span className="badge" style={{ background: "#1e2235", color: "#8a8fb0", marginRight: 6 }}>{m.type}</span>
                          {m.size} · {m.uploaded}
                        </div>
                      </div>
                      <button className="btn-ghost" style={{ padding: "6px 10px", fontSize: 16 }}>⬇</button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ===== ADD/EDIT ITEM MODAL ===== */}
      {showAddItem && (
        <div className="modal-overlay" onClick={() => setShowAddItem(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3 style={{ fontWeight: 700, fontSize: 18, marginBottom: 20 }}>{editItem ? "Edit Item" : "Add New Item"}</h3>
            <div style={{ display: "grid", gap: 14 }}>
              {[["Name", "name", "text"], ["SKU", "sku", "text"]].map(([label, key, type]) => (
                <div key={key}>
                  <label style={{ fontSize: 12, color: "#7a7f99", display: "block", marginBottom: 5 }}>{label}</label>
                  <input className="input-field" type={type} value={newItem[key]} onChange={e => setNewItem(n => ({ ...n, [key]: e.target.value }))} />
                </div>
              ))}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label style={{ fontSize: 12, color: "#7a7f99", display: "block", marginBottom: 5 }}>Category</label>
                  <select className="input-field" value={newItem.category} onChange={e => setNewItem(n => ({ ...n, category: e.target.value }))}>
                    {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 12, color: "#7a7f99", display: "block", marginBottom: 5 }}>Brand</label>
                  <select className="input-field" value={newItem.brand} onChange={e => setNewItem(n => ({ ...n, brand: e.target.value }))}>
                    {BRANDS.map(b => <option key={b}>{b}</option>)}
                  </select>
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 12 }}>
                {[["Qty", "qty"], ["Min Qty", "minQty"], ["Cost (R)", "cost"]].map(([label, key]) => (
                  <div key={key}>
                    <label style={{ fontSize: 12, color: "#7a7f99", display: "block", marginBottom: 5 }}>{label}</label>
                    <input className="input-field" type="number" step="0.01" value={newItem[key]} onChange={e => setNewItem(n => ({ ...n, [key]: parseFloat(e.target.value) || 0 }))} />
                  </div>
                ))}
                <div>
                  <label style={{ fontSize: 12, color: "#7a7f99", display: "block", marginBottom: 5 }}>Unit</label>
                  <select className="input-field" value={newItem.unit} onChange={e => setNewItem(n => ({ ...n, unit: e.target.value }))}>
                    {["pcs", "roll", "tube", "box", "m", "pack"].map(u => <option key={u}>{u}</option>)}
                  </select>
                </div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 10, marginTop: 22 }}>
              <button className="btn-primary" style={{ flex: 1 }} onClick={saveItem}>{editItem ? "Update" : "Add Item"}</button>
              <button className="btn-ghost" onClick={() => setShowAddItem(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* ===== QUOTE BUILDER MODAL ===== */}
      {showQuoteBuilder && (
        <div className="modal-overlay" onClick={() => setShowQuoteBuilder(false)}>
          <div className="modal" style={{ width: 640 }} onClick={e => e.stopPropagation()}>
            <h3 style={{ fontWeight: 700, fontSize: 18, marginBottom: 20 }}>Build Quote / Estimate</h3>
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 12, color: "#7a7f99", display: "block", marginBottom: 5 }}>Select Client</label>
              <select className="input-field" value={quoteClient} onChange={e => setQuoteClient(e.target.value)}>
                <option value="">-- Choose client --</option>
                {clients.map(c => <option key={c.id} value={c.id}>{c.name} ({c.email})</option>)}
              </select>
            </div>
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 12, color: "#7a7f99", display: "block", marginBottom: 5 }}>Add Items from Inventory</label>
              <div style={{ maxHeight: 160, overflowY: "auto", background: "#1a1d2e", borderRadius: 8, padding: 8 }}>
                {inventory.map(i => (
                  <div key={i.id} style={{ display: "flex", justifyContent: "space-between", padding: "7px 8px", borderRadius: 6, cursor: "pointer" }} onClick={() => addQuoteItem(i)}
                    onMouseOver={e => e.currentTarget.style.background = "#242840"} onMouseOut={e => e.currentTarget.style.background = "transparent"}>
                    <span style={{ fontSize: 13 }}>{i.name}</span>
                    <span style={{ fontSize: 12, color: "#2a9d8f" }}>R{i.cost.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>
            {quoteItems.length > 0 && (
              <div style={{ marginBottom: 14, background: "#1a1d2e", borderRadius: 8, overflow: "hidden" }}>
                <table>
                  <thead><tr><th>Item</th><th>Qty</th><th>Markup%</th><th>Subtotal</th><th></th></tr></thead>
                  <tbody>
                    {quoteItems.map(qi => (
                      <tr key={qi.id}>
                        <td style={{ fontSize: 13 }}>{qi.name}</td>
                        <td>
                          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                            <button className="qty-btn" onClick={() => setQuoteItems(q => q.map(x => x.id === qi.id ? { ...x, qty: Math.max(1, x.qty - 1) } : x))}>−</button>
                            <span>{qi.qty}</span>
                            <button className="qty-btn" onClick={() => setQuoteItems(q => q.map(x => x.id === qi.id ? { ...x, qty: x.qty + 1 } : x))}>+</button>
                          </div>
                        </td>
                        <td><input type="number" value={qi.markup} style={{ width: 52, background: "#1e2235", border: "1px solid #2d3146", color: "#e0e3f0", borderRadius: 5, padding: "3px 6px", fontSize: 13 }} onChange={e => setQuoteItems(q => q.map(x => x.id === qi.id ? { ...x, markup: parseFloat(e.target.value) || 0 } : x))} /></td>
                        <td style={{ color: "#2a9d8f", fontWeight: 600 }}>R{(qi.cost * qi.qty * (1 + qi.markup / 100)).toFixed(2)}</td>
                        <td><button className="btn-danger" style={{ padding: "3px 8px" }} onClick={() => setQuoteItems(q => q.filter(x => x.id !== qi.id))}>✕</button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div style={{ padding: "12px 16px", borderTop: "1px solid #232640", textAlign: "right", fontWeight: 700, fontSize: 17 }}>
                  Total: <span style={{ color: "#2a9d8f" }}>R{quoteTotal.toFixed(2)}</span>
                </div>
              </div>
            )}
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 12, color: "#7a7f99", display: "block", marginBottom: 5 }}>Notes</label>
              <textarea className="input-field" style={{ height: 70, resize: "none" }} placeholder="Additional notes for client..." value={quoteNote} onChange={e => setQuoteNote(e.target.value)} />
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button className="btn-primary" style={{ flex: 1, padding: 12 }} onClick={sendQuote} disabled={quoteSending}>
                {quoteSending ? "🔄 Generating..." : "✉ Generate & Send Quote"}
              </button>
              <button className="btn-ghost" onClick={() => setShowQuoteBuilder(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* ===== ADD CLIENT MODAL ===== */}
      {showAddClient && (
        <div className="modal-overlay" onClick={() => setShowAddClient(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3 style={{ fontWeight: 700, fontSize: 18, marginBottom: 20 }}>Add New Client</h3>
            <div style={{ display: "grid", gap: 14 }}>
              {[["Company Name", "name"], ["Email", "email"], ["Phone", "phone"], ["Address", "address"]].map(([label, key]) => (
                <div key={key}>
                  <label style={{ fontSize: 12, color: "#7a7f99", display: "block", marginBottom: 5 }}>{label}</label>
                  <input className="input-field" value={newClient[key]} onChange={e => setNewClient(n => ({ ...n, [key]: e.target.value }))} />
                </div>
              ))}
            </div>
            <div style={{ display: "flex", gap: 10, marginTop: 22 }}>
              <button className="btn-primary" style={{ flex: 1 }} onClick={saveClient}>Add Client</button>
              <button className="btn-ghost" onClick={() => setShowAddClient(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
