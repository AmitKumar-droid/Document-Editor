import React, { useState } from 'react';
import mslogo from "../images/mslogo.png";
import { IoEye } from "react-icons/io5";
import { MdEmail, MdOutlineWifiPassword } from "react-icons/md";
import { Link, useNavigate } from 'react-router-dom';
import rightIMG from "../images/loginRight.png";
import { api_base_url } from '../Helper';

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [error, setError] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // For disabling the button during submission

  const togglePasswordVisibility = () => {
    setShowPwd((prev) => !prev);
  };

  const login = (e) => {
    e.preventDefault();
    setIsLoading(true); // Start loading state

    fetch(api_base_url + "/login", {
      mode: "cors",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: pwd,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setIsLoading(false); // Stop loading state

        if (data.success === true) {
          localStorage.setItem("token", data.token);
          localStorage.setItem("isLoggedIn", true);
          localStorage.setItem("userId", data.userId);
          setTimeout(() => {
            navigate("/");
          }, 100);
        } else {
          setError(data.message);
        }
      })
      .catch(() => {
        setIsLoading(false); // Stop loading state on error
        setError("An error occurred. Please try again.");
      });
  };

  return (
    <div className="flex overflow-hidden items-center w-screen justify-center flex-col h-screen bg-[#946767]">
      <div className="flex w-full items-center">
        <div className="left w-[30%] flex flex-col ml-[100px]">
          <img className="w-[80px]" src={mslogo} alt="Logo" />
          <form onSubmit={login} className="pl-3 mt-5">

            <div className="inputCon">
              <p className="text-[14px] text-[#121212]">Email</p>
              <div className="inputBox w-[100%]">
                <i><MdEmail /></i>
                <input
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                  type="email"
                  placeholder="Email"
                  id="Email"
                  name="Email"
                  required
                  aria-label="Email Address"
                />
              </div>
            </div>

            <div className="inputCon">
              <p className="text-[14px] text-[#161616]">Password</p>
              <div className="inputBox w-[100%]">
                <i><MdOutlineWifiPassword /></i>
                <input
                  onChange={(e) => setPwd(e.target.value)}
                  value={pwd}
                  type={showPwd ? "text" : "password"}
                  placeholder="Password"
                  id="Password"
                  name="Password"
                  required
                  aria-label="Password"
                />
                <i
                  className="cursor-pointer !mr-3 !text-[25px]"
                  onClick={togglePasswordVisibility}
                >
                  <IoEye />
                </i>
              </div>
            </div>

            {error && <p className="text-red-500 text-[14px] my-2">{error}</p>}
            <p>
              Don't have an account?{" "}
              <Link to="/signUp" className="text-blue-500">
                Sign Up
              </Link>
            </p>

            <button
              type="submit"
              className="p-[10px] bg-green-500 transition-all hover:bg-green-600 text-white rounded-lg w-full border-0 mt-3"
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Login"}
            </button>
          </form>
        </div>
        <div className="right flex items-end justify-end">
          <img className="w-[35vw]" src={rightIMG} alt="Login" />
        </div>
      </div>
    </div>
  );
};

export default Login;
