import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import React, { useState, useRef, useEffect } from 'react';
import JoditEditor from "jodit-pro-react";
import { api_base_url } from '../Helper';

// Debounce function to limit how frequently the updateDoc is called
const debounce = (func, delay) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), delay);
  };
};

const CreateDocs = () => {
  const { docsId } = useParams();
  const editor = useRef(null);
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // Loading state
  const [data, setData] = useState('');

  // Update the document
  const updateDoc = () => {
    if (content !== "") {
      setLoading(true); // Show loading while saving
      fetch(api_base_url + "/uploadDoc", {
        mode: "cors",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: localStorage.getItem("userId"),
          docId: docsId,
          content: content,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          setLoading(false); // Hide loading after the response
          if (!data.success) {
            setError(data.message);
          } else {
            setError(""); // Clear error if save is successful
          }
        })
        .catch((error) => {
          setLoading(false);
          console.error("Error updating document:", error);
          setError("An error occurred while updating the document.");
        });
    }
  };

  // Get document content
  const getContent = () => {
    setLoading(true); // Show loading while fetching
    fetch(api_base_url + "/getDoc", {
      mode: "cors",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: localStorage.getItem("userId"),
        docId: docsId,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setLoading(false); // Hide loading after the response
        if (!data.success) {
          setError(data.message);
        } else {
          setContent(data.doc.content); // Set content if success
        }
      })
      .catch((error) => {
        setLoading(false);
        console.error("Error fetching document:", error);
        setError("An error occurred while fetching the document.");
      });
  };

  // Debounced update
  const debouncedUpdate = debounce(updateDoc, 1000);

  useEffect(() => {
    getContent(); // Fetch document on component mount
  }, [docsId]);

  return (
    <>
      <Navbar />
      <div className="px-[100px] mt-3">
        <h2 className="mb-4 text-xl">Edit Document</h2>

        {loading && <div className="loadingIndicator">Loading...</div>}

        <JoditEditor
          ref={editor}
          value={content}
          tabIndex={1} // tabIndex of textarea
          onChange={(newContent) => {
            setContent(newContent);
            debouncedUpdate(); // Save after user stops typing for 1 second
          }}
        />

        {error && <p className="error-message text-red-500 mt-2">{error}</p>}
      </div>
    </>
  );
};

export default CreateDocs;
