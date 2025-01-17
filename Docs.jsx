import React, { useState } from 'react'
import docsIcon from "../images/docsIcon.png"
import { MdDelete } from "react-icons/md";
import deleteImg from "../images/delete.png"
import { api_base_url } from '../Helper';
import { useNavigate } from 'react-router-dom';

const Docs = ({ docs }) => {
  const [error, setError] = useState("");
  const [isDeleteModelShow, setIsDeleteModelShow] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);  // State to track if deleting is in progress

  const docID = `doc-${docs._id}`;
  const navigate = useNavigate();

  const deleteDoc = () => {
    setIsDeleting(true); // Set deleting to true
    const doc = document.getElementById(docID);
    
    fetch(api_base_url + "/deleteDoc", {
      mode: "cors",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        docId: docs._id,
        userId: localStorage.getItem("userId"),
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setIsDeleting(false); // Reset deleting state
        if (data.success === false) {
          setError(data.message);
        } else {
          setIsDeleteModelShow(false);
          alert(data.message);
          doc.remove();
        }
      })
      .catch((error) => {
        setIsDeleting(false);
        console.error("Error deleting document:", error);
        setError("An error occurred while deleting the document.");
      });
  };

  return (
    <>
      <div id={docID} className='docs cursor-pointer rounded-lg flex items-center mt-4 justify-between p-4 bg-[#9a6565] transition-all hover:bg-[#DCDCDC] max-w-[100%] md:max-w-[500px] mx-auto'>
        <div onClick={() => { navigate(`/createDocs/${docs._id}`) }} className="left flex items-center gap-3">
          <img src={docsIcon} alt="Document Icon" className="w-[40px] h-[40px] object-contain" />
          <div>
            <h3 className='text-[18px] font-medium'>{docs.title}</h3>
            <p className='text-[12px] text-[#151515]'>
              Created In : {new Date(docs.date).toDateString()} | Last Updated : {new Date(docs.lastUpdate).toDateString()}
            </p>
          </div>
        </div>
        <div className="docsRight">
          <i onClick={() => { setIsDeleteModelShow(true) }} className="delete text-[24px] text-red-500 cursor-pointer transition-all hover:text-red-600" aria-label="Delete Document">
            <MdDelete />
          </i>
        </div>
      </div>

      {error && <p className="text-red-500 text-center mt-2">{error}</p>} {/* Display error message */}

      {isDeleteModelShow && (
        <div className="deleteDocsModelCon fixed top-0 left-0 right-0 bottom-0 bg-[rgb(0,0,0,.3)] w-screen h-screen flex flex-col items-center justify-center">
          <div className="deleteModel flex flex-col justify-center p-6 bg-white rounded-xl w-[80%] sm:w-[50%] md:w-[40%] lg:w-[30%] transition-all">
            <h3 className='text-[22px] font-semibold mb-4 text-center'>Delete Document</h3>
            <div className="flex items-center gap-4 mb-4">
              <img src={deleteImg} alt="Delete Icon" className="w-[50px] h-[50px] object-contain" />
              <div>
                <h3 className='text-[16px] font-medium'>Are you sure you want to delete this document?</h3>
                <p className='text-[12px] text-[#101010]'>You cannot undo this action.</p>
              </div>
            </div>
            <div className="flex items-center gap-4 justify-center mt-4">
              <button
                onClick={deleteDoc}
                className='p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg w-[45%] transition-all disabled:bg-red-300'
                disabled={isDeleting} // Disable the delete button while deleting
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
              <button
                onClick={() => { setIsDeleteModelShow(false) }}
                className='p-2 bg-gray-300 text-black rounded-lg w-[45%] transition-all'
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Docs;
