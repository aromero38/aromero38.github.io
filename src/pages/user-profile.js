import Head from 'next/head'
import {getProviders, signOut} from "next-auth/react"
import spotifyApi from 'lib/spotify'
import {useSession} from 'next-auth/react'
import { useEffect } from 'react'
import SpotifyWebApi from 'spotify-web-api-node'
import { currentlyPlayingSong } from "../../lib/spotify";


export default function UserProfile({providers}) {
  const {data: session} = useSession();

  return (
    <>
      <Head>
        <title>{session?.user.name} | Tunefy</title>
        <meta name="description" content="Spotify Statistic Tracker" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* nav stuff */}
      <h1 className='text-white p-5 pb-24 font-bold '>LOGO | TUNEFY</h1>
      <div className='text-white p-5 pb-24 font-bold '>
        <button onClick={() => signOut({ callbackUrl: 'http://localhost:3000/' })}>sign out</button>
      </div>

      {/* heading stuff - username, image, etc.*/}
      <div className='text-white pl-5 flex flex-row w-full place-items-center'>
        <img className='h-48 w-48 mr-12 rounded-full' src={session?.user.image} />
        <p className='text-2xl'>Hello, {session?.user.name}</p>
      </div>

      {/* actual content */}
      <div>

      </div>

      {/* music player */}
      <div>

      </div>
    </>
  );
}

export async function getServerSideProps(){
  const providers = await getProviders();

  return {
    props: {
      providers
    }
  }
}