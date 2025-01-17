import React, { useEffect, useState } from 'react';
import mslogo from "../images/mslogo.png";
import { RiSearchLine } from "react-icons/ri";
import Avatar from 'react-avatar';
import { api_base_url } from '../Helper';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [error, setError] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true); // Loading state for fetching user
  const navigate = useNavigate();

  const getUser = () => {
    setLoading(true); // Set loading to true when starting the fetch
    fetch(api_base_url + "/getUser", {
      mode: "cors",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: localStorage.getItem("userId"),
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setLoading(false); // Set loading to false after response
        if (data.success === false) {
          setError(data.message);
        } else {
          setData(data.user);
        }
      })
      .catch((error) => {
        setLoading(false);
        setError("Failed to fetch user data.");
      });
  };

  const logout = () => {
    fetch(api_base_url + "/logout", {
      mode: "cors",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: localStorage.getItem("userId"),
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success === false) {
          setError(data.message);
        } else {
          localStorage.removeItem("userId");
          localStorage.removeItem("token");
          localStorage.removeItem("isLoggedIn");
          navigate("/login");
        }
      })
      .catch((error) => {
        setError("Error logging out. Please try again.");
      });
  };

  useEffect(() => {
    getUser();
  }, []);

  return (
    <>
      <div className="navbar flex items-center px-4 md:px-[100px] h-[90px] justify-between bg-[#9b5c5c]">
        <img src={mslogo} alt="Logo" className="logo w-[80px] h-[80px]" />

        <div className="right flex items-center justify-end gap-4 md:gap-2 w-full md:w-auto">
          {/* Search bar */}
          <div className="inputBox flex items-center w-full max-w-[300px] md:w-[30vw]">
            <i><RiSearchLine /></i>
            <input type="text" placeholder="Search Here..." className="w-full p-2 border rounded-md" />
          </div>

          {/* Error message */}
          {error && <p className="text-red-500 text-sm">{error}</p>}

          {/* Logout button */}
          <button
            onClick={logout}
            className="p-2 min-w-[120px] bg-red-500 text-white rounded-lg border-0 transition-all hover:bg-red-600"
          >
            Logout
          </button>

          {/* Avatar */}
          {loading ? (
            <div className="loader text-center">Loading...</div> // Loader during fetching user
          ) : (
            <Avatar
              name={data ? data.name : "User"}
              className="cursor-pointer"
              size="40"
              round="50%"
            />
          )}
        </div>
      </div>
    </>
  );
};

export default Navbar;
