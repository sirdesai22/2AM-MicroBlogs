import { auth } from '@/config/firebase-config';
import { signOut } from 'firebase/auth';
import React from 'react'

type Props = {
    userName: string,
    image: any
}

const Navbar = (props: Props) => {

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      window.location.href = '/';
    } catch (error) {
      console.error("Error signing out with Google", error);
    }
  };

  return (
    <div className='flex justify-between items-center py-2 px-4 bg-gradient-to-tr from-sky-500 to-cyan-500'>
        <div className='text-3xl font-extrabold'>2AM</div>
        <div className='flex h-10 gap-3 items-center'>
            {/* <h1>Hello, {props.userName}</h1> */}
            <button onClick={handleSignOut} className='px-3 py-2 bg-red-500 rounded-md font-semibold'>Sign out</button>
            <img onClick={() => {window.location.href = `/dashboard/${props.userName}`}} src={props.image} alt=""  className='bg-red-300 rounded-full max-h-full cursor-pointer hover:shadow-md hover:scale-110'/>
        </div>
    </div>
  )
}

export default Navbar