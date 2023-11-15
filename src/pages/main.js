// spotify & auth stuff
import Head from 'next/head'
import { getProviders, signOut } from "next-auth/react"
import {useSession} from 'next-auth/react'
import { useState } from 'react'

// components
import MusicPlayer from '@/components/MusicPlayer.js'
import UserNavbar from '@/components/UserNavbar.js'
import UserContent from '@/components/UserContent.js'
import SearchContent from '@/components/SearchContent'
import DiscoverContent from '@/components/DiscoverContent.js'

export default function UserProfile({providers}) {
	const {data: session} = useSession();

    const [currentPage, setCurrentPage] = useState("UserContent");


    const currentlyDisplayedPage = () => {
        if (currentPage == "UserContent") {
            return (
                <>
                    {/* username, image, etc.*/}
                    <div className='bg-black pt-[36px] pb-[36px] border-b-[1px] border-gray-500 '>
                        <UserNavbar  />
                    </div>

                    {/* actual content */}
                    <div className='bg-gradient-to-t from-green-400 to-black'>
                        <UserContent />
                    </div>
                </>
            )
        }
        else if(currentPage == "Search"){
            return(
                <>
                    {/* searched content */}
                    <div className='bg-gradient-to-t from-green-400 to-black pb-80'>
                        <SearchContent />
                    </div>
                </>
            )
        }
        else if (currentPage == "Discover") {
            return (
                <>
                    <div className='bg-gradient-to-t from-green-400 to-black pb-80'>
                        <DiscoverContent />
                    </div>
                </>
            )
        }
        
        return currentPage
    }

	return (
	<>
        <div className='absolute w-full'>
			<Head>
				<title>{session?.user.name} | Tunefy</title>
				<meta name="description" content="Spotify Statistic Tracker" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<link rel="icon" href="/favicon.ico" />
			</Head>

            {/* nav bar */}
            <div className='bg-black sticky top-0'>
                <div className='text-white flex flex-row justify-between w-full place-items-center'>
                    <button className='text-white p-5 font-bold order-first' onClick={() => setCurrentPage("UserContent")}>TUNEFY</button>
                    <div className='text-white p-5 font-bold order-end'>
                        {/* <Link href="/search-page" className="pr-4">search</Link> */}
                        <button className="pr-4" onClick={() => setCurrentPage("Discover")}>discover</button>
                        <button className="pr-4" onClick={() => setCurrentPage("Search")}>search</button>
                        {/* <button onClick={() => signOut({ callbackUrl: 'http://localhost:3000/' })}>sign out</button> */}
                        <button onClick={() => signOut({ callbackUrl: process.env.NEXTAUTH_URL })}>sign out</button>
                    </div>
                </div>
            </div>

            {currentlyDisplayedPage(currentPage)}

			{/* music player */}
			<MusicPlayer className="z-50" />
		</div>
	</>
	);
}

export async function getServerSideProps(){
	const providers = await getProviders();

	return {
		props: {
			providers
		}
	}
}