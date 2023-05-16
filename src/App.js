import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { memo } from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './assets/css/Site.css';
import 'react-toastify/dist/ReactToastify.css';
import Home from './pages/Home';
import Login from './pages/Login';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { setUserData } from './store/UserData';
import Orders from './pages/Orders';

function App() {
  const dispatch = useDispatch();
  // axios.defaults.baseURL = "https://uol-v-2.hostprohub.com/api/";
  axios.defaults.baseURL = "http://192.168.100.17:8000/api/";
  axios.defaults.headers.common["Accept"] = 'application/json';
  axios.defaults.headers.common["retry-after"] = 3600;
  var token = null;
  const { UserData } = useSelector((state) => state.UserData);
  if (localStorage.getItem("posUser") || UserData) {
    var obj = JSON.parse(localStorage.getItem("posUser"));
    if (UserData) {
      obj = UserData;
    }
    else{
      dispatch(setUserData(obj));
    }
    // console.log(obj);
    token = obj.token;
    axios.defaults.headers.common["Authorization"] = 'Bearer ' + token;
  }
  return (
    <Router>
      <Routes>

        <Route exact path="/" element={<Home />} />
        {/* <Route path="*" element={<NotFoundPage/>} /> */}
        <Route exact path="/login" element={<Login />} />
        <Route exact path="/orders" element={<Orders />} />

      </Routes>
    </Router>
  );
}

export default memo(App);
