// spotify & auth stuff
import Head from 'next/head'
import {getProviders, signOut} from "next-auth/react"
import {useSession} from 'next-auth/react'
import useSpotify from 'hooks/useSpotify.js'
import { useEffect, useState } from 'react'

// components
import MusicPlayer from '@/components/MusicPlayer.js'
import TopNavbar from '@/components/TopNavbar.js'
import UserNavbar from '@/components/UserNavbar.js'
import UserContent from '@/components/UserContent.js'


export default function UserProfile({providers}) {
	const {data: session} = useSession();
	const spotifyApi = useSpotify();




	// spotifyApi.getUserPlaylists(session?.user.email)
	// 	.then (function(data) {
	// 		console.log('Retrieved playlists', data.body);
	// 	},
	// 	function(err) {
	// 		console.log('Something went wrong!', err);
	// 	});

	return (
	<>
		<div className=' absolute w-full'>
			<Head>
				<title>{session?.user.name} | Tunefy</title>
				<meta name="description" content="Spotify Statistic Tracker" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<link rel="icon" href="/favicon.ico" />
			</Head>

			{/* nav bar */}
			<div className='bg-black pb-[36px] '>
				<TopNavbar />
			</div>

			{/* username, image, etc.*/}
			<div className='bg-black pb-[36px] border-b-[1px] border-gray-500 '>
				<UserNavbar  />
			</div>

			{/* actual content */}
			<div className='bg-gradient-to-t from-green-400 to-black'>
				<UserContent />
			</div>

			{/* music player */}
			<MusicPlayer />
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