import React, { useRef } from "react";
import { useEffect } from "react";
import { useState } from "react";
import Layout from "../layouts/Layout";
import PosIcon from "../assets/images/pos_icon.png"
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
    var obj = { user_input: username, password: password };
    ref.current.continuousStart();
    // pos/login 
    axios
      .post("customer/login", obj)
      .then(function (resp) {
        var data = resp.data;
        if (data.success === false) {
          ref.current.complete();
          setError(resp.data.message);
          Swal.fire({
            position: 'center',
            icon: 'error',
            title: resp.data.message,
            showConfirmButton: false,
            timer: 2000
          })
        }
        // console.log(localStorage.getItem("user"));
        if (data.status) {
          var user = { token: data.token, customer_id: data.data.id, customer_name: data.data.customer_name, user: data.data };
          dispatch(setUserData(user));
          localStorage.setItem("user", JSON.stringify(user));
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Successfully logged in',
            showConfirmButton: false,
            timer: 1500
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

    return (
      <div>
        <LoadingBar
        color='#0098b8' 
        ref={ref}
        />
        <Layout>
          <div className="wrapper">
            <div className="logo">
              <img src={PosIcon} alt="" />
            </div>
            <div className="text-center mt-4 name">
              POS
            </div>
            <form className="p-3 mt-3" onSubmit={(e) => { loginSubmit(e); }}>
              <div className="form-field d-flex align-items-center">
                <span className="far fa-user"></span>
                <input type="text" name="userName" id="userName" placeholder="Email"
                  value={username}
                  onChange={(e) => setUserName(e.target.value)} />
              </div>
                  {errorList && (<><span className='text-danger'>{errorList.user_input[0]}</span><br/><br/></>)}
              <div className="form-field d-flex align-items-center">
                <span className="fas fa-key"></span>
                <input type="password" name="password" id="pwd" placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete={'false'} />
              </div>
              {errorList && (<><span className='text-danger'>{errorList.password[0]}</span><br/></>)}
              <button className="btn mt-3">Login</button>
            </form>
            {/* <div className="text-center fs-6">
            <a href="#">Forget password?</a> or <a href="#">Sign up</a>
        </div> */}
          </div>
        </Layout>
      </div>
    );
  };

  export default Login;
