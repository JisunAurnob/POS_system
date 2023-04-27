import React, { useEffect, useState } from "react";
import Layout from "../layouts/Layout";
import { Col, Row } from "react-bootstrap";
import '../assets/css/Home.css'
// import { Link } from "react-router-dom";
import all_cate from '../assets/images/home/all_cate.png';
import search_icon from '../assets/images/icons/Search.svg';
import bar_icon from '../assets/images/icons/bar.png';
import plus_icon from '../assets/images/icons/plus.png';
// import ghee_image from '../assets/images/ghee.jpg';
import cart_image from '../assets/images/icons/icon-cart.svg';
import tag_icon from '../assets/images/icons/tag_icon.png';
import discount_icon from '../assets/images/icons/discount_icon.png';
import axios from "axios";

const Home = () => {

  const [categories, setCategories] = useState();
  const [products, setProducts] = useState();
  useEffect(() => {
    axios.get("get-categories")
      .then(resp => {
        setCategories(resp.data.categories[0]);
      });
    axios.get("get-products?limit=50")
      .then(resp => {
        setProducts(resp.data.data.data);
      });
    console.log('render check');
  }, []);
  return (
    <div>
      <Layout>
        <Row>
          <Col md={8} className="ps-0">
            <div className="products_tab">
              <h2 className="p-2">Categories</h2>
              <div className="category_div">
                <button className="category_card active">
                  <span role="img" aria-label="database" className="catIcon">
                    <img className="catIcon" src={all_cate} alt='All'
                      width="40" height="40" />
                  </span>
                  <p className="m-0">All</p>
                </button>
                {categories &&
                  (
                    categories.categories.map((category, index) => {
                      return (
                        <button key={index} className="category_card">
                          <span role="img" aria-label="database" className="catIcon">
                            <img className="catIcon" src={axios.defaults.baseURL.slice(0, -4) + "frontend/images/category_images/" + category.category_image} alt={category.category_name}
                              width="40" height="40" />
                          </span>
                          <p className="m-0" title={category.category_name}>{category.category_name}</p>
                        </button>
                      );
                    })
                  )
                }
              </div>
              <h2 className="p-2">Products</h2>
              <Row className="justify-content-center">
                <Col md={7}>
                  <div className="input-group ms-2">
                    <input type="search" className="form-control search_input" placeholder="Search Product.." aria-label="Recipient's username" aria-describedby="basic-addon2" />
                    <span className="input-group-text search_input_icon" id="basic-addon2"><img src={search_icon} alt="search icon" /></span>
                  </div>
                </Col>
                <Col xs={3} md={1}>
                  <button className="btn basic_btn"><img src={bar_icon} height={30} alt="bar icon" /></button>
                </Col>
                <Col xs={3} md={1} className="ps-0">

                  <button className="btn basic_btn"><img src={plus_icon} height={30} alt="bar icon" /></button>
                </Col>
                <Col xs={6} md={3}>
                  <p className="text-end pe-3">{products ? products.length : '0'} Products</p>
                </Col>
              </Row>
              <Row className="product_list">
                {/* <Col md={6} lg={3}>
                  <div className="pos_product_card">
                    <Row>
                      <Col xs={6} className="pe-0">
                        <img className="img-fluid" src={ghee_image} alt="Product name" />
                      </Col>
                      <Col xs={6} className="pos_product_details">
                        <h2 className="mb-0" title="Grass-fed Ghee 500 ML">Grass-fed Ghee 500 ML</h2>
                        <p className="mb-0">৳800</p>
                        <span className="in_stock">In Stock</span>
                      </Col>
                    </Row>
                  </div>
                </Col> */}
                {products &&
                  products.map((product, index) => {
                    return (
                      <Col key={index} md={6} lg={3}>
                        <div className="pos_product_card">
                          <Row>
                            <Col xs={6} className="pe-0">
                              {product.image && (

                                <img className="img-fluid" src={product.image.small} alt={product.name} />
                              )}
                            </Col>
                            <Col xs={6} className="pos_product_details">
                              <h2 className="mb-0" title={product.name}>{product.name}</h2>
                              <p className="mb-0">{product.formatted_final_product_price}</p>
                              {product.stock > 0 ? 
                              <span className="in_stock">In Stock</span> : 
                              <span className="out_stock">Out Of Stock</span>}
                            </Col>
                          </Row>
                        </div>
                      </Col>
                    );
                  })}
              </Row>
            </div>
          </Col>
          <Col md={4} className="">
            <div className="cart_section">
              <h2 className="p-2"><img src={cart_image} alt="cart icon" className="img-fluid" width={28} /> Cart Items</h2>
              <div className="cart_items">

              </div>
              <div className="cart_totals">
                <hr style={{ marginLeft: '-6%' }} />
                <Row>
                  <Col md={8}>
                    <h6>Subtotal:</h6>
                  </Col>
                  <Col md={4}>
                    <p className="text-end pe-3">0.00৳</p>
                  </Col>
                  <Col md={8}>
                    <h6>Tax:</h6>
                  </Col>
                  <Col md={4}>
                    <p className="text-end pe-3">0.00৳</p>
                  </Col>
                  <Col md={8}>
                    <h6>Discount:</h6>
                  </Col>
                  <Col md={4}>
                    <p className="text-end pe-3">0.00৳</p>
                  </Col>
                  <Col md={8}>
                    <h6>Applied Coupon(s):</h6>
                  </Col>
                  <Col md={4}>
                    <p className="text-end pe-3">0.00৳</p>
                  </Col>
                  <Col md={6}>
                    <button className="btn discount_card">
                      <img src={tag_icon} alt="coupon" /><br />
                      Coupon
                    </button>
                  </Col>
                  <Col md={6}>
                    <button className="btn discount_card">
                      <img src={discount_icon} alt="coupon" /><br />
                      Discount
                    </button>
                  </Col>
                  {/* <Col md={4}>
                <button className="btn discount_card">
                <img src={tag_icon} alt="coupon" />
                  Hold
                </button>
                </Col> */}
                </Row><br />
                <button className="btn cart_order_btn">
                  <p className="text-start ps-4 pt-2">Proceed to Pay
                    <br />
                    <i>5 Items</i>
                  </p>
                  <p>1,432.17৳&nbsp;
                    <span role="img" aria-label="double-right" className="anticon anticon-double-right">
                      <svg viewBox="64 64 896 896" focusable="false" data-icon="double-right" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                        <path d="M533.2 492.3L277.9 166.1c-3-3.9-7.7-6.1-12.6-6.1H188c-6.7 0-10.4 7.7-6.3 12.9L447.1 512 181.7 851.1A7.98 7.98 0 00188 864h77.3c4.9 0 9.6-2.3 12.6-6.1l255.3-326.1c9.1-11.7 9.1-27.9 0-39.5zm304 0L581.9 166.1c-3-3.9-7.7-6.1-12.6-6.1H492c-6.7 0-10.4 7.7-6.3 12.9L751.1 512 485.7 851.1A7.98 7.98 0 00492 864h77.3c4.9 0 9.6-2.3 12.6-6.1l255.3-326.1c9.1-11.7 9.1-27.9 0-39.5z"></path></svg>
                    </span></p>
                </button>
              </div>
            </div>
          </Col>
        </Row>
      </Layout>
    </div>
  );
};

export default Home;
