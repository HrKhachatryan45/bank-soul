import React from 'react';
import Navbar from "../components/Navbar";
import 'bootstrap/dist/css/bootstrap.min.css';
import Carousel from "react-bootstrap/Carousel";
import Footer from "../components/Footer";

function Home(props) {
    return (
        <div className="homePage">
            <Navbar/>

            <Carousel fade>
                <Carousel.Item interval={3000}>
                    <div className="carS" style={{ background: "url(../images/car1.jpg)", backgroundSize: 'cover', backgroundPosition: 'center', height: '100vh' }}>
                        <div className="carousel-content">
                            <h1>Welcome to Our Bank</h1>
                            <p>Secure. Reliable. Trusted.</p>
                            <button>Learn More</button>
                        </div>
                    </div>
                </Carousel.Item>

                <Carousel.Item interval={3000}>
                    <div className="carS" style={{ background: "url(../images/car2.jpg)", backgroundSize: 'cover', backgroundPosition: 'center', height: '100vh' }}>
                        <div className="carousel-content">
                            <h1>Grow with Confidence</h1>
                            <p>Financial solutions for your future.</p>
                            <button>Get Started</button>
                        </div>
                    </div>
                </Carousel.Item>
            </Carousel>

            <section className="features">
                <div className="feature">
                    <h2>Fast Account Setup</h2>
                    <p>Open your account in minutes — all online.</p>
                </div>
                <div className="feature">
                    <h2>24/7 Support</h2>
                    <p>We're always here to help you.</p>
                </div>
                <div className="feature">
                    <h2>Secure Transactions</h2>
                    <p>End-to-end encryption for your peace of mind.</p>
                </div>
            </section>

            <section className="whyChoose">
                <h2>Why Choose Our Bank?</h2>
                <ul>
                    <li>No hidden fees, ever.</li>
                    <li>Instant transfers and payments.</li>
                    <li>Real-time alerts and fraud protection.</li>
                </ul>
            </section>

            <section className="services">
                <h2>Our Services</h2>
                <div className="service-grid">
                    <div className="service-card">
                        <h3>Savings Accounts</h3>
                        <p>Earn interest with flexible plans designed for every goal.</p>
                    </div>
                    <div className="service-card">
                        <h3>Loans</h3>
                        <p>From personal to business, get funding that fits your needs.</p>
                    </div>
                    <div className="service-card">
                        <h3>Investments</h3>
                        <p>Diversify with expert-guided options and real growth potential.</p>
                    </div>
                </div>
            </section>

            <section className="testimonials">
                <h2>What Our Customers Say</h2>
                <div className="testimonial">
                    <p>"The mobile banking app is amazing — everything's just a tap away!"</p>
                    <span>- Sarah M.</span>
                </div>
                <div className="testimonial">
                    <p>"I switched from a big bank and never looked back. Excellent service!"</p>
                    <span>- James L.</span>
                </div>
            </section>

            <section className="cta">
                <h2>Bank Smarter, Live Better</h2>
                <p>Join thousands of happy users building a stronger financial future with us.</p>
                <button>Explore Our Products</button>
            </section>
            <Footer/>
        </div>
    );
}

export default Home;
