"use client";
import React, { useEffect, useState } from "react";
import { auth, db } from "../../config/firebase-config";
import { onAuthStateChanged, signOut } from "firebase/auth";
import Navbar from "@/components/Navbar";
import { addDoc, collection, getDocs } from "firebase/firestore";
import Popup from "reactjs-popup";

type Props = {};

const page = (props: Props) => {
  const [content, setContent] = useState("");
  const [wordLength, setWrodLength] = useState(0);
  const [userName, setUserName] = useState("John Doe");

  onAuthStateChanged(auth, (user) => {
    if (user) {
      // User is signed in, see docs for a list of available properties
      // https://firebase.google.com/docs/reference/js/auth.user
      // console.log("Still logged in");
      // console.log(auth.currentUser?.displayName);
      const name = String(auth?.currentUser?.displayName);
      setUserName(name);
      // ...
    } else {
      console.log("Not logged in");
      // User is signed out
      // ...
    }
  });
  const postsCollectionRef = collection(db, "blogs");
  const [posts, setPosts] = useState();

  const getPosts = async () => {
    try {
      const data = await getDocs(postsCollectionRef);
      const filterData = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      // console.log(filterData)
      setPosts(filterData);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getPosts();
  }, []);

  const handlePost = async () => {
    try {
      await addDoc(postsCollectionRef, {
        content: content,
        author: auth?.currentUser?.displayName || auth?.currentUser?.email,
        time: new Date(),
      });
      getPosts();
      closePopup();
    } catch (error) {
      console.log(error);
      closePopup();
    }
  };

  let closePopup;

  const convertTime = (timestamp) => {
    const milliseconds =
      timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000;

    // Create a new Date object using the milliseconds
    const date = new Date(milliseconds);

    // Get the components of the date (day, month, year)
    const day = date.getDate();
    const month = new Intl.DateTimeFormat("en-US", { month: "long" }).format(
      date
    );
    const year = date.getFullYear();

    // Format the date as "dd-month-yyyy"
    const formattedDate = `${day}-${month}-${year}`;

    return formattedDate;
  };

  return (
    <div className="bg-[#020617] min-h-screen">
      <Navbar userName={userName} image={auth.currentUser?.photoURL} />

      <Popup
        className="fixed inset-0 flex justify-center items-center"
        trigger={
          <button className="rounded-md border-2 border-white px-3 py-2 m-3 hover:bg-slate-100 hover:text-black duration-700">
            Write a blog
          </button>
        }
        position="center center"
        modal
        // closeOnDocumentClick={false} // To prevent closing on document click
        ref={(ref) => (closePopup = ref && ref.close)}
      >
        <div className="bg-none border-white border-2 backdrop-blur-lg flex flex-col justify-center items-center text-black p-2 shadow-lg rounded-md">
          {/* bg-gradient-to-br from-[#292929] to-[#252525] */}
          <span className="text-white">{wordLength}/200</span>
          <textarea
            rows={12}
            onChange={(e) => {
              setContent(e.target.value);
              setWrodLength(content.length + 1);
            }}
            placeholder="Write your thoughts..."
            className="bg-none bg-transparent border-2 text-white text-xl p-2
          w-[55vw]"
          />
          <button
            onClick={handlePost}
            className="w-full rounded-md border-2 border-white px-3 py-2 m-3 text-xl text-white font-semibold hover:bg-slate-100 hover:text-black duration-700"
          >
            Post
          </button>
        </div>
      </Popup>

      <div className="flex flex-col items-center gap-5 py-3 px-5 justify-center">
        {posts
          ?.slice()
          .sort((a, b) => a.time - b.time)
          .reverse()
          .map((post, key) => (
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

export default page;
