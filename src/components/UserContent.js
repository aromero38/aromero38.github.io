import { useSession, getProviders, signOut } from "next-auth/react";
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
            <div className='bg-gradient-to-t from-green-500 to-black absolute text-white h-full w-full'>
                <p>Top 5 Artists:</p>
                    <img src={myTopArtists?.[0]?.images?.[1]?.url}></img>
                    <img src={myTopArtists?.[1]?.images?.[1]?.url}></img> 
                    <img src={myTopArtists?.[2]?.images?.[1]?.url}></img>  
                    <ol>
                        <li>{myTopArtists?.[0]?.name}</li>
                        <li>{myTopArtists?.[1]?.name}</li>
                        <li>{myTopArtists?.[2]?.name}</li>
                    </ol>
                <br></br>
                <p>Top 5 songs</p>
                    <img src={myTopSongs?.[0]?.album?.images?.[1].url}></img>
                    <img src={myTopSongs?.[1]?.album?.images?.[1].url}></img> 
                    <img src={myTopSongs?.[2]?.album?.images?.[1].url}></img> 
                    <ol>
                        <li>{myTopSongs?.[0]?.name}</li>
                        <li>{myTopSongs?.[1]?.name}</li>
                        <li>{myTopSongs?.[2]?.name}</li>
                        <li>{myTopSongs?.[3]?.name}</li>
                        <li>{myTopSongs?.[4]?.name}</li>
                    </ol>
            </div>
        </>
    )
}

export default UserContent;