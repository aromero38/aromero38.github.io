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

	// const [playlists, setPlaylists] = useState([]);
	// const [playlistId, setPlaylistId] = useState(null);

	// console.log('You picked playlist >>> ', playlistId);

	// useEffect(() => {
	//   if(spotifyApi.getAccessToken()){
	//     spotifyApi.getUserPlaylists().then((data) =>{
	//       setPlaylists(data.body.items);
	//     });
	//   }
	// }, [session, spotifyApi]);


	spotifyApi.getUserPlaylists(session?.user.email)
		.then (function(data) {
			console.log('Retrieved playlists', data.body);
		},
		function(err) {
			console.log('Something went wrong!', err);
		});

	return (
	<>
		<Head>
			<title>{session?.user.name} | Tunefy</title>
			<meta name="description" content="Spotify Statistic Tracker" />
			<meta name="viewport" content="width=device-width, initial-scale=1" />
			<link rel="icon" href="/favicon.ico" />
		</Head>

		{/* nav bar */}
		<TopNavbar />

		{/* username, image, etc.*/}
		<UserNavbar />

		{/* actual content */}
		<UserContent />

		{/* music player */}
		<div>
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