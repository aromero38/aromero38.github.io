import { useSession} from "next-auth/react";
import { useEffect, useState } from 'react';

import useSpotify from 'hooks/useSpotify.js';
//import useTopArtists from 'hooks/useTopArtists.js';

const UserContent = () => {
    const spotifyApi = useSpotify();
    const {data: session} = useSession();
	const [myTopArtists, setMyTopArtists] = useState([])
    const [myTopSongs, setmyTopSongs] = useState([])

    spotifyApi.getMyTopTracks()
    .then(
        function(data) {
            let topTracks = data.body.items;
            console.log(topTracks);
        }, 
        function(err) {
            console.log('Something went wrong!', err);
        }
    );

    const fetchTop = () => {
            spotifyApi.getMyTopArtists()
            .then(
                function(data) {
                    setMyTopArtists(data.body.items);
                }, 
                function(err) {
                    console.log('Something went wrong!', err);
                }
            );

            spotifyApi.getMyTopTracks()
            .then(
                function(data) {
                    setmyTopSongs(data.body.items);
                }, 
                function(err) {
                    console.log('Something went wrong!', err);
                }
            );
    }

    const displayTopArtist = (myTopArtists) => {
        
        const topArtists = [];
        for(let i = 0; i < 5; i++){
            topArtists.push(
                <>
                    <div className="flex flex-row place-items-center justify-start pb-8 w-1/4 ml-8">
                        <img src={myTopArtists?.[i]?.images?.[0]?.url} className="h-32 w-32 rounded-full mr-8"></img>
                        <a href={myTopArtists?.[i]?.external_urls?.spotify} target="_blank"><h2 className="text-2xl font-semibold">{myTopArtists?.[i]?.name}</h2></a>
                    </div>
                </>
            )
        }
        return(
            <>
                <div className='mt-16 flex justify-between flex-col items-center'>
                    <h3 className="text-3xl font-bold pb-16 ">Top Artists</h3>
                    {topArtists}
                </div>
            </>
        )
    }

    const displayTopSongs = (myTopSongs) => {
        
        const topSongs = [];
        for(let i = 0; i < 5; i++){
            topSongs.push(
                <>
                    <div className="flex flex-row place-items-center justify-start pb-8 w-1/4 ml-8">
                        <img src={myTopSongs?.[i]?.album?.images?.[1].url} className="h-32 w-32 rounded-lg mr-8"></img>
                        <div>
                            <a href={myTopSongs?.[i]?.external_urls?.spotify} target="_blank"><h2 className="text-2xl font-semibold"> {myTopSongs?.[i]?.name}</h2></a>
                            <h2 className="text-xl">{myTopSongs?.[i]?.artists?.[0]?.name}</h2>
                        </div>
                    </div>
                </>
            )
        }
        return(
            <>
             <div className='mt-32 flex justify-between flex-col items-center'>
                    <h3 className="text-3xl font-bold pb-8">Top Songs</h3>
                    {topSongs}
                </div>
            </>
        )
    }


    useEffect(() => {
        if (spotifyApi.getAccessToken()) {
            fetchTop();
        }
    }, [spotifyApi, session]);


    return (
        <>  
            <div className='text-white w-full pb-64'>
                {displayTopArtist(myTopArtists)}
                {displayTopSongs(myTopSongs)}
            </div>
        </>
    )
}

export default UserContent;