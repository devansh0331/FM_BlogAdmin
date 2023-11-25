import React, { useState } from "react";

import "./form.css";
import { Timestamp, addDoc, collection } from "firebase/firestore";
import { db, storage } from "../firebaseConfig";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { useNavigate } from "react-router-dom";

function Create() {
  //   const [title, setTitle] = useState("");
  //   const [name, setName] = useState("");
  //   const [summary, setSummary] = useState("");
  //   const [file, setFile] = useState("");

  const navigate = useNavigate();

  const [progress, setProgress] = useState(0);

  const [formData, setFormData] = useState({
    title: "",
    author: "",
    summary: "",
    image: "",
    descrption: "",
    createdAt: Timestamp.now().toDate(),
  });

  const handleOnChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  const handlePublish = (e) => {
    e.preventDefault();
    console.log(formData);
    // if (
    //   !formData.title ||
    //   !formData.author ||
    //   !formData.summary ||
    //   !formData.descrption ||
    //   !formData.image
    // ) {
    //   alert("Please fill all the fields");
    // }

    const storageRef = ref(
      storage,
      `/images/${Date.now()}${formData.image.name}`
    );

    const uploadImage = uploadBytesResumable(storageRef, formData.image);

    uploadImage.on(
      "state_changed",
      (snapshot) => {
        const progressPercent = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setProgress(progressPercent);
      },
      (err) => {
        console.log(err);
      },
      () => {
        setFormData({
          itle: "",
          author: "",
          summary: "",
          image: "",
          descrption: "",
        });
        getDownloadURL(uploadImage.snapshot.ref).then((url) => {
          const blogsRef = collection(db, "Blogs");
          addDoc(blogsRef, {
            title: formData.title,
            author: formData.author,
            summary: formData.summary,
            imageUrl: url,
            createdAt: Timestamp.now().toDate(),
          })
            .then(() => {
              alert("Blog Added Successfully");
              setProgress(0);
              navigate("/");
            })
            .catch((err) => {
              alert("Error: " + err);
            });
        });
      }
    );
  };

  return (
    <div className="container">
      <span className="page-title">Create your Blog Here</span>
      <form action="" className="form">
        <input
          type="text"
          name="title"
          placeholder="Blog Title"
          value={formData.title}
          onChange={handleOnChange}
        />
        <input
          type="text"
          name="author"
          placeholder="Auther Name"
          value={formData.author}
          onChange={handleOnChange}
        />
        <input
          type="text"
          name="summary"
          placeholder="Summary"
          value={formData.summary}
          onChange={handleOnChange}
        />
        <input
          type="file"
          name="image"
          //   accept="image/"
          onChange={handleImageChange}
        />
        <textarea
          name="description"
          id=""
          cols="30"
          rows="10"
          placeholder="Description"
          value={formData.description}
          onChange={handleOnChange}
        ></textarea>
        <button onClick={handlePublish}>Submit</button>
      </form>
    </div>
  );
}

export default Create;
