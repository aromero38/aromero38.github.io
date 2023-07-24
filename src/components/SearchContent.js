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
import { search } from 'superagent'


export default function UserProfile({providers}) {
	const {data: session} = useSession();
	const spotifyApi = useSpotify();
    const [mySearchInfo, setMySearchInfo] = useState([])


    const [searchValue, setSearchValue] = useState('');
    const handleInputChange = (event) => {
        setSearchValue(event.target.value);
      };

    const fetchSearch = () => {
        if (spotifyApi.getAccessToken()) {
            spotifyApi.searchTracks(searchValue)
            .then(function(data) {
                setMySearchInfo(data.body)
              console.log(`Search by ${searchValue}`, data.body);
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
			{/* username, image, etc.*/}
                <div className='field'>
                    <form>
                        <label>Search<input type="search" value={searchValue} onChange={handleInputChange}/></label>
                    </form>
                </div>
                <div className='text-white pl-10 flex flex-row w-full place-items-center'>
                    {/* <img src={mySearchInfo?.[1]?.images?.[0]?.url} className="h-32 w-32 rounded-full mr-8"></img> */}
                    <h2 className="text-2xl font-semibold">{mySearchInfo?.tracks?.items?.[0]?.name}</h2>
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