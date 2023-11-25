import React, { useEffect, useState } from "react";
import "./display.css";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { db, storage } from "../firebaseConfig";

import EditPng from "../img/edit.png";
import Delete from "../img/delete.png";
import { deleteObject, ref } from "firebase/storage";
import { useNavigate } from "react-router-dom";

function Display() {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  useEffect(() => {
    const blogsRef = collection(db, "blogs");
    // const blogsRef = getDocs(collection(db, "blogs"));
    // blogsRef.then((doc) => {
    //   // doc.data() is never undefined for query doc snapshots
    //   console.log(doc.id, " => ", doc.docs());
    // });
    const q = query(collection(db, "Blogs"), orderBy("createdAt", "desc"));
    onSnapshot(q, (querySnapshot) => {
      console.log(querySnapshot);
      setBlogs(
        querySnapshot.docs.map((doc) => ({
          id: doc.id,
          data: doc.data(),
        }))
      );
      //   setBlogs(blogs1);
      console.log(blogs.id);
    });
    console.log(blogs.id);
  }, []);

  const handleDelete = async (e) => {};
  const handleAdd = (e) => {
    e.preventDefault();
    navigate("/create");
  };
  return (
    <div className="container">
      <span className="page-title">Welcome Admin</span>
      <div className="sub-container">
        <span>Available Blogs</span>
        <button onClick={handleAdd}>+Add</button>

        {blogs.length === 0 ? (
          <div className="no-blogs-container">
            <p className="no-blogs">No Blogs Available</p>
          </div>
        ) : (
          <div className="blogs">
            {blogs.map((item, key) => (
              <div className="single-blog" key={key}>
                {item.data.imageUrl && (
                  <div className="left">
                    <img src={`${item.data.imageUrl}`} alt="" />
                  </div>
                )}
                <div className="right">
                  {/* <div className="sub-right"> */}
                  <p className="blog-title">{item.data.title}</p>
                  {/* </div> */}
                  <div className="sub-right">
                    <p>by: {item.data.author}</p>
                    <p>{item.data.createdAt.toDate().toDateString()}</p>
                  </div>
                  <p>{item.data.summary.split("").slice(0, 40)}...</p>
                  <div className="edit-icons">
                    <a href={`/edit/${item.id}`} style={{ margin: "0" }}>
                      {" "}
                      <img src={EditPng} alt="" />
                    </a>
                    <a
                      onClick={async (e) => {
                        e.preventDefault();

                        try {
                          await deleteDoc(doc(db, "Blogs", item.id));
                          const storageRef = ref(storage, item.data.imageUrl);
                          await deleteObject(storageRef);
                          alert("Blog Deleted Sucessfully");
                        } catch (err) {
                          alert("Error : " + err);
                        }
                      }}
                    >
                      <img src={Delete} alt="" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Display;
