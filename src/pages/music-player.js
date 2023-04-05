import {useSession} from 'next-auth/react'
import { useEffect, useState } from 'react';
import useSpotify from 'hooks/useSpotify';



const MusicPlayer = ({providers}) =>{
    const {data: session, status} = useSession();
    const spotifyApi = useSpotify();

    return(
        <>
        <div className='absolute bottom-0 w-full'>
        <center>   

          <p className='text-white' > </p>
          <p className='text-white' ><button onClick={() => {spotifyApi.play()}}>play</button> </p>
          <p className='text-white' ><button onClick={() => {spotifyApi.pause()}}>pause</button> </p>

          <button className='text-white' onClick={() => {spotifyApi.skipToNext()}}>
            &lt; &lt;
          </button>


          {/* <button className='text-white' onClick={spotifyApi.pause(session?.user.accessToken)}>
            <img className='h-12 w-12' src='https://www.freepnglogos.com/uploads/play-button-png/index-media-cover-art-play-button-overlay-5.png'/>
          </button> */}

          <button className='text-white' onClick={() => {spotifyApi.skipToPrevious()}}>
            &gt; &gt;
          </button>
        </center>
      </div>
      </>
    )
} 

export default MusicPlayer;
