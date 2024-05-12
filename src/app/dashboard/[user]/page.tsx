"use client";
import Navbar from "@/components/Navbar";
import React, { useEffect, useState } from "react";
import { auth, db } from "@/config/firebase-config";
import { onAuthStateChanged } from "firebase/auth";
import { collection, getDocs } from "firebase/firestore";
import convertTime from "@/hooks/convertTime";

type Props = {};

const Dashboard = (props: Props) => {
  const [userName, setUserName] = useState("John Doe");

  useEffect(() => {
    getPosts();
  }, [userName]);

  onAuthStateChanged(auth, (user) => {
    if (user) {
      const name = String(auth?.currentUser?.displayName);
      setUserName(name);
    } else {
      console.log("Not logged in");
    }
  });

  const postsCollectionRef = collection(db, "blogs");
  // const [posts, setPosts] = useState([]);
  const [posts, setPosts] = useState([]);

  const getPosts = async () => {
    try {
      const data = await getDocs(postsCollectionRef);
      const filterData: any = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      // console.log(filterData)
      const userBlogs = filterData.filter((item:any) => String(item.author) === String(userName));
      // console.log(userName)
      setPosts(userBlogs);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="bg-[#020617] min-h-screen">
      <Navbar userName={userName} image={auth.currentUser?.photoURL} />
      <h1 className="text-7xl font-bold p-5 font-mono">Hello, {userName}</h1>

      <h1 className="text-5xl p-5 font-semibold font-mono">Your blogs...</h1>
      <div className="flex flex-col items-center gap-5 py-3 px-5 justify-center">
        {posts
          ?.slice()
          .sort((a:any, b:any) => a.time - b.time)
          .reverse()
          .map((post:any, key) => (
            <div
              className="flex justify-between items-center gap-3 border-2 w-full rounded-md p-5 md:w-[50vw] shadow-lg"
              key={key}
            >
              <div>
                <h1 className="text-2xl">{post.content}</h1>
                <hr className="opacity-50 my-5" />
                <p className="text-xl font-light">By {post.author}</p>
                <p className="font-light text-xs">{convertTime(post.time)}</p>
              </div>
              {/* <button className="text-2xl" onClick={() => deleteMovie(movie.id)}>❌</button> */}
            </div>
          ))}
      </div>
    </div>
  );
};

export default Dashboard;
