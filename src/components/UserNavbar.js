import {useSession} from 'next-auth/react'

const UserNavbar = ({providers}) => {
    const {data: session} = useSession();
    return (
        <>
            <div className='text-white pl-10 flex flex-row w-full place-items-center'>
                <img className='h-40 w-40 mr-12 rounded-full object-center' src={session?.user.image} />
                <p className='text-4xl font-bold'>{session?.user.name} </p>
            </div>
        </>
    )
} 

export default UserNavbar