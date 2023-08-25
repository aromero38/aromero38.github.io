// spotify & auth stuff
import Head from 'next/head'
import {getProviders, signOut} from "next-auth/react"
import {useSession} from 'next-auth/react'
import useSpotify from 'hooks/useSpotify.js'

// components
import MusicPlayer from '@/components/MusicPlayer.js'
import TopNavbar from '@/components/TopNavbar.js'
import UserNavbar from '@/components/UserNavbar.js'
import SearchContent from '@/components/SearchContent'


export default function UserProfile({providers}) {
	const {data: session} = useSession();
	const spotifyApi = useSpotify();

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
			<div className='bg-black sticky top-0 z-50'>
				<TopNavbar />
			</div>

			{/* searched content */}
			<div className='bg-gradient-to-t from-green-400 to-black'>
				<SearchContent />
			</div>

			{/* music player */}
			<MusicPlayer className='z-50' />
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