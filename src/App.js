import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './assets/css/Site.css';
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

export default App;
