import React, { useEffect, useRef, useState } from "react";
import Layout from "../layouts/Layout";
import { Col, Modal, Row } from "react-bootstrap";
import Swal from 'sweetalert2';
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
import { useCart } from "react-use-cart";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import SelectSearch from "react-select-search";
import { useDispatch, useSelector } from "react-redux";
import { setUserData } from "../store/UserData";
import LoadingBar from "react-top-loading-bar";

const Home = () => {
  const successNotify = (v) => toast.success(v, {
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
  const errorNotify = (v) => toast.error(v, {
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
  const infoNotify = (v) => toast.info(v, {
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
  const ref = useRef(null);
  const dispatch = useDispatch();
  const [selectedCustomerAddresses, setSelectedCustomerAddress] = useState();
  const navigate = useNavigate();
  const { addItem, totalUniqueItems, cartTotal, items, updateItemQuantity, removeItem, updateItem, emptyCart } = useCart();
  const [searchProduct, setSearchProduct] = useState();
  const [itemExpend, setItemExpend] = useState();
  const [categories, setCategories] = useState();
  const [products, setProducts] = useState();
  const [subtotal, setSubtotal] = useState(0.00);
  const [discount, setDiscount] = useState(0.00);
  const [couponAmount, setCouponAmount] = useState(0.00);
  const [tax, setTax] = useState(0.00);
  const [grandTotal, setGrandTotal] = useState(subtotal - discount - couponAmount + tax);
  const [searchCustomer, setSearchCustomer] = useState();
  const [customers, setCustomers] = useState();
  const [selectedCustomer, setCustomer] = useState();
  const [selectedCustomerAddressesId, setCustomerAddressId] = useState();
  const [cateID, setCateID] = useState();
  const [query, setQuery] = useState(null);
  const [addAddressModal, setAddAddressModal] = useState();
  const [addCustomerModal, setAddCustomerModal] = useState();
  const [insideShiCharge, setInsideShiCharge] = useState("");
  const [outsideShiCharge, setOutsideShiCharge] = useState("");
  const [city, setCity] = useState("inside_dhaka");
  const [shipingCost, setShipingCost] = useState("0.00");
  const [bkashTId, setBkashTId] = useState();
  let [orderNote, setOrderNote] = useState("");
  let [paymentMethod, setPaymentMethod] = useState("");
  const { UserData } = useSelector((state) => state.UserData);

  const search = useLocation().search;
  const queryParam = new URLSearchParams(search);
  

  useEffect(() => {
    ref.current.continuousStart();
    if (UserData || queryParam.get('token')) {
      console.log('pos verify');
      var token = queryParam.get('token') !== null ? queryParam.get('token') : (UserData ? UserData.token : '');
        axios.get("pos/verify-token/" + token)
        .then(resp => {
          ref.current.complete();
          localStorage.removeItem("posUser");
          dispatch(setUserData(null))
          if(resp.data.success){
            // Swal.fire({
            //   position: 'center',
            //   icon: 'success',
            //   title: resp.data.message,
            //   showConfirmButton: false,
            //   timer: 1000
            // });
            localStorage.setItem("posUser", JSON.stringify(resp.data.data));
            dispatch(setUserData(resp.data.data));
          }
          else if(resp.data.success==false){
              Swal.fire({
                position: 'center',
                icon: 'warning',
                title: resp.data.message,
                showConfirmButton: false,
                timer: 1000
              })
              localStorage.removeItem("posUser");
              dispatch(setUserData(null))
            navigate({ pathname: '/login', search: '?q=You Need To Login First', replace: true });
          }
  
        }).catch(err => {
          ref.current.complete();
          console.log(err);
          navigate({ pathname: '/login', search: '?q=You Need To Login First', replace: true });
        });
      
    }
  }, [queryParam.get('token')]);
  // console.log(UserData);

  useEffect(() => {

    axios.get("get-shipping-charges")
      .then(resp => {
        if (resp.data) {
          // console.log(resp.data.shipping_charges);
          setInsideShiCharge(resp.data.shipping_charges[0].price);
          setOutsideShiCharge(resp.data.shipping_charges[1].price);
        }
      });

  }, [insideShiCharge,outsideShiCharge]);
  useEffect(() => {
    if (searchProduct && cateID) {
      setQuery("?product_name=" + searchProduct + "&category_id=" + cateID);
    }
    else if (searchProduct) {
      setQuery("?product_name=" + searchProduct);
    }
    else if (cateID) {
      setQuery("?category_id=" + cateID);
    }
    else {
      setQuery(null);
    }
    // console.log(query);
  }, [cateID, searchProduct]);

  useEffect(() => {
    if (searchProduct && cateID && query) {
      axios.get("pos/products" + query)
        .then(resp => {
          if(resp.data.success===false && queryParam.get('token') === null){
            navigate({ pathname: '/login', search: '?q=You Need To Login First', replace: true });
          }
          else{
            setProducts(resp.data.data);
          }
        });
    }
    else if (searchProduct && query) {
      axios.get("pos/products" + query)
        .then(resp => {
          if(resp.data.success===false && queryParam.get('token') === null){
            navigate({ pathname: '/login', search: '?q=You Need To Login First', replace: true });
          }
          else{
          setProducts(resp.data.data);
          }
        });
    }
    else if (cateID && query) {
      axios.get("pos/products" + query)
        .then(resp => {
          if(resp.data.success===false && queryParam.get('token') === null){
            navigate({ pathname: '/login', search: '?q=You Need To Login First', replace: true });
          }
          else{
          setProducts(resp.data.data.data);
          }
        });
    }
    else {
      axios.get("pos/products")
        .then(resp => {
          if(resp.data.success===false && queryParam.get('token') === null){
            navigate({ pathname: '/login', search: '?q=You Need To Login First', replace: true });
          }
          else{
          setProducts(resp.data.data.data);
          }
        });
    }
  }, [UserData, query]);

  useEffect(() => {
    if (!categories) {
      axios.get("get-categories")
        .then(resp => {
          setCategories(resp.data.categories);
        });
    }
    // console.log('render check');
  }, [categories]);
  // console.log(products);
  useEffect(() => {
    if (city === 'inside_dhaka') {
      setShipingCost(insideShiCharge);
    }
    else if (city === 'outside_dhaka') {
      setShipingCost(outsideShiCharge);
    }
    // console.log(shipingCost);
    // console.log(outsideShiCharge);
  }, [city]);

  useEffect(() => {
    setSubtotal(cartTotal);
    setGrandTotal(subtotal - Number(discount) - Number(couponAmount) + Number(shipingCost) + Number(tax));
  }, [cartTotal, discount, couponAmount, tax, shipingCost, subtotal, grandTotal]);

  useEffect(() => {
    setCustomers(null);
    if (searchCustomer) {
      axios.get("pos/customer-list?customerSearchInput=" + searchCustomer)
        .then(resp => {
          // console.log(resp.data);
          if (resp.data.data.length > 0) {
            setCustomers(resp.data.data);
          }
        });
    }
  }, [searchCustomer]);

  const [addressHtml, setAddressHtml] = useState(null);

  const customerAddress = (customer_id) => {
    setSelectedCustomerAddress(null);
    axios
      .get("pos/get-customer-addresses/" + customer_id)
      .then(function (resp) {
        setSelectedCustomerAddress(resp.data.data);

      })
      .catch((err) => {
        console.log(err);
      });
    // console.log('customerAddress load function hit');
  }
  // console.log(selectedCustomerAddresses);
  useEffect(() => {
    let radioHtml = '<b className="mb-2 mt-2 col-12">Select Address</b> <br>';
    if (selectedCustomerAddresses) {
      try {
        selectedCustomerAddresses.forEach(function (item, key) {
          radioHtml += `<div className="form-check form-check-inline col-5 pe-0" style="margin:1rem">
        <input className="form-check-input discount_type" type="radio" name="address_id" id="`+ item.id + `" value="` + item.id + `" required>
        <label className="form-check-label" for="`+ item.id + `">
        <address className='row address_div'>
        <p className="col-6" style="margin-bottom: 0; border-bottom: 1px solid #e5e5e5;">`+ item.address + `</p>
        <p className="col-6" style="margin-bottom: 0; border-bottom: 1px solid #e5e5e5;">
        <i style="color: rgb(9, 179, 212)"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-person" viewBox="0 0 16 16">
        <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0Zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4Zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10Z"/>
      </svg></i> `+ item.name + `</p>
        <p className="col-6" style="margin-bottom: 0; border-bottom: 1px solid #e5e5e5;"><i style="color: rgb(9, 179, 212)"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-telephone" viewBox="0 0 16 16">
        <path d="M3.654 1.328a.678.678 0 0 0-1.015-.063L1.605 2.3c-.483.484-.661 1.169-.45 1.77a17.568 17.568 0 0 0 4.168 6.608 17.569 17.569 0 0 0 6.608 4.168c.601.211 1.286.033 1.77-.45l1.034-1.034a.678.678 0 0 0-.063-1.015l-2.307-1.794a.678.678 0 0 0-.58-.122l-2.19.547a1.745 1.745 0 0 1-1.657-.459L5.482 8.062a1.745 1.745 0 0 1-.46-1.657l.548-2.19a.678.678 0 0 0-.122-.58L3.654 1.328zM1.884.511a1.745 1.745 0 0 1 2.612.163L6.29 2.98c.329.423.445.974.315 1.494l-.547 2.19a.678.678 0 0 0 .178.643l2.457 2.457a.678.678 0 0 0 .644.178l2.189-.547a1.745 1.745 0 0 1 1.494.315l2.306 1.794c.829.645.905 1.87.163 2.611l-1.034 1.034c-.74.74-1.846 1.065-2.877.702a18.634 18.634 0 0 1-7.01-4.42 18.634 18.634 0 0 1-4.42-7.009c-.362-1.03-.037-2.137.703-2.877L1.885.511z"/>
      </svg></i> `+ item.phone + `</p>
        <p className="col-6" style="margin-bottom: 0; border-bottom: 1px solid #e5e5e5;">`+ item.shipping_state.name + `</p>
        <p className="col-6" style="margin-bottom: 0; border-bottom: 1px solid #e5e5e5;">Zip: `+ item.zip + `</p>
        </address>
        </label>
        <input type="hidden" id="address_name`+ item.id + `" value="`+ item.name + `" required>
        <input type="hidden" id="address`+ item.id + `" value="`+ item.address + `" required>
        <input type="hidden" id="address_phone`+ item.id + `" value="`+ item.phone + `" required>
        <input type="hidden" id="address_email`+ item.id + `" value="`+ item.email + `" required>
        <input type="hidden" id="shipping_id`+ item.id + `" value="`+ item.shipping_state.id + `" required>
        <input type="hidden" id="zip`+ item.id + `" value="`+ item.zip + `" required>
        <input type="hidden" id="area`+ item.id + `" value="`+ item.area + `" required>
      </div>`;
        });
        
      } catch (error) {
        Swal.fire({
          customClass: {
            icon: 'mt-4'
          },
          position: 'center',
          icon: 'success',
          title: 'Ops! Something Went Wrong',
          showConfirmButton: true,
        });
        console.error(error);
      }
    }
    else {
      radioHtml = `<h5 className="text-warning">No Address Found</h5>`;
    }
    setAddressHtml(radioHtml)
    // console.log('changes in the radio html' + radioHtml);
  }, [selectedCustomerAddresses]);
  // console.log(city);
  // console.log(selectedCustomerAddresses);
  const [errorList, setError] = useState();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState('customer1234');
  const [email, setEmail] = useState("");
  const [contact, setContact] = useState("");
  const [area, setArea] = useState("");
  const [areaID, setAreaId] = useState(0);
  const [zip, setZip] = useState("");
  const [defaultValue, setDefault] = useState(false);
  const [couponId, setCouponId] = useState();
  const [address, setAddress] = useState("");
  const [shippingZones, setShippingZones] = useState([]);
  const [variation, setVariation] = useState({
    id: '', value: '', stock: '', attribute_final_price: '', old_price: ''
  });
  useEffect(() => {
    // console.log(city);
    if (city === 'inside_dhaka') {
      axios.get("ec/area-by-district/dhaka")
        .then(resp => {
          // console.log(resp.data.data);
          setShippingZones(resp.data.data.data);
        }).catch(err => {
          console.log(err);
        });
    }
    else if (city === 'outside_dhaka') {
      axios.get("ec/get-cities")
        .then(resp => {
          // console.log(resp.data.data);
          setShippingZones(resp.data.data);
        }).catch(err => {
          console.log(err);
        });
    }
  }, [city]);

  const addCustomer = (event) => {

    var obj = {
      customer_name: username,
      customer_password: password,
      customer_email: email,
      customer_contact: contact,
      address: address,
      city: city,
      zip: zip,
      area: area,
      shipping_id: areaID
    };
    if (city === 'inside_dhaka') {
      obj.shipping_id = 14;
    }
    else if (city === 'outside_dhaka') {
      obj.shipping_id = 15;
    }
    // console.log(props.customer_id);
    // console.log(obj);
    axios
      .post("pos/register-customer", obj)
      .then(function (resp) {

        // console.log(resp.data);
        var data = resp.data;
        console.log(data);
        if (data.success == false) {

          setError(data.message);
        }
        else if (data.message) {
          Swal.fire({
            customClass: {
              icon: 'mt-4'
            },
            position: 'center',
            icon: 'success',
            title: data.message,
            showConfirmButton: true,
          });
          // navigate("/customer/address");
          setCustomer(data.data.customer[0]);
          // setSelectedCustomerAddress([data.data.customer[1]]);
          setCustomerAddressId(data.data.customer[1].id);
          setError(null);
          setAddCustomerModal(false);
        }
      })
      .catch((err) => {
        console.log(err);
        setError(err.response.data.errors)
      });

    // console.log('errorlist');
    // console.log(errorList);
    event.preventDefault();
  };

  const handleSubmit = (event) => {
    var obj = {
      name: username,
      email: email,
      phone: contact,
      address: address,
      city: city,
      zip: zip,
      area: area,
      area_id: areaID,
      shipping_id: 0,
      is_default: defaultValue
    };
    if (city === 'inside_dhaka') {
      obj.shipping_id = 14;
    }
    else if (city === 'outside_dhaka') {
      obj.shipping_id = 15;
    }
    // console.log(props.customer_id);
    // console.log(obj);
    axios
      .post("pos/add-customer-address/" + selectedCustomer.id, obj)
      .then(function (resp) {
        var data = resp.data;
        // console.log(data);
        if (data.success == false) {

          setError(data.message);
        }
        else {
          Swal.fire({
            customClass: {
              icon: 'mt-4'
            },
            position: 'center',
            icon: 'success',
            title: data.message,
            showConfirmButton: false,
          });
          setUsername('');
          setPassword('');
          setEmail('');
          setContact('');
          setAddress('');
          setZip('');
          setArea('');
          setAreaId('');
          setError(null);
          setCity('');
          customerAddress(selectedCustomer.id);
          setAddAddressModal(false);
        }
      })
      .catch((err) => {
        setAddressHtml();
        setAddAddressModal(false);
        console.log(err);
        setError(err.response.data.errors)
      });

    // console.log(errorList);
    event.preventDefault();
  };

  const checkOutSubmit = () => {
    ref.current.continuousStart();
    if (!selectedCustomerAddressesId) {
      Swal.fire('Select Customer Address First')
    }
    else if (!city || !paymentMethod) {
      Swal.fire('Select Shipping Zone & Payment Method')
    }
    else {
      var customer_city = 0;
      if (city === "inside_dhaka") {
        customer_city = 14;
      }
      else if (city === "outside_dhaka") {
        customer_city = 15;
      }
      var customer_details = {
        customer_name: selectedCustomer.customer_name,
        customer_email: selectedCustomer.customer_email,
        customer_phone: selectedCustomer.customer_contact,
        customer_address: selectedCustomer.customer_address ?? '',
        customer_city: customer_city,
        customer_zip: selectedCustomer.zip ?? '',
      }
      var shipping_details = {
        customer_name: username,
        customer_email: email,
        customer_phone: contact,
        customer_address: address,
        customer_city: customer_city,
        customer_zip: zip,
        shipping_area: area,
      };
      if(paymentMethod!=='bkash-merchant'){
        setBkashTId(null);
      }
      if (!customer_details.customer_email) {
        customer_details.customer_email = "";
      }
      else if (!customer_details.customer_city) {
        customer_details.customer_city = "";
      }
      else if (!customer_details.customer_phone) {
        customer_details.customer_phone = "";
      }
      var products = [];
      items.forEach(function (item) {
        // console.log("listcart theke id"+item.id);
        products.push({
          id: item.id,
          product_id: item.product_id,
          product_name: item.name,
          product_price: item.price,
          qty: item.quantity,
          image: item.image,
          variation_id: item.variation_id && item.variation_id,
          variation_value: item.variation_value && item.variation_value,
          variation_stock: item.variation_stock && item.variation_stock,
          variation_final_price: item.variation_final_price && item.variation_final_price
        });
      });

      var order = {
        admin_id: UserData.id,
        customer_id: selectedCustomer.id,
        customer_details: customer_details,
        shipping_details: shipping_details,
        products: products,
        order_note: orderNote,
        payment_method: paymentMethod,
        shipping_cost: shipingCost,
        vat: tax,
        coupon_id: couponId,
        bKash_tran_id: bkashTId,
        order_from: 'pos'
      };
      // console.log(order);
      if (paymentMethod === "ssl") {
        // console.log(order);
        axios.post('pos/order', order)
          .then(resp => {
            console.log(resp.data);
            if (resp.data.success) {
            ref.current.complete();
              emptyCart();
              setTimeout(() => {
                window.location.reload();
                }, 1200);
            }
            else {
              ref.current.complete();
              setError(resp.data.message);
            }
            // window.location.replace(resp.gatewayPageUrl);
          })
          .catch(err => {
            ref.current.complete();
            console.log(err);
          });

      }
      else {
        axios
          .post("pos/order", order)
          .then(function (resp) {
            console.log(resp.data);
            var data = resp.data;
            if (resp.data.success) {
              ref.current.complete();
              Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: data.message,
                showConfirmButton: false,
                timer: 1200
              });
              emptyCart();
              setTimeout(() => {
              window.location.reload();
              }, 1200);

            }
            else {
              Swal.fire({
                position: 'center',
                icon: 'warning',
                title: 'Something went wrong please try again later',
                showConfirmButton: true
              });
              ref.current.complete();
              setError(resp.data.message);
            }

          })
          .catch((err) => {
            console.log(err);
            ref.current.complete();
            if (err) {
              setError("There is something wrong in the order!!!");
            }
          });
      }


    }
  };

  return (
    <div>
      <LoadingBar
        color='#0098b8' 
        ref={ref}
        />
      <Layout>
        <Row>
          <Col lg={7} xxl={8} className="ps-0 pe-0">
            <div className="products_tab">
              <h2 className="p-2">Categories</h2>
              <div className="category_div">
                <button className={cateID ? "category_card" : "category_card active"} onClick={() => {
                  setCateID(null);
                }}>
                  <span role="img" aria-label="database" className="catIcon">
                    <img className="catIcon" src={all_cate} alt='All'
                      width="40" height="40" />
                  </span>
                  <p className="m-0">All</p>
                </button>
                {categories &&
                  (
                    categories.map((category, index) => {
                      return (
                        <button key={index} className={cateID === category.id ? "category_card active" : "category_card"} onClick={() => {
                          setCateID(category.id);
                        }}>
                          <span role="img" aria-label="database" className="catIcon">
                            <img className="catIcon" src={category.category_image} alt={category.category_name}
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
                <Col md={8}>
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
                {/* <Col xs={3} md={1} className="ps-0">

                  <button className="btn basic_btn"><img src={plus_icon} height={30} alt="bar icon" /></button>
                </Col> */}
                <Col xs={6} md={3}>
                  <p className="text-end pe-3">{products ? products.length : '0'} Products</p>
                </Col>
              </Row>
              <Row className="product_list">
                {products &&
                  products.map((product, index) => {
                    return (
                      <Col key={index} md={6} lg={3}>
                        <div className="pos_product_card" onClick={() => {
                          // errorNotify();
                          if (product.stock > 0 && product.attribute_id === undefined) {
                            addItem({
                              id: product.id,
                              product_id: product.id,
                              name: product.name,
                              price: Number(product.final_product_price).toFixed(2),
                              quantity: 1,
                              image: product.image.small,
                              stock: product.stock
                            });
                            successNotify('Product added to cart');
                          } else if (product.stock > 0) {
                            addItem({
                              id: product.id + '_' + product.attribute_id,
                              product_id: product.id,
                              name: product.name,
                              price: Number(product.final_product_price).toFixed(2),
                              quantity: 1,
                              image: product.image.small,
                              stock: product.stock,
                              variation_id: product.attribute_id,
                              variation_final_price: product.final_product_price,
                              variation_stock: product.stock,
                              variation_value: product.name,
                            });
                            successNotify('Product added to cart');
                          } else {
                            errorNotify('Product is out of stock');
                          }

                        }}>
                          <Row>
                            <Col xs={6} className="pe-0">
                              {product && product.image && product.image && (

                                <img className="img-fluid pos_product_img" height={100} width={100} src={product.image.small} alt={product.name} />
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
          <Col lg={5} xxl={4} className="ps-0">
            <div className="cart_section">
              <div className="customer_section row">
                {selectedCustomer ? (
                  <>
                    <div className="col-7">
                      <div className="selected_customer">{selectedCustomer.customer_name} ({selectedCustomer.customer_contact})</div>

                    </div>
                    <div className="col-2">
                      <button className="btn customer_add_btn"
                        style={{ fontSize: '0.68rem' }}
                        title="Select Address"
                        onClick={() => {
                          var button_text = '';
                          // if(!selectedCustomerAddresses){
                          //   button_text = 'Add Address';
                          // }
                          // else{
                          button_text = 'Select Address';
                          // }
                          Swal.fire({
                            title: 'Customer Addresses',
                            html: `<div className="row" style="width: 100%">
                      <div className="col-12 row">
                      `+ addressHtml + `
                      </div>
                      </div>
                              `,
                            confirmButtonColor: '#09b3d4',
                            confirmButtonText: button_text,
                            showDenyButton: true,
                            denyButtonText: `Add Address`,
                            denyButtonColor: '#890bc2',
                          }).then((result) => {
                            if (result.isConfirmed) {

                              if (!selectedCustomerAddresses) {

                                setAddAddressModal(true);
                              }
                              else {
                                setCustomerAddressId(Swal.getHtmlContainer().querySelector("input[name='address_id']:checked").value);
                                setUsername(Swal.getHtmlContainer().querySelector("#address_name"+Swal.getHtmlContainer().querySelector("input[name='address_id']:checked").value).value);
                                setContact(Swal.getHtmlContainer().querySelector("#address_phone"+Swal.getHtmlContainer().querySelector("input[name='address_id']:checked").value).value);
                                setEmail(Swal.getHtmlContainer().querySelector("#address_email"+Swal.getHtmlContainer().querySelector("input[name='address_id']:checked").value).value);
                                setCity(Swal.getHtmlContainer().querySelector("#shipping_id"+Swal.getHtmlContainer().querySelector("input[name='address_id']:checked").value).value===14 ? 'inside_dhaka' : 'outside_dhaka');
                                setAddress(Swal.getHtmlContainer().querySelector("#address"+Swal.getHtmlContainer().querySelector("input[name='address_id']:checked").value).value);
                                setZip(Swal.getHtmlContainer().querySelector("#zip"+Swal.getHtmlContainer().querySelector("input[name='address_id']:checked").value).value);
                                setArea(Swal.getHtmlContainer().querySelector("#area"+Swal.getHtmlContainer().querySelector("input[name='address_id']:checked").value).value);
                              }
                              // console.log(Swal.getHtmlContainer().querySelector("#shipping_id"+Swal.getHtmlContainer().querySelector("input[name='address_id']:checked").value).value);
                            }
                            else if (result.isDenied) {
                              setAddAddressModal(true);
                            }
                          })
                        }}>
                        {/* <i>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-ui-radios" viewBox="0 0 16 16">
                      <path d="M7 2.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-7a.5.5 0 0 1-.5-.5v-1zM0 12a3 3 0 1 1 6 0 3 3 0 0 1-6 0zm7-1.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-7a.5.5 0 0 1-.5-.5v-1zm0-5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5zm0 8a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5zM3 1a3 3 0 1 0 0 6 3 3 0 0 0 0-6zm0 4.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z"/>
                    </svg>
                      </i>  */}
                        Select Address
                      </button>
                      <Modal
                        show={addAddressModal}
                        size="md"
                        aria-labelledby="contained-modal-title-vcenter"
                        centered
                      >
                        <Modal.Header closeButton onClick={() => setAddAddressModal(false)}>
                          <Modal.Title id="contained-modal-title-vcenter">
                            Add Customer Address
                          </Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                          <div className="ps-4 pe-4">
                            <form onSubmit={(e) => { handleSubmit(e); }}>
                              <div className="form-group mb-2">
                                <label htmlFor="name" className="required">
                                  Full Name:
                                </label>{" "}
                                <input
                                  id="name"
                                  type="text"
                                  name="name"
                                  value={username}
                                  onChange={(e) => setUsername(e.target.value)}
                                  placeholder="Customer full name"
                                  className="form-control square"
                                />
                                <span className='text-danger'>{errorList && errorList.name && errorList.name[0]}</span>
                              </div>{" "}
                              <div className="form-group mb-2">
                                <label htmlFor="email">Email:</label>{" "}
                                <input id="email" type="email" name="email" value={email}
                                  onChange={(e) => setEmail(e.target.value)} placeholder="your-email@domain.com" className="form-control square" />
                                {errorList && (<span className='text-danger'>{errorList.email && errorList.email}</span>)}
                              </div>{" "}
                              <div className="form-group mb-2">
                                <label htmlFor="phone" className="required">
                                  Phone:
                                </label>{" "}
                                <input id="phone" type="text" name="phone" value={contact} onChange={(e) => setContact(e.target.value)} className="form-control square" />
                                {errorList && (<span className='text-danger'>{errorList.phone}</span>)}
                              </div>{" "}
                              <div className="form-group mb-2">
                                <label htmlFor="city" className="required">
                                  City:
                                </label>{" "}
                                <select style={{ height: '47px' }} className="form-control address-control-item address-control-item-required"
                                  id="city"
                                  name="city"
                                  value={city}
                                  required
                                  onChange={(e) => { setCity(e.target.value); }}
                                >
                                  {/* <option>Your City</option> */}
                                  <option value={'inside_dhaka'}>Inside Dhaka</option>
                                  <option value={'outside_dhaka'}>Outside Dhaka</option>
                                </select>
                                {errorList && (<span className='text-danger'>{errorList.city}</span>)}
                              </div>{" "}
                              <div className="form-group mb-2">
                                <label htmlFor="area" className="required">
                                  Area:
                                </label>{" "}
                                {city === 'inside_dhaka' && (
                                  // <div className="form-group">
                                  // <SelectSearch options={DhakaShippingZoneData} value={area} search={true} name="area" placeholder="Select Area" onChange={(selectedValue,selectedOption) => {setArea(selectedOption.name);console.log(selectedOption);}} />
                                  // </div>
                                  shippingZones && (
                                    <div className="form-group mb-2">
                                      <select style={{ height: '47px' }} className="form-control address-control-item address-control-item-required"
                                        name="area"
                                        required={area === "" ? true : false}
                                        value={area}
                                        onChange={(e) => setArea(e.target.value)}
                                      >
                                        <option value={null}>Select Area</option>
                                        {shippingZones &&
                                          (shippingZones.map((srvzn, index) => {
                                            return <option key={index} value={srvzn.name}>{srvzn.name}</option>;
                                          }))}
                                      </select>
                                      {errorList && (
                                        <span className="text-danger">
                                          {errorList['shipping_details.area'] && errorList['shipping_details.area'][0]}
                                        </span>
                                      )}
                                    </div>
                                  )
                                )}
                                {city === 'outside_dhaka' && (
                                  shippingZones && (
                                    <div className="form-group">
                                      <SelectSearch options={shippingZones} value={area} search={true} name="area" placeholder="Select Area" onChange={(selectedValue) => { setArea(selectedValue); }} />
                                    </div>
                                  )
                                )}
                                {errorList && (<span className='text-danger'>{errorList.area}</span>)}
                              </div>{" "}
                              <div className="form-group mb-2">
                                <label htmlFor="zip" className="">
                                  Zip:
                                </label>{" "}
                                <input id="zip" type="text" name="zip" value={zip} onChange={(e) => setZip(e.target.value)} placeholder="Enter your city" className="form-control square" />
                              </div>{" "}
                              <div className="form-group mb-2">
                                <label htmlFor="address" className="required">
                                  Address:
                                </label>{" "}
                                <input
                                  id="address"
                                  type="text"
                                  name="address"
                                  value={address}
                                  onChange={(e) => setAddress(e.target.value)}
                                  required="required"
                                  placeholder="Enter your address"
                                  className="form-control square"
                                />
                                {errorList && (<span className='text-danger'>{errorList.address}</span>)}
                              </div>{" "}
                              {/* <div className="form-group mb-2">
                                <div className="custome-checkbox">
                                  <input type="checkbox" name="is_default" value={1} id="is_default" onClick={(e) => setDefault(!defaultValue)} className="form-check-input" />{" "}
                                  <label htmlFor="is_default" className="form-check-label">
                                    <span>Use this address as default.</span>
                                  </label>
                                </div>
                              </div>{" "} */}
                              <div className="col-md-12">
                                <button type="submit" className="btn customer_add_btn">
                                  Save address
                                </button>&nbsp;
                                <button type="reset" className="btn btn-light" onClick={() => setAddAddressModal(false)}>Cancel</button>
                              </div>
                            </form>
                          </div>
                        </Modal.Body>
                      </Modal>
                    </div>
                    <div className="col-1">
                      <button data-title="Remove" className="btn" onClick={() => {
                        setCustomer(null);
                        setCustomerAddressId(null);
                      }}>
                        <i style={{ color: 'red' }}>
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6Z"></path><path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1ZM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118ZM2.5 3h11V2h-11v1Z"></path></svg>
                        </i>
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="col-8 ps-4">
                      <input type="search" className="form-control" placeholder="Search customer name phone or email" value={searchCustomer} onChange={(e) => setSearchCustomer(e.target.value)} />

                      {searchCustomer && customers && (
                        <div className="customer_class_search_result">
                          {customers && customers.map((customer, key) => {
                            return (
                              <p key={key} onClick={() => {
                                customerAddress(customer.id);
                                // console.log(selectedCustomerAddresses);

                                Swal.fire({
                                  title: 'Customer Details',
                                  html: `<div className="row" style="width: 100%">
                          <h6 className="col-7 mb-0 text-start">Name: `+ customer.customer_name + `</h6>
                          <p className="col-5 mb-0 text-end">`+ customer.customer_contact + `</p>
                          <p className="col-8 mb-0 text-start">Email: `+ customer.customer_email + `</p>
                          <p className="col-4 mb-0 text-end">Gender: `+ customer.customer_gender + `</p>
                          </div>
                                  `,
                                  confirmButtonColor: '#09b3d4',
                                  confirmButtonText: "Select Customer",
                                }).then((result) => {
                                  if (result.isConfirmed) {
                                    setCustomer(customer);
                                  }
                                })
                              }} className="mb-1">{customer.customer_name} ({customer.customer_contact})</p>
                            )
                          })}
                        </div>
                      )}

                    </div>
                    <div className="col-4">
                      <button className="col-7 col-xl-5 btn customer_add_btn" title="Add Customer" onClick={() => {
                        setAddCustomerModal(!addCustomerModal);
                      }}>
                        <i>
                          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" className="bi bi-person-add" viewBox="0 0 16 16">
                            <path d="M12.5 16a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Zm.5-5v1h1a.5.5 0 0 1 0 1h-1v1a.5.5 0 0 1-1 0v-1h-1a.5.5 0 0 1 0-1h1v-1a.5.5 0 0 1 1 0Zm-2-6a3 3 0 1 1-6 0 3 3 0 0 1 6 0ZM8 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" />
                            <path d="M8.256 14a4.474 4.474 0 0 1-.229-1.004H3c.001-.246.154-.986.832-1.664C4.484 10.68 5.711 10 8 10c.26 0 .507.009.74.025.226-.341.496-.65.804-.918C9.077 9.038 8.564 9 8 9c-5 0-6 3-6 4s1 1 1 1h5.256Z" />
                          </svg>
                        </i>
                      </button>
                    </div>
                    <Modal
                      show={addCustomerModal}
                      size="md"
                      aria-labelledby="contained-modal-title-vcenter"
                      centered
                    >
                      <Modal.Header closeButton onClick={() => setAddCustomerModal(!addCustomerModal)}>
                        <Modal.Title id="contained-modal-title-vcenter">
                          Add Customer
                        </Modal.Title>
                      </Modal.Header>
                      <Modal.Body>
                        <div className="ps-4 pe-4">
                          <form onSubmit={(e) => { addCustomer(e); }}>
                            <div className="form-group mb-2">
                              <label htmlFor="name" className="required">
                                Full Name:
                              </label>{" "}
                              <input
                                id="name"
                                type="text"
                                name="name"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Enter your full name"
                                className="form-control square"
                              />
                              {errorList && (<span className='text-danger'>{errorList.customer_name && errorList.customer_name[0]}</span>)}
                            </div>{" "}
                            <div className="form-group mb-2">
                              <label htmlFor="email">Email:</label>{" "}
                              <input id="email" type="email" name="email" value={email}
                                onChange={(e) => setEmail(e.target.value)} placeholder="your-email@domain.com" className="form-control square" />
                              {errorList && (<span className='text-danger'>{errorList.customer_email && errorList.customer_email[0]}</span>)}
                            </div>{" "}
                            <div className="form-group mb-2">
                              <label htmlFor="phone" className="required">
                                Phone:
                              </label>{" "}
                              <input id="phone" type="text" name="phone" placeholder="Enter Customer Phone Number" value={contact} onChange={(e) => setContact(e.target.value)} className="form-control square" />
                              {errorList && (<span className='text-danger'>{errorList.customer_contact && errorList.customer_contact[0]}</span>)}
                            </div>{" "}
                            <div className="form-group mb-2">
                              <label htmlFor="password" className="required">
                                Password:
                              </label>{" "}
                              <input
                                id="password"
                                type="text"
                                name="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Password For The Customer"
                                className="form-control square"
                                style={{backgroundColor:'#e1e1e1'}}
                                readOnly
                              />
                              <span className='text-danger'>{errorList && errorList.customer_password && errorList.customer_password[0]}</span>
                            </div>{" "}
                            <div className="form-group mb-2">
                              <label htmlFor="city" className="required">
                                City:
                              </label>{" "}
                              <select style={{ height: '47px' }} className="form-control address-control-item address-control-item-required"
                                id="city"
                                name="city"
                                value={city}
                                required
                                onChange={(e) => { setCity(e.target.value); }}
                              >
                                {/* <option>Your City</option> */}
                                <option value={'inside_dhaka'}>Inside Dhaka</option>
                                <option value={'outside_dhaka'}>Outside Dhaka</option>
                              </select>
                              {errorList && (<span className='text-danger'>{errorList.city}</span>)}
                            </div>{" "}
                            <div className="form-group mb-2">
                              <label htmlFor="area" className="required">
                                Area:
                              </label>{" "}
                              {city === 'inside_dhaka' && (
                                // <div className="form-group">
                                // <SelectSearch options={DhakaShippingZoneData} value={area} search={true} name="area" placeholder="Select Area" onChange={(selectedValue,selectedOption) => {setArea(selectedOption.name);console.log(selectedOption);}} />
                                // </div>
                                shippingZones && (
                                  <div className="form-group mb-2" id="area">
                                    <select style={{ height: '47px' }} className="form-control address-control-item address-control-item-required"
                                      name="area"
                                      required={area === "" ? true : false}
                                      value={area}
                                      onChange={(e) => setArea(e.target.value)}
                                    >
                                      <option value={null}>Select Area</option>
                                      {shippingZones &&
                                        (shippingZones.map((srvzn, index) => {
                                          return <option key={index} value={srvzn.name}>{srvzn.name}</option>;
                                        }))}
                                    </select>
                                    {errorList && (
                                      <span className="text-danger">
                                        {errorList['shipping_details.area'] && errorList['shipping_details.area'][0]}
                                      </span>
                                    )}
                                  </div>
                                )
                              )}
                              {city === 'outside_dhaka' && (
                                shippingZones && (
                                  <div className="form-group" id="area">
                                    <SelectSearch options={shippingZones} value={area} search={true} name="area" placeholder="Select Area" onChange={(selectedValue) => { setArea(selectedValue); }} />
                                  </div>
                                )
                              )}
                              <span className='text-danger'>{errorList && errorList.area && errorList.area[0]}</span>
                            </div>{" "}
                            <div className="form-group mb-2">
                              <label htmlFor="zip" className="">
                                Zip:
                              </label>{" "}
                              <input id="zip" type="text" name="zip" value={zip} onChange={(e) => setZip(e.target.value)} placeholder="Enter your city" className="form-control square" />
                              <span className='text-danger'>{errorList && errorList.zip && errorList.zip[0]}</span>
                            </div>{" "}
                            <div className="form-group mb-2">
                              <label htmlFor="address" className="required">
                                Address:
                              </label>{" "}
                              <input
                                id="address"
                                type="text"
                                name="address"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                // required="required"
                                placeholder="Enter your address"
                                className="form-control square"
                              />
                              {errorList && (<span className='text-danger'>{errorList.address && errorList.address[0]}</span>)}
                            </div>{" "}
                            {/* <div className="form-group mb-2">
                    <div className="custome-checkbox">
                      <input type="checkbox" name="is_default" value={1} id="is_default" onClick={(e) => setDefault(!defaultValue)} className="form-check-input" />{" "}
                      <label htmlFor="is_default" className="form-check-label">
                        <span>Use this address as default.</span>
                      </label>
                    </div>
                  </div>{" "} */}
                            <div className="col-md-12">
                              <button type="submit" className="btn customer_add_btn">
                                Save address
                              </button>&nbsp;
                              <button type="reset" className="btn btn-light" onClick={() => setAddCustomerModal(!addCustomerModal)}>Cancel</button>
                            </div>
                          </form>
                        </div>
                      </Modal.Body>
                    </Modal>
                  </>
                )}
              </div>
              <h2 className="p-2"><img src={cart_image} alt="cart icon" className="img-fluid" width={28} /> Cart Items</h2>
              <div className="cart_items">
                {items.map((item, key) => {
                  return (
                    <div key={key} className="cart_item_card me-2 mt-1" style={{ cursor: 'pointer' }}>
                      <div className="row me-2" onClick={() => {
                        if (itemExpend == item.id) {
                          setItemExpend(null);
                        }
                        else {
                          setItemExpend(item.id);
                        }
                      }}>
                        <div className="col-1 center_col">
                          {itemExpend === item.id ? (

                            <i style={{ color: '#09b3d4' }} className="ps-2">
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-chevron-up" viewBox="0 0 16 16">
                                <path fill-rule="evenodd" d="M7.646 4.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1-.708.708L8 5.707l-5.646 5.647a.5.5 0 0 1-.708-.708l6-6z" />
                              </svg></i>
                          ) : (
                            <i style={{ color: '#09b3d4' }} className="ps-2">
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-chevron-down" viewBox="0 0 16 16">
                                <path fillRule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z" />
                              </svg></i>

                          )}
                        </div>
                        <div className="col-3 center_col" data-title="Product">
                          <img className="img-fluid cart_product_image" src={item.image} width='100' height='100' alt="Foster Farms Takeout Crispy classNameic" />
                        </div>
                        <div className="col-5 center_col" data-title="Name">
                          <h5 className="m-0" title={item.name}>
                            {item.name}
                            <h6 className="text-body"> ৳{item.price} x {item.quantity} </h6>{" "}
                          </h5>
                          {/* <p className="mb-0"> <small>(Weight: 4KG)</small></p> */}
                        </div>
                        <div data-title="Price" className="col-2 ps-0 center_col">

                          <h6 className="text-body text-center"> ৳{(item.price * item.quantity)} </h6>{" "}
                          {/* <small>
                                <del>$90.00</del>
                              </small> */}
                        </div>

                        <div data-title="Remove" className="col-1 ps-0 center_col">

                          <button data-title="Remove" className="btn basic_btn" onClick={() => {
                            infoNotify('Product removed from cart');
                            removeItem(item.id);
                          }
                          }>
                            <i style={{ color: 'red' }}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash" viewBox="0 0 16 16">
                              <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6Z" />
                              <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1ZM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118ZM2.5 3h11V2h-11v1Z" />
                            </svg></i>
                          </button>
                        </div>
                      </div>
                      <div className="row">
                        {itemExpend === item.id && (
                          <>
                            <div className="col-5">
                              <label className="quantity_price_label" htmlFor="quantity_value">Quantity</label>
                              <div className="quantity_button_group">
                                <button
                                  className="quantity_button"
                                  disabled={item.quantity <= 1}
                                  onClick={() => updateItemQuantity(item.id, item.quantity - 1)}>
                                  <svg xmlns="http://www.w3.org/2000/svg" width="12px" height="2px" viewBox="0 0 12 1.5">
                                    <rect data-name="Rectangle 970" width="12px" height="2px" fill="currentColor"></rect>
                                  </svg>
                                </button>
                                <input title="Quantity" id="quantity_value" type='number' className="form-control quantity_value text-center" value={item.quantity} onChange={(e) => updateItemQuantity(item.id, e.target.value)} />
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
                            </div>
                            <div className="col-5">
                              <label className="quantity_price_label" htmlFor="unit_price">Unit Price</label>
                              <input title="Unit Price" id="unit_price" type='number' className="form-control text-center" value={item.price} onChange={(e) => updateItem(item.id, {
                                price: e.target.value,
                              })} />
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}

              </div>
              <div className="cart_totals">
                <hr style={{ marginTop: '0', marginLeft: '-14px' }} />
                <Row>
                  <Col md={8}>
                    <h6>Subtotal:</h6>
                  </Col>
                  <Col md={4}>
                    <p className="text-end">{Number(subtotal.toFixed(2))}৳</p>
                  </Col>
                  <Col md={8}>
                    <h6>Tax:</h6>
                  </Col>
                  <Col md={4}>
                    <p className="text-end">{tax > 0 ? Number(tax.toFixed(2)) : '0.00'}৳</p>
                  </Col>
                  <Col md={8}>
                    <h6>Discount:</h6>
                  </Col>
                  <Col md={4}>
                    <p className="text-end">
                      {discount > 0 && (

                        <button data-title="Remove" className="btn pt-0" onClick={() => {
                          infoNotify('Discount removed');
                          setDiscount(0.00);
                        }
                        }>
                          <i><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash" viewBox="0 0 16 16">
                            <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6Z" />
                            <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1ZM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118ZM2.5 3h11V2h-11v1Z" />
                          </svg></i>
                        </button>
                      )}
                      -{discount > 0 ? Number(discount) : '0.00'}৳</p>
                  </Col>
                  <Col md={8}>
                    <h6>Applied Coupon(s):</h6>
                  </Col>
                  <Col md={4}>
                    <p className="text-end">
                      {couponAmount > 0 && (

                        <button data-title="Remove" className="btn pt-0" onClick={() => {
                          infoNotify('Coupon removed');
                          setCouponAmount(0.00);
                        }
                        }>
                          <i><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash" viewBox="0 0 16 16">
                            <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6Z" />
                            <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1ZM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118ZM2.5 3h11V2h-11v1Z" />
                          </svg></i>
                        </button>
                      )}
                      -{couponAmount && couponAmount > 0 ? Number(couponAmount) : '0.00'}৳</p>
                  </Col>
                  <Col md={8}>
                    <h6>Shipping Charge:</h6>
                  </Col>
                  <Col md={4}>
                    <p className="text-end">{Number(shipingCost)}৳</p>
                  </Col>
                  {/* <Col lg={6} xl={4}>
                    <button className="btn discount_card" onClick={() => {
                      Swal.fire({
                        title: 'Enter Coupon Code',
                        input: 'text',
                        inputPlaceholder: 'Your Coupon Code',
                        confirmButtonColor: '#09b3d4',
                        confirmButtonText: 'Apply',
                      }).then((result) => {
                        if (result.isConfirmed) {
                          console.log('coupon applied');
                          axios.post("pos/coupon-apply/",
                            { coupon: result.value, sub_total: subtotal })
                            .then(function (resp) {
                              console.log(resp.data);
                              if (resp.data.success) {
                                successNotify('Coupon Applied Successfully');
                                setCouponAmount(resp.data.data.coupon_discount);
                                setCouponId(resp.data.data.coupon_id);
                              } else {
                                errorNotify(resp.data.message);
                              }
                            })
                            .catch((err) => {
                              console.log(err);
                            });
                        }
                      })
                    }}>
                      <img src={tag_icon} alt="coupon" width='30' /><br />
                      Coupon
                    </button>
                  </Col>
                  <Col lg={6} xl={4}>
                    <button className="btn discount_card" onClick={() => {
                      Swal.fire({
                        title: 'Apply Discount',
                        html: `<b className="mb-2">Select discount type</b> <br>
                                  <div className="form-check form-check-inline">
                                    <input className="form-check-input discount_type" type="radio" name="type" id="fixed" value="fixed">
                                    <label className="form-check-label" for="fixed">Fixed</label>
                                  </div>
                                  <div className="form-check form-check-inline">
                                    <input className="form-check-input discount_type" type="radio" name="type" id="percentage" value="percentage">
                                    <label className="form-check-label" for="percentage">Percentage</label>
                                  </div>
                                `,
                        input: 'number',
                        inputPlaceholder: 'Enter Discount Amount',
                        inputAttributes: {
                          min: '0',
                          step: 0.1,
                        },
                        confirmButtonColor: '#09b3d4',
                        confirmButtonText: 'Apply',
                      }).then((result) => {
                        if (result.isConfirmed) {
                          axios.post("pos/discount/" + Swal.getHtmlContainer().querySelector("input[name='type']:checked").value,
                            { discount_amount: result.value, subtotal: subtotal })
                            .then(function (resp) {
                              if (resp.data.success) {
                                // console.log(resp.data.data.discounted_amount);
                                successNotify('Discount Applied Successfully');
                                setDiscount(resp.data.data.discounted_amount);
                              }
                              else {
                                errorNotify(resp.data.message);
                              }
                            })
                            .catch((err) => {
                              console.log(err);
                            });
                        }
                      })
                    }}>
                      <img src={discount_icon} alt="discount" width='30' /><br />
                      Discount
                    </button>
                  </Col>
                  <Col lg={6} xl={4}>
                    <button className="btn discount_card" onClick={() => {
                      Swal.fire({
                        title: 'Enter Order Comment',
                        input: 'text',
                        inputPlaceholder: 'Order Comment',
                        confirmButtonColor: '#09b3d4',
                        confirmButtonText: 'Add',
                        showCancelButton: true,
                      }).then((result) => {
                        if (result.isConfirmed) {
                          // axios.post("pos/coupon-apply/",
                          //   { coupon: result.value, sub_total: subtotal })
                          //   .then(function (resp) {
                          //     if (resp.data.success) {
                          //       // console.log(resp.data);
                          //       successNotify('Coupon Applied Successfully');
                          //       setCouponAmount(resp.data.data.coupon_discount);
                          //       setCouponId(resp.data.data.coupon_id);
                          //     } else {
                          //       errorNotify(resp.data.message);
                          //     }
                          //   })
                          //   .catch((err) => {
                          //     console.log(err);
                          //   });
                          infoNotify('This feature is upcoming');
                        }
                      })
                    }}>
                      <svg viewBox="64 64 896 896" focusable="false" data-icon="pause" width="1.5em" height="1.9em" fill="currentColor" aria-hidden="true"><path d="M304 176h80v672h-80zm408 0h-64c-4.4 0-8 3.6-8 8v656c0 4.4 3.6 8 8 8h64c4.4 0 8-3.6 8-8V184c0-4.4-3.6-8-8-8z"></path></svg>
                      <br />
                      Hold Order
                    </button>
                  </Col> */}
                  <Col md={12}>
                    <select className="form-control ms-1 mt-3" name="shipping_city" title="Select Shipping Zone" required
                      value={city}
                      onChange={(e) => { setCity(e.target.value); }}>
                      <option selected>Select Shipping Zone</option>
                      <option value="inside_dhaka">Inside Dhaka{'- ' + insideShiCharge}</option>
                      <option value="outside_dhaka">Outside Dhaka{'- ' + outsideShiCharge}</option>
                    </select>
                  </Col>
                  <Col md={12}>
                    <select className="form-control ms-1 mt-3" name="payment_method" title="Payment Method" required
                      value={paymentMethod}
                      onChange={(e) => { setPaymentMethod(e.target.value); setBkashTId(null); }}>
                      <option selected >Payment Method
                      </option>
                      <option value="cod">Cash On Delivery</option>
                      <option value="ssl">SSL Commerez</option>
                      <option value="bkash-merchant">bKash Merchant</option>
                    </select>
                  </Col>
                  {paymentMethod && paymentMethod==='bkash-merchant' && (
                    <Col md={12}>
                    <div className="ms-1">
                      <label className="pt-2 mb-1">bKash Trans. Id</label>
                      <input type="text" className="form-control" placeholder="If customer already paid please insert the transaction id" name="bKash_tran_id" value={bkashTId}
                        onChange={(e) => { setBkashTId(e.target.value); }} />
                    </div>
                  </Col>
                  )}
                  <Col md={12}>
                    <div className="ms-1">
                      <label className="pt-2 mb-1">Order Notes </label>
                      <textarea className="form-control" placeholder="Oder Notes" name="order_note" value={orderNote}
                        onChange={(e) => { setOrderNote(e.target.value); }} />
                    </div>
                  </Col>
                </Row><br />
                <button className="btn cart_order_btn mb-2" onClick={() => {
                  checkOutSubmit();
                }}>
                  <p className="text-start ps-4 pt-2">Proceed To Order
                    <br />
                    <i>{totalUniqueItems} Items</i>
                  </p>
                  <p>{Number(grandTotal).toFixed(2)}৳&nbsp;
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

export default React.memo(Home);
