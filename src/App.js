import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Register from './pages/register';
import Login from './pages/login';

import LetterRequest from './pages/letter_request';
import ViewStatus from './pages/view_status';

import Dashboard from './pages/dashboard';
import CreateLetter from './pages/create_letter';
import ManageHead from './pages/manage_head';
import ManageTemplate from './pages/manage_template';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/letter-request" element={<LetterRequest />} />
        <Route path="/view-status" element={<ViewStatus />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/create-letter" element={<CreateLetter />} />
        <Route path="/manage-head" element={<ManageHead />} />
        <Route path="/manage-template" element={<ManageTemplate />} />

      </Routes>
    </Router>
  );
}

export default App;