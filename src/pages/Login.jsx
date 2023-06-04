import React, { useRef } from "react";
import { useEffect } from "react";
import { useState } from "react";
import Layout from "../layouts/Layout";
import PosIcon from "../assets/images/point-of-sale.png"
import '../assets/css/login.css';
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setUserData } from "../store/UserData";
import LoadingBar from "react-top-loading-bar";

const Login = () => {

  useEffect(() => {
    document.title = "POS | Login";
    window.scrollTo(0, 0);
    ref.current.continuousStart();
    setTimeout(() => {
      ref.current.complete();
    }, 100);

  }, []);
  const ref = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const search = useLocation().search;
  const queryParam = new URLSearchParams(search);
  let [username, setUserName] = useState("");
  let [password, setPassword] = useState("");
  const [errorList, setError] = useState("");
  useEffect(() => {
    // console.log("Full render")
    if (queryParam.get('q') != null) {
      Swal.fire({
        position: 'center',
        icon: 'warning',
        title: queryParam.get('q'),
        // showConfirmButton: false,
        // timer: 2000
      })
    }
  }, []);

  const loginSubmit = (e) => {
    var obj = { admin_input: username, password: password };
    ref.current.continuousStart();
    // pos/login 
    axios
      .post("pos/login", obj)
      .then(function (resp) {
        var data = resp.data;
        // console.log(data);
        if (data.success === false) {
          ref.current.complete();
          setError(resp.data.message);
          // if(errorList.admin_input[0]===undefined){
          //   Swal.fire({
          //     position: 'center',
          //     icon: 'error',
          //     title: resp.data.message,
          //     showConfirmButton: false,
          //     timer: 2000
          //   })
          // }
          localStorage.removeItem("posUser");
            dispatch(setUserData(null));
        }
        // console.log(localStorage.getItem("user"));
        if (data.success) {
          localStorage.setItem("posUser", JSON.stringify(data.data));
            dispatch(setUserData(data.data));
           Swal.fire({
              position: 'center',
              icon: 'success',
              title: data.message,
              showConfirmButton: false,
              timer: 1000
            });
          navigate("/",{ replace: true });
          // window.location.reload(false);
        }
      })
      .catch((err) => {
        console.log(err);
      });
    e.preventDefault();
  };
// console.log(errorList);
    return (
      <div>
        <LoadingBar
        color='#0098b8' 
        ref={ref}
        />
          <div className="wrapper">
            <div className="logo">
              <img src={PosIcon} alt="" className="" />
            </div>
            <div className="text-center mt-4 name">
              Point of Sale
            </div>
            <form className="p-3 mt-3" onSubmit={(e) => { loginSubmit(e); }} autoComplete="none">
              <span className="text-danger mb-2">{errorList && errorList.admin_input===undefined && errorList }</span>
              <div className="form-field d-flex align-items-center">
                <span className="far fa-user"></span>
                <input type="text" name="userName" id="userName" placeholder="Email"
                  value={username}
                  onChange={(e) => setUserName(e.target.value)} autoComplete="none" />
              </div>
                  {errorList && errorList.admin_input!==undefined && (<><span className='text-danger'>{errorList.admin_input[0]}</span><br/><br/></>)}
              <div className="form-field d-flex align-items-center">
                <span className="fas fa-key"></span>
                <input type="password" name="password" id="pwd" placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="none" required />
              </div>
              {errorList && errorList.password!==undefined && (<><span className='text-danger'>{errorList.password[0]}</span><br/></>)}
              <button className="btn mt-3">Login</button>
            </form>
            {/* <div className="text-center fs-6">
            <a href="#">Forget password?</a> or <a href="#">Sign up</a>
        </div> */}
          </div>
      </div>
    );
  };

  export default React.memo(Login);
