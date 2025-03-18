import React, { useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, ListGroup } from 'react-bootstrap';
import Navbar from './Navbar';
import { useCart } from '../context/CartContext';
import { useOrders } from '../context/OrdersContext';
import { useNavigate } from 'react-router-dom';
import home_i1 from '../assets/home_i1.jpg';

const FoodCartPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem('user')) {
      navigate('/menu');
    }
  }, [navigate]);

  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();
  const { addOrder } = useOrders();

  const storedUser = localStorage.getItem('user');
  const user = storedUser ? JSON.parse(storedUser) : {};

  // Calculate totals
  const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
  const tax = subtotal * 0.08;
  const deliveryFee = 3.99;
  const total = subtotal + tax + deliveryFee;

  // Handle checkout button click
  const handleCheckout = () => {
    if (cart.length === 0) {
      alert("Your cart is empty!");
      return;
    }
    const order = {
      id: Date.now(),
      user: {
        name: user.username || "Unknown",
        email: user.email || "unknown@example.com"
      },
      items: cart.map((item) => ({
        name: item.name,
        quantity: item.quantity
      }))
    };
    console.log("Adding order", order);
    addOrder(order);
    clearCart();
    alert('Order has been added to the queue. You will be notified shortly.');
    navigate('/orders');
  };

  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      {/* Background Layer */}
      <div
        style={{
          backgroundImage: `url(${home_i1})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          filter: 'brightness(0.7)',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: -1,
        }}
      />

      {/* Foreground Content */}
      <Navbar />
      <Container className="py-5">
        <h1 className="mb-4 text-center" style={{ color: 'white', textShadow: '1px 1px 2px rgba(0,0,0,0.6)' }}>
          Your Food Cart
        </h1>
        <Row>
          {/* Cart Items Section */}
          <Col md={8}>
            <Card className="mb-4">
              <Card.Header>
                <Row className="fw-bold">
                  <Col md={6}>Item</Col>
                  <Col md={2} className="text-center">Price</Col>
                  <Col md={2} className="text-center">Quantity</Col>
                  <Col md={2} className="text-center">Total</Col>
                </Row>
              </Card.Header>
              <Card.Body>
                {cart.length === 0 ? (
                  <div className="text-center py-4">
                    <h5>Your cart is empty</h5>
                    <Button variant="primary" className="mt-3" onClick={() => navigate('/menu')}>
                      Browse Menu
                    </Button>
                  </div>
                ) : (
                  cart.map((item) => (
                    <Row key={item.id} className="mb-3 py-3 border-bottom align-items-center">
                      <Col md={6} className="d-flex align-items-center">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="me-3"
                          style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                        />
                        <div>
                          <h6 className="mb-0">{item.name}</h6>
                          <Button variant="link" className="text-danger p-0" onClick={() => removeFromCart(item.id)}>
                            Remove
                          </Button>
                        </div>
                      </Col>
                      <Col md={2} className="text-center">${item.price.toFixed(2)}</Col>
                      <Col md={2}>
                        <div className="d-flex justify-content-center align-items-center">
                          <Button
                            variant="outline-secondary"
                            size="sm"
                            onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                          >
                            -
                          </Button>
                          <Form.Control
                            size="sm"
                            type="number"
                            value={item.quantity}
                            onChange={(e) => {
                              const value = parseInt(e.target.value);
                              if (!isNaN(value) && value > 0) {
                                updateQuantity(item.id, value);
                              }
                            }}
                            min="1"
                            className="text-center mx-2"
                            style={{ width: '50px' }}
                          />
                          <Button
                            variant="outline-secondary"
                            size="sm"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            +
                          </Button>
                        </div>
                      </Col>
                      <Col md={2} className="text-center">${(item.price * item.quantity).toFixed(2)}</Col>
                    </Row>
                  ))
                )}
              </Card.Body>
            </Card>
            <Card className="mb-4">
              <Card.Body>
                <h5>Special Instructions</h5>
                <Form.Control as="textarea" rows={3} placeholder="Add notes about your order, delivery preferences, allergies, etc." />
              </Card.Body>
            </Card>
          </Col>
          {/* Order Summary Section */}
          <Col md={4}>
            <Card className="mb-4">
              <Card.Header>
                <h5 className="mb-0">Order Summary</h5>
              </Card.Header>
              <Card.Body>
                <ListGroup variant="flush">
                  <ListGroup.Item className="d-flex justify-content-between">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </ListGroup.Item>
                  <ListGroup.Item className="d-flex justify-content-between">
                    <span>Tax</span>
                    <span>${tax.toFixed(2)}</span>
                  </ListGroup.Item>
                  <ListGroup.Item className="d-flex justify-content-between">
                    <span>Delivery Fee</span>
                    <span>${deliveryFee.toFixed(2)}</span>
                  </ListGroup.Item>
                  <ListGroup.Item className="d-flex justify-content-between fw-bold">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </ListGroup.Item>
                </ListGroup>
              </Card.Body>
              <Card.Footer className="bg-white">
                <Button variant="success" size="lg" className="w-100" onClick={handleCheckout}>
                  Proceed to Checkout
                </Button>
              </Card.Footer>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default FoodCartPage;
