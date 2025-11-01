import React from "react";
import "./Login.css";
import assets from "../../assets/assets";
import { useState  } from "react";
import { useNavigate } from "react-router-dom";

import { signup  , login , resetPass} from "../../congif/firebase";

const Login = () => {

  const navigate = useNavigate()

  const [currState, setCurrState] = useState("Sign Up");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleClick = () => {
    if (currState === "Sign Up") {
      setCurrState("Login");
    } else {
      setCurrState("Sign Up");
    }
  };

  const onSubmitHandler =(event)=>{
    event.preventDefault();
    if(currState === "Sign Up"){
      signup(username,email,password)
    }else{
      login(email , password)
      navigate('/')
    }
  }

  return (
    <div className="login">
      <img className="logo" src={assets.logo_big} alt="" />

      <form action="" className="login-form" onSubmit={onSubmitHandler}>
        <h2>{currState}</h2>
        {currState === "Sign Up" ? (
          <input
            onChange={(e) => setUsername(e.target.value)}
            value={username}
            type="text"
            className="form-input"
            placeholder="Enter Username"
            required
          />
        ) : null}

        <input
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          type="email"
          className="form-input"
          placeholder="Enter Email"
          required
        />
        <input
          onChange={(e) => setPassword(e.target.value)}
          value={password}
          type="password"
          className="form-input"
          placeholder="Enter Password"
          required
        />
        <button type="submit">
          {currState === "Sign Up" ? "Create Account" : "Login"}
        </button>

        <div className="login-term">
          <input type="checkbox" required />
          <p>Agree to the terms of use & privacy policy.</p>
        </div>

        <div className="login-forgot">
          {currState === "Sign Up" ? (
            <p className="login-toggle">
              Already have an account
              <span onClick={handleClick}>Click Here</span>
            </p>
          ) : (
            <p className="login-toggle">
              Don't have an account<span onClick={handleClick}>Click Here</span>
            </p>
          )}
          {currState == "Login" ? <p className="login-toggle">
              Forgot Password<span onClick={()=>resetPass(email)}>Reset</span>
            </p> : null}
        </div>
      </form>
    </div>
  );
};

export default Login;
