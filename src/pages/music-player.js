import {useSession} from 'next-auth/react'
import spotifyApi from 'lib/spotify';
import SpotifyWebApi from 'spotify-web-api-node';
import {getMyCurrentPlayingTrack} from 'lib/spotify'
import { getToken } from 'next-auth/jwt';


const MusicPlayer = ({providers}) =>{
    const {data: session} = useSession();
    


    return(
        <>
        <div className='absolute bottom-0 w-full'>
        <center>
            {/* <p className='text-white' > test my token is {spotifyApi.getClientId()}</p> */}
          <button className='text-white' onClick={spotifyApi.skipToNext}>
            &lt; &lt;
          </button>

          <button className='text-white'>
            <img className='h-12 w-12' src='https://www.freepnglogos.com/uploads/play-button-png/index-media-cover-art-play-button-overlay-5.png'/>
          </button>

          <button className='text-white'>
            &gt; &gt;
          </button>
        </center>
      </div>
      </>
    )
} 

export default MusicPlayer;
