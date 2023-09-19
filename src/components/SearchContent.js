// spotify & auth stuff
import { getProviders, signOut } from "next-auth/react"
import { useSession } from 'next-auth/react'
import { useEffect, useState } from "react";
import useSpotify from 'hooks/useSpotify.js'
import { PlayIcon } from '@heroicons/react/24/solid';

export default function UserProfile() {
	const {data: session} = useSession();
	const spotifyApi = useSpotify();

	const [searchValue, setSearchValue] = useState('');

	const [searchedTrack, setSearchedTrack] = useState(null);
	const [searchedArtist, setSearchedArtist] = useState(null);
	const handleInputChange = (event) => {
		if(event.target.value === null){
			setSearchValue(null);
		}
		setSearchValue(event.target.value);
	};

	const fetchSearch = () => {
		if (spotifyApi.getAccessToken()) {

			//get tracks
			spotifyApi.searchTracks(`track:${searchValue}`)
			.then(function(data) {
				setSearchedTrack(data.body)
				console.log(`Search by ${searchValue}`, data.body);
			}, function(err) {
				console.error(err);
			});

			//get artists
			spotifyApi.searchArtists(searchValue)
				.then(function(data) {
					setSearchedArtist(data.body)
					console.log(`Search for artists by ${searchValue}`, data.body);
				}, function(err) {
					console.error(err);
				});
		}
	};

	const displayTopResult = (searchedTrack) => {
	return (				
	<>
		<div className="flex flex-col w-1/3 mr-12">
			<h2 className="text-3xl font-semibold pb-4">Top Result</h2>
			<div className="w-full h-full relative group"> 
				<div className="relative h-[80%] w-5/6 hover:bg-gradient-to-b from-transparent to-black group-hover:opacity-100 rounded-md border-[0.1px] border-slate-400 z-0"> {/* Hover container */}
				{/* gradient overlay */}
					<div className="absolute inset-0 rounded-md bg-gradient-to-b from-transparent to-black opacity-100 group-hover:opacity-100 z-10"></div>
					{/* cover */}
					<img src={searchedTrack?.tracks?.items?.[0]?.album?.images[0]?.url} className="h-full w-full object-none z-0 rounded-md"></img>
					{/* text */}
						<div className="absolute bottom-[20px] left-2 px-4 text-white text-2xl font-bold opacity-100 group-hover:opacity-100 z-30 w-[75%]">
							<h2 className="text-2xl font-semibold">{searchedTrack?.tracks?.items?.[0]?.album?.name}</h2>
							<h2 className="text-sm font-semibold">{searchedTrack?.tracks?.items?.[0]?.album?.artists?.[0]?.name}</h2>
						</div>
						{/* play btn */}
					<div className="absolute bottom-[25px] right-4 text-white text-2xl font-bold opacity-0 group-hover:opacity-100 z-30">
						<div className="h-12 w-12 bg-green-900 rounded-full hover:scale-105">
							<PlayIcon alt="Play" className="h-12 w-12 text-white scale-[75%]" onClick={() => spotifyApi.play({context_uri: searchedTrack?.tracks?.items?.[0]?.album?.uri})}  />
						</div>
					</div>
				</div>
			</div>
		</div>
	</>)
	}

	const displayTopArtist = (searchedArtist) => {

		const topArtists = [];
		for(let i = 0; i < 5; i++){
			topArtists.push(
				<div className="flex flex-row items-center pb-8">
					<img src={searchedArtist?.artists?.items?.[i]?.images?.[0]?.url} className="h-32 w-32 rounded-full mr-8"></img>
					<h2 className="text-2xl font-semibold">{searchedArtist?.artists?.items?.[i]?.name}</h2>
				</div>
			)
		}

		return(
		<>
			<div className= "flex flex-col w-1/3 mr-6">
				<h2 className="text-3xl font-semibold pb-4">Artists</h2>
				{topArtists}
			</div>
		</>
		)
	}

	const displayTopTracks = (searchedTrack) => {

		const topTracks = [];
		for(let i = 0; i < 5; i++){
			topTracks.push(
				<div className="flex flex-row items-center pb-8">
					<img src={searchedTrack?.tracks?.items?.[i]?.album?.images[0]?.url} className="h-32 w-32 rounded-full mr-8"></img>
					<div>
						<h2 className="text-2xl font-semibold">{searchedTrack?.tracks?.items?.[i]?.name}</h2>
						<h2 className="text-sm">{searchedTrack?.tracks?.items?.[i]?.album?.artists?.[0]?.name}</h2>
					</div>
				</div>
			)
		}

		return(
		<>
			<div className= "flex flex-col w-1/3 mr-6">
				<h2 className="text-3xl font-semibold pb-4">Tracks</h2>
				{topTracks}
			</div>
		</>
		)
	}

	const displayTopAlbums = (searchedArtist) => {

		const topAlbums = [];
		for(let i = 1; i < 6; i++){
			topAlbums.push(
				<div className="text-center">
					<h2 className="text-xs w-48">{searchedTrack?.tracks?.items?.[i]?.album?.artists?.[0]?.name}</h2>
					<h2 className="text-sm font-semibold w-48">{searchedTrack?.tracks?.items?.[i]?.album?.name}</h2>
					<img src={searchedTrack?.tracks?.items?.[i]?.album?.images[0]?.url} className="h-48 w-48 rounded-md mb-2"></img>
				</div>
			)
		}

		return(
		<>
			<div className="flex flex-col h-96 w-full">
				<div className="flex flex-row">
					<h2 className="text-3xl font-semibold pb-4">Albums</h2>
				</div>
				<div className="flex flex-row justify-between">
					{topAlbums}
				</div>
			</div>
		</>
		)
	}

	useEffect(() => {
		if(searchValue === null){
			console.log(searchValue);
		}
		else{
			fetchSearch();
		}
	}, [spotifyApi, session, searchValue]);

	return (
	<>
		{/* search bar */}
		<div className='bg-black pt-[24px] pb-[30px] border-b-[1px] border-gray-500 text-white sticky top-1 z-50'>
			{/* search stuff */}
			<div className='pl-5 flex justify-between flex-col items-start'>
					<div className="relative rounded-lg shadow-sm w-full">
						<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-auto">
							<svg className="absolute text-slate-300 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
								<path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd"></path>
							</svg>
						</div>
						<input type="search" placeholder="Search Some Tunes!" value={searchValue} onChange={handleInputChange} 
							className="text-sm pl-10 py-2 px-3 placeholder-slate-600 ring-slate-800 rounded-lg bg-gradient-to-r from-black to-gray-900 dark:ring-2 dark:text-slate-300 focus:ring-green-900 focus:outline-none" />
					</div>
			</div>
		</div>
		
		{/* search content */}
		{searchedTrack != null && searchedArtist != null ? 
		<div className="w-100% h-[1000px] mt-24 mx-36 text-white relative">
			<div>
				<div className="flex flex-row h-3/4 justify-center pb-8">
					{displayTopResult(searchedTrack)}
					{displayTopArtist(searchedArtist)}
					{displayTopTracks(searchedTrack)}
				</div>
				{displayTopAlbums(searchedTrack)}
			</div>
		</div> : <></>}
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
