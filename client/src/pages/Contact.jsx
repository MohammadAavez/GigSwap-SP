import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "./Styles/Contact.css";
import { useAuth } from "../store/auth";
import { toast } from "react-toastify";

const defaultContactFormData = {
  username: "",
  email: "",
  message: "",
  address: "", // Final address (Area name ya Google Map link)
  date: "",
  time: "",
};

export const Contact = () => {
  const [contact, setContact] = useState(defaultContactFormData);
  const [userData, setUserData] = useState(true);
  const [addressMode, setAddressMode] = useState("area"); // 'area' ya 'maps' mode ke liye

  const { user } = useAuth();
  const location = useLocation();

  // URL se service name lene ke liye (e.g. ?service=Plumbing)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const serviceFromURL = params.get("service");
    if (serviceFromURL) {
      setContact((prev) => ({ ...prev, message: serviceFromURL }));
    }
  }, [location]);

  // Auth context se user details fill karne ke liye
  useEffect(() => {
    if (userData && user) {
      setContact((prev) => ({
        ...prev,
        username: user.username,
        email: user.email,
        message: contact.message || prev.message,
      }));
      setUserData(false);
    }
  }, [userData, user, contact.message]);

  const handleInput = (e) => {
    const { name, value } = e.target;
    setContact({ ...contact, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!contact.address) {
      return toast.warn("Please select an area or provide a location link!");
    }

    try {
      const response = await fetch("https://gig-swap-hsp-backend.vercel.app/api/form/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(contact),
      });

      if (response.ok) {
        setContact({ 
          ...defaultContactFormData, 
          username: user.username, 
          email: user.email 
        });
        setAddressMode("area");
        toast.success("Service Booked Successfully! Confirmation sent to email.");
      } else {
        toast.error("Failed to book service. Please try again.");
      }
    } catch (error) {
      toast.error("Network error. Check your connection.");
    }
  };

  return (
    <section className="section-contact">
      <div className="contact-content container">
        <h1 className="main-heading">Book Your Service</h1>
      </div>

      <div className="container grid grid-two-cols">
        <div className="contact-img">
          <img src="/images/support.png" alt="support" />
        </div>

        <section className="section-form">
          <form onSubmit={handleSubmit}>
            {/* --- USER INFO (Read Only) --- */}
            <div>
              <label htmlFor="username">Username</label>
              <input type="text" name="username" value={contact.username} readOnly />
            </div>

            <div>
              <label htmlFor="email">Email</label>
              <input type="email" name="email" value={contact.email} readOnly />
            </div>

            {/* --- SERVICE SELECTION --- */}
            <div>
              <label htmlFor="message">Services</label>
              <select 
                name="message" 
                value={contact.message} 
                onChange={handleInput} 
                required
                className="select-style"
                style={{ width: "100%", padding: "10px", borderRadius: "5px", border: "1px solid #ccc" }}
              >
                <option value="">Select Service</option>
                <option value="Electrician">Electrician</option>
                <option value="Plumbing">Plumbing</option>
                <option value="Ac-Repair">Ac-Repair</option>
                <option value="Cleaner">Cleaner</option>
                <option value="Carpenter">Carpenter</option>
                <option value="Pest Control">Pest Control</option>
              </select>
            </div>

            {/* --- ADDRESS SELECTION LOGIC --- */}
            <div style={{ marginBottom: "15px", border: "1px solid #ddd", padding: "15px", borderRadius: "8px", background: "#fdfdfd" }}>
              <label style={{ fontWeight: "bold", display: "block", marginBottom: "10px" }}>Service Location</label>
              
              <div style={{ display: "flex", gap: "10px", marginBottom: "12px" }}>
                <button 
                  type="button" 
                  onClick={() => { setAddressMode("area"); setContact({...contact, address: ""}) }}
                  style={{ flex: 1, padding: "8px", cursor: "pointer", borderRadius: "5px", border: "1px solid #9f6fff", background: addressMode === "area" ? "#9f6fff" : "#fff", color: addressMode === "area" ? "#fff" : "#9f6fff", fontWeight: "bold", transition: "0.3s" }}
                >
                  Select Area
                </button>
                <button 
                  type="button" 
                  onClick={() => { setAddressMode("maps"); setContact({...contact, address: ""}) }}
                  style={{ flex: 1, padding: "8px", cursor: "pointer", borderRadius: "5px", border: "1px solid #9f6fff", background: addressMode === "maps" ? "#9f6fff" : "#fff", color: addressMode === "maps" ? "#fff" : "#9f6fff", fontWeight: "bold", transition: "0.3s" }}
                >
                  Paste Map Link
                </button>
              </div>

              {addressMode === "area" ? (
                <select 
                  name="address" 
                  value={contact.address} 
                  onChange={handleInput} 
                  required 
                  style={{ width: "100%", padding: "12px", borderRadius: "5px", border: "1px solid #ccc" }}
                >
                  <option value="">-- Choose Nearest Area --</option>
                  <option value="Shivaji Nagar">Shivaji Nagar</option>
                  <option value="Viman Nagar">Viman Nagar</option>
                  <option value="Kothrud">Kothrud</option>
                  <option value="Hinjewadi">Hinjewadi</option>
                  <option value="Baner">Baner</option>
                  <option value="Wakad">Wakad</option>
                </select>
              ) : (
                <div style={{ display: "flex", gap: "8px" }}>
                  <input 
                    type="text" 
                    name="address" 
                    placeholder="Paste link here..." 
                    value={contact.address} 
                    onChange={handleInput}
                    required 
                    style={{ flex: 1, padding: "12px", borderRadius: "5px", border: "1px solid #ccc" }}
                  />
                  <a 
                    href="https://www.google.com/maps" 
                    target="_blank" 
                    rel="noreferrer"
                    style={{ background: "#4285F4", color: "#fff", padding: "10px 15px", borderRadius: "5px", textDecoration: "none", fontSize: "14px", fontWeight: "bold", display: "flex", alignItems: "center", whiteSpace: "nowrap" }}
                  >
                    📍 Open Maps
                  </a>
                </div>
              )}
              {addressMode === "maps" && (
                <p style={{ fontSize: "11px", color: "#888", marginTop: "5px" }}>*Open maps, pick location, copy link & paste it above.</p>
              )}
            </div>

            {/* --- DATE & TIME --- */}
            <div className="grid grid-two-cols">
              <div>
                <label htmlFor="date">Date</label>
                <input 
                  type="date" 
                  name="date" 
                  value={contact.date} 
                  onChange={handleInput} 
                  min={new Date().toISOString().split("T")[0]} 
                  required 
                />
              </div>
              <div>
                <label htmlFor="time">Time</label>
                <input 
                  type="time" 
                  name="time" 
                  value={contact.time} 
                  onChange={handleInput} 
                  required 
                />
              </div>
            </div>

            <button type="submit" className="btn-submit" style={{ marginTop: "20px", width: "100%", padding: "14px", fontWeight: "bold", fontSize: "1.1rem" }}>
              Book Now
            </button>
          </form>
        </section>
      </div>
    </section>
  );
};