'use client'
import Navbar from '@/components/Navbar'
import React, { useState } from 'react'
import { auth } from '@/config/firebase-config' 
import { onAuthStateChanged } from 'firebase/auth'

type Props = {}

const page = (props: Props) => {
    const [userName, setUserName] = useState("John Doe");

    onAuthStateChanged(auth, (user) => {
        if (user) {
          const name = String(auth?.currentUser?.displayName);
          setUserName(name);
          console.log(auth?.currentUser?.uid)
        } else {
          console.log("Not logged in");
        }
      });
  return (
    <div>
        <Navbar userName={userName} image={auth.currentUser?.photoURL} />
    </div>
  )
}

export default page