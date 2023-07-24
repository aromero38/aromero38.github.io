import { useSession} from "next-auth/react";
import { useEffect, useState } from 'react';

import useSpotify from 'hooks/useSpotify.js';
import useTop from "hooks/useTop";
//import useTopArtists from 'hooks/useTopArtists.js';

const UserContent = ({providers}) => {
    const spotifyApi = useSpotify();
    const {data: session, status} = useSession();
	const [myTopArtists, setMyTopArtists] = useState([])
    const [myTopSongs, setmyTopSongs] = useState([])

    const topArtists = useTop();
    const topSongs = useTop();

    spotifyApi.getMyTopTracks()
    .then(function(data) {
      let topTracks = data.body.items;
      console.log(topTracks);
    }, function(err) {
      console.log('Something went wrong!', err);
    });

    const fetchTop = () => {
        if(!topArtists){
            spotifyApi.getMyTopArtists()
            .then(function(data) {
                setMyTopArtists(data.body.items);
            }, function(err) {
              console.log('Something went wrong!', err);
            });
        }
        if(!topSongs){
            spotifyApi.getMyTopTracks()
            .then(function(data) {
            setmyTopSongs(data.body.items);
            }, function(err) {
            console.log('Something went wrong!', err);
            });
        }
    }


    useEffect(() => {
        if(spotifyApi.getAccessToken()){
            fetchTop();
        }
    }, [spotifyApi, session]);


    return (
        <>  
            <div className='text-white w-full pb-64'>
                <div className='mt-16 flex justify-between flex-col items-center'>
                    <h3 className="text-3xl font-bold pb-16 ">Top Artists</h3>

                    <div className="flex flex-row place-items-center justify-start pb-8 w-1/4 ml-8">
                        <img src={myTopArtists?.[0]?.images?.[0]?.url} className="h-32 w-32 rounded-full mr-8"></img>
                        <a href={myTopArtists?.[0]?.external_urls?.spotify} target="_blank"><h2 className="text-2xl font-semibold">{myTopArtists?.[0]?.name}</h2></a>
                    </div>

                    <div className="flex flex-row place-items-center justify-start pb-8 w-1/4 ml-8">
                        <img src={myTopArtists?.[1]?.images?.[0]?.url} className="h-32 w-32 rounded-full mr-8"></img>
                        <a href={myTopArtists?.[1]?.external_urls?.spotify} target="_blank"><h2 className="text-2xl font-semibold">{myTopArtists?.[1]?.name}</h2></a>
                    </div>

                    <div className="flex flex-row place-items-center justify-start pb-8 w-1/4 ml-8">
                        <img src={myTopArtists?.[2]?.images?.[0]?.url} className="h-32 w-32 rounded-full mr-8"></img>
                        <a href={myTopArtists?.[2]?.external_urls?.spotify} target="_blank"><h2 className="text-2xl font-semibold">{myTopArtists?.[2]?.name}</h2></a>
                    </div>

                    <div className="flex flex-row place-items-center justify-start pb-8 w-1/4 ml-8">
                        <img src={myTopArtists?.[3]?.images?.[0]?.url} className="h-32 w-32 rounded-full mr-8"></img>
                        <a href={myTopArtists?.[3]?.external_urls?.spotify} target="_blank"><h2 className="text-2xl font-semibold">{myTopArtists?.[3]?.name}</h2></a>
                    </div>

                    <div className="flex flex-row place-items-center justify-start pb-8 w-1/4 ml-8">
                        <img src={myTopArtists?.[4]?.images?.[0]?.url} className="h-32 w-32 rounded-full mr-8"></img>
                        <a href={myTopArtists?.[4]?.external_urls?.spotify} target="_blank"><h2 className="text-2xl font-semibold">{myTopArtists?.[4]?.name}</h2></a>
                    </div>
                </div>

                <div className='mt-32 flex justify-between flex-col items-center'>
                    <h3 className="text-3xl font-bold pb-8">Top Songs</h3>

                    <div className="flex flex-row place-items-center justify-start pb-8 w-1/4 ml-8">
                        <img src={myTopSongs?.[0]?.album?.images?.[1].url} className="h-32 w-32 rounded-lg mr-8"></img>
                        <div className="flex flex-col">
                        <a href={myTopSongs?.[0]?.external_urls?.spotify} target="_blank"><h2 className="text-2xl font-semibold"> {myTopSongs?.[0]?.name}</h2></a>
                            <h2 className="text-xl">{myTopSongs?.[0]?.artists?.[0]?.name}</h2>
                        </div>
                    </div>

                    <div className="flex flex-row place-items-center justify-start pb-8 w-1/4 ml-8">
                        <img src={myTopSongs?.[1]?.album?.images?.[1].url} className="h-32 w-32 rounded-lg mr-8"></img>
                        <div>
                        <a href={myTopSongs?.[1]?.external_urls?.spotify} target="_blank"><h2 className="text-2xl font-semibold"> {myTopSongs?.[1]?.name}</h2></a>
                            <h2 className="text-xl">{myTopSongs?.[1]?.artists?.[0]?.name}</h2>
                        </div>
                    </div>

                    <div className="flex flex-row place-items-center justify-start pb-8 w-1/4 ml-8">
                        <img src={myTopSongs?.[2]?.album?.images?.[1].url} className="h-32 w-32 rounded-lg mr-8"></img>
                        <div>
                        <a href={myTopSongs?.[2]?.external_urls?.spotify} target="_blank"><h2 className="text-2xl font-semibold"> {myTopSongs?.[2]?.name}</h2></a>
                            <h2 className="text-xl">{myTopSongs?.[2]?.artists?.[0]?.name}</h2>
                        </div>
                    </div>

                    <div className="flex flex-row place-items-center justify-start pb-8 w-1/4 ml-8">
                        <img src={myTopSongs?.[3]?.album?.images?.[1].url} className="h-32 w-32 rounded-lg mr-8"></img>
                        <div>
                        <a href={myTopSongs?.[3]?.external_urls?.spotify} target="_blank"><h2 className="text-2xl font-semibold"> {myTopSongs?.[3]?.name}</h2></a>
                            <h2 className="text-xl">{myTopSongs?.[3]?.artists?.[0]?.name}</h2>
                        </div>
                    </div>

                    <div className="flex flex-row place-items-center justify-start pb-8 w-1/4 ml-8">
                        <img src={myTopSongs?.[4]?.album?.images?.[1].url} className="h-32 w-32 rounded-lg mr-8"></img>
                        <div className="w-auto">
                        <a href={myTopSongs?.[4]?.external_urls?.spotify} target="_blank"><h2 className="text-2xl font-semibold"> {myTopSongs?.[4]?.name}</h2></a>
                            <h2 className="text-xl">{myTopSongs?.[4]?.artists?.[0]?.name}</h2>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default UserContent;