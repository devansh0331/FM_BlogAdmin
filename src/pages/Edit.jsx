import { collection, doc, getDoc, setDoc } from "firebase/firestore";
import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { db } from "../firebaseConfig";

function Edit() {
  const { _id } = useParams();

  useEffect(() => {
    const blogsRef = doc(db, "Blogs", _id);
    const blog = getDoc(blogsRef);
    console.log(blog);
  }, []);

  return <div className="container"></div>;
}

export default Edit;
