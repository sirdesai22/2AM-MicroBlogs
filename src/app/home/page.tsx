"use client";
import React, { useEffect, useState } from "react";
import { auth, db } from "../../config/firebase-config";
import { onAuthStateChanged, signOut } from "firebase/auth";
import Navbar from "@/components/Navbar";
import { addDoc, collection, getDocs } from "firebase/firestore";
import Popup from "reactjs-popup";
import convertTime from "@/hooks/convertTime";

type Props = {};

const page = (props: Props) => {
  const [content, setContent] = useState("");
  const [wordLength, setWordLength] = useState(0);
  const [userName, setUserName] = useState("John Doe");
  const postsCollectionRef = collection(db, "blogs");
  const [posts, setPosts] = useState([]);

  onAuthStateChanged(auth, (user) => {
    if (user) {
      const name = String(auth?.currentUser?.displayName);
      setUserName(name);
    } else {
      console.log("Not logged in");
    }
  });

  const getPosts = async () => {
    try {
      const data = await getDocs(postsCollectionRef);
      const filterData:any = data.docs.map((doc) => ({
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

  let closePopup:any;

  const changeTextarea = (e:any) => {
    if (wordLength >= 200) {
      setContent(content.substring(0, 199));
    } else {
      setContent(e.target.value);
      setWordLength(content.length+1);
    }
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
        ref={(ref:any) => (closePopup = ref && ref.close)}
      >
        <div className="bg-none border-white border-2 backdrop-blur-lg flex flex-col justify-center items-center text-black p-2 shadow-lg rounded-md">
          {/* bg-gradient-to-br from-[#292929] to-[#252525] */}
          <span className="text-white">{wordLength}/200</span>
          <textarea
            rows={12}
            onChange={changeTextarea}
            value={content}
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

export default page;
