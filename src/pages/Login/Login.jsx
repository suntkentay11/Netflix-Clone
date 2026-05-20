import React, { useState } from 'react'
import './Login.css'
import logo from '../../assets/logo.png'
import { useNavigate } from 'react-router-dom'
import { auth, login, signup } from '../../firebase.js'

const Login = () => {
  const navigate = useNavigate();

  const [showSignupModal, setShowSignupModal] = useState(false);

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await login(loginEmail, loginPassword);
      navigate("/profiles");
    } catch (error) {
      console.error(error);

      if (error.code === "auth/user-not-found" || error.code === "auth/invalid-credential") {
        const shouldSignup = window.confirm("No account found with these credentials. Would you like to sign up?");
        if (shouldSignup) {
          setShowSignupModal(true);
        }
      } else {
        alert(error.message);
      }
    }
  }

  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      const newUser = await signup(name, email, password);

      localStorage.setItem(`netflixUserName_${newUser.uid}`, name);
      localStorage.removeItem(`profiles_${newUser.uid}`);
      localStorage.removeItem("activeProfile");

      setShowSignupModal(false);
      navigate("/profiles");
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };
  
  return (
    <div className='login'>
      <div className="logo">
        <img src={logo} className="login__logo" alt="Netflix Logo" />
      </div>
      <div className="login__box">
        <h1>Sign In</h1>
        <form onSubmit={handleLogin}>
          <input type="email" placeholder="Email" value={loginEmail}
          onChange={(e) => setLoginEmail(e.target.value)} />
          <input type="password" placeholder="Password" value={loginPassword}
          onChange={(e) => setLoginPassword(e.target.value)} />
          <button type="submit">Sign In</button>
        </form>
        <div className="form-help">
          <div className="remember">
            <input type="checkbox" className="remember__checkbox" />
            <label htmlFor="remember">Remember me</label>
          </div>
          <p>Need Help?</p>
        </div>
        <div className="login__signup">
        <p>New to Netflix? <span onClick={() => setShowSignupModal(true)}>Get Started</span></p>
      </div>
      </div>

      {showSignupModal && (
        <div className="signup-modal__overlay" onClick={() => setShowSignupModal(false)}>
          <div className="signup-modal" onClick={(e) => e.stopPropagation()}>
            <button className="signup-modal__close" onClick={() => setShowSignupModal(false)}>X</button>
            <h2>Create Account</h2>
            <form onSubmit={handleSignup}>
              <input type="text" placeholder="Name"
              value={name} onChange={(e) => setName(e.target.value)} />
              <input type="email" placeholder="Email"
              value={email} onChange={(e) => setEmail(e.target.value)} />
              <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
              <button type="submit" className='signup-modal__button'>Create Account</button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Login