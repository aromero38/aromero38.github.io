import Head from 'next/head'
import {getProviders, signOut} from "next-auth/react"
import {useSession} from 'next-auth/react'
import spotifyApi from 'lib/spotify.js'
import MusicPlayer from './music-player.js'


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
      <div className='text-white flex flex-row justify-between w-full place-items-center'>
        <h1 className='text-white p-5 font-bold order-first'>LOGO | TUNEFY</h1>
        <div className='text-white p-5 font-bold order-end'>
          <button onClick={() => signOut({ callbackUrl: 'http://localhost:3000/' })}>sign out</button>
        </div>
      </div>

      {/* heading stuff - username, image, etc.*/}
      <div className='text-white pl-5 flex flex-row w-full place-items-center'>
        <img className='h-24 w-24 mr-12 rounded-full object-center' src={session?.user.image} />
        <p className='text-2xl'>Hello, {session?.user.name} </p>
      </div>

      {/* actual content */}
      <div className='bg-green-800 text-white w-full h-full'>
        <p>test</p>
        <button onClick={spotifyApi.skipToNext}>test</button>
      </div>

      {/* temp music player */}
      <MusicPlayer></MusicPlayer>
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