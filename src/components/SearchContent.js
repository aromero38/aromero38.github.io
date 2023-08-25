// spotify & auth stuff
import { getProviders, signOut } from "next-auth/react"
import { useSession } from 'next-auth/react'
import { useEffect, useState } from "react";
import useSpotify from 'hooks/useSpotify.js'

import { PlayIcon } from '@heroicons/react/24/solid';

export default function UserProfile({providers}) {
	const {data: session} = useSession();
	const spotifyApi = useSpotify();
  	// const [mySearchInfo, setMySearchInfo] = useState([])

	const [searchValue, setSearchValue] = useState('');

	const [searchedTrack, setSearchedTrack] = useState('');
	const [searchedArtist, setSearchedArtist] = useState('');
	const handleInputChange = (event) => {
		setSearchValue(event.target.value);
	};

	const fetchSearch = () => {
		if (spotifyApi.getAccessToken()) {
			spotifyApi.searchTracks(searchValue)
				.then(function(data) {
					setSearchedTrack(data.body)
					console.log(`Search by ${searchValue}`, data.body);
				}, function(err) {
					console.error(err);
				});

			spotifyApi.searchArtists(searchValue)
				.then(function(data) {
					setSearchedArtist(data.body)
					console.log(`Search for artists by ${searchValue}`, data.body);
				}, function(err) {
					console.error(err);
				});
		}
	};

	useEffect(() => {
		fetchSearch();
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
		<div className="w-100% h-[1000px] mt-24 mx-36 text-white relative">
			<div className="flex flex-row h-3/4 justify-center pb-8">
				<div className="flex flex-col w-1/3 mr-12">
					<h2 className="text-3xl font-semibold pb-4">Top Result</h2>
					<div className="w-full h-full relative group"> 
					<div className="relative h-[90%] w-5/6 hover:bg-gradient-to-b from-transparent to-black group-hover:opacity-100 rounded-md border-[0.1px] border-slate-400 z-0"> {/* Hover container */}
						{/* gradient overlay */}
						<div className="absolute inset-0 rounded-md bg-gradient-to-b from-transparent to-black opacity-100 group-hover:opacity-100 z-10"></div>

						{/* cover */}
						<img src={searchedTrack?.tracks?.items?.[0]?.album?.images[0]?.url} className="h-full w-full object-none z-0 rounded-md"></img>

						{/* text */}
						<div className="absolute bottom-[20px] left-2 px-4 text-white text-2xl font-bold opacity-100 group-hover:opacity-100 z-30 w-[75%]">
							<h2 className="text-2xl font-semibold truncate">{searchedTrack?.tracks?.items?.[0]?.album?.name}</h2>
							<h2 className="text-sm font-semibold truncate">{searchedTrack?.tracks?.items?.[0]?.album?.artists?.[0]?.name}</h2>
						</div>

						{/* play btn */}
						<div className="absolute bottom-[25px] right-4 text-white text-2xl font-bold opacity-0 group-hover:opacity-100 z-30">
							<div className="h-12 w-12 bg-green-900 rounded-full hover:scale-105">
								<PlayIcon alt="Play" className="h-12 w-12 text-white scale-[75%]"  />
							</div>
						</div>
					</div>
				</div>
			</div>

			<div className= "flex flex-col w-1/3 mr-6">
				<h2 className="text-3xl font-semibold pb-4">Artists</h2>

				<div className="flex flex-row items-center pb-8">
					<img src={searchedArtist?.artists?.items?.[0]?.images?.[0]?.url} className="h-32 w-32 rounded-full mr-8"></img>
					<h2 className="text-2xl font-semibold">{searchedArtist?.artists?.items?.[0]?.name}</h2>
				</div>

				<div className="flex flex-row items-center pb-8">
					<img src={searchedArtist?.artists?.items?.[1]?.images?.[0]?.url} className="h-32 w-32 rounded-full mr-8"></img>
					<h2 className="text-2xl font-semibold">{searchedArtist?.artists?.items?.[1]?.name}</h2>
				</div>

				<div className="flex flex-row items-center pb-8">
					<img src={searchedArtist?.artists?.items?.[2]?.images?.[0]?.url} className="h-32 w-32 rounded-full mr-8"></img>
					<h2 className="text-2xl font-semibold">{searchedArtist?.artists?.items?.[2]?.name}</h2>
				</div>

				<div className="flex flex-row items-center pb-8">
					<img src={searchedArtist?.artists?.items?.[3]?.images?.[0]?.url} className="h-32 w-32 rounded-full mr-8"></img>
					<h2 className="text-2xl font-semibold">{searchedArtist?.artists?.items?.[3]?.name}</h2>
				</div>
			</div>

			<div className= "flex flex-col w-1/3 mr-6">
				<h2 className="text-3xl font-semibold pb-4">Tracks</h2>

				<div className="flex flex-row items-center pb-8">
					<img src={searchedTrack?.tracks?.items?.[0]?.album?.images[0]?.url} className="h-32 w-32 rounded-full mr-8"></img>
					<div>
						<h2 className="text-2xl font-semibold">{searchedTrack?.tracks?.items?.[0]?.name}</h2>
						<h2 className="text-sm">{searchedTrack?.tracks?.items?.[0]?.album?.artists?.[0]?.name}</h2>
					</div>
				</div>

				<div className="flex flex-row items-center pb-8">
					<img src={searchedTrack?.tracks?.items?.[1]?.album?.images[0]?.url} className="h-32 w-32 rounded-full mr-8"></img>
					<div>
						<h2 className="text-2xl font-semibold">{searchedTrack?.tracks?.items?.[1]?.name}</h2>
						<h2 className="text-sm">{searchedTrack?.tracks?.items?.[1]?.album?.artists?.[0]?.name}</h2>
					</div>
				</div>

				<div className="flex flex-row items-center pb-8">
					<img src={searchedTrack?.tracks?.items?.[2]?.album?.images[0]?.url} className="h-32 w-32 rounded-full mr-8"></img>
					<div>
						<h2 className="text-2xl font-semibold">{searchedTrack?.tracks?.items?.[2]?.name}</h2>
						<h2 className="text-sm">{searchedTrack?.tracks?.items?.[2]?.album?.artists?.[0]?.name}</h2>
					</div>
				</div>

				<div className="flex flex-row items-center pb-8">
					<img src={searchedTrack?.tracks?.items?.[3]?.album?.images[0]?.url} className="h-32 w-32 rounded-full mr-8"></img>
					<div>
						<h2 className="text-2xl font-semibold">{searchedTrack?.tracks?.items?.[3]?.name}</h2>
						<h2 className="text-sm">{searchedTrack?.tracks?.items?.[3]?.album?.artists?.[0]?.name}</h2>
					</div>
				</div>
			</div>
		</div>

		<div className="flex flex-col h-96 w-full">
			<div className="flex flex-row">
				<h2 className="text-3xl font-semibold pb-4">Albums</h2>
			</div>
			<div className="flex flex-row justify-between">
				<div className="text-center">
					<img src={searchedTrack?.tracks?.items?.[0]?.album?.images[0]?.url} className="h-48 w-48 rounded-md mb-2"></img>
					<h2 className="text-xs w-48">{searchedTrack?.tracks?.items?.[0]?.album?.artists?.[0]?.name}</h2>
					<h2 className="text-sm font-semibold w-48">{searchedTrack?.tracks?.items?.[0]?.album?.name}</h2>
				</div>
				<div className="text-center">
					<img src={searchedTrack?.tracks?.items?.[1]?.album?.images[0]?.url} className="h-48 w-48 rounded-md mb-2"></img>
					<h2 className="text-xs w-48">{searchedTrack?.tracks?.items?.[1]?.album?.artists?.[0]?.name}</h2>
					<h2 className="text-sm font-semibold w-48">{searchedTrack?.tracks?.items?.[1]?.album?.name}</h2>
				</div>
				<div className="text-center">
					<img src={searchedTrack?.tracks?.items?.[2]?.album?.images[0]?.url} className="h-48 w-48 rounded-md mb-2"></img>
					<h2 className="text-xs w-48">{searchedTrack?.tracks?.items?.[2]?.album?.artists?.[0]?.name}</h2>
					<h2 className="text-sm font-semibold w-48">{searchedTrack?.tracks?.items?.[2]?.album?.name}</h2>
				</div>
				<div className="text-center">
					<img src={searchedTrack?.tracks?.items?.[3]?.album?.images[0]?.url} className="h-48 w-48 rounded-md mb-2"></img>
					<h2 className="text-xs w-48">{searchedTrack?.tracks?.items?.[3]?.album?.artists?.[0]?.name}</h2>
					<h2 className="text-sm font-semibold w-48">{searchedTrack?.tracks?.items?.[3]?.album?.name}</h2>
				</div>
				<div className="text-center">
					<img src={searchedTrack?.tracks?.items?.[4]?.album?.images[0]?.url} className="h-48 w-48 rounded-md mb-2"></img>
					<h2 className="text-xs w-48">{searchedTrack?.tracks?.items?.[4]?.album?.artists?.[0]?.name}</h2>
					<h2 className="text-sm font-semibold w-48">{searchedTrack?.tracks?.items?.[4]?.album?.name}</h2>
				</div>
				<div className="text-center">
					<img src={searchedTrack?.tracks?.items?.[5]?.album?.images[0]?.url} className="h-48 w-48 rounded-md mb-2"></img>
					<h2 className="text-xs w-48">{searchedTrack?.tracks?.items?.[5]?.album?.artists?.[0]?.name}</h2>
					<h2 className="text-sm font-semibold w-48">{searchedTrack?.tracks?.items?.[5]?.album?.name}</h2>
				</div>
			</div>
		</div>

		{/* <div className="flex flex-row pb-[1500px] w-full">
			<div className="flex flex-col w-full h-64">
				

				<div className="flex flex-row w-full justify-between">
					<div className="flex flex-col align-middle justify-center w-48 text-center mr-8">
						<img src={searchedTrack?.tracks?.items?.[0]?.album?.images[0]?.url} className="h-48 w-48 rounded-md mb-2"></img>
						<h2 className="text-sm font-semibold w-48">{searchedTrack?.tracks?.items?.[0]?.album?.name}</h2>
					</div>
					<div className="flex flex-col align-middle justify-center w-48 text-center mr-8">
						<img src={searchedTrack?.tracks?.items?.[1]?.album?.images[0]?.url} className="h-48 w-48 rounded-md mb-2"></img>
						<h2 className="text-sm font-semibold w-48">{searchedTrack?.tracks?.items?.[1]?.album?.name}</h2>
					</div>
					<div className="flex flex-col align-middle justify-center w-48 text-center mr-8">
						<img src={searchedTrack?.tracks?.items?.[2]?.album?.images[0]?.url} className="h-48 w-48 rounded-md mb-2"></img>
						<h2 className="text-sm font-semibold w-48">{searchedTrack?.tracks?.items?.[2]?.album?.name}</h2>
					</div>
					<div className="flex flex-col align-middle justify-center w-48 text-center mr-8">
						<img src={searchedTrack?.tracks?.items?.[3]?.album?.images[0]?.url} className="h-48 w-48 rounded-md mb-2"></img>
						<h2 className="text-sm font-semibold w-48">{searchedTrack?.tracks?.items?.[3]?.album?.name}</h2>
					</div>
					<div className="flex flex-col align-middle justify-center w-48 h-auto text-center mr-8">
						<img src={searchedTrack?.tracks?.items?.[4]?.album?.images[0]?.url} className="h-48 w-48 rounded-md mb-2"></img>
						<h2 className="text-sm font-semibold w-48 h-1/4">{searchedTrack?.tracks?.items?.[4]?.album?.name}</h2>
					</div>
					<div className="flex flex-col align-middle justify-center w-48 text-center mr-8">
						<img src={searchedTrack?.tracks?.items?.[5]?.album?.images[0]?.url} className="h-48 w-48 rounded-md mb-2"></img>
						<h2 className="text-sm font-semibold w-48">{searchedTrack?.tracks?.items?.[5]?.album?.name}</h2>
					</div>
				</div>
			</div>
		</div> */}
	</div>

					{/* 3 more album names that will pop up */}
			{/* <div className="flex flex-row">
			<h2 className="text-3xl font-semibold justify-start">Albums</h2>
				

				<img src={searchedTrack?.tracks?.items?.[2]?.album?.images[0]?.url} className="h-32 w-32 rounded-full mr-8"></img>
				<h2 className="text-2xl font-semibold">{searchedTrack?.tracks?.items?.[2]?.album?.name}</h2>

				<img src={searchedTrack?.tracks?.items?.[3]?.album?.images[0]?.url} className="h-32 w-32 rounded-full mr-8"></img>
				<h2 className="text-2xl font-semibold">{searchedTrack?.tracks?.items?.[3]?.album?.name}</h2>
			</div> */}


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
