import React, { useState, useEffect } from "react";
import "../styles/dashboard.css";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

function Dashboard() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const response = await axios.get(
        "http://127.0.0.1:8000/api/me",
        {
          withCredentials: true
        }
      );

      setUser(response.data);

    } catch (error) {
      console.log(error);
    }
  };

  const getInitials = (name) => {
    if (!name) return "A";
    const words = name.trim().split(" ");
    return words.length === 1
      ? words[0][0].toUpperCase()
      : (words[0][0] + words[words.length - 1][0]).toUpperCase();
  };

  const getColor = (name) => {
    const colors = ["blue", "green", "purple", "yellow", "orange", "red", "teal", "cyan", "magenta", "lime"];
    return name ? colors[name.length % colors.length] : "blue";
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

  const location = useLocation();

  useEffect(() => {
    window.addEventListener("mousemove", resize);
    window.addEventListener("mouseup", stopResizing);

    return () => {
      window.removeEventListener("mousemove", resize);
      window.removeEventListener("mouseup", stopResizing);
    };
  }, [isResizing]);

  const navigate = useNavigate();

  const [requests, setRequests] = useState([]);
  const [showRejectPopup, setShowRejectPopup] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async() => {
    try {
      const response = await axios.get(
        "http://127.0.0.1:8000/letter-requests",
      );

      setRequests(response.data);
    } catch(error) {
      console.log(error);
    }
  };

  const handleDetails = (item) => {
    if(item.status === "Pending") {
      navigate("/create-letter");
    }
    else if(item.status === "Approved") {
      navigate(`/preview-letter/${item.id}`);
    }
    else if(item.status === "Rejected") {
      setRejectReason(
        item.reject_reason || "No rejection reason provided."
      );

      setShowRejectPopup(true);
    }
  };

  const approved = requests.filter(r => r.status === "Approved").length;
  const pending = requests.filter(r => r.status === "Pending").length;
  const rejected = requests.filter(r => r.status === "Rejected").length;

  return (
    <div className="dashboard">

      {/* SIDEBAR */}
      <div
        className="sidebar"
        style={{ width: sidebarWidth }}
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
          <Link to="/dashboard" style={{ textDecoration: "none" }}>
            <div className={`menu ${location.pathname === "/dashboard" ? "active" : ""}`}>
              📊 {!isMini && "Dashboard"}
            </div>
          </Link>

          <Link to="/create-letter" style={{ textDecoration: "none" }}>
            <div className={`menu ${location.pathname === "/create-letter" ? "active" : ""}`}>
              📥 {!isMini && "Create Letter"}
            </div>
          </Link>

          <Link to="/manage-head" style={{ textDecoration: "none" }}>
            <div className={`menu ${location.pathname === "/manage-head" ? "active" : ""}`}>
              🧑‍💼 {!isMini && "Manage Head"}
            </div>
          </Link>

          <Link to="/manage-template" style={{ textDecoration: "none" }}>
            <div className={`menu ${location.pathname === "/manage-template" ? "active" : ""}`}>
              📄 {!isMini && "Manage Template"}
            </div>
          </Link>
        </div>
        
        {/* ISI SIDEBAR */}
        <div className="sidebar-body">
          
          {/* USER */}
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
                    {user?.name || "Admin User"}
                  </div>
                  <div className="email">
                    {user?.email || "admin@mail.com"}
                  </div>
                </div>
              </div>

              <div className="user-arrow">➜</div>
            </div>
          </div>
        </div>
        
        <div className="resizer" onMouseDown={startResizing} />
      </div>

      {/* CONTENT */}
      <div className="content" style={{ marginLeft: sidebarWidth + 40 }}>
        
        <div className="header">
          <h1>Dashboard</h1>
        </div>

        <hr className="divider" />

        {/* SUMMARY */}
        <div className="summary-card">
          <h2>Student's Request Status</h2>

          <div className="summary-grid">
            <div className="box approved">
              <p>Request Approved</p>
              <h1>{requests.length === 0 ? "--" : approved}</h1>
            </div>

            <div className="box pending">
              <p>Request Pending</p>
              <h1>{requests.length === 0 ? "--" : pending}</h1>
            </div>

            <div className="box rejected">
              <p>Request Rejected</p>
              <h1>{requests.length === 0 ? "--" : rejected}</h1>
            </div>
          </div>
        </div>

        {/* TABLE */}
        <div className="table-wrapper">

          <div className="table-header">
            <div>No.</div>
            <div>Request Date</div>
            <div>Request Status</div>
            <div>Download File</div>
          </div>

          {
            requests.length === 0 ? (
              <div className="table-row empty">
                <div>--</div>
                <div>--</div>
                <div>--</div>
                <div>--</div>
              </div>
            ) : (
              requests.map((item, i) => (
                <div className="table-row" key={i}>
                  <div>{i + 1}</div>
                  <div>{item.date}</div>
                  <div className={`status ${item.status.toLowerCase()}`}>
                    {item.status}
                  </div>
                  <div>
                    <button
                      className="detail-btn"
                      onClick={() => handleDetails(item)}
                    >
                      Details
                    </button>
                  </div>
                </div>
              ))
            )
          }

        </div>

        {/* POP-UP REJECT */}
        {
          showRejectPopup && (
            <div className="popup-overlay">
              <div className="reject-popup">
                <h2>Request Rejected</h2>

                <hr />

                <p className="reject-reason">
                  {rejectReason}
                </p>

                <div className="popup-footer">
                  <button
                    className="popup-ok-btn"
                    onClick={() => setShowRejectPopup(false)}
                  >
                    OK
                  </button>
                </div>
              </div>
            </div>
          )
        }

      </div>
    </div>
  );
}

export default Dashboard;