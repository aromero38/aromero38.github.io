import {useSession} from 'next-auth/react'

const UserNavbar = ({providers}) => {
    const {data: session} = useSession();
    return (
        <>
            <div className='text-white pl-10 flex flex-row w-full place-items-center'>
                <img className='h-32 w-32 mr-12 rounded-full object-center' src={session?.user.image} />
                <p className='text-3xl font-bold'>{session?.user.name} </p>
            </div>

            <div className='text-white pl-10 flex flex-row w-full place-items-center'>
                <a href="user-profile">Home</a>
                <a href="search-page">Search</a>
            </div>
        </>
    )
} 

export default UserNavbar