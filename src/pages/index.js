import Head from 'next/head'
import {getProviders, signIn} from "next-auth/react"
import spotifyApi from 'lib/spotify'
import {useSession} from 'next-auth/react'
import Link from 'next/link'
import ParticlesComponent from '@/components/Particles'


export default function Home({providers}) {
  const {data: session} = useSession();

  return (
    <>
      <Head>
        <title>Tunefy</title>
        <meta name="description" content="Spotify Statistic Tracker" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* top gradient */}
      <div className='w-full h-1/6 bg-gradient-to-b from-black fixed z-10 ' />
      
      {/* particles */}
      <div className='z-5 fixed'>
        <ParticlesComponent />
      </div>

      {/* content */}
      <div className='w-full fixed top-1/3 flex flex-col items-center'>
        <h2 className="welcome"> Welcome to Tunefy </h2>
        <h1 className='text-white text-2xl  text-center mx-auto my-auto font-' > View your spotify stats and share them with anyone </h1>
        <h1 className='text-white text-2xl  text-center mx-auto my-auto pb-10'> Get music recommendations, listen to music, and more </h1>
        
        {/* login button */}
        <div className='rounded-full bg-green-500 text-white font-bold p-3.5 hover:bg-green-600 gap-x-5'>
          {Object.values(providers).map((provider) => (
            <button onClick={() => signIn(provider.id, {callbackUrl: "/user-profile"})}>
              Login With {provider.name}
            </button>
          ))}
        </div>
      </div>
            
      {/* bottom gradient */}
      <div className='w-full h-1/6 bg-gradient-to-t from-black absolute z-10 bottom-0'/>
    </>
  )
}

//allows the api call to spotify on the server-side
export async function getServerSideProps() {
  const providers = await getProviders();

  return {
    props: {
      providers
    }
  }
}