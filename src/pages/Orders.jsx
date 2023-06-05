import React, { useRef } from "react";
import { useEffect } from "react";
import { useState } from "react";
import Layout from "../layouts/Layout";
import axios from "axios";
import { Col, Row } from "react-bootstrap";
import search_icon from '../assets/images/icons/Search.svg';
import '../assets/css/order.css'
import LoadingBar from "react-top-loading-bar";
import { useDispatch } from "react-redux";
import { setUserData } from "../store/UserData";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const Orders = () => {

  useEffect(() => {
    document.title = "Ultimate Organic Life | Orders";
    window.scrollTo(0, 0);

  }, []);
  const navigate = useNavigate();
  const ref = useRef(null);
  const [orders, setOrders] = useState();
  const [search, setSearch] = useState();
  const [orderDetails, setOrderDetails] = useState();
  const dispatch = useDispatch();

  useEffect(() => {
    ref.current.continuousStart();
    // console.log(query);
    var url = "pos/order-list";
    if (search) {
      url = "pos/order-list?search=" + search;
    }
    else {
      url = "pos/order-list";
    }
    // if(isLoggedIn){
    axios.get(url)
      .then(resp => {
        setOrders(null);
        console.log(resp.data);
        ref.current.complete();
        if (resp.data.success == true) {
          setOrders(resp.data.data);
        }
        else if (resp.data.success == false) {
          Swal.fire({
            position: 'center',
            icon: 'warning',
            title: resp.data.message,
            showConfirmButton: true,
            // timer: 1000
          })
          if(resp.data.message=="Unauthorized"){
            localStorage.removeItem("posUser");
            dispatch(setUserData(null))
            navigate({ pathname: '/login', search: '?q=You Need To Login First', replace: true });
          }
        }
      })
      .catch((err) => {
        console.log(err);
        // localStorage.removeItem("posUser");
        // dispatch(setUserData(null))
        // navigate({ pathname: '/login', search: '?q=You Need To Login First', replace: true });
      });
    // }
  }, [search]);
  // console.log(orders);
  return (
    <div>
      <LoadingBar
        color='#0098b8'
        ref={ref}
      />
      <Layout>
        <Row>
          <Col md={8} className="ps-0">
            <div className="products_tab">
              <Row className="justify-content-center mt-3">
                <Col md={8}>
                  <div className="input-group ms-2 mt-2">
                    <input type="search" className="form-control search_input" placeholder="Enter Order Number To Search.." aria-label="Recipient's username" aria-describedby="basic-addon2"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)} />
                    <span className="input-group-text search_input_icon" id="basic-addon2"><img src={search_icon} alt="search icon" /></span>
                  </div>
                </Col>
                <Col md={4}>
                  <p className="text-end pe-3">{orders ? orders.length : '0'} Orders</p>
                </Col>
              </Row>
              <Row>
                {orders ? (
                  orders.map((order, index) => {
                    return (
                      <div key={index} className={orderDetails && orderDetails.id===order.id ? 'col-11 order_card active' : 'col-11 order_card' } onClick={() => {
                        setOrderDetails(order);
                      }}>
                        <h4 className="mt-1 mb-0" style={{color:'#15afcd'}}>Order #{order.order_number}</h4>
                        <div style={{ float: 'right' }}>
                          <h4 className="mb-0">{order.total_amount}৳&nbsp;</h4>
                          <p>{order.order_details.length} Item(s)&nbsp;</p>
                        </div>
                        <p className="mb-0"><svg viewBox="64 64 896 896" focusable="false" data-icon="user" width="1em" height="1em" fill="currentColor" aria-hidden="true"><path d="M858.5 763.6a374 374 0 00-80.6-119.5 375.63 375.63 0 00-119.5-80.6c-.4-.2-.8-.3-1.2-.5C719.5 518 760 444.7 760 362c0-137-111-248-248-248S264 225 264 362c0 82.7 40.5 156 102.8 201.1-.4.2-.8.3-1.2.5-44.8 18.9-85 46-119.5 80.6a375.63 375.63 0 00-80.6 119.5A371.7 371.7 0 00136 901.8a8 8 0 008 8.2h60c4.4 0 7.9-3.5 8-7.8 2-77.2 33-149.5 87.8-204.3 56.7-56.7 132-87.9 212.2-87.9s155.5 31.2 212.2 87.9C779 752.7 810 825 812 902.2c.1 4.4 3.6 7.8 8 7.8h60a8 8 0 008-8.2c-1-47.8-10.9-94.3-29.5-138.2zM512 534c-45.9 0-89.1-17.9-121.6-50.4S340 407.9 340 362c0-45.9 17.9-89.1 50.4-121.6S466.1 190 512 190s89.1 17.9 121.6 50.4S684 316.1 684 362c0 45.9-17.9 89.1-50.4 121.6S557.9 534 512 534z"></path>
                        </svg><b>{order.customer_name}</b></p>
                        <p className="mb-0"><svg viewBox="64 64 896 896" focusable="false" data-icon="field-time" width="1em" height="1em" fill="currentColor" aria-hidden="true"><defs><style></style></defs><path d="M945 412H689c-4.4 0-8 3.6-8 8v48c0 4.4 3.6 8 8 8h256c4.4 0 8-3.6 8-8v-48c0-4.4-3.6-8-8-8zM811 548H689c-4.4 0-8 3.6-8 8v48c0 4.4 3.6 8 8 8h122c4.4 0 8-3.6 8-8v-48c0-4.4-3.6-8-8-8zM477.3 322.5H434c-6.2 0-11.2 5-11.2 11.2v248c0 3.6 1.7 6.9 4.6 9l148.9 108.6c5 3.6 12 2.6 15.6-2.4l25.7-35.1v-.1c3.6-5 2.5-12-2.5-15.6l-126.7-91.6V333.7c.1-6.2-5-11.2-11.1-11.2z"></path><path d="M804.8 673.9H747c-5.6 0-10.9 2.9-13.9 7.7a321 321 0 01-44.5 55.7 317.17 317.17 0 01-101.3 68.3c-39.3 16.6-81 25-124 25-43.1 0-84.8-8.4-124-25-37.9-16-72-39-101.3-68.3s-52.3-63.4-68.3-101.3c-16.6-39.2-25-80.9-25-124 0-43.1 8.4-84.7 25-124 16-37.9 39-72 68.3-101.3 29.3-29.3 63.4-52.3 101.3-68.3 39.2-16.6 81-25 124-25 43.1 0 84.8 8.4 124 25 37.9 16 72 39 101.3 68.3a321 321 0 0144.5 55.7c3 4.8 8.3 7.7 13.9 7.7h57.8c6.9 0 11.3-7.2 8.2-13.3-65.2-129.7-197.4-214-345-215.7-216.1-2.7-395.6 174.2-396 390.1C71.6 727.5 246.9 903 463.2 903c149.5 0 283.9-84.6 349.8-215.8a9.18 9.18 0 00-8.2-13.3z"></path>
                        </svg>&nbsp;{order.date}</p>
                      </div>
                    );
                  })
                ) : (
                  <div className="col-11 ps-4 mt-4">
                    {!orders && (
                      <h3 className="text-warning text-center">
                        No Order To Show!
                      </h3>
                    )}
                  </div>
                )}

              </Row>
            </div>
          </Col>
          <Col md={4} className="ps-0">
            <div className="cart_section">
              {orderDetails && (
                <>
                  <div className="customer_section row">
                    <div className="col-8">
                      <div className="order_number">
                      Order #{orderDetails.order_number}
                      </div>
                    </div>
                    <div className="col-4">
                      <svg viewBox="64 64 896 896" focusable="false" data-icon="user" width="1em" height="1em" fill="currentColor" aria-hidden="true"><path d="M858.5 763.6a374 374 0 00-80.6-119.5 375.63 375.63 0 00-119.5-80.6c-.4-.2-.8-.3-1.2-.5C719.5 518 760 444.7 760 362c0-137-111-248-248-248S264 225 264 362c0 82.7 40.5 156 102.8 201.1-.4.2-.8.3-1.2.5-44.8 18.9-85 46-119.5 80.6a375.63 375.63 0 00-80.6 119.5A371.7 371.7 0 00136 901.8a8 8 0 008 8.2h60c4.4 0 7.9-3.5 8-7.8 2-77.2 33-149.5 87.8-204.3 56.7-56.7 132-87.9 212.2-87.9s155.5 31.2 212.2 87.9C779 752.7 810 825 812 902.2c.1 4.4 3.6 7.8 8 7.8h60a8 8 0 008-8.2c-1-47.8-10.9-94.3-29.5-138.2zM512 534c-45.9 0-89.1-17.9-121.6-50.4S340 407.9 340 362c0-45.9 17.9-89.1 50.4-121.6S466.1 190 512 190s89.1 17.9 121.6 50.4S684 316.1 684 362c0 45.9-17.9 89.1-50.4 121.6S557.9 534 512 534z"></path>
                      </svg><b>{orderDetails.customer_name}</b>
                    </div>
                  </div>
                  <div className="cart_items">
                    {orderDetails.order_details.map((item, key) => {
                      return (
                        <div key={key} className="cart_item_card me-2 mt-1" style={{ cursor: 'pointer' }}>
                          <div className="row me-2">
                            <div className="col-1 center_col">
                            </div>
                            <div className="col-3 center_col" data-title="Product">
                              <img className="img-fluid cart_product_image" src={item.product_image} width='100' height='100' alt="alt" />
                            </div>
                            <div className="col-5 center_col" data-title="Name">
                              <h5 className="m-0" title={item.product_name}>
                                {item.product_name}
                                <h6 className="text-body"> ৳{item.product_price} x {item.product_quantity} </h6>{" "}
                              </h5>
                              {/* <p className="mb-0"> <small>(Weight: 4KG)</small></p> */}
                            </div>
                            <div data-title="Price" className="col-3 ps-0 center_col">

                              <h5 className="text-body text-center"> ৳{(item.line_total)} </h5>{" "}
                              {/* <small>
                                <del>$90.00</del>
                              </small> */}
                            </div>
                          </div>
                        </div>
                      );
                    })}

                  </div>
                  <div className="cart_totals" style={{width: '30.2%'}}>
                <hr style={{ marginTop: '0', marginLeft: '-14px' }} />
                <Row>
                  <Col md={8}>
                    <h4>Status:</h4>
                  </Col>
                  <Col md={4}>
                    <h4 className="text-end pe-3">
                    {orderDetails.status==='confirm' ? 
                    (<span className="text-success">Confirm</span>) : 
                    (orderDetails.status!=='pending' && orderDetails.status!=='cancel' ?
                    <span className="text-info">{orderDetails.status}</span> : 
                    (orderDetails.status==='cancel' ? <span className="text-danger">Cancel</span> : orderDetails.status==='pending' && <span className="text-warning">Pending</span> ))}
                    </h4>
                  </Col>
                  <Col md={8}>
                    <h4>Subtotal:</h4>
                  </Col>
                  <Col md={4}>
                    <h4 className="text-end pe-3">{orderDetails.total_amount}৳</h4>
                  </Col>
                  </Row>
                  </div>
                </>

              )}

            </div>
          </Col>
        </Row>
      </Layout>
    </div>
  );
};

export default Orders;
