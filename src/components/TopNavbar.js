import {signOut} from "next-auth/react"
import Link from 'next/link';



const TopNavbar = () => {
    return (
        <>
            <div className='text-white flex flex-row justify-between w-full place-items-center'>
                <h1 className='text-white p-5 font-bold order-first'>
                    <Link href="/user-profile">TUNEFY</Link>
                </h1>
                <div className='text-white p-5 font-bold order-end'>
                    <Link href="/search-page" className="pr-4">search</Link>
                    <button onClick={() => signOut({ callbackUrl: 'http://localhost:3000/' })}>sign out</button>
                </div>
            </div>
        </>
    )
}

export default TopNavbar;