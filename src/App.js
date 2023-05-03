import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { memo } from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './assets/css/Site.css';
import 'react-toastify/dist/ReactToastify.css';
import Home from './pages/Home';

function App() {
  return (
    <Router>
      <Routes>

        <Route exact path="/" element={<Home />} />
        {/* <Route path="*" element={<NotFoundPage/>} /> */}

      </Routes>
    </Router>
  );
}

export default memo(App);
