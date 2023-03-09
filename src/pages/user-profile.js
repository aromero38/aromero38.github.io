 import userProfile from '@/styles/user-profile.module.css'
import Head from 'next/head'
import {getProviders, signIn} from "next-auth/react"
import spotifyApi from 'lib/spotify'
import {useSession} from 'next-auth/react'
import Link from 'next/link'
import { useEffect } from 'react'
import SpotifyWebApi from 'spotify-web-api-node'
import { currentlyPlayingSong } from "../../lib/spotify";


export default async function UserProfile({providers}) {
  const {data: session} = useSession();

  const response = await currentlyPlayingSong();

  if (response.status === 204 || response.status > 400) {
    return res.status(200).json({ isPlaying: false });
  }

  const song = await response.json();

  if (song.item === null) {
    return res.status(200).json({ isPlaying: false });
  }

  const isPlaying = song.is_playing;
  const title = song.item.name;
  const artist = song.item.artists.map((_artist) => _artist.name).join(", ");
  const album = song.item.album.name;
  const albumImageUrl = song.item.album.images[0].url;
  const songUrl = song.item.external_urls.spotify;

  res.setHeader(
    "Cache-Control",
    "public, s-maxage=60, stale-while-revalidate=30"
  );

  return (
    <>
      <Head>
        <title>USER | Tunefy</title>
        <meta name="description" content="Spotify Statistic Tracker" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <div>
          <h1 className={userProfile.header}>LOGO | TUNEFY</h1>
          <div>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            {/* replace with padding */}
          </div>
          <div className={userProfile.test}>
            <div>
                <img className={userProfile.userImage} src="https://i.pinimg.com/236x/0a/87/04/0a8704e1cf2a194fe83cc6eee0220bf1.jpg"></img>
                {session?.user.name}
            </div>
          </div>
          {/*Music Player Template*/}
          <div>
           
          </div>
        </div>
      </main>
    </>
  );
}

export async function getServerSideProps(){
  const providers = await getProviders();

  return{
    props: {
      providers
    }
  }
}