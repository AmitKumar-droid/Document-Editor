import React, { useState } from 'react';
import mslogo from "../images/mslogo.png";
import { FaUser, FaPhone } from "react-icons/fa";
import { IoEye } from "react-icons/io5";
import { MdEmail, MdOutlineWifiPassword } from "react-icons/md";
import nameTag from "../images/nameTag.png";
import { Link, useNavigate } from 'react-router-dom';
import rightIMG from "../images/signUpRight.png";
import { api_base_url } from '../Helper';

const SignUp = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [pwd, setPwd] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState("");

  const togglePasswordVisibility = () => {
    setShowPwd((prev) => !prev);
  };

  const createUser = (e) => {
    e.preventDefault();
    if (!username || !name || !email || !phone || !pwd) {
      setError("All fields are required.");
      return;
    }

    fetch(api_base_url + "/signUp", {
      mode: "cors",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        name,
        email,
        phone,
        password: pwd,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success === false) {
          setError(data.message);
        } else {
          navigate("/login");
        }
      });
  };

  return (
    <div className="flex items-center justify-center w-full min-h-screen bg-[#8f6868]">
      <div className="flex flex-col md:flex-row w-full max-w-screen-xl">
        {/* Left Section - SignUp Form */}
        <div className="left flex flex-col w-full md:w-[50%] p-6">
          <img className="w-[80px] h-[80px] mx-auto" src={mslogo} alt="Logo" />
          <form onSubmit={createUser} className="mt-5">
            <div className="inputCon mb-4">
              <p className="text-[14px] text-[#121111]">Username</p>
              <div className="inputBox flex items-center border-b-2 border-gray-300 py-2">
                <i><FaUser /></i>
                <input
                  onChange={(e) => setUsername(e.target.value)}
                  value={username}
                  type="text"
                  placeholder="Username"
                  className="w-full pl-2 outline-none"
                  required
                />
              </div>
            </div>

            <div className="inputCon mb-4">
              <p className="text-[14px] text-[#131212]">Name</p>
              <div className="inputBox flex items-center border-b-2 border-gray-300 py-2">
                <i><img src={nameTag} alt="Name" className="w-5 h-5" /></i>
                <input
                  onChange={(e) => setName(e.target.value)}
                  value={name}
                  type="text"
                  placeholder="Name"
                  className="w-full pl-2 outline-none"
                  required
                />
              </div>
            </div>

            <div className="inputCon mb-4">
              <p className="text-[14px] text-[#0f0e0e]">Email</p>
              <div className="inputBox flex items-center border-b-2 border-gray-300 py-2">
                <i><MdEmail /></i>
                <input
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                  type="email"
                  placeholder="Email"
                  className="w-full pl-2 outline-none"
                  required
                />
              </div>
            </div>

            <div className="inputCon mb-4">
              <p className="text-[14px] text-[#141414]">Phone</p>
              <div className="inputBox flex items-center border-b-2 border-gray-300 py-2">
                <i><FaPhone /></i>
                <input
                  onChange={(e) => setPhone(e.target.value)}
                  value={phone}
                  type="phone"
                  placeholder="Phone"
                  className="w-full pl-2 outline-none"
                  required
                />
              </div>
            </div>

            <div className="inputCon mb-4">
              <p className="text-[14px] text-[#141414]">Password</p>
              <div className="inputBox flex items-center border-b-2 border-gray-300 py-2">
                <i><MdOutlineWifiPassword /></i>
                <input
                  onChange={(e) => setPwd(e.target.value)}
                  value={pwd}
                  type={showPwd ? "text" : "password"}
                  placeholder="Password"
                  className="w-full pl-2 outline-none"
                  required
                />
                <i className="cursor-pointer ml-3 text-[20px]" onClick={togglePasswordVisibility}>
                  <IoEye />
                </i>
              </div>
            </div>

            {error && <p className="text-red-500 text-[14px] my-2">{error}</p>}

            <p className="text-center mb-4">Already have an account? <Link to="/login" className="text-blue-500">Login</Link></p>

            <button className="p-3 bg-green-500 hover:bg-green-600 text-white rounded-lg w-full border-0 transition-all">
              Sign Up
            </button>
          </form>
        </div>

        {/* Right Section - Image */}
        <div className="right w-full md:w-[50%] flex justify-center items-center bg-[#2d1c1c]">
          <img className="w-[80%] md:w-[60%] max-w-[600px] rounded-lg" src={rightIMG} alt="Signup Illustration" />
        </div>
      </div>
    </div>
  );
};

export default SignUp;
