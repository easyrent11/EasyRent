import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Logo from './Logo';
import Login from './Login';
import Register from './Register';

export default function NavBar() {
  const [loginState, setLoginState] = useState(false);
  const [registerState, setRegisterState] = useState(false);

  function handleLoginClick() {
    setLoginState(true);
  }

  function handleRegisterClick(){
    setRegisterState(true);
  }

  function handleLoginClose() {
    setLoginState(false);
  }

  function handleRegisterClose() {
    setRegisterState(false);
  }

  return (
    <>
      <nav className="flex justify-between items-center w-full p-1 m-1">
        <Logo />
        <div className="flex items-center justify-center w-1/2">
          <button className="m-2 hover:text-[#CC6200]" onClick={handleLoginClick}>Login</button>
          <button className="m-2 hover:text-[#CC6200]" onClick={handleRegisterClick}>Register</button>

          <Link className="m-2 hover:text-[#CC6200] " to="/">
            Home
          </Link>
          <Link className="m-2 hover:text-[#CC6200] hover:border-b-2 border-black" to="/about">
            About
          </Link>
          <Link className="m-2 hover:text-[#CC6200] hover:border-b-2 border-black" to="/contact">
            Contact
          </Link>
        </div>
      </nav>

      {loginState && <Login handleClose={handleLoginClose} />}
      {registerState && <Register handleRegisterClose={handleRegisterClose} />}
    </>
  );
}