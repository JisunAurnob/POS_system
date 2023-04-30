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
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import { useCart } from "react-use-cart";
import { Link } from "react-router-dom";
import axios from "axios";

const Home = () => {
  const successNotify = () => toast.success('Product added to cart', {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "colored",
    // progressClassName: "fancy-progress-bar",
  });
  const errorNotify = () => toast.error('Product is out of stock', {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "colored",
    // progressClassName: "fancy-progress-bar",
  });
  const infoNotify = () => toast.info('Product is out of stock', {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "colored",
    // progressClassName: "fancy-progress-bar",
  });
  const { addItem, totalUniqueItems, items, updateItemQuantity, removeItem } = useCart();
  const [searchProduct, setSearchProduct] = useState();
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
  // console.log(searchProduct);
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
                    <input type="search" className="form-control search_input" placeholder="Search Product.." aria-label="Recipient's username" aria-describedby="basic-addon2"
                      value={searchProduct}
                      onChange={(e) => setSearchProduct(e.target.value)} />
                    <span className="input-group-text search_input_icon" id="basic-addon2"><img src={search_icon} alt="search icon" /></span>
                  </div>
                </Col>
                <Col xs={3} md={1}>
                  <button className="btn basic_btn" onClick={() => {
                    Swal.fire({
                      title: 'Enter/Scan Bar Code',
                      input: 'text',
                      inputPlaceholder: 'Enter/Scan Bar Code',
                      confirmButtonColor: '#09b3d4',
                    }).then((result) => {
                      if (result.isConfirmed) {
                        setSearchProduct(result.value);
                      }
                    })
                  }}><img src={bar_icon} height={30} alt="bar icon" /></button>
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
                        <div className="pos_product_card" onClick={() => {
                          // errorNotify();
                          if (product.stock > 0) {
                            addItem({
                              id: product.id,
                              product_id: product.id,
                              name: product.name,
                              price: product.final_product_price,
                              quantity: 1,
                              image: product.image.small,
                              stock: product.stock
                            });
                            successNotify();
                          } else {
                            errorNotify();
                          }

                        }}>
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
                {items.map((item, key) => {
                  return (
                    <div key={key} className="row cart_item_card me-2">
                      <div className="col-1">
                        <i style={{ color: '#09b3d4' }}>
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-down" viewBox="0 0 16 16">
                            <path fill-rule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z" />
                          </svg></i>
                        {/* <i style={{ color: '#09b3d4' }}>
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-up" viewBox="0 0 16 16">
                            <path fill-rule="evenodd" d="M7.646 4.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1-.708.708L8 5.707l-5.646 5.647a.5.5 0 0 1-.708-.708l6-6z" />
                          </svg></i> */}
                      </div>
                      <div className="col-3" data-title="Product">
                        <img className="img-fluid" src={item.image} width='100' alt="Foster Farms Takeout Crispy classNameic" />
                      </div>
                      <div className="col-5" style={{ paddingLeft: '1rem' }} data-title="Name">
                        <h6 className="mb-5">
                          {item.name}
                          <h5 className="text-body"> ৳{item.price} x {item.quantity} </h5>{" "}
                        </h6>
                        {/* <p className="mb-0"> <small>(Weight: 4KG)</small></p> */}
                      </div>
                      <div data-title="Price" className="col-2">

                        <h5 className="text-body text-center"> ৳{(item.price * item.quantity)} </h5>{" "}
                        {/* <small>
                                <del>$90.00</del>
                              </small> */}
                      </div>

                      {/* <td data-title="Quantity" className="" style={{ whiteSpace: 'nowrap' }}>
                          <div
                            className="quantity_button_group">
                            <button
                              className="quantity_button"
                              disabled={item.quantity <= 1}
                              onClick={() => updateItemQuantity(item.id, item.quantity - 1)}>
                              <svg xmlns="http://www.w3.org/2000/svg" width="12px" height="2px" viewBox="0 0 12 1.5">
                                <rect data-name="Rectangle 970" width="12px" height="2px" fill="currentColor"></rect>
                              </svg>
                            </button>
                            <input type='number' className="qty-input quantity_value" value={item.quantity} onChange={(e) => updateItemQuantity(item.id, e.target.value)} readOnly/>
                            <button
                              className="quantity_button" onClick={() => updateItemQuantity(item.id, item.quantity + 1)} 
                              disabled={item.variation ? item.variation.stock <= item.quantity : item.stock <= item.quantity} >
                              <svg data-name="plus (2)" xmlns="http://www.w3.org/2000/svg" width="12px" height="12px"
                                viewBox="0 0 12 12">
                                <g data-name="Group 5367">
                                  <path data-name="Path 17138"
                                    d="M6.749,5.251V0h-1.5V5.251H0v1.5H5.251V12h1.5V6.749H12v-1.5Z"
                                    fill="currentColor"></path>
                                </g>
                              </svg>
                            </button>
                          </div>
                          {" "}
                        </td> */}

                      <div data-title="Remove" className="col-1">

                        <button data-title="Remove" className="btn basic_btn" onClick={() => {
                          infoNotify();
                          removeItem(item.id);
                        }
                        }>
                          <i style={{ color: 'red' }}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
                            <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6Z" />
                            <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1ZM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118ZM2.5 3h11V2h-11v1Z" />
                          </svg></i>
                        </button>
                      </div>
                    </div>
                  );
                })}

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
                      <img src={tag_icon} alt="coupon" width='30' /><br />
                      Coupon
                    </button>
                  </Col>
                  <Col md={6}>
                    <button className="btn discount_card">
                      <img src={discount_icon} alt="coupon" width='30' /><br />
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
