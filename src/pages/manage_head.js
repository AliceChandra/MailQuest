import React, { useState, useEffect } from "react";
import "../styles/manage_head.css";
import { Link, useLocation } from "react-router-dom";

function ManageHead() {
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

  const [openDropdown, setOpenDropdown] = useState(null);
  const [selectedCurriculum, setSelectedCurriculum] = useState("");

  const [showPopup, setShowPopup] = useState(false);
  const [showUploadPopup, setShowUploadPopup] = useState(false);
  const [popupMode, setPopupMode] = useState("create");

  const [openProgramDropdown, setOpenProgramDropdown] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState("");

  const [openYearDropdown, setOpenYearDropdown] = useState(false);
  const [selectedYear, setSelectedYear] = useState("");

  const [uploadedFile, setUploadedFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState("");
  const [uploadMessage, setUploadMessage] = useState("");

  const [showReplacePopup, setShowReplacePopup] = useState(false);
  const [pendingFile, setPendingFile] = useState(null);

  const [headData, setHeadData] = useState([]);

  const [headName, setHeadName] = useState("");

  const [errors, setErrors] = useState({});
  
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  const curriculums = [
    "2022 / 2023 Odd",
    "2022 / 2023 Even",
    "2023 / 2024 Odd",
    "2023 / 2024 Even",
    "2024 / 2025 Odd",
    "2024 / 2025 Even",
    "2025 / 2026 Odd",
    "2025 / 2026 Even"
  ];

  const programs = [
    "Artificial Intelligence",
    "Computer Science",
    "Computer Science (Global Class)",
    "Computer Science and Mathematics",
    "Computer Science and Statistics",
    "Cyber Security",
    "Data Science",
    "Game Application and Technology",
    "Master Track of Information Technology"
  ];

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

  const handleFileUpload = (file) => {
    if(file) {
      setUploadedFile(file);

      // reset progress
      setUploadProgress(0);
      setUploadStatus("processing");
      setUploadMessage("");

      let progress = 0;
      const allowedFormats = [
        "image/png",
        "image/jpeg",
        "application/pdf"
      ];
      
      const maxSize = 10 * 1024 * 1024; // 10 MB

      const interval = setInterval(() => {
        progress += 1;

        setUploadProgress(progress);

        if(progress >= 100) {
          clearInterval(interval);

          if(!allowedFormats.includes(file.type)) {
            setUploadStatus("error");
            setUploadMessage("Upload Failed: Improper file formats, must be JPG, JPEG, PNG, or PDF");
          }

          else if(file.size > maxSize) {
            setUploadStatus("error");
            setUploadMessage("Upload Failed: File size exceeds 10 MB");
          }

          else if(navigator.onLine === false) {
            setUploadStatus("error");
            setUploadMessage("Upload Failed: Something went wrong with the connection.");
          }

          else {
            setUploadStatus("success");
            setUploadMessage("Upload Completed");

            setErrors(prev => {
              const newErrors = { ...prev };
              delete newErrors.signature;
              return newErrors;
            });
          }
        }
      }, 80);
    }
  }

  const hasHeadData = headData.length > 0;

  const validateForm = () => {

    let newErrors = {};

    if(!selectedProgram) newErrors.program = true;
    if(!headName) newErrors.head = true;
    if(!uploadedFile) newErrors.signature = true;
    if(!selectedYear) newErrors.year = true;
    
    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  }

  return (
    <div className="manage-head">

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
                  <div className="name">{user?.name || "Admin User"}</div>
                  <div className="email">{user?.email || "admin@mail.com"}</div>
                </div>
              </div>

              <div className="user-arrow">➜</div>
            </div>
          </div>
        </div>
        
        <div className="resizer" onMouseDown={startResizing} />
      </div>

      {/* POP-UP */}
      {
        showPopup && (
          <div className="popup-overlay">
            <div className="popup-box">
              <div className="popup-header">
                <h2>
                  {
                    popupMode === "create"
                    ? "Create Head of Program"
                    : "Edit Head of Program"
                  }
                </h2>

                <button
                  className="close-btn"
                  onClick={() => setShowPopup(false)}
                >
                  ✕
                </button>
              </div>

              <hr className="divider popup" />

              <div className="popup-form">
                <div className="form-group">
                  <label>Program Study</label>

                  <div className="custom-dropdown program-study">
                    <div
                      className = {`dropdown-header program-study
                        ${ openProgramDropdown ? "open" : "" }
                        ${ errors.program ? "error-input" : ""}
                      `}
                      onClick={() => setOpenProgramDropdown(!openProgramDropdown)}
                    >
                      {selectedProgram || "Select Program Study"}
                    </div>

                    {openProgramDropdown && (
                      <div className="dropdown-list program">
                        {programs.map((item) => (
                          <div
                            key = {item}
                            className="dropdown-item"
                            onClick={() => {
                              setSelectedProgram(item);
                              setOpenProgramDropdown(false);

                              setErrors(prev => {
                                const newErrors = { ...prev };
                                delete newErrors.program;
                                return newErrors;
                              });
                            }}
                          >
                            {item}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {errors.program && (
                    <p className="error-message">
                      (this field is required)
                    </p>
                  )}
                </div>

                {/* HEAD */}
                <div className="form-group">
                  <label>Head of Program</label>

                  <input
                    type="text"
                    className={errors.head ? "error-input" : ""}
                    placeholder="Enter Head of Program"
                    value={headName}
                    onChange={(e) => {
                      setHeadName(e.target.value);

                      setErrors(prev => {
                        const copy = { ...prev };
                        delete copy.head;
                        return copy;
                      });
                    }}
                  />

                  {errors.head && (
                    <p className="error-message">
                      (this field is required)
                    </p>
                  )}
                </div>

                {/* SIGNATURE */}
                <div className="form-group">
                  <label>Upload Signature</label>

                  <button
                    type="button"
                    className="btn upload-in-popup"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowUploadPopup(true);

                      setErrors(prev => {
                        const newErrors = { ...prev };
                        delete newErrors.signature;
                        return newErrors;
                      });
                    }}
                  >
                    ⬆ Upload File
                  </button>

                  {uploadedFile && (
                    <div className="file-preview view-in-popup">
                      <div className="file-left">
                        📄

                        <div className="file-info">
                          <div className="file-name">
                            {uploadedFile.name}
                          </div>

                          <div className="file-size">
                            {(uploadedFile.size / 1024).toFixed(2)} kB
                          </div>

                          {uploadStatus === "success" && (
                            <div className="upload-success">
                              ✅ Upload Completed
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="file-actions">
                        <span
                          onClick={() =>
                            window.open(URL.createObjectURL(uploadedFile))
                          }
                        >
                          👁
                        </span>

                        <span
                          onClick={() => setUploadedFile(null)}
                        >
                          🗑
                        </span>
                      </div>
                    </div>
                  )}

                  <small>
                    Allowed Files: JPG, JPEG, PNG, PDF
                  </small>

                  {errors.signature && (
                    <p className="error-message">
                      (this field is required)
                    </p>
                  )}
                </div>

                {/* CURRICULUM */}
                <div className="form-group">
                  <label>Academic Year</label>

                  <div className="custom-dropdown academic-year-in-popup">
                    <div
                      className={`dropdown-header academic-year-in-popup
                        ${openYearDropdown ? "open" : ""}
                        ${errors.year ? "error-input" : ""}
                      `}
                      onClick={() => setOpenYearDropdown(!openYearDropdown)}
                    >
                      {selectedYear || "Select Academic Year"}
                    </div>

                    {openYearDropdown && (
                      <div className="dropdown-list curriculum-in-popup">
                        {
                          curriculums.map((item) => (
                            <div
                              key = {item}
                              className="dropdown-item"
                              onClick={() => {
                                setSelectedYear(item);
                                setOpenYearDropdown(false);
                                setErrors(prev => {
                                  const copy = { ...prev };
                                  delete copy.year;
                                  return copy;
                                });
                              }}
                            >
                              {item}
                            </div>
                          ))
                        }
                      </div>
                    )}
                  </div>

                  {errors.year && (
                    <p className="error-message">
                      (this field is required)
                    </p>
                  )}
                </div>

                {/* SAVE */}
                <div className="save-wrapper">
                  <button
                    type="button"
                    className="btn save"
                    onClick={() => {
                      if(!validateForm()) return;

                      setHeadData(prev => [
                        ...prev,
                        {
                          programs: selectedProgram,
                          head: headName,
                          signature: uploadedFile,
                          curriculums: selectedYear
                        }
                      ]);

                      setShowPopup(false);
                      setShowSuccessPopup(true);
                    }}
                  >
                    {
                      popupMode === "create"
                      ? "Create"
                      : "Save Charges"
                    }
                  </button>
                </div>
              </div>
            </div>
          </div>
        )
      }

      {/* UPLOAD POPUP */}
      {
        showUploadPopup && (
          <div className="upload-overlay">
            <div className="upload-popup">

              {/* HEADER */}
              <div className="upload-header">
                <div className="upload-title">
                  ☁ <h2>Upload Signature</h2>
                </div>

                <button
                  type="button"
                  className="close-btn"
                  onClick={() => setShowUploadPopup(false)}
                >
                  ✕
                </button>
              </div>

              <hr className="divider popup" />

              {/* DROP AREA */}
              <div
                className="upload-dropzone"
                onDragOver={(e) => e.preventDefault()}
                onDrop = {(e) => {
                  e.preventDefault();

                  const file = e.dataTransfer.files[0];

                  if(!file) return;

                  // kalau sudah ada file
                  if(uploadedFile) {
                    setPendingFile(file);
                    setShowReplacePopup(true);
                  }

                  // kalau belum ada file
                  else {
                    handleFileUpload(file);
                  }
                }}
              >
                <input
                  type="file"
                  id = "fileUpload"
                  hidden
                  accept=".jpg, .jpeg, .png, .pdf"
                  onChange={(e) => {
                    const file = e.target.files[0];

                    if(!file) return;

                    // kalau sudah ada file
                    if(uploadedFile) {
                      setPendingFile(file);
                      setShowReplacePopup(true);
                    }

                    // kalau belum ada file
                    else {
                      handleFileUpload(file);
                    }
                  }}
                />

                <div className="upload-icon">
                  ☁
                </div>

                <p className="upload-text">
                  Choose an image or drag & drop it here
                </p>
                <p className="upload-text">
                  JPG, PNG, PDF, and JPEG formats, up to 10 MB
                </p>

                <button
                  className="browse-btn"
                  onClick={() => document.getElementById("fileUpload").click()}
                >
                  Browse File
                </button>
              </div>

              {/* FILE PREVIEW */}
              {
                uploadedFile && (
                  <div className="file-preview">
                    <div className="file-left">
                      📄

                      <div>
                        <div className="file-name">
                          {uploadedFile ? uploadedFile.name : "No file chosen"}
                        </div>

                        <div className="file-size">
                          {(uploadedFile.size / 1024).toFixed(2)} kB
                        </div>

                        {
                          uploadStatus === "processing" && (
                            <div className = "progress-wrapper">
                              <div className = "progress-bar">
                                <div
                                  className = "progress-fill"
                                  style = {{ width: `${uploadProgress}%` }}
                                ></div>
                              </div>

                              <span className="progress-text">
                                {uploadProgress}% Processing...
                              </span>
                            </div>
                          )
                        }

                        {
                          uploadStatus === "success" && (
                            <div className="upload-success">
                              ✅ {uploadMessage}
                            </div>
                          )
                        }

                        {
                          uploadStatus === "error" && (
                            <div className="upload-error">
                              ⛔ {uploadMessage}
                            </div>
                          )
                        }

                      </div>
                    </div>

                    <div className="file-actions">
                      <span
                        onClick={
                          () => window.open(
                            URL.createObjectURL(uploadedFile)
                          )
                        }
                      >
                        👁
                      </span>

                      <span
                        onClick={() => setUploadedFile(null)}
                      >
                        🗑
                      </span>
                    </div>
                  </div>
                )
              }

              {/* SAVE */}
              <div className="save-wrapper">
                <button
                  className="btn save-upload"
                  onClick={() => {
                    setShowUploadPopup(false);
                  }}
                >
                  Save Upload
                </button>
              </div>

            </div>
          </div>
        )
      }

      {/* REPLACE FILE POPUP */}
      {
        showReplacePopup && (
          <div className="replace-overlay">
            <div className="replace-popup">

              <h2>Files Replacement</h2>

              <hr className="divider popup" />

              <p className="replace-text">
                Are you sure, you want to reupload? You will replace your existing uploaded files if you want to reupload it!
              </p>

              <div className = "replace-actions">

                {/* CANCEL BUTTON */}
                <button
                  className="btn cancel-replace"
                  onClick = {() => {
                    setPendingFile(null);
                    setShowReplacePopup(false);
                  }}
                >
                  Cancel
                </button>

                {/* REPLACE BUTTON */}
                <button
                  className="btn confirm-replace"
                  onClick = {() => {
                    handleFileUpload(pendingFile);
                    setShowReplacePopup(false);
                    setPendingFile(null);
                  }}
                >
                  Replace
                </button>
              </div>
            </div>
          </div>
        )
      }

      {/* SUCCESS POPUP */}
      {
        showSuccessPopup && (
          <div className="success-overlay">
            <div className="success-popup">
              <h2>Success!</h2>

              <hr className="divider success"/>

              <p>Your signature is successfully saved!</p>

              <div className="success-icon">
                <span className="checkmark">✓</span>
              </div>

              <button
                className="success-btn"
                onClick={()=>setShowSuccessPopup(false)}
              >
                OK
              </button>
            </div>
          </div>
        )
      }

      {/* CONTENT */}
      <div className="content" style={{ marginLeft: sidebarWidth + 40 }}>

        <div className="header">
          <h1>Manage Head of Program</h1>
        </div>

        <hr className="divider" />

        <p className="subtitle">
          Current Head of Study Program based on the active curriculum.
        </p>

        <h2>Program Study Mapping</h2>

        {/* ACTION BAR */}
        <div className="action-bar">

          {/* DROPDOWN */}
          <div className="filter">
            <div className="custom-dropdown academic-year">
              <div
                className={`dropdown-header academic-year ${openDropdown ? "open" : ""}`}
                onClick={() => setOpenDropdown(!openDropdown)}
              >
                {selectedCurriculum || "Academic Year"}
              </div>

              {
                openDropdown && (
                  <div className="dropdown-list curriculum">
                    {
                      curriculums.map((item) => (
                        <div
                          key={item}
                          className="dropdown-item"
                          onClick={() => {
                            setSelectedCurriculum(item);
                            setOpenDropdown(false);
                          }}
                        >
                          {item}
                        </div>
                      ))
                    }
                  </div>
                )
              }
            </div>
          </div>

          {/* BUTTON */}
          <button
            className="btn upload"
            onClick={() => {
              setShowPopup(true);

              // reset form
              setSelectedProgram("");
              setHeadName("");
              setSelectedYear("");
              setUploadedFile(null);
              setErrors({});

              setShowPopup(true);
            }}
          >
            ⬆ Upload File
          </button>
        </div>

        {/* TABLE */}
        <div className="table">
          <div className="table-header">
            <div>Program Study</div>
            <div>Head of Program</div>
            <div>Signature</div>
            <div>Action</div>
          </div>

          {
            !hasHeadData ? (
              <div className="table-row">
                <div>--</div>
                <div>--</div>
                <div>--</div>
                <div>--</div>
              </div>
            ) : (
              headData.map((item, index) => (
                <div className="table-row" key={index}>
                  <div>{item.programs}</div>
                  <div>{item.head}</div>

                  <div>
                    <button
                      className="btn preview"
                      disabled={!item.signature}
                      onClick={() => {
                        window.open(URL.createObjectURL(item.signature));
                      }}
                    >
                      👁 Preview
                    </button>
                  </div>

                  <div>
                    <button
                      className="btn edit"
                      onClick={() => {
                        setSelectedProgram(item.programs);
                        setHeadName(item.head);
                        setSelectedYear(item.curriculums);
                        setUploadedFile(item.signature);

                        setShowPopup(true);
                      }}
                    >
                      ✏ Edit
                    </button>
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

export default ManageHead;