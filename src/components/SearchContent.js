// spotify & auth stuff
import { getProviders, signOut } from "next-auth/react"
import { useSession } from 'next-auth/react'
import { useEffect, useState } from "react";
import useSpotify from 'hooks/useSpotify.js'
import { PlayIcon, FaceFrownIcon } from '@heroicons/react/24/solid';

export default function UserProfile() {
	const {data: session} = useSession();
	const spotifyApi = useSpotify();
	const [searchValue, setSearchValue] = useState('');
	const [searchedTrack, setSearchedTrack] = useState('');
	const [searchedArtist, setSearchedArtist] = useState('');
	const [searchedAlbum, setSearchedAlbum] = useState('');
	const [selectedFilter, setSelectedFilter] = useState('All');
	const [selectedAlbum, setSelectedAlbum] = useState({});

	const handleInputChange = (event) => {
		if (event.target.value === null) {
			setSearchValue(null);
		}
		setSearchValue(event.target.value);
	};

	useEffect(() => {
		if (searchValue === null) {
			console.log(searchValue);
		}
		else {
			fetchSearch();
		}
	}, [spotifyApi, session, searchValue]);

	const fetchSearch = () => {
		if (spotifyApi.getAccessToken()) {
			//get tracks
			spotifyApi.searchTracks(`track:${searchValue}`)
				.then(function(data) {
					setSearchedTrack(data.body)
					console.log(`Search tracks by ${searchValue}`, data.body);
				}, 
				function(err) {
					console.error(err);
				}
			);

			//get albums
			spotifyApi.searchAlbums(`albums:${searchValue}`)
				.then(function(data) {
					setSearchedAlbum(data.body)
					console.log(`Search albums by ${searchValue}`, data.body);
				}, 
				function(err) {
					console.error(err);
				}
			);

			//get artists
			spotifyApi.searchArtists(`artist:${searchValue}`)
				.then(function(data) {
					setSearchedArtist(data.body)
					console.log(`Search for artists named ${searchValue}`, data.body);
				}, 
				function(err) {
					console.error(err);
				}
			);
		}
	};

	//
	// TOP RESULT
	//
	const displayTopResult = (searchedTrack) => {
		const topResult = []
		
		if (searchedTrack?.tracks?.items?.length > 0) {
			topResult.push(
				<div 
					className="w-[80%] h-[100%] group hover:scale-[100.5%]" 
					onClick={() => {
						spotifyApi.getAlbum(searchedTrack?.tracks?.items?.[0]?.album?.id)
							.then(function(data) {
								setSelectedAlbum(data.body)
								console.log(`Selected album: ${data?.body?.name}`, data.body);
							}, 
							function(err) {
								console.error(err);
							}
						);
						setSelectedFilter('Albums Tracks')
					}}>
					{/* Hover container */}
					<div className="relative h-full w-full rounded-md border-[1px] z-0">
						{/* gradient overlay */}
						<div className="absolute inset-0 rounded-md bg-gradient-to-b from-transparent to-black opacity-[0.98] group-hover:opacity-100 z-10"></div>
						{/* cover */}
						<img src={searchedTrack?.tracks?.items?.[0]?.album?.images[0]?.url} className="h-full w-full object-cover z-0 rounded-md"></img> 
						{/* text */}
						<div className="absolute bottom-[20px] left-2 px-4 text-white text-2xl font-bold opacity-100 group-hover:opacity-100 z-30 w-[75%]">
							<h2 className="text-2xl font-semibold">{searchedTrack?.tracks?.items?.[0]?.album?.name}</h2>
							<h2 className="text-sm font-semibold">{searchedTrack?.tracks?.items?.[0]?.album?.artists?.[0]?.name}</h2>
						</div>
						{/* play btn */}
						<div className="absolute bottom-[25px] right-10 text-white text-2xl font-bold z-30">
							<div className="h-12 w-12 bg-green-900 rounded-full hover:scale-105">
								<PlayIcon alt="Play" className="h-12 w-[52px] text-white scale-[75%]" onClick={() => spotifyApi.play({context_uri: searchedTrack?.tracks?.items?.[0]?.album?.uri})}  />
							</div>
						</div>
					</div>
				</div>
			)
		}
		else {
			topResult.push(
				<div className="flex flex-col border-white text-center justify-center w-[80%] h-[100%] rounded-md border-[0.1px] ">
					<FaceFrownIcon className="w-24 h-24 self-center" />
					<h2 className="text-2xl font-bold">No Results Found</h2>
				</div>
			)
		}
		return (				
		<>
			{topResult}
		</>
		)
	};

	const displayTopArtist = (searchedArtist, amount) => {
		const topArtists = [];
		for (let i = 0; i < amount; i++) {
			if (searchedArtist?.artists?.items?.[i]?.images?.[0]?.url) {
				topArtists.push(
					<div className="flex flex-row items-center pb-8">
						<div className="pr-4 group relative hover:bg-transparent hover:scale-[101%]">
							<img src={searchedArtist?.artists?.items?.[i]?.images?.[0]?.url} className="h-32 w-32 rounded-full" alt="Artist" />
							<div className="absolute -bottom-0.5 -left-0.5 h-12 w-12 bg-green-900 rounded-full opacity-0 group-hover:opacity-100 hover:scale-105">
								<PlayIcon alt="Play" className="h-12 w-[52px] text-white scale-[75%]" onClick={() => spotifyApi.play({ context_uri: searchedArtist?.artists?.items?.[i]?.uri })}/>
							</div>
						</div>
						<div className="w-80">
							<h2 className="text-2xl font-semibold truncate">{searchedArtist?.artists?.items?.[i]?.name}</h2>
						</div>
					</div>
				)
			}
		}

		if (topArtists.length == 0) {
			topArtists.push(
				<div className="flex flex-row items-center pb-8">
					<div className="pr-4">
						<div className="flex flex-col text-center justify-center h-32 w-32 rounded-full">
							<FaceFrownIcon className="scale-50" />
						</div>
					</div>
					<div className="w-[400px]">
						<h2 className="text-2xl font-semibold truncate">No Results Found</h2>
					</div>	
				</div>
			)
		}
		else {
			topArtists.push(
				<div className="flex flex-row items-center pb-8">
					<div className="border border-white rounded-2xl h-8 w-24 hover:scale-[102%]">
						<button className="pl-[7px] pt-1" onClick={() => setSelectedFilter('Artists')}><h1 className="font-bold">View More</h1></button>
					</div>
				</div>
			)
		}

		return(
		<>
			<h2 className="text-3xl font-semibold pb-4">Artists</h2>
			{topArtists}
		</>
		)
	};

	const displayTopTracks = (searchedTrack, amount) => {
		const topTracks = [];
		let sortedTracks = searchedTrack?.tracks?.items;
		sortedTracks?.sort((a, b) => b.popularity - a.popularity);
	
		for (let i = 0; i < amount; i++) {
		  const track = sortedTracks?.[i];
	
		  if (track?.album?.images[0]?.url) {
			topTracks.push(
				<div 
					className="flex flex-row items-center pb-8" 
					key={i}

					onClick={() => {
						spotifyApi.getAlbum(searchedTrack?.tracks?.items?.[i]?.album?.id)
							.then(function(data) {
								setSelectedAlbum(data.body)
								console.log(`Selected album: ${data?.body?.name}`, data.body);
							}, 
							function(err) {
								console.error(err);
							}
						);
						setSelectedFilter('Albums Tracks')
					}}
				>
					<div className="pr-4 group relative hover:bg-transparent hover:scale-[101%]">
						<img
							src={track?.album?.images[0]?.url}
							className="h-32 w-32 rounded-full"
							alt="Album Cover"
						/>
						<div className="absolute -bottom-0.5 -left-0.5 h-12 w-12 bg-green-900 rounded-full opacity-0 group-hover:opacity-100 hover:scale-105">
							<PlayIcon
							alt="Play"
							className="h-12 w-[52px] text-white scale-[75%]"
							onClick={() => spotifyApi.play({ uris: [track?.uri] })}
							/>
						</div>
					</div>
					<div className="w-80">
						<h2 className="text-2xl font-semibold truncate">{track?.name}</h2>
						<h2 className="text-sm">{track?.album?.artists?.[0]?.name}</h2>
					</div>
				</div>
			);
		  }
		}
	
		if (topTracks.length === 0) {
		  topTracks.push(
			<div className="flex flex-row items-center pb-8" key="no-results">
			  <div className="pr-4">
				<div className="flex flex-col text-center justify-center h-32 w-32 rounded-full">
				  <FaceFrownIcon className="scale-50" />
				</div>
			  </div>
			  <div className="w-[400px]">
				<h2 className="text-2xl font-semibold truncate">No Results Found</h2>
			  </div>
			</div>
		  );
		}
		else {
			topTracks.push(
				<div className="flex flex-row items-center pb-8">
					<div className="border border-white rounded-2xl h-8 w-24 hover:scale-[102%]">
						<button className="pl-[7px] pt-1" onClick={() => setSelectedFilter('Tracks')}><h1 className="font-bold">View More</h1></button>
					</div>
				</div>
			)
		}
	
		return (
		  <>
			<h2 className="text-3xl font-semibold pb-4">Tracks</h2>
			{topTracks}
		  </>
		);
	};

	const displayTopAlbums = (searchedAlbum, amount) => {
		const topAlbums = [];
		let sortedAlbums = searchedAlbum?.albums?.items;
		sortedAlbums?.sort((a, b) => b.popularity - a.popularity);
		for (let i = 1; i < amount; i++) {
			if (sortedAlbums?.[i]?.artists?.[0]?.name) {
				topAlbums.push(
					<div className="flex flex-col text-center h-56 w-48 mr-28 relative">
						<div className="h-8 mb-2">
							<h2 className="text-xs w-48 truncate">{sortedAlbums?.[i]?.artists?.[0]?.name}</h2>
							<h2 className="text-sm font-semibold w-48 truncate" >{sortedAlbums?.[i]?.name}</h2>
						</div>

						<div className="group h-48 w-48 relative hover:bg-transparent hover:scale-[101%]">
							<img 
								src={sortedAlbums?.[i]?.images[0]?.url} 
								className="h-48 w-48 rounded-md mb-2" 
								onClick={() => {
									spotifyApi.getAlbum(sortedAlbums?.[i]?.id)
										.then(function(data) {
											setSelectedAlbum(data.body)
											console.log(`Selected album: ${data?.body?.name}`, data.body);
										}, 
										function(err) {
											console.error(err);
										}
									);
									setSelectedFilter('Albums Tracks')
								}}>
							</img>
							<div className="absolute bottom-2 left-2 h-12 w-12 bg-green-900 rounded-full opacity-0 group-hover:opacity-100 hover:scale-105">
								<PlayIcon alt="Play" className="h-12 w-[52px] text-white scale-[75%]" onClick={() => spotifyApi.play({ context_uri: sortedAlbums?.[i]?.uri })}/>
							</div>
						</div>
					</div>
				)
			}
		}

		if (topAlbums.length == 0) {
			topAlbums.push(
				<div className="flex flex-col h-48 w-48 border-2 border-white rounded-lg text-center justify-center">
					<FaceFrownIcon className="w-8 h-8 self-center" />
					<h2 className="text-sm w-48 font-bold">No Results Found</h2>					
				</div>
			)
		}

		return(
		<>
			<div className="flex flex-col h-96 w-full">
				<div className="flex flex-col">
					<h2 className="text-3xl font-semibold pb-10">Albums</h2>
					<div className="flex flex-row justify-start">
						{topAlbums}
					</div>
					{(topAlbums.length > 1) ?
						<div className="border border-white rounded-2xl h-8 w-24 mt-8 hover:scale-[102%]">
							<button className="pl-2 pt-1" onClick={() => setSelectedFilter('Albums')}><h1 className="font-bold">View More</h1></button>
						</div>
					: null}
				</div>
			</div>
		</>
		)
	};

	//
	// ALBUM / ARTIST PAGES
	//
	const displayAlbumTracks = () => {
		const albumTracks = []
		const pageLength = `w-100% h-[${Math.round(76 * selectedAlbum?.tracks?.items?.length)}px] mt-4 mx-20 text-white relative mb-20`

		for (let i = 0; i < selectedAlbum?.tracks?.items?.length; i++) {
			albumTracks.push(
				<>
				<div className="flex flex-row group">
					<div>
						<h1 className="opacity-[50%] pr-4 group-hover:hidden">{i + 1}</h1>
						<PlayIcon 
							alt="Play" 
							className="text-white hidden group-hover:block h-6 w-6 mr-2" 
							onClick={() => spotifyApi.play({ context_uri: selectedAlbum?.tracks?.items?.[i]?.uri })}/>
					</div>
					<h2 className="text-xl font-semibold truncate">{selectedAlbum?.tracks?.items?.[i]?.name}</h2>
				</div>
				<hr className="w-[50%] pb-12 opacity-[10%]"></hr>
				</>
			);
		}
	
		return (
			<>
			<div className={pageLength}>
				<div className="text-white relative mb-16">
					<div className="border border-white rounded-2xl h-8 w-24 mt-8 hover:scale-[102%]">	
						<button className="pl-4 pt-1" onClick={() => setSelectedFilter('All')}><h1 className="font-bold">Go Back</h1></button>
					</div>
				</div>
				<div className="flex flex-row ml-16">
					<div className="flex flex-col w-1/3 mr-48">
						<img className="rounded-lg mb-4" src={selectedAlbum?.images?.[0]?.url}></img>
						<h2 className="text-4xl font-bold text-white">{selectedAlbum?.name}</h2>
						<h2 className="text-lg font-bold text-white">{selectedAlbum?.artists?.[0]?.name}</h2>

						<h2 className="text-md font-bold text-white opacity-[35%] pt-4">Released: {selectedAlbum?.release_date}</h2>
						<h2 className="text-md font-bold text-white opacity-[35%]">{selectedAlbum?.tracks?.items?.length} Tracks</h2>
					</div>
					<div className="flex flex-col w-3/4">
						{albumTracks}
					</div>
				</div>
			</div>
			</>
		)
	}

	//
	// FILTERED RESULTS
	//
	const displayAllFilter = () => {
		return(	<>
			{/* search content */}
			{searchedTrack != null && searchedArtist != null ? 
				<div className="w-100% h-[1100px] mt-20 mx-20 text-white relative mb-20">
					<div className="text-white relative mb-20">
					</div>
					{/* top / artists / tracks */}
					<div className="flex flex-row h-3/4 justify-center mb-32">
						<div className="flex flex-col w-1/3">
							{displayTopResult(searchedTrack)}
						</div>
						<div className="flex flex-col w-1/3">
							{displayTopArtist(searchedArtist, 5)}
						</div>
						<div className="flex flex-col w-1/3">
							{displayTopTracks(searchedTrack, 5)}
						</div>
					</div>
	
					{/* albums */}
					<div className="flex flex-row h-1/4 justify-start mb-20">
						{displayTopAlbums(searchedAlbum, 7)}
					</div>
				</div>
	
				: <div className="h-[575px]"></div>
			}
		</>)
	};

	const displayAlbumsFilter = () => {
		// Ensure searchedTrack exists and has tracks
		if (!searchedAlbum) {
		  return (
			<div className="h-[575px]"></div>
		  );
		}
	  
		const albums = searchedAlbum.albums.items;
	  
		const rows = [];
		const albumsPerRow = 6;
	  
		// Divide tracks into rows
		for (let i = 0; i < albums.length; i += albumsPerRow) {
		  const row = albums.slice(i, i + albumsPerRow);
		  const albumsRow = row.map((album, index) => (
			<div className="flex flex-col text-center h-56 w-48 mr-28 relative mb-20">
				<div className="h-8 mb-2">
					<h2 className="text-xs w-48 truncate">{album?.artists?.[0]?.name}</h2>
					<h2 className="text-sm font-semibold w-48 truncate">{album?.name}</h2>
				</div>
				<div className="group h-48 w-48 relative hover:bg-transparent hover:scale-[101%]">
					<img 
						src={album?.images[0]?.url} 
						className="h-48 w-48 rounded-md mb-2"
						onClick={() => {
							spotifyApi.getAlbum(album?.id)
								.then(function(data) {
									setSelectedAlbum(data.body)
									console.log(`Selected album: ${data?.body?.name}`, data.body);
								}, 
								function(err) {
									console.error(err);
								}
							);
							setSelectedFilter('Albums Tracks')
						}} 
					/>
					<div className="absolute bottom-2 left-2 h-12 w-12 bg-green-900 rounded-full opacity-0 group-hover:opacity-100 hover:scale-105">
						<PlayIcon alt="Play" className="h-12 w-[52px] text-white scale-[75%]" onClick={() => spotifyApi.play({ context_uri: album?.uri })} />
					</div>
				</div>
			</div>
		  ));
	  
		  rows.push(
			<div className="flex flex-row items-start" key={`track-row-${i}`}>
			  {albumsRow}
			</div>
		  );
		}
	  
		return (
		  <div className="w-100% h-[1100px] mt-4 mx-20 text-white relative mb-20">
			<div className="text-white relative mb-16">
				<div className="border border-white rounded-2xl h-8 w-24 mt-8 hover:scale-[102%]">	
					<button className="pl-4 pt-1" onClick={() => setSelectedFilter('All')}><h1 className="font-bold">Go Back</h1></button>
				</div>
			</div>
			{rows}
		  </div>
		);
	};

	const displayArtistsFilter = () => {
		// Ensure searchedTrack exists and has tracks
		if (!searchedArtist) {
		  return (
			<div className="h-[575px]"></div>
		  );
		}
	  
		const artists = searchedArtist.artists.items;
	  
		const rows = [];
		const artistsPerRow = 3;
	  
		// Divide tracks into rows
		for (let i = 0; i < artists.length; i += artistsPerRow) {
			const row = artists.slice(i, i + artistsPerRow);
			const artistRow = row.map((artist, index) => (
				<div className="flex flex-row items-center pb-12">
					<div className="pr-4 group relative hover:bg-transparent hover:scale-[101%]">
						<img src={artist?.images?.[0]?.url} className="h-32 w-32 rounded-full" alt="Artist" />
						<div className="absolute -bottom-0.5 -left-0.5 h-12 w-12 bg-green-900 rounded-full opacity-0 group-hover:opacity-100 hover:scale-105">
							<PlayIcon alt="Play" className="h-12 w-[52px] text-white scale-[75%]" onClick={() => spotifyApi.play({ context_uri: artist?.uri })}/>
						</div>
					</div>
					<div className="w-80 mr-20">
						<h2 className="text-2xl font-semibold truncate">{artist?.name}</h2>
					</div>
				</div>
		  ));
	  
		  rows.push(
			<div className="flex flex-row items-start" key={`track-row-${i}`}>
			  {artistRow}
			</div>
		  );
		}
	  
		return (
			<div className="w-100% h-[1100px] mt-4 mx-20 text-white relative mb-20">
				<div className="text-white relative mb-16">
					<div className="border border-white rounded-2xl h-8 w-24 mt-8 hover:scale-[102%]">	
						<button className="pl-4 pt-1" onClick={() => setSelectedFilter('All')}><h1 className="font-bold">Go Back</h1></button>
					</div>
				</div>
				{rows}
			</div>
		);
	};

	const displayTracksFilter = () => {
		// Ensure searchedTrack exists and has tracks
		if (!searchedTrack) {
		  return (
			<div className="h-[575px]"></div>
		  );
		}
	  
		const tracks = searchedTrack.tracks.items;
	  
		const rows = [];
		const tracksPerRow = 2;

		// Divide tracks into rows
		for (let i = 0; i < tracks.length; i += tracksPerRow) {
			const row = tracks.slice(i, i + tracksPerRow);
			const trackRow = row.map((track, index) => (
				<div 
					className="flex flex-row items-center pb-12" 
					key={track.id}
					onClick={() => {
						spotifyApi.getAlbum(searchedTrack?.tracks?.items?.[i]?.album?.id)
							.then(function(data) {
								setSelectedAlbum(data.body)
								console.log(`Selected album: ${data?.body?.name}`, data.body);
							}, 
							function(err) {
								console.error(err);
							}
						);
						setSelectedFilter('Albums Tracks')
					}}>
					<div className="pr-4 group relative hover:bg-transparent hover:scale-[101%]">
						<img
							src={track.album.images[0]?.url}
							className="h-32 w-32 rounded-full"
							alt="Album Cover"
						/>
						<div className="absolute -bottom-0.5 -left-0.5 h-12 w-12 bg-green-900 rounded-full opacity-0 group-hover:opacity-100 hover:scale-105">
						<PlayIcon
							alt="Play"
							className="h-12 w-[52px] text-white scale-[75%]"
							onClick={() => spotifyApi.play({ uris: [track.uri] })}
						/>
						</div>
					</div>
					<div className="w-[575px] mr-32">
						<h2 className="text-2xl font-semibold truncate">{track.name}</h2>
						<h2 className="text-sm">{track.album.artists[0]?.name}</h2>
					</div>
				</div>
			));
		
			rows.push(
				<div className="flex flex-row items-start" key={`track-row-${i}`}>
					{trackRow}
				</div>
			);
		}
	  
		return (
			<div className="w-100% h-[1600px] mt-4 mx-20 text-white relative mb-20">
				<div className="text-white relative mb-16">
					<div className="border border-white rounded-2xl h-8 w-24 mt-8 hover:scale-[102%]">	
						<button className="pl-4 pt-1" onClick={() => setSelectedFilter('All')}><h1 className="font-bold">Go Back</h1></button>
					</div>
				</div>
				{rows}
			</div>
		);
	};

	const filterContent = () => {
		switch (selectedFilter) {
		  case 'Albums':
			return (
			  <>
				{displayAlbumsFilter()}
			  </>
			);
		  case 'Albums Tracks': 
			return(
				<>
					{displayAlbumTracks()}
				</>
			)
		  case 'Artists':
			return (
			  <>
				{displayArtistsFilter()}
			  </>
			);
		  case 'Tracks':
			return (
			  <>
				{displayTracksFilter()}
			  </>
			);
		  default:
			return (
				<>
				  {displayAllFilter()}
				</>
			  );
		}
	};


	//
	// MAIN
	//
	return (
		<>
			{/* search bar */}
			<div className='bg-black pt-[24px] pb-[30px] border-b-[1px] border-gray-500 text-white sticky top-0 z-50'>
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
			
			<div>
				{filterContent()}
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
