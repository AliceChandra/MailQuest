import React, { useState, useEffect } from "react";
import "../styles/manage_template.css";
import { Link, useLocation } from "react-router-dom";

function ManageTemplate() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const getInitials = (name) => {
    if (!name) return "A";

    const words = name.trim().split(" ");

    return words.length === 1
      ? words[0][0].toUpperCase()
      : (words[0][0] + words[words.length - 1][0]).toUpperCase();
  };

  const getColor = (name) => {
    const colors = ["blue", "green", "purple", "orange", "red"];
    return name ? colors[name.length % colors.length] : "blue";
  };

  const [sidebarWidth, setSidebarWidth] = useState(250);
  const [isResizing, setIsResizing] = useState(false);

  const isMini = sidebarWidth < 120;

  const startResizing = () => setIsResizing(true);
  const stopResizing = () => setIsResizing(false);

  const [openDropdown, setOpenDropdown] = useState(false);
  const [openPopupDropdown, setOpenPopupDropdown] = useState(false);
  const [selectedType, setSelectedType] = useState("");

  const [showTemplatePopup, setShowTemplatePopup] = useState(false);

  const [templateTitle, setTemplateTitle] = useState("");
  const [description, setDescription] = useState("");
  const [academicYear, setAcademicYear] = useState("");
  const [autoGenerate, setAutoGenerate] = useState(false);

  const [showPopup, setShowPopup] = useState(false);
  const [showUploadPopup, setShowUploadPopup] = useState(false);

  const [uploadedFile, setUploadedFile] = useState(null);

  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState("");
  const [uploadMessage, setUploadMessage] = useState("");

  const [showReplacePopup, setShowReplacePopup] = useState(false);
  const [pendingFile, setPendingFile] = useState(null);

  const [templates, setTemplates] = useState([]);

  const [selectedFilter, setSelectedFilter] = useState("");
  const [selectedLetterType, setSelectedLetterType] = useState("");

  const [openYearDropdown, setOpenYearDropdown] = useState(false);
  const [selectedYear, setSelectedYear] = useState("");

  const [errors, setErrors] = useState({});

  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

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

  const letterTypes = [
    "Survey",
    "Non-Survey"
  ];

  const academicYears = [
    "2026/2027",
    "2025/2026",
    "2024/2025",
    "2023/2024",
    "2022/2023"
  ];

  const hasTemplate = templates.length > 0;

  const handleFileUpload = (file) => {
    if(file) {
      setUploadedFile(file);

      // reset progress
      setUploadProgress(0);
      setUploadStatus("processing");
      setUploadMessage("");

      let progress = 0;
      const allowedFormats = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/rtf"
      ];
      
      const maxSize = 50 * 1024 * 1024; // 50 MB

      const interval = setInterval(() => {
        progress += 1;

        setUploadProgress(progress);

        if(progress >= 100) {
          clearInterval(interval);

          if(!allowedFormats.includes(file.type)) {
            setUploadStatus("error");
            setUploadMessage("Upload Failed: Improper file formats, must be DOCX, DOC, PDF, and RTF");
          }

          else if(file.size > maxSize) {
            setUploadStatus("error");
            setUploadMessage("Upload Failed: File size exceeds 50 MB");
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
              delete newErrors.uploadFile;
              return newErrors;
            });
          }
        }
      }, 80);
    }
  }

  const validateForm = () => {
    let newErrors = {};

    if(!selectedLetterType) newErrors.letterTypes = true;

    if(!templateTitle.trim()) newErrors.templateTitle = true;

    if(!uploadedFile) newErrors.uploadFile = true;

    if(!academicYear) newErrors.academicYear = true;

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  }

  const handleSaveTemplate = () => {
    if(!validateForm()) return;

    const newTemplate = {
      title: templateTitle,
      letterTypes: selectedLetterType,
      year: academicYear,
      description,
      file: uploadedFile,
      uploadedDate: new Date().toLocaleDateString("id-ID")
    };

    setTemplates(prev => [...prev, newTemplate]);
    resetTemplateForm();
    setShowTemplatePopup(false);
    setShowSuccessPopup(true);
  }

  const resetTemplateForm = () => {
    setTemplateTitle("");
    setDescription("");
    setSelectedLetterType("");
    setAcademicYear("");
    setSelectedYear("");
    setUploadedFile(null);
    setUploadStatus("")
    setUploadProgress(0);
    setUploadMessage("");
    setErrors({});
    setAutoGenerate(false);
  }

  const filteredTemplates = 
    selectedType
      ? templates.filter(
        t => t.letterTypes === selectedType
      )
      : templates;

  return (
    <div className="manage-template">

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

      {/* UPLOAD TEMPLATE FORM */}
      {
        showTemplatePopup && (
          <div className = "popup-overlay">
            <div className = "popup-box template">
              <div className = "popup-header">
                <h2>Upload Template Form</h2>

                <button
                  className = "close-btn"
                  onClick = {() => setShowTemplatePopup(false)}
                >
                  ✕
                </button>
              </div>

              <hr className="divider popup" />

              <div className="popup-form">
                <div className="form-group">
                  <label>Letter Type</label>
                  
                  <div className="custom-dropdown popup-dropdown-in-popup">
                    <div
                      className={`dropdown-header
                        ${ openPopupDropdown ? "open" : "" }
                        ${ errors.letterTypes ? "error-input" : ""}
                      `}
                      onClick={() => setOpenPopupDropdown(!openPopupDropdown)}
                    >
                      {selectedLetterType || "Select Letter Type"}
                    </div>

                    {openPopupDropdown && (
                      <div className="dropdown-list">
                        {letterTypes.map((item) => (
                          <div
                            key={item}
                            className="dropdown-item"
                            onClick={() => {
                              setSelectedLetterType(item);
                              setOpenPopupDropdown(false);

                              setErrors(prev => {
                                const newErrors = { ...prev };
                                delete newErrors.letterTypes;
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

                  {errors.letterTypes && (
                    <p className="error-message">
                      (this field is required)
                    </p>
                  )}
                </div>

                <div className="form-group">
                  <label>Letter Title</label>

                  <input
                    type="text"
                    className={errors.templateTitle ? "error-input" : ""}
                    placeholder="Letter Title"
                    value={templateTitle}
                    onChange={(e) => {
                      setTemplateTitle(e.target.value);

                      setErrors(prev => {
                        const newErrors = { ...prev };
                        delete newErrors.templateTitle;
                        return newErrors;
                      });
                    }}
                  />

                  {errors.templateTitle && (
                    <p className="error-message">
                      (this field is required)
                    </p>
                  )}
                </div>

                <div className="form-group">
                  <label>Upload Template File</label>

                  <button
                    className="btn upload-in-popup"
                    type="button"
                    onClick={()=> setShowUploadPopup(true)}
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

                          {uploadStatus === "processing" && (
                            <div className="progress-wrapper">
                              <div className="progress-bar">
                                <div
                                  className="progress-fill"
                                  style={{ width: `${uploadProgress}%` }}
                                />
                              </div>

                              <span className="progress-text">
                                {uploadProgress}% Processing...
                              </span>
                            </div>
                          )}

                          {uploadStatus === "success" && (
                            <div className="upload-success">
                              ✅ Upload Completed
                            </div>
                          )}

                          {uploadStatus === "error" && (
                            <div className="upload-error">
                              ⛔ {uploadMessage}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="file-actions">
                        <span
                          onClick={() => {
                            const url = URL.createObjectURL(uploadedFile);
                            window.open(url, "_blank");
                            setTimeout(()=>URL.revokeObjectURL(url), 1000);
                          }}
                        >
                          👁
                        </span>

                        <span
                          onClick={() => {
                            setUploadedFile(null);
                            setUploadStatus("");
                            setUploadProgress(0);
                            setUploadMessage("");
                            setPendingFile(null);
                            setErrors(prev=>{
                              const e={...prev};
                              delete e.uploadFile;
                              return e;
                            });
                          }}
                        >
                          🗑
                        </span>
                      </div>
                    </div>
                  )}

                  <small>Allowed Files: DOCX, DOC, PDF, RTF</small>

                  <small>Maximum Size: 50 MB</small>

                  {errors.uploadFile && (
                    <p className="error-message">
                      (this field is required)
                    </p>
                  )}
                </div>

                <div className="form-group">
                  <label>Description</label>

                  <textarea
                    rows="5"
                    placeholder="Write Description here"
                    value={description}
                    onChange={(e)=>setDescription(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label>Academic Year</label>

                  <div className="custom-dropdown popup-dropdown-in-popup">
                    <div
                      className={`dropdown-header
                        ${openYearDropdown ? "open" : ""}
                        ${errors.academicYear ? "error-input" : ""}
                      `}
                      onClick={() => {
                        setOpenYearDropdown(!openYearDropdown);
                      }}
                    >
                      {selectedYear || "Academic Year"}
                    </div>

                    {openYearDropdown && (
                      <div className="dropdown-list">

                        {academicYears.map((year) => (
                          <div
                            key={year}
                            className="dropdown-item"
                            onClick={() => {
                              setSelectedYear(year);
                              setAcademicYear(year);
                              setOpenYearDropdown(false);

                              setErrors(prev => {
                                const newErrors = {...prev};
                                delete newErrors.academicYear;
                                return newErrors;
                              });
                            }}
                          >
                            {year}
                          </div>
                        ))}
                      </div>
                    )}
                    
                  </div>

                  {errors.academicYear && (
                    <p className="error-message">
                      (this field is required)
                    </p>
                  )}

                  <div className="switch-wrapper">
                    <span>Auto Generate Letter</span>
                    <label className="switch">
                      <input
                        type="checkbox"
                        checked={autoGenerate}
                        onChange={(e) => setAutoGenerate(e.target.checked)}
                      />

                      <span className="slider"></span>
                    </label>
                  </div>

                  <div className="template-buttons">
                    <button className="btn view">View Template</button>
                    <button
                      className="btn save"
                      onClick={handleSaveTemplate}
                    >
                      Save Template
                    </button>
                  </div>
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
                  ☁ <h2>Upload Files</h2>
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
                    setErrors(prev => {
                      const newErrors = { ...prev };
                      delete newErrors.uploadFile;
                      return newErrors;
                    })
                  }
                }}
              >
                <input
                  type="file"
                  id = "fileUpload"
                  hidden
                  accept=".docx, .doc, .pdf, .rtf"
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
                      setErrors(prev => {
                        const newErrors = { ...prev };
                        delete newErrors.uploadFile;
                        return newErrors;
                      });
                    }
                  }}
                />

                <div className="upload-icon">
                  ☁
                </div>

                <p className="upload-text">
                  Choose a document or drag & drop it here
                </p>
                <p className="upload-text">
                  DOCX, DOC, PDF, and RTF formats, up to 50 MB
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

                      <div className="file-info">
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
                        onClick={() => {
                          const url = URL.createObjectURL(uploadedFile);
                          window.open(url, "_blank");
                          setTimeout(()=>URL.revokeObjectURL(url), 1000);
                        }}
                      >
                        👁
                      </span>

                      <span
                        onClick={() => {
                          setUploadedFile(null);
                          setUploadStatus("");
                          setUploadProgress(0);
                          setUploadMessage("");

                          setErrors(prev=>{
                            const e={...prev};
                            delete e.uploadFile;
                            return e;
                          });
                        }}
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
                    if(!pendingFile) return;
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

              <p>Your template is successfully saved!</p>

              <div className="success-icon">
                <span className="checkmark">✓</span>
              </div>

              <button
                className="success-btn"
                onClick={()=>{
                  setShowSuccessPopup(false);
                  resetTemplateForm();
                }}
              >
                OK
              </button>
            </div>
          </div>
        )
      }

      {/* CONTENT */}
      <div
        className="content"
        style={{ marginLeft: sidebarWidth + 40 }}
      >
        <div className="header">
          <h1>Manage Letter Template</h1>
        </div>

        <hr className="divider" />

        <h2>Manage Letter Template</h2>

        {/* ACTION BAR */}
        <div className="action-bar">

          {/* DROPDOWN */}
          <div className="custom-dropdown">
            <div
              className={`dropdown-header ${openDropdown ? "open" : ""}`}
              onClick={() => setOpenDropdown(!openDropdown)}
            >
              {selectedType || "Select Letter Type"}
            </div>

            {
              openDropdown && (
                <div className="dropdown-list">
                  {
                    letterTypes.map((item) => (
                      <div
                        key={item}
                        className="dropdown-item"
                        onClick={() => {
                          setSelectedType(item);
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

          {/* BUTTON */}
          <button
            className="btn upload"
            onClick={() => setShowTemplatePopup(true)}
          >
            ⬆ Upload File
          </button>
        </div>

        {/* TABLE */}
        <div className="table">

          <div className="table-header">
            <div>File Name</div>
            <div>Letter Type</div>
            <div>Uploaded Date</div>
            <div>Action</div>
          </div>

          {
            !hasTemplate ? (
              <div className="table-row empty-row">
                <div>--</div>
                <div>--</div>
                <div>--</div>
                <div>--</div>
              </div>
            ) : (
              filteredTemplates.map((item, i) => (
                <div
                  key={i}
                  className="table-row"
                >
                  <div>{item.title}</div>
                  <div>{item.letterTypes}</div>
                  <div>{item.year}</div>
                  <div className="action-buttons">
                    <button
                      className="btn replace"
                      onClick={() => {
                        setUploadedFile(item.file);
                        setShowUploadPopup(true);
                      }}
                    >
                      ♻ Replace
                    </button>
                    <button
                      className="btn download"
                      onClick={() => {
                        const url = URL.createObjectURL(item.file);
                        const a = document.createElement("a");
                        a.href = url;
                        a.download = item.file.name;
                        a.click();
                        URL.revokeObjectURL(url);
                      }}
                    >
                      ⬇ Download
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

export default ManageTemplate;