// spotify & auth stuff
import Head from 'next/head'
import {getProviders, signOut} from "next-auth/react"
import {useSession} from 'next-auth/react'
import { useEffect, useState } from "react";
import useSpotify from 'hooks/useSpotify.js'

// components
import MusicPlayer from '@/components/MusicPlayer.js'
import TopNavbar from '@/components/TopNavbar.js'
import UserNavbar from '@/components/UserNavbar.js'
import UserContent from '@/components/UserContent.js'
import SearchContent from '@/components/SearchContent.js'
import { search } from 'superagent'


export default function UserProfile({providers}) {
	const {data: session} = useSession();
	const spotifyApi = useSpotify();

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
			<div className='bg-black sticky top-0'>
				<TopNavbar />
			</div>

			{/* username, image, etc.*/}
			<div className='bg-black pt-[36px] pb-[36px] border-b-[1px] border-gray-500 '>
                <UserNavbar  />
                <SearchContent />
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