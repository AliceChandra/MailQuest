import React, { useState, useEffect } from 'react';
import '../styles/letter_request.css';
import { Link, useLocation } from "react-router-dom";
import axios from "axios";

function LetterRequest() {
  const [user, setUser] = useState(null);
  useEffect(() => {
    const fetchUser = async() => {
      try {
        const response = await axios.get(
          "http://127.0.0.1:8000/auth/me",
          {
            withCredentials: true
          }
        );

        console.log("AUTH ME RESPONSE:", response.data);

        setUser(response.data);
      } catch(error) {
        console.error("Failed to fetch user: ", error);
      }
    };

    fetchUser();
  }, []);

  const getInitials = (name) => {
    if (!name) return "G";

    const words = name.trim().split(" ");

    if (words.length === 1) {
      return words[0][0].toUpperCase();
    }

    return(
      words[0][0] + words[words.length - 1][0]
    ).toUpperCase();
  };

  const getColor = (name) => {
    const colors = ["blue", "green", "purple", "yellow", "orange", "red", "teal", "cyan", "magenta", "lime"];
    const index = name ? name.length % colors.length : 0;
    return colors[index];
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

  const [openDropdown, setOpenDropdown] = useState({});
  const [selectedRegion, setSelectedRegion] = useState({});
  const [selectedFaculty, setSelectedFaculty] = useState({});
  const [selectedMajor, setSelectedMajor] = useState({});
  const [selectedLetterType, setSelectedLetterType] = useState("");

  const regions = [
    "Binus Kemanggisan",
    "Binus Alam Sutera",
    "Binus ASO",
    "Binus Bekasi",
    "Binus Bandung",
    "Binus Malang",
    "Binus Semarang",
    "Binus Medan",
    "Binus Online"
  ];

  const faculties = [
    "School of Computer Science",
    "School of Information Systems",
    "School of Design",
    "BINUS Business School Undergraduate Programs",
    "School of Accounting",
    "Faculy of Digital Communication and Hotel & Tourism",
    "Faculty of Humanities",
    "Faculty of Engineering",
    "School of Engineering (Binus ASO)"
  ];

  const majors = [
    "Accounting",
    "Animation",
    "Architecture",
    "Artificial Intelligence",
    "Automotive and Robotics Engineering",
    "Biotechnology",
    "Business Analytics",
    "Business Creation",
    "Business Engineering",
    "Business Hotel Management (D4)",
    "Business Information Technology",
    "Business Law",
    "Business Management",
    "Business Psychology",
    "Civil Engineering",
    "Communication",
    "Computer Engineering",
    "Computer Science",
    "Computer Science (Global Class)",
    "Computer Science (Software Engineering)",
    "Computer Science and Mathematics",
    "Computer Science and Statistics",
    "Creative Advertising",
    "Creative Communication",
    "Creative Digital English",
    "Creativepreneurship",
    "Cyber Security",
    "Data Science",
    "Digital Business",
    "Digital Business Communication",
    "Digital Business Innovation (S1 + S1)",
    "Digital Business Management",
    "Digital Psychology (S1 + S1)",
    "Fashion",
    "Film",
    "Finance",
    "Food Technology",
    "Game Application and Technology",
    "Global Business Chinese",
    "Global Business Marketing",
    "Hotel Management (D4)",
    "Industrial Engineering",
    "Information Systems",
    "Interactive Design and Technology (S1 + S1)",
    "Interior Design",
    "International Business Management",
    "International Business Management (Global Class)",
    "International Relations",
    "International Relations (Global Class)",
    "International Trade",
    "Japanese Pop Culture",
    "Management",
    "Marketing Communication",
    "Mass Communication",
    "Master of Information Systems Management",
    "Master of Information Technology",
    "Master of Management",
    "New Media",
    "Primary Teacher Education",
    "Product Design Engineering",
    "Psychology",
    "Public Relations",
    "Smart Industrial Engineering",
    "Taxation",
    "Tourism",
    "Visual Communication Design"
  ];

  const majorMapping = {
    "Binus Kemanggisan" : {
      "School of Computer Science" : [
        "Artificial Intelligence",
        "Computer Science",
        "Computer Science and Mathematics",
        "Computer Science and Statistics",
        "Cyber Security",
        "Data Science",
        "Game Application and Technology",
        "Master of Information Technology"
      ],

      "School of Information Systems" : [
        "Business Analytics",
        "Information Systems",
        "Master of Information Systems Management"
      ],

      "School of Design" : [
        "Animation",
        "Creative Media",
        "Interior Design",
        "New Media"
      ],

      "BINUS Business School Undergraduate Programs" : [
        "Global Business Marketing",
        "Management"
      ],

      "School of Accounting" : [
        "Accounting",
        "Taxation"
      ],

      "Faculy of Digital Communication and Hotel & Tourism" : [
        "Hotel Management (D4)",
        "Marketing Communication",
        "Mass Communication",
        "Tourism"
      ],

      "Faculty of Humanities" : [
        "Business Law",
        "Creative Digital English",
        "Digital Psychology (S1 + S1)",
        "Global Business Chinese",
        "International Relations",
        "Japanese Popularl Culture",
        "Primary Teacher Education",
        "Psychology"
      ],

      "Faculty of Engineering" : [
        "Architecture",
        "Civil Engineering",
        "Computer Engineering",
        "Industrial Engineering"
      ]
    },

    "Binus Alam Sutera" : {
      "School of Computer Science" : [
        "Artificial Intelligence",
        "Computer Science",
        "Computer Science (Global Class)",
        "Cyber Security"
      ],

      "School of Information Systems" : [
        "Information Systems"
      ],

      "School of Design" : [
        "Animation",
        "Fashion",
        "Film",
        "New Media"
      ],

      "BINUS Business School Undergraduate Programs" : [
        "Business Creation",
        "Global Business Marketing",
        "International Business Management",
        "International Business Management (Global Class)",
        "Management",
        "Master of Management"
      ],

      "School of Accounting" : [
        "Accounting",
        "Finance"
      ],

      "Faculy of Digital Communication and Hotel & Tourism" : [
        "Marketing Communication",
        "Mass Communication"
      ],

      "Faculty of Humanities" : [
        "Global Business Chinese"
      ],

      "Faculty of Engineering" : [
        "Biotechnology",
        "Food Technology"
      ]
    },

    "Binus ASO" : {
      "School of Engineering (Binus ASO)" : [
        "Automotive and Robotics Engineering",
        "Business Engineering",
        "Product Design Engineering"
      ]
    },

    "Binus Bekasi" : {
      "School of Computer Science" : [
        "Computer Science (Software Engineering)"
      ],
      "School of Information Systems" : [
        "Business Information Technology"
      ],
      "BINUS Business School Undergraduate Programs" : [
        "Business Management",
        "Digital Business Innovation (S1 + S1)",
        "Management"
      ],
      "School of Accounting" : [
        "Accounting"
      ],
      "Faculy of Digital Communication and Hotel & Tourism" : [
        "Business Hotel Management (D4)",
        "Creative Communication"
      ],
      "Faculty of Humanities" : [
        "Psychology"
      ]
    },

    "Binus Bandung" : {
      "School of Computer Science" : [
        "Computer Science"
      ],
      "School of Design" : [
        "Interior Design",
        "Visual Communication Design",
        "Interactive Design and Technology (S1 + S1)"
      ],
      "BINUS Business School Undergraduate Programs" : [
        "Business Creation",
        "Digital Business Innovation (S1 + S1)"
      ],
      "Faculty of Digital Communication and Hotel & Tourism" : [
        "Communication",
        "Public Relations"
      ],
      "Faculty of Humanities" : [
        "Digital Psychology (S1 + S1)"
      ]
    },

    "Binus Malang" : {
      "School of Computer Science" : [
        "Computer Science"
      ],
      "School of Design" : [
        "Interior Design",
        "Visual Communication Design",
        "Interactive Design and Technology (S1 + S1)"
      ],
      "BINUS Business School Undergraduate Programs" : [
        "Business Creation",
        "Digital Business Innovation (S1 + S1)"
      ],
      "Faculty of Digital Communication and Hotel & Tourism" : [
        "Communication",
        "Public Relations"
      ],
      "Faculty of Humanities" : [
        "Digital Psychology (S1 + S1)"
      ]
    },

    "Binus Semarang" : {
      "School of Computer Science" : [
        "Computer Science"
      ],
      "School of Information Systems" : [
        "Information Systems"
      ],
      "School of Design" : [
        "Visual Communication Design"
      ],
      "BINUS Business School Undergraduate Programs" : [
        "Digital Business"
      ],
      "Faculty of Humanities" : [
        "Digital Psychology (S1 + S1)"
      ],
      "Faculty of Engineering" : [
        "Smart Industrial Engineering"
      ]
    },

    "Binus Medan" : {
      "School of Computer Science" : [
        "Computer Science"
      ],
      "School of Information Systems" : [
        "Information Systems"
      ],
      "School of Design" : [
        "Visual Communication Design"
      ],
      "BINUS Business School Undergraduate Programs" : [
        "Digital Business",
        "International Trade"
      ]
    },

    "Binus Online" : {
      "School of Computer Science" : [
        "Computer Science",
        "Data Science",
        "Master of Computer Science"
      ],
      "School of Information Systems" : [
        "Business Analytics",
        "Information Systems",
        "Master of Information Systems Management"
      ],
      "School of Design" : [
        "Creative Media"
      ],
      "BINUS Business School Undergraduate Programs" : [
        "Business Management",
        "Digital Business Management",
        "Master in Business Management",
        "MM Business Management (Blended Learning)",
        "MM Strategy & Execution (Blended Learning)"
      ],
      "Faculy of Digital Communication and Hotel & Tourism" : [
        "Digital Business Communication"
      ],
      "Faculty of Humanities" : [
        "Business Psychology"
      ],
      "Faculty of Engineering" : [
        "Industrial Engineering",
        "Master of Industrial Engineering"
      ]
    }
  };

  const letter_type = [
    "Survey",
    "Non-Survey"
  ];

  const getFilteredMajors = (index) => {
    const region = selectedRegion[index];
    const faculty = selectedFaculty[index];

    if(!region || !faculty) return majors;

    return majorMapping[region]?.[faculty] || [];
  };
  
  const location = useLocation();

  useEffect(() => {
    window.addEventListener("mousemove", resize);
    window.addEventListener("mouseup", stopResizing);

    return () => {
      window.removeEventListener("mousemove", resize);
      window.removeEventListener("mouseup", stopResizing);
    };
  });

  const [students, setStudents] = useState([1]);
  const [showPopup, setShowPopup] = useState(false);
  const [showRemovePopup, setShowRemovePopup] = useState(false);
  const [studentCount, setStudentCount] = useState(1);

  const [removeCount, setRemoveCount] = useState(0);
  const [removeError, setRemoveError] = useState("");

  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  const [errors, setErrors] = useState({});

  const [letterTitle, setLetterTitle] = useState("");
  const [scriptTitle, setScriptTitle] = useState("");
  const [researchLocation, setResearchLocation] = useState("");

  const [studentData, setStudentData] = useState([
    {
      nim: "",
      name: "",
    }
  ]);

  const validateForm = () => {
    let newErrors = {};

    students.forEach((_, index) => {
      if(!studentData[index]?.nim) {
        newErrors[`nim-${index}`] = true;
      }

      if(!studentData[index]?.name) {
        newErrors[`name-${index}`] = true;
      }

      if(!selectedRegion[index]) {
        newErrors[`region-${index}`] = true;
      }

      if(!selectedFaculty[index]) {
        newErrors[`faculty-${index}`] = true;
      }

      if(!selectedMajor[index]) {
        newErrors[`major-${index}`] = true;
      }
    });

    if(!selectedLetterType) {
      newErrors.letterType = true;
    }

    if(!letterTitle.trim()) {
      newErrors.letterTitle = true;
    }

    if(!scriptTitle.trim()) {
      newErrors.scriptTitle = true;
    }

    if(!researchLocation.trim()) {
      newErrors.researchLocation = true;
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleStudentChange = (index, field, value) => {
    const updated = [...studentData];

    updated[index] = {
      ...updated[index],
      [field]: value
    };

    setStudentData(updated);

    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[`${field}-${index}`];
      return newErrors;
    });
  };

  const handleRemoveStudent = () => {
    const current = students.length;

    if(!removeCount) {
      setRemoveError("Please enter a number.");
      return;
    }

    if(removeCount >= current) {
      setRemoveError(
        "At least 1 student must remain. Please enter a smaller number."
      );
      return;
    }

    if(removeCount < 1) {
      setRemoveError("Invalid number. Please enter a positive number.");
      return;
    }

    const updatedStudents = students.slice(0, current - removeCount);
    setStudents(updatedStudents);
    setStudentData(prev =>
      prev.slice(0, current - removeCount)
    );
    setShowRemovePopup(false);
    setRemoveError("");
  }
  
  return (
    <div className="letter-request">

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

      {/* MAIN CONTENT */}
      <div
        className="content"
        style={{ marginLeft: sidebarWidth + 40}}
      >
        <div className="header">
          <h1>Letter Request</h1>
        </div>
        <hr className="divider" />
        
        {/* STUDENT FORM */}
        {students.map((num, index) => (
          <div key={num}>
            <h3 className="student-title">Student {num}</h3>

            <div className="card">
              <div className="form-group">
                <label>NIM</label>

                <input
                  className={errors[`nim-${index}`] ? "error-input" : ""}
                  placeholder="Enter NIM"
                  value={studentData[index]?.nim || ""}
                  onChange={(e) =>
                    handleStudentChange(index, "nim", e.target.value)
                  }
                />

                {
                  errors[`nim-${index}`] && (
                    <p className = "error-message">
                      (this field is required)
                    </p>
                  )
                }
              </div>

              <div className="form-group">
                <label>Name</label>

                <input
                  className={errors[`name-${index}`] ? "error-input" : ""}
                  placeholder="Enter Name"
                  value={studentData[index]?.name || ""}
                  onChange={(e) => 
                    handleStudentChange(index, "name", e.target.value)
                  }
                />

                {
                  errors[`name-${index}`] && (
                    <p className = "error-message">
                      (this field is required)
                    </p>
                  )
                }
              </div>

              <div className="form-group">
                <label>Region</label>
                
                <div className="custom-dropdown">
                  <div 
                    className={`dropdown-header 
                      ${openDropdown[`${index}-region`] ? "open" : ""}
                      ${errors[`region-${index}`] ? "error-input" : ""}
                    `}

                    onClick={
                      () => setOpenDropdown(prev =>
                        prev[`${index}-region`] ? {} : { [`${index}-region`] : true }
                      )
                    }
                  >
                    {selectedRegion[index] || "Select your Region"}
                  </div>

                  {
                    errors[`region-${index}`] && (
                      <p className = "error-message">
                        (this field is required)
                      </p>
                    )
                  }

                  {openDropdown[`${index}-region`] && (
                    <div className="dropdown-list">
                      {regions.map((item) => (
                        <div
                          key={item}
                          className="dropdown-item"
                          onClick={() => {
                            setSelectedRegion(prev => ({
                              ...prev,
                              [index]: item
                            }));
                            setErrors(prev => ({
                              ...prev,
                              [`region-${index}`]: false
                            }));

                            // tutup semua dropdown
                            setOpenDropdown({});
                          }}
                        >
                          {item}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="form-group">
                <label>Faculty</label>
                <div className="custom-dropdown">
                  <div 
                    className={`dropdown-header
                      ${openDropdown[`${index}-faculty`] ? "open" : ""}
                      ${errors[`faculty-${index}`] ? "error-input" : ""}
                    `}
                    
                    onClick={
                      () => setOpenDropdown(prev =>
                        prev[`${index}-faculty`] ? {} : { [`${index}-faculty`] : true }
                      )
                    }
                  >
                    {selectedFaculty[index] || "Select your Faculty"}
                  </div>

                  {
                    errors[`faculty-${index}`] && (
                      <p className = "error-message">
                        (this field is required)
                      </p>
                    )
                  }

                  {openDropdown[`${index}-faculty`] && (
                    <div className="dropdown-list">
                      {faculties.map((item) => (
                        <div
                          key={item}
                          className="dropdown-item"
                          onClick={() => {
                            setSelectedFaculty(prev => ({
                              ...prev,
                              [index]: item
                            }));
                            setErrors(prev => ({
                              ...prev,
                              [`faculty-${index}`]: false
                            }));
                            setSelectedMajor(prev => ({
                              ...prev,
                              [index]: ""
                            }));

                            // tutup semua dropdown
                            setOpenDropdown({});
                          }}
                        >
                          {item}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="form-group">
                <label>Major</label>
                <div className="custom-dropdown">
                  <div 
                    className={`dropdown-header
                      ${openDropdown[`${index}-major`] ? "open" : ""}
                      ${errors[`major-${index}`] ? "error-input" : ""}
                    `}

                    onClick={
                      () => setOpenDropdown(prev =>
                        prev[`${index}-major`] ? {} : { [`${index}-major`] : true }
                      )
                    }
                  >
                    {selectedMajor[index] || "Select your Major"}
                  </div>

                  {
                    errors[`major-${index}`] && (
                      <p className = "error-message">
                        (this field is required)
                      </p>
                    )
                  }

                  {openDropdown[`${index}-major`] && (
                    <div className="dropdown-list">
                      {getFilteredMajors(index).map((item) => (
                        <div
                          key={item}
                          className="dropdown-item"
                          onClick={() => {
                            setSelectedMajor(prev => ({
                              ...prev,
                              [index]: item
                            }));
                            setErrors(prev => ({
                              ...prev,
                              [`major-${index}`]: false
                            }));

                            // tutup semua dropdown
                            setOpenDropdown({});
                          }}
                        >
                          {item}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}

        <div className = "student-buttons">
          <button
            className = "add-student-btn"
            onClick = {() => setShowPopup(true)}
          >
            Add Another Student
          </button>

          <button
            className = "remove-student-btn"
            disabled = {students.length === 1}
            onClick = {() => setShowRemovePopup(true)}
          >
            Remove Student
          </button>
        </div>

        {/* LETTER REQUEST */}
        <div className="h2">
          <h2>Letter Request</h2>
        </div>

        <div className="letter-section">
          <label>Type of Requested Letter</label>

          <div className="custom-dropdown">
            <div 
              className={`dropdown-header
                ${openDropdown["letter_type"] ? "open" : ""}
                ${errors.letterType ? "error-input" : ""}
              `}
              onClick={
                () => setOpenDropdown(prev =>
                  prev["letter_type"] ? {} : { letter_type : true }
                )
              }
            >
              {selectedLetterType || "Select Letter Type"}
            </div>

            {errors.letterType && (
              <p className="error-message">
                (this field is required)
              </p>
            )}

            {openDropdown["letter_type"] && (
              <div className="dropdown-list">
                {letter_type.map((item) => (
                  <div
                    key={item}
                    className="dropdown-item"
                    onClick={() => {
                      setSelectedLetterType(item);
                      setErrors(prev => {
                        const newErrors = {...prev};
                        delete newErrors.letterType;
                        return newErrors;
                      });

                      setOpenDropdown({});
                    }}
                  >
                    {item}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="letter-section">
          <label>Request Letter Title</label>

          <input
            className={errors.letterTitle ? "error-input" : ""}
            placeholder="Request Letter Title"
            value={letterTitle}
            onChange={(e) => {
              setLetterTitle(e.target.value);

              setErrors(prev => {
                const newErrors = {...prev};
                delete newErrors.letterTitle;
                return newErrors;
              });
            }}
          />

          {errors.letterTitle && (
            <p className="error-message">
              (this field is required)
            </p>
          )}
        </div>

        <div className="letter-section">
          <label>Script Essay Title</label>

          <input
            className={errors.scriptTitle ? "error-input" : ""}
            placeholder="Script Essay Title"
            value={scriptTitle}
            onChange={(e) => {
              setScriptTitle(e.target.value);

              setErrors(prev => {
                const newErrors = {...prev};
                delete newErrors.scriptTitle;
                return newErrors;
              });
            }}
          />

          {errors.scriptTitle && (
            <p className="error-message">
              (this field is required)
            </p>
          )}
        </div>

        <div className="letter-section">
          <label>Research Location</label>

          <input
            className={errors.researchLocation ? "error-input" : ""}
            placeholder="Research Location"
            value={researchLocation}
            onChange={(e) => {
              setResearchLocation(e.target.value);

              setErrors(prev => {
                const newErrors = {...prev};
                delete newErrors.researchLocation;
                return newErrors;
              });
            }}
          />
        </div>

        {errors.researchLocation && (
          <p className="error-message">
            (this field is required)
          </p>
        )}

        <div className="save-wrapper">
          <button
            className="save-btn"
            onClick={async () => {
              if(validateForm()) {
                const requestData = {
                  requestDate: new Date().toLocaleDateString(),
                  requestStatus: "Pending",
                  students: studentData,
                  regions: selectedRegion,
                  faculties: selectedFaculty,
                  majors: selectedMajor,
                  letterType: selectedLetterType,
                  letterTitle,
                  scriptTitle,
                  researchLocation
                }

                await axios.post(
                  "http://localhost:8000/letters/create",
                  requestData
                );

                setShowSuccessPopup(true);
              }
            }}
          >
            Save
          </button>
        </div>

      </div>

      {/* POPUP ADD STUDENT */}
      {
        showPopup && (
          <div className = "popup-overlay">
            <div className = "popup-box">

              {/* HEADER */}
              <div className="popup-header">
                <div className="popup-title">
                  <h2>User Requests</h2>
                </div>
              </div>

              <hr className="divider popup" />

              <label>Number of Students</label>

              <input
                type = "number"
                min = "1"
                value={studentCount}
                onChange={(e) =>
                  setStudentCount(Number(e.target.value))
                }
              />

              <div className = "popup-buttons">
                <button
                  className = "cancel-btn"
                  onClick = {() => setShowPopup(false)}
                >
                  Cancel
                </button>

                <button
                  className = "confirm-btn"
                  onClick = {() => {
                    const current = students.length;

                    const arr = [];

                    for(let i = 1; i <= current + studentCount; i++) {
                      arr.push(i);
                    }

                    setStudents(arr);

                    setStudentData(prev => [
                      ...prev,
                      ...Array(studentCount).fill({
                        nim: "",
                        name: ""
                      })
                    ]);

                    setShowPopup(false);
                  }}
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )
      }

      {/* POPUP REMOVE STUDENT */}
      {
        showRemovePopup && (
          <div className = "popup-overlay">
            <div className = "popup-box">

              {/* HEADER */}
              <div className="popup-header">
                <div className="popup-title">
                  <h2>Remove Students</h2>
                </div>
              </div>
              
              <hr className="divider popup" />

              <label>Current Students</label>

              <input
                type = "number"
                value = {students.length}
                readOnly
              />

              <label>Students to be removed</label>

              <input
                type = "number"
                value = {removeCount}
                onChange = {(e) =>
                  setRemoveCount(Number(e.target.value))
                }
              />

              {
                removeError && (
                  <p className = "error-message">
                    {removeError}
                  </p>
                )
              }

              <div className = "popup-buttons">
                <button
                  className = "cancel-btn"
                  onClick = {() => {
                    setShowRemovePopup(false);
                    setRemoveError("");
                    setRemoveCount(0);
                  }}
                >
                  Cancel
                </button>

                <button
                  className = "confirm-btn"
                  onClick = {handleRemoveStudent}
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )
      }

      {/* POPUP SUCCESS */}
      {
        showSuccessPopup && (
          <div className = "success-overlay">
            <div className = "success-popup">
              <h2>Success!</h2>

              <hr className = "divider success" />

              <p>Your data has been saved successfully!</p>

              <div className = "success-icon">
                <span className = "checkmark">✓</span>
              </div>

              <button
                className = "success-btn"
                onClick = {() => {
                  setShowSuccessPopup(false);

                  setStudentData([
                    {
                      nim: "",
                      name: ""
                    }
                  ]);

                  setStudents([1]);

                  setSelectedRegion({});
                  setSelectedFaculty({});
                  setSelectedMajor({});

                  setSelectedLetterType("");

                  setLetterTitle("");
                  setScriptTitle("");
                  setResearchLocation("");

                  setErrors({});
                }}
              >
                OK
              </button>
            </div>
          </div>
        )
      }

    </div>
  );
}

export default LetterRequest;