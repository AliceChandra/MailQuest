import React, { useState, useEffect } from "react";
import "../styles/create_letter.css";
import { Link, useLocation } from "react-router-dom";

function CreateLetter() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");

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

  const [requestData, setRequestData] = useState(null);

  const hasRequest = requestData !== null;

  const status = requestData?.status;

  return (
    <div className="create-letter">

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
          <h1>Create Letter</h1>
        </div>

        <hr className="divider" />

        <h2>Student's Letter Request</h2>

        {/* TABLE */}
        <div className="student-table">
          <div className="table-header">
            <div>NIM</div>
            <div>Name</div>
            <div>Region</div>
            <div>Faculty</div>
            <div>Major</div>
          </div>

          {
            requestData === null ? (
              <div className="table-row">
                <div>--</div>
                <div>--</div>
                <div>--</div>
                <div>--</div>
                <div>--</div>
              </div>
            ) : (
              requestData.students.map((student, index) => (
                <div className="table-row" key={index}>
                  <div>{student.nim}</div>
                  <div>{student.name}</div>
                  <div>{student.region}</div>
                  <div>{student.faculty || "--"}</div>
                  <div>{student.major}</div>
                </div>
              ))
            )
          }
        </div>

        {/* RESEARCH */}
        <h2>Research Request Information</h2>
        <div>
          <div className="info-row">
            <span>Type of Requested Letter</span>
            <span>:</span>
            <span>
              {requestData?.letterType || "--"}
            </span>
          </div>

          <div className="info-row">
            <span>Request Letter Title</span>
            <span>:</span>
            <span>
              {requestData?.letterTitle || "--"}
            </span>
          </div>

          <div className="info-row">
            <span>Script Essay Title</span>
            <span>:</span>
            <span>
              {requestData?.scriptTitle || "--"}
            </span>
          </div>

          <div className="info-row">
            <span>Research Location</span>
            <span>:</span>
            <span>
              {requestData?.researchLocation || "--"}
            </span>
          </div>
        </div>

        {/* SUPERVISOR */}
        <h2>Supervisor Approvement</h2>
        <div>
          <div className="form-group">
            <label>Letter Code</label>
            <input type="text" placeholder="Enter Letter Code" />
          </div>

          <div className="form-group">
            <label>Supervisor Name</label>
            <input type="text" placeholder="Enter Supervisor Name" />
          </div>

          <div className="form-group">
            <label>Head of Study Program</label>
            <input type="text" placeholder="Select Head of Program" />
          </div>

          <div className="form-group date-wrapper">
            <label>Letter Date</label>
            <input type="date" placeholder="Select Date" />
          </div>
        </div>

        {/* BUTTON */}
        <div className="btn-group">
          {/* VIEW */}
          <button
            className="primary-btn"
            disabled={!hasRequest}
          >
            View
          </button>

          {/* SAVE DRAFT */}
          <button
            className="primary-btn"
            disabled={!hasRequest || status !== "Pending"}
          >
            Save Draft
          </button>

          {/* GENERATE */}
          <button
            className="primary-btn"
            disabled={!hasRequest || status !== "Pending"}
          >
            Generate
          </button>

          {/* APPROVE & SEND */}
          <button
            className="primary-btn"
            disabled={!hasRequest || status !== "Pending"}
          >
            Approve & Send
          </button>

          {/* REVOKE */}
          <button
            className="primary-btn"
            disabled={!hasRequest || status !== "Approved"}
          >
            Revoke
          </button>
        </div>

      </div>
    </div>
  );
}

export default CreateLetter;