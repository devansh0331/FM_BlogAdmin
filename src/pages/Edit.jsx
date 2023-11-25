import {
  Timestamp,
  addDoc,
  collection,
  doc,
  getDoc,
  setDoc,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { db, storage } from "../firebaseConfig";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";

function Edit() {
  const { id } = useParams();
  const [blogData, setBlogData] = useState({});
  const navigate = useNavigate();

  const [progress, setProgress] = useState(0);
  const [imgFlag, setImgFlag] = useState(0);

  useEffect(() => {
    const blogsRef = doc(db, "Blogs", id);
    const blog = getDoc(blogsRef);

    blog.then((data) => {
      var fetchedData = data.data();
      setBlogData({
        title: fetchedData.title,
        author: fetchedData.author,
        summary: fetchedData.summary,
        imageUrl: fetchedData.imageUrl,
        createdAt: fetchedData.createdAt,
      });
      console.log(fetchedData.imageUrl);
    });
  }, []);

  const handleOnChange = (e) => {
    e.preventDefault();
    setBlogData({ ...blogData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    e.preventDefault();
    setBlogData({ ...blogData, imageUrl: e.target.files[0] });
    setImgFlag(1);
  };

  const handlePublish = async (e) => {
    e.preventDefault();

    const storageRef = ref(
      storage,
      `/images/${Date.now()}${blogData.imageUrl.name}`
    );

    const uploadImage = uploadBytesResumable(storageRef, blogData.imageUrl);

    if (imgFlag) {
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
          getDownloadURL(uploadImage.snapshot.ref)
            .then(async (urlImage) => {
              console.log(urlImage);

              await setDoc(doc(db, "Blogs", id), {
                title: blogData.title,
                author: blogData.author,
                summary: blogData.summary,
                imageUrl: urlImage,
                createdAt: blogData.createdAt,
              });
            })
            .then(() => {
              navigate("/");
            });
        }
      );
    } else {
      await setDoc(doc(db, "Blogs", id), {
        title: blogData.title,
        author: blogData.author,
        summary: blogData.summary,
        imageUrl: blogData.imageUrl,
        createdAt: blogData.createdAt,
      }).then(() => {
        navigate("/");
      });
    }
  };

  return (
    <div className="container">
      <span className="page-title">Create your Blog Here</span>
      <form action="" className="form">
        <input
          type="text"
          name="title"
          placeholder="Blog Title"
          value={blogData.title}
          onChange={handleOnChange}
        />
        <input
          type="text"
          name="author"
          placeholder="Auther Name"
          value={blogData.author}
          onChange={handleOnChange}
        />
        {/* <input
          type="text"
          name="summary"
          placeholder="Summary"
          value={blogData.summary}
          onChange={handleOnChange}
        /> */}
        <input
          type="file"
          name="imageUrl"
          id="imageUrl"
          // value={blogData.imageUrl.toString()}
          onChange={handleImageChange}
        />
        <textarea
          name="summary"
          id="summary"
          cols="30"
          rows="10"
          placeholder="Description"
          value={blogData.summary}
          onChange={handleOnChange}
        ></textarea>
        <button onClick={handlePublish}>Submit</button>
      </form>
    </div>
  );
}

export default Edit;
