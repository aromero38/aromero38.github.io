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


    // const fetchTop = async () => {
    //     try {
    //       const topArtists = await spotifyApi.getMyTopArtists();
    //       const topSongs = await spotifyApi.getMyTopTracks();
    //       setMyTopArtists(topArtists.body.items);
    //       setMyTopSongs(topSongs.body.items);
    //     } catch (error) {
    //       console.error('Error fetching top data:', error);
    //     }
    //   };
    
      // useEffect(() => {
      //   if (spotifyApi.getAccessToken()) {
      //     fetchTop(); // No need for then() here
      //   }
      // }, [spotifyApi, session]);
    
      useEffect(() => {
        // Use the state variables directly instead of passing them as arguments
        const fetchData = async () => {
          try {

            if(myTopArtists === null && myTopSongs === null){
            const topArtists = await spotifyApi.getMyTopArtists();
            const topSongs = await spotifyApi.getMyTopTracks();
            setMyTopArtists(topArtists.body.items);
            setMyTopSongs(topSongs.body.items);

            // Ensure myTopArtists and myTopSongs are not null before making the API call
            const body = {
              user_email: session.user.email,
              top_artists: topArtists.body.items,
              top_songs: topSongs.body.items,
            };
    
            const response = await fetch(`/api/setStats`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(body),
            });
    
            const fetchedData = await response.json();
            console.log(fetchedData);
          }
          } catch (error) {
            console.error('Error fetching data:', error);
          }
        };
    
        if (spotifyApi.getAccessToken()) {
          fetchData(); // No need for then() here
        }
        //fetchData(); // Call fetchData directly here
      }, [myTopArtists, myTopSongs, session]);

      
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

    return (
        <>  
            <div className='text-white w-full pb-64'>
                HELLO BITCH {user_id} my email is {session?.user?.email} :D
                {displayTopArtist(myTopArtists)}
                {displayTopSongs(myTopSongs)}
            </div>
        </>
    )
}

export default UserContent;