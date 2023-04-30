import React from 'react'
// import Footer from './Footer';
import Header from './Header';
import { Container, Row, Col } from 'react-bootstrap';
import { ToastContainer } from 'react-toastify';

const Layout = ({ children }) => {

    return (
        <Container fluid className='pos_container'>

            <ToastContainer />
            <Row className='justify-content-center'>
                <Col lg={12}>
                    <Header />
                    {/* <div className='d-flex flex-column min-vh-100' style={{marginLeft: '150px'}}>
                    {children}
                </div> */}
                    <div className="d-flex flex-column body_container">
                        {children}
                    </div>
                </Col>
            </Row>
        </Container>
    )
}
export default React.memo(Layout);