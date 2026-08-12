import React, { useState, useEffect } from "react";
import "../styles/view_status.css";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";

function ViewStatus() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const getInitials = (name) => {
    if (!name) return "G";
    const words = name.trim().split(" ");
    return words.length === 1
      ? words[0][0].toUpperCase()
      : (words[0][0] + words[words.length - 1][0]).toUpperCase();
  };

  const getColor = (name) => {
    const colors = ["blue", "green", "purple", "yellow", "orange", "red", "teal", "cyan", "magenta", "lime"];
    return name ? colors[name.length % colors.length] : colors[0];
  };

  const [sidebarWidth, setSidebarWidth] = useState(250);
  const [isResizing, setIsResizing] = useState(false);

  const isMini = sidebarWidth < 120;

  const startResizing = () => setIsResizing(true);
  const stopResizing = () => setIsResizing(false);

  const resize = (e) => {
    if (isResizing) {
      const newWidth = e.clientX;
      if (newWidth >= 80 && newWidth <= 400) {
        setSidebarWidth(newWidth);
      }
    }
  };

  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchLetters = async() => {
      try {
        const response = await axios.get(
          "http://localhost/mailquest-api/view_status.php"
        );

        setData(response.data);
      } catch(error) {
        console.error(error);
      }
    };

    fetchLetters();
  }, []);
  
  const location = useLocation();

  useEffect(() => {
    window.addEventListener("mousemove", resize);
    window.addEventListener("mouseup", stopResizing);

    return () => {
      window.removeEventListener("mousemove", resize);
      window.removeEventListener("mouseup", stopResizing);
    };
  });

  return (
    <div className="view-status">

      {/* SIDEBAR */}
      <div
        className = "sidebar"
        style = {{ width: sidebarWidth }}
      >

        {/* TOP */}
        <div className="top-section">
          <div className="logo">
            <h1>📩 {!isMini && "MailQuest"}</h1>
          </div>

          <hr className="divider" />
        </div>

        {/* MENU */}
        <div className="menu-group">
          <Link to="/letter-request" style={{ textDecoration: "none" }}>
            <div className={`menu ${location.pathname === "/letter-request" ? "active" : ""}`}>
              📥 {!isMini && "Survey Request"}
            </div>
          </Link>

          <Link to="/view-status" style={{ textDecoration: "none" }}>
            <div className={`menu ${location.pathname === "/view-status" ? "active" : ""}`}>
              📊 {!isMini && "View Status"}
            </div>
          </Link>
        </div>

        {/* ISI SIDEBAR */}
        <div className="sidebar-body">
          {/* BOTTOM */}
          <div className="user-wrapper">
            <hr className="divider" />
            <div className="user-box">
              <div className="user-left">
                <div
                  className="avatar"
                  style={{ background: getColor(user?.name || "") }}
                >
                  {getInitials(user?.name || "")}
                </div>

                <div className="user-info">
                  <div className="name">
                    {user?.name || "Guest User"}
                  </div>
                  <div className="email">
                    {user?.email || "guest@binus.ac.id"}
                  </div>
                </div>
              </div>

              <div className="user-arrow">➜</div>
            </div>
          </div>
        </div>
        
        <div
          className="resizer"
          onMouseDown={startResizing}
        />
      </div>

      {/* CONTENT */}
      <div
        className="content"
        style={{ marginLeft: sidebarWidth + 40 }}
      >
        <div className="header">
          <h1>Request Status Viewer</h1>
        </div>
        <hr className="divider" />

        <h2>Student’s Request Status</h2>

        <div className="status-table">
          <div className="table-header">
            <div className="date">{"Request Date"}</div>
            <div>{"Request Status"}</div>
            <div>{"Download File"}</div>
          </div>

          {
            data.length === 0 ? (
              <div className="table-row empty">
                <div>--</div>
                <div>--</div>
                <div>--</div>
              </div>
            ) : (
              data.map((item, index) => (
                <div className="table-row" key={index}>
                  <div>{item.date}</div>
                  <div className={`status ${item.status.toLowerCase()}`}>
                    {item.status}
                  </div>
                  <div>
                    {item.status === "Approved" ? (
                      <button className="download-btn">
                        ⬇ Download
                      </button>
                    ) : (
                      <span className="waiting-text">
                        Waiting for Admin
                      </span>
                    )}
                  </div>
                </div>
              ))
            )
          }
        
        </div>
      </div>
    </div>
  );
}

export default ViewStatus;