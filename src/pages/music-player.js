import {useSession} from 'next-auth/react'
import { useEffect, useState } from 'react';
import useSpotify from 'hooks/useSpotify';



const MusicPlayer = ({providers}) =>{
    const {data: session, status} = useSession();
    const spotifyApi = useSpotify();

    
    return(
        <>
        <div className='absolute bottom-0 w-full bg-green-800'>
        <center>   

          <p className='text-white' ><button onClick={() => {spotifyApi.play()}}>play</button> </p>
          <p className='text-white' ><button onClick={() => {spotifyApi.pause()}}>pause</button> </p>
          <p className='text-white'><button onClick={() => {spotifyApi.play({context_uri: 'spotify:album:1hWngwO1drEAJXsUV8dSdA'})}}>Play Love's A Disaster by BWK</button></p>

          <button className='text-white' onClick={() => {spotifyApi.skipToPrevious()}}>
            &lt; &lt;
          </button>


          {/* <button className='text-white' onClick={() => {spotifyApi.pause()}}>
            <img className='h-12 w-12' src='https://www.freepnglogos.com/uploads/play-button-png/index-media-cover-art-play-button-overlay-5.png'/>
          </button> */}

          

          <button className='text-white' onClick={() => {spotifyApi.skipToNext()}}>
            &gt; &gt;
          </button>
        </center>
      </div>
      </>
    )
} 

export default MusicPlayer;
