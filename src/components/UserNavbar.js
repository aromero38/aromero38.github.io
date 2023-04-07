import {useSession} from 'next-auth/react'

const UserNavbar = ({providers}) => {
    const {data: session} = useSession();
    return (
        <>
            <div className='text-white pl-5 flex flex-row w-full place-items-center'>
                <img className='h-24 w-24 mr-12 rounded-full object-center' src={session?.user.image} />
                <p className='text-2xl'>Hello, {session?.user.name} </p>
            </div>
        </>
    )
} 

export default UserNavbar