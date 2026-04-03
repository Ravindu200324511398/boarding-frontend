import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer style={{
      background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
      color: "#94a3b8",
      marginTop: "auto",
      borderTop: "1px solid #1e293b"
    }}>
      {/* Main Footer Content */}
      <div className="container" style={{ padding: "3rem 1rem 2rem" }}>
        <div className="row g-4">

          {/* Column 1 - About */}
          <div className="col-lg-4 col-md-6">
            <div style={{ marginBottom: "1rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "1rem" }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 10,
                  background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "1.2rem"
                }}>🏠</div>
                <span style={{
                  fontFamily: "var(--font-heading)", fontWeight: 800,
                  fontSize: "1.2rem", color: "#f1f5f9"
                }}>BoardingFinder</span>
              </div>
              <p style={{
                fontSize: "0.875rem", lineHeight: 1.8,
                color: "#94a3b8", margin: "0 0 1.2rem"
              }}>
                Sri Lanka's trusted platform for finding affordable and comfortable
                boarding places near universities. Connecting students with verified
                landlords since 2024.
              </p>
              {/* Social Links */}
              <div style={{ display: "flex", gap: "0.6rem" }}>
                {[
                  { icon: "f", label: "Facebook", color: "#1877f2", href: "#" },
                  { icon: "in", label: "Instagram", color: "#e1306c", href: "#" },
                  { icon: "t", label: "Twitter", color: "#1da1f2", href: "#" },
                  { icon: "yt", label: "YouTube", color: "#ff0000", href: "#" },
                ].map(s => (
                  <a key={s.label} href={s.href} title={s.label}
                    style={{
                      width: 36, height: 36, borderRadius: 8,
                      background: "rgba(255,255,255,0.07)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      color: "#94a3b8", textDecoration: "none", fontSize: "0.7rem",
                      fontWeight: 800, transition: "all 0.2s",
                      cursor: "pointer"
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.background = s.color;
                      e.currentTarget.style.color = "#fff";
                      e.currentTarget.style.borderColor = s.color;
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background = "rgba(255,255,255,0.07)";
                      e.currentTarget.style.color = "#94a3b8";
                      e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
                    }}>
                    {s.icon.toUpperCase()}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Column 2 - Quick Links */}
          <div className="col-lg-2 col-md-6 col-6">
            <h6 style={{
              color: "#f1f5f9", fontWeight: 700, fontSize: "0.82rem",
              textTransform: "uppercase", letterSpacing: "0.08em",
              marginBottom: "1.2rem"
            }}>Quick Links</h6>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {[
                { label: "Browse Listings", to: "/" },
                { label: "Add Listing", to: "/add" },
                { label: "Map View", to: "/map" },
                { label: "Compare", to: "/compare" },
                { label: "Favorites", to: "/favorites" },
                { label: "My Profile", to: "/profile" },
              ].map(link => (
                <li key={link.label} style={{ marginBottom: "0.6rem" }}>
                  <Link to={link.to} style={{
                    color: "#94a3b8", textDecoration: "none",
                    fontSize: "0.875rem", display: "flex",
                    alignItems: "center", gap: "0.4rem",
                    transition: "color 0.15s"
                  }}
                  onMouseEnter={e => e.currentTarget.style.color = "#60a5fa"}
                  onMouseLeave={e => e.currentTarget.style.color = "#94a3b8"}>
                    <span style={{ color: "#2563eb", fontSize: "0.7rem" }}>▶</span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 - Room Types */}
          <div className="col-lg-2 col-md-6 col-6">
            <h6 style={{
              color: "#f1f5f9", fontWeight: 700, fontSize: "0.82rem",
              textTransform: "uppercase", letterSpacing: "0.08em",
              marginBottom: "1.2rem"
            }}>Room Types</h6>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {[
                { label: "Single Rooms", emoji: "🛏️" },
                { label: "Double Rooms", emoji: "🛏️" },
                { label: "Triple Rooms", emoji: "🛏️" },
                { label: "Annex", emoji: "🏡" },
                { label: "Studio", emoji: "🏠" },
              ].map(type => (
                <li key={type.label} style={{ marginBottom: "0.6rem" }}>
                  <span style={{
                    color: "#94a3b8", fontSize: "0.875rem",
                    display: "flex", alignItems: "center", gap: "0.5rem"
                  }}>
                    <span>{type.emoji}</span>
                    {type.label}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4 - Contact Info */}
          <div className="col-lg-4 col-md-6">
            <h6 style={{
              color: "#f1f5f9", fontWeight: 700, fontSize: "0.82rem",
              textTransform: "uppercase", letterSpacing: "0.08em",
              marginBottom: "1.2rem"
            }}>Contact Us</h6>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {[
                { icon: "📍", label: "Kandy, Central Province, Sri Lanka" },
                { icon: "📧", label: "support@boardingfinder.lk" },
                { icon: "📞", label: "+94 77 123 4567" },
                { icon: "🕐", label: "Mon - Fri, 8:00 AM - 6:00 PM" },
              ].map(item => (
                <li key={item.label} style={{
                  marginBottom: "0.85rem", display: "flex",
                  alignItems: "flex-start", gap: "0.75rem"
                }}>
                  <span style={{ fontSize: "1rem", marginTop: "0.05rem", flexShrink: 0 }}>{item.icon}</span>
                  <span style={{ fontSize: "0.875rem", color: "#94a3b8", lineHeight: 1.5 }}>{item.label}</span>
                </li>
              ))}
            </ul>

            {/* Newsletter mini box */}
            <div style={{
              marginTop: "1.2rem", background: "rgba(37,99,235,0.15)",
              border: "1px solid rgba(37,99,235,0.3)",
              borderRadius: 12, padding: "1rem"
            }}>
              <p style={{ fontSize: "0.8rem", color: "#93c5fd", fontWeight: 600, margin: "0 0 0.6rem" }}>
                📬 Get notified of new listings
              </p>
              <div style={{ display: "flex", gap: "0.4rem" }}>
                <input type="email" placeholder="Your email"
                  style={{
                    flex: 1, background: "rgba(255,255,255,0.08)",
                    border: "1px solid rgba(255,255,255,0.15)",
                    borderRadius: 8, padding: "0.45rem 0.75rem",
                    color: "#f1f5f9", fontSize: "0.8rem",
                    outline: "none", fontFamily: "var(--font-body)"
                  }} />
                <button style={{
                  background: "linear-gradient(135deg,#2563eb,#1d4ed8)",
                  color: "#fff", border: "none", borderRadius: 8,
                  padding: "0.45rem 0.85rem", fontSize: "0.78rem",
                  fontWeight: 700, cursor: "pointer",
                  fontFamily: "var(--font-body)", whiteSpace: "nowrap"
                }}>
                  Subscribe
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Divider */}
      <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }} />

      {/* Bottom Bar */}
      <div className="container" style={{ padding: "1.2rem 1rem" }}>
        <div style={{
          display: "flex", alignItems: "center",
          justifyContent: "space-between", flexWrap: "wrap", gap: "0.8rem"
        }}>
          <p style={{ margin: 0, fontSize: "0.8rem", color: "#64748b" }}>
            © {currentYear} <span style={{ color: "#94a3b8", fontWeight: 600 }}>BoardingFinder</span>. All rights reserved. Made with ❤️ for Sri Lankan students.
          </p>
          <div style={{ display: "flex", gap: "1.2rem" }}>
            {["Privacy Policy", "Terms of Use", "Help Center"].map(item => (
              <a key={item} href="#" style={{
                color: "#64748b", textDecoration: "none",
                fontSize: "0.78rem", transition: "color 0.15s"
              }}
              onMouseEnter={e => e.currentTarget.style.color = "#94a3b8"}
              onMouseLeave={e => e.currentTarget.style.color = "#64748b"}>
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
