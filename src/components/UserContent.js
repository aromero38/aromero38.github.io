import { useSession} from "next-auth/react";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import useSpotify from 'hooks/useSpotify.js';

const UserContent = () => {
    const router = useRouter();
    const user_id = router.query.user === undefined ? '' : (router.query.user).toString();

    const spotifyApi = useSpotify();
    const {data: session} = useSession();
	  const [myTopArtists, setMyTopArtists] = useState(null)
    const [myTopSongs, setMyTopSongs] = useState(null)
    const [displayedTopArtists, setDisplayedTopArtists] = useState(null);
    const [displayedTopSongs, setDisplayedTopSongs] = useState(null);
    
    useEffect(() => {
        const fetchData = async () => {
        try {
            if(myTopArtists === null && myTopSongs === null){
              const topArtists = await spotifyApi.getMyTopArtists();
              const topSongs = await spotifyApi.getMyTopTracks();
              setMyTopArtists(topArtists.body.items);
              setMyTopSongs(topSongs.body.items);

              const body = {
                user_email: session.user.email,
                top_artists: topArtists.body.items,
                top_songs: topSongs.body.items,
              };

              const setStats = await fetch(`/api/setStats`, {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify(body),
              });

              const setStatsResponse = await setStats.json();
              console.log(setStatsResponse);

              const getStats = await fetch(`/api/getStats?user_id=${user_id}&user_email=${session.user.email}`);
              const getStatsResponse = await getStats.json();
              setDisplayedTopArtists(getStatsResponse.topArtists);
              setDisplayedTopSongs(getStatsResponse.topSongs);

            }
            
          } catch (error) {
            console.error('Error fetching data:', error);
          }
        };

        if (spotifyApi.getAccessToken()) {
          fetchData();
        }

          
    }, [myTopArtists, myTopSongs, session]);

      
    const displayTopArtist = (displayedTopArtists) => {
        
        const topArtists = [];
        for(let i = 0; i < 5; i++){
            topArtists.push(
                <>
                    <div className="flex flex-row place-items-center justify-start pb-8 w-1/4 ml-8">
                        <img src={displayedTopArtists?.[i]?.artist_info?.images?.[0]?.url} className="h-32 w-32 rounded-full mr-8"></img>
                        <a href={displayedTopArtists?.[i]?.artist_info?.external_urls?.spotify} target="_blank"><h2 className="text-2xl font-semibold">{displayedTopArtists?.[i]?.artist_info?.name}</h2></a>
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

    const displayTopSongs = (displayedTopSongs) => {
        
        const topSongs = [];
        for(let i = 0; i < 5; i++){
            topSongs.push(
                <>
                    <div className="flex flex-row place-items-center justify-start pb-8 w-1/4 ml-8">
                        <img src={displayedTopSongs?.[i]?.song_info?.album?.images?.[1].url} className="h-32 w-32 rounded-lg mr-8"></img>
                        <div>
                            <a href={displayedTopSongs?.[i]?.song_info?.external_urls?.spotify} target="_blank"><h2 className="text-2xl font-semibold"> {displayedTopSongs?.[i]?.song_info?.name}</h2></a>
                            <h2 className="text-xl">{displayedTopSongs?.[i]?.song_info?.artists?.[0]?.name}</h2>
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

    return (
        <>  
            <div className='text-white w-full pb-64'>
                {displayTopArtist(displayedTopArtists)}
                {displayTopSongs(displayedTopSongs)}
            </div>
        </>
    )
}

export default UserContent;