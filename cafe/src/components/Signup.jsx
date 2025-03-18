import React,{useState} from 'react'
import Navbar from './Navbar'
import signup from '../assets/signup.jpg';
import {useNavigate} from 'react-router-dom';
export default function Signup() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  })
  const navigate = useNavigate();
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleSubmit = async(e)=>{
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8080/signup',{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })
      const data = await response.json();
      if(response.ok){
        alert('Sign up successfull!');
        console.log('Server Response:', data);
        navigate('/');
      }else {
        alert(data.error || 'Signup Failed');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Something went wrong.');
    }
  }
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

                <p className="text-center h1 fw-bold mb-5 mx-1 mx-md-4 mt-4">Sign up</p>

                <form className="mx-1 mx-md-4" onSubmit={handleSubmit}>

                  <div className="d-flex flex-row align-items-center mb-4">
                    <i className="fas fa-user fa-lg me-3 fa-fw"></i>
                    <div data-mdb-input-init className="form-outline flex-fill mb-0">
                      <input type="text" id="form3Example1c" className="form-control" value={formData.username} onChange={handleChange} name='username'/>
                      <label className="form-label" htmlFor="form3Example1c">Your Name</label>
                    </div>
                  </div>

                  <div className="d-flex flex-row align-items-center mb-4">
                    <i className="fas fa-envelope fa-lg me-3 fa-fw"></i>
                    <div data-mdb-input-init className="form-outline flex-fill mb-0">
                      <input type="email" id="form3Example3c" className="form-control" value={formData.email} onChange={handleChange} name='email'/>
                      <label className="form-label" htmlFor="form3Example3c">Your Email</label>
                    </div>
                  </div>

                  <div className="d-flex flex-row align-items-center mb-4">
                    <i className="fas fa-lock fa-lg me-3 fa-fw"></i>
                    <div data-mdb-input-init className="form-outline flex-fill mb-0">
                      <input type="password" id="form3Example4c" className="form-control" value={formData.password} onChange={handleChange} name='password'/>
                      <label className="form-label" htmlFor="form3Example4c">Password</label>
                    </div>
                  </div>


                  <div className="form-check d-flex justify-content-center mb-5">
                    <label className="form-check-label" for="form2Example3">
                      Already have an account?<a href="/login" style={{color:'#b34a5d',textDecoration:'none'}}>Login here</a>
                    </label>
                  </div>

                  <div className="d-flex justify-content-center mx-4 mb-3 mb-lg-4">
                    <button  type="submit" data-mdb-button-init data-mdb-ripple-init className="btn btn-success btn-lg">Register</button>
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
