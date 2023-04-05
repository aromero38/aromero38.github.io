import {useSession} from 'next-auth/react'
import spotifyApi from 'lib/spotify';
import SpotifyWebApi from 'spotify-web-api-node';
import {getMyCurrentPlayingTrack} from 'lib/spotify'
import { getToken } from 'next-auth/jwt';
import useSpotify from '/hooks/useSpotify.js';
import { useEffect, useState } from 'react';


const MusicPlayer = ({providers}) =>{
    const spotifyApi = useSpotify();
    const {data: session} = useSession();
    const [playlists, setPlaylists] = useState([])

    useEffect(() => {
      if(spotifyApi.getAccessToken()){
          spotifyApi.getUserPlaylists(session).then((data) => {
            setPlaylists(data.items);
          });
      }
    }, [session, spotifyApi]);

    console.log(playlists);


    return(
        <>
        <div className='absolute bottom-0 w-full'>
        <center>   
            {/* <p className='text-white' > test my token is {session?.user.accessToken} </p> */}
            <p className='text-white' > test <button onClick={() => {spotifyApi.playNext()}}>pause</button> </p>

            {playlists.map((playlist) => (
              <p key={playlist.id} className='text-white'>
                {playlist.name}
              </p>
            ))}

          <button className='text-white'>
            &lt; &lt;
          </button>

          {/* <button className='text-white' onClick={spotifyApi.pause(session?.user.accessToken)}>
            <img className='h-12 w-12' src='https://www.freepnglogos.com/uploads/play-button-png/index-media-cover-art-play-button-overlay-5.png'/>
          </button> */}

          <button className='text-white'>
            &gt; &gt;
          </button>
        </center>
      </div>
      </>
    )
} 

export default MusicPlayer;
