// OrdersPage.js
import React, {useEffect} from 'react';
import Navbar from './Navbar';
import { useOrders } from '../context/OrdersContext';
import home_i1 from '../assets/home_i1.jpg';
import { useNavigate } from 'react-router-dom';
const OrdersPage = () => {
  const { orders, removeOrder } = useOrders();
  const navigate = useNavigate();
  useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const user = storedUser ? JSON.parse(storedUser) : null;
        if (!user || user.role !== 'admin') {
        navigate('/');
        }
      }, [navigate]);
  const handleSendEmail = async(orderId, email)=>{
      try {
            const response = await fetch('http://localhost:8080/send-order-email',{
                  method:'POST',
                  headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ orderId, email }),
            })
            const data = await response.json();
            if(response.ok){
                  alert(`Email sent successfully to ${email}`);
                  removeOrder(orderId);
            }else{
                  alert(`Failed to send email to ${email}. Error: ${data.message}`);
            }
      } catch (error) {
            console.error('Error sending email',error);
            alert('Failed to send email. Please try again later.');
      }
  }

  return (
    <div style={{position:'relative',minHeight:'100vh'}}>
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
          zIndex: -1 // ensures it's behind the content
        }}
      />
      <Navbar />
      <div>
      <div className="container mt-4">
        <h1 className="mb-4 text-center text-white">Customer Orders</h1>
        <div className="row">
          {orders.length === 0 ? (
            <p className="text-center">No orders yet.</p>
          ) : (
            orders.map(order => (
              <div className="col-lg-6 mb-4" key={order.id}>
                <div className="card">
                  <div className="card-header text-white" style={{backgroundColor:'#c0b156'}}>
                    <h5 className="mb-0">Order #{order.id}</h5>
                  </div>
                  <div className="card-body">
                    <div className="mb-3">
                      <h6 className="fw-bold">Customer Information</h6>
                      <p className="mb-1">
                        <strong>Name:</strong> {order.user.name}
                      </p>
                      <p className="mb-0">
                        <strong>Email:</strong> {order.user.email}
                      </p>
                    </div>
                    <h6 className="fw-bold">Order Items</h6>
                    <table className="table table-sm table-striped">
                      <thead>
                        <tr>
                          <th>Item</th>
                          <th>Quantity</th>
                        </tr>
                      </thead>
                      <tbody>
                        {order.items.map((item, index) => (
                          <tr key={index}>
                            <td>{item.name}</td>
                            <td>{item.quantity}</td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr>
                          <td className="fw-bold">Total Items:</td>
                          <td className="fw-bold">
                            {order.items.reduce((sum, item) => sum + item.quantity, 0)}
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                    <button className='btn btn-success' onClick={()=>handleSendEmail(order.id, order.user.email)}>Send email</button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      </div>
    </div>
  );
};

export default OrdersPage;
