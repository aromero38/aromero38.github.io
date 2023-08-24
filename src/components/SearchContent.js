// spotify & auth stuff
import {getProviders, signOut} from "next-auth/react"
import {useSession} from 'next-auth/react'
import { useEffect, useState } from "react";
import useSpotify from 'hooks/useSpotify.js'



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
		<div className='text-white w-100% pt-8 pl-8 pb-48 h-100%'>
			{/* search stuff */}
			<div className='pl-36flex justify-between flex-col items-start'>
				<form>
					<input type="search" value={searchValue} onChange={handleInputChange}/>
				</form>
			</div>

			<div className='mt-16 flex justify-between flex-col items-center'>
				{/* top album name that will pop up */}
				Top Result
				<img src={searchedTrack?.tracks?.items?.[0]?.album?.images[0]?.url} className="h-32 w-32 mr-8"></img>
				<h2 className="text-2xl font-semibold">{searchedTrack?.tracks?.items?.[0]?.album?.name}</h2>

				{/* top 3 artists that will pop up */}
				Artists
				<img src={searchedArtist?.artists?.items?.[0]?.images?.[0]?.url} className="h-32 w-32 rounded-full mr-8"></img>
				<h2 className="text-2xl font-semibold">{searchedArtist?.artists?.items?.[0]?.name}</h2>

				<img src={searchedArtist?.artists?.items?.[1]?.images?.[0]?.url} className="h-32 w-32 rounded-full mr-8"></img>
				<h2 className="text-2xl font-semibold">{searchedArtist?.artists?.items?.[1]?.name}</h2>

				<img src={searchedArtist?.artists?.items?.[2]?.images?.[0]?.url} className="h-32 w-32 rounded-full mr-8"></img>
				<h2 className="text-2xl font-semibold">{searchedArtist?.artists?.items?.[2]?.name}</h2>

				{/* top 3 songs that will pop up */}
				Songs
				<img src={searchedTrack?.tracks?.items?.[0]?.album?.images[0]?.url} className="h-32 w-32 rounded-full mr-8"></img>
				<h2 className="text-2xl font-semibold">{searchedTrack?.tracks?.items?.[0]?.name}</h2>

				<img src={searchedTrack?.tracks?.items?.[1]?.album?.images[0]?.url} className="h-32 w-32 rounded-full mr-8"></img>
				<h2 className="text-2xl font-semibold">{searchedTrack?.tracks?.items?.[1]?.name}</h2>

				<img src={searchedTrack?.tracks?.items?.[2]?.album?.images[0]?.url} className="h-32 w-32 rounded-full mr-8"></img>
				<h2 className="text-2xl font-semibold">{searchedTrack?.tracks?.items?.[2]?.name}</h2>

				{/* 3 more album names that will pop up */}
				Albums
				<img src={searchedTrack?.tracks?.items?.[1]?.album?.images[0]?.url} className="h-32 w-32 rounded-full mr-8"></img>
				<h2 className="text-2xl font-semibold">{searchedTrack?.tracks?.items?.[1]?.album?.name}</h2>

				<img src={searchedTrack?.tracks?.items?.[2]?.album?.images[0]?.url} className="h-32 w-32 rounded-full mr-8"></img>
				<h2 className="text-2xl font-semibold">{searchedTrack?.tracks?.items?.[2]?.album?.name}</h2>

				<img src={searchedTrack?.tracks?.items?.[3]?.album?.images[0]?.url} className="h-32 w-32 rounded-full mr-8"></img>
				<h2 className="text-2xl font-semibold">{searchedTrack?.tracks?.items?.[3]?.album?.name}</h2>

			</div>
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
