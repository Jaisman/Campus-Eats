import React,{useState} from 'react'
import Navbar from './Navbar';
import { useNavigate } from 'react-router-dom';
import signup from '../assets/signup.jpg';
export default function Login() {
  const [formData, setFormData] = useState({
    email:'',
    password:''
  });
  const navigate = useNavigate();
  const handleChange = (e)=>{
    setFormData({...formData,[e.target.name]:e.target.value});
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8080/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      console.log(data);
      if (response.ok) {
        localStorage.setItem("role",data.user.role);
        localStorage.setItem("authToken", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        alert('Login successful!');
        console.log('Login successful!');
        navigate('/');
      } else {
        alert('Login failed! Please try again');
        console.error(data.error);
      }
    } catch (error) {
      console.error("An error occurred during login:", error);
      alert("An unexpected error occurred. Please try again later.");
    }
  };
  
  return (
    <div style={{position:'relative',minHeight:'100vh'}}>
      <div
              style={{
                backgroundImage: `url(${signup})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                filter: 'brightness(0.6)',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: -1 
              }}
            />
      <Navbar/>
            <section >
        <div>
          <div className="row d-flex justify-content-center align-items-center">
            <div className="col-lg-12 col-xl-11">
              <div>
                <div className="card-body p-md-5">
                  <div className="row justify-content-center">
                    <div className="col-md-10 col-lg-6 col-xl-5 order-2 order-lg-1">
      
                      <p className="text-center h1 fw-bold mb-5 mx-1 mx-md-4 mt-4">Login</p>
      
                      <form className="mx-1 mx-md-4" onSubmit={handleSubmit}>
      
      
                        <div className="d-flex flex-row align-items-center mb-4">
                          <i className="fas fa-envelope fa-lg me-3 fa-fw"></i>
                          <div data-mdb-input-init className="form-outline flex-fill mb-0">
                            <input type="email" id="form3Example3c" className="form-control" name='email' onChange={handleChange} value={formData.email}/>
                            <label className="form-label" for="form3Example3c">Your Email</label>
                          </div>
                        </div>
      
                        <div className="d-flex flex-row align-items-center mb-4">
                          <i className="fas fa-lock fa-lg me-3 fa-fw"></i>
                          <div data-mdb-input-init className="form-outline flex-fill mb-0">
                            <input type="password" id="form3Example4c" className="form-control" name='password' onChange={handleChange} value={formData.password} />
                            <label className="form-label" for="form3Example4c">Password</label>
                          </div>
                        </div>
      
      
                        <div className="form-check d-flex justify-content-center mb-5">
                          
                          <label className="form-check-label" for="form2Example3">
                            Do not have an account?<a href="/signup" style={{color:'#b34a5d',textDecoration:'none'}}>Register here</a>
                          </label>
                        </div>
      
                        <div className="d-flex justify-content-center mx-4 mb-3 mb-lg-4">
                          <button  type="submit" data-mdb-button-init data-mdb-ripple-init className="btn btn-success btn-lg">Login</button>
                        </div>
      
                      </form>
      
                    </div>
                    
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
