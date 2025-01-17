import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { BsPlusLg } from "react-icons/bs";
import Docs from '../components/Docs';
import { MdOutlineTitle } from "react-icons/md";
import { api_base_url } from '../Helper';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const [isCreateModelShow, setIsCreateModelShow] = useState(false);
  const [title, setTitle] = useState("");
  const [error, setError] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false); // Loading state for fetching documents

  const navigate = useNavigate();

  const createDoc = () => {
    if (!title) {
      setError("Please enter a title");
      return;
    }

    setLoading(true); // Start loading while creating the document

    fetch(api_base_url + "/createDoc", {
      mode: "cors",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        docName: title,
        userId: localStorage.getItem("userId"),
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setLoading(false); // Stop loading after response
        if (data.success) {
          setIsCreateModelShow(false);
          navigate(`/createDocs/${data.docId}`);
        } else {
          setError(data.message);
        }
      })
      .catch((err) => {
        setLoading(false); // Stop loading on error
        setError("Something went wrong. Please try again.");
      });
  };

  const getData = async () => {
    setLoading(true); // Start loading while fetching documents
    try {
      const response = await fetch(api_base_url + "/getAllDocs", {
        mode: "cors",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: localStorage.getItem("userId"),
        }),
      });
      const result = await response.json();
      setData(result.docs);
    } catch (error) {
      setError("Failed to load documents. Please try again.");
    } finally {
      setLoading(false); // Stop loading once data is fetched or failed
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <>
      <Navbar />
      <div className="flex flex-col lg:flex-row items-center justify-between px-5 lg:px-24 py-6">
        <h3 className="text-3xl mb-3">All Documents</h3>
        <button
          className="btnBlue flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-blue-600 transition-all"
          onClick={() => {
            setIsCreateModelShow(true);
            document.getElementById('title').focus();
          }}
          aria-label="Create new document"
        >
          <BsPlusLg />
          Create New Document
        </button>
      </div>

      <div className="allDocs px-5 lg:px-24 mt-4">
        {loading ? (
          <p>Loading documents...</p>
        ) : (
          data ? data.map((el, index) => (
            <Docs key={index} docs={el} docID={`doc-${index + 1}`} />
          )) : (
            <p>No documents available</p>
          )
        )}
      </div>

      {isCreateModelShow && (
        <div className="createDocsModelCon fixed top-0 left-0 right-0 bottom-0 bg-[rgb(0,0,0,.3)] w-screen h-screen flex flex-col items-center justify-center">
          <div className="createDocsModel p-6 bg-white rounded-lg w-[80%] sm:w-[60%] md:w-[40%]">
            <h3 className="text-xl mb-4">Create New Document</h3>

            <div className="inputCon mt-3">
              <p className="text-sm text-[#171616]">Title</p>
              <div className="inputBox w-full flex items-center border-b-2 border-gray-300 py-2 mt-1">
                <MdOutlineTitle className="text-gray-500" />
                <input
                  onChange={(e) => setTitle(e.target.value)}
                  value={title}
                  type="text"
                  placeholder="Title"
                  id="title"
                  name="title"
                  required
                  className="w-full pl-2 outline-none"
                  aria-label="Document Title"
                />
              </div>
            </div>

            <div className="flex mt-4 items-center gap-4 justify-between w-full">
              <button
                onClick={createDoc}
                className="btnBlue !min-w-[48%] py-2 rounded-lg"
                disabled={loading}
              >
                {loading ? "Creating..." : "Create New Document"}
              </button>
              <button
                onClick={() => setIsCreateModelShow(false)}
                className="bg-gray-300 text-black py-2 rounded-lg min-w-[48%]"
                aria-label="Cancel document creation"
              >
                Cancel
              </button>
            </div>
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          </div>
        </div>
      )}
    </>
  );
};

export default Home;
