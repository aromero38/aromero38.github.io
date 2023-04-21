import {getProviders, signOut} from "next-auth/react"


const TopNavbar = () => {
    return (
        <>
            <div className='text-white flex flex-row justify-between w-full place-items-center'>
                <h1 className='text-white p-5 font-bold order-first'>TUNEFY</h1>
                <div className='text-white p-5 font-bold order-end'>
                    <button onClick={() => signOut({ callbackUrl: 'http://localhost:3000/' })}>sign out</button>
                </div>
            </div>
        </>
    )
}

export default TopNavbar;