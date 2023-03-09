import Head from 'next/head'
import index from '@/styles/index.module.css'
import {getProviders, signIn} from "next-auth/react"
import spotifyApi from 'lib/spotify'
import {useSession} from 'next-auth/react'
import Link from 'next/link'


export default function Home({providers}) {
const {data: session} = useSession();


  return (
    <>
      <Head className={index.background}>
        <title>Tunefy</title>
        <meta name="description" content="Spotify Statistic Tracker" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <div>
          <h1 className={index.header}>LOGO | TUNEFY</h1>
          <div className={index.text}>
            <div>
              <center style={{fontSize: 56}}>WELCOME TO TUNEFY
              <div style={{fontSize:20}}>
                View your Spotify stats and share them with anyone <br></br>
                Get music recommendations, listen to music, and more
              </div></center>
            </div>
            {/* Login button that takes you to authentication */}
            {Object.values(providers).map((provider) =>(
            <div key={provider.name}>
                  <center style={{fontSize: 24}}><button className={index.button} onClick={() => signIn(provider.id, {callbackUrl: "/"})}>Login with {provider.name}</button></center>
            </div>
            ))}
            <div>
              {/* Hello "User" */}
              Hello, {session?.user.name}
            </div>
            <div>
              {/* temp link to user page */}
            <Link href="/user-profile"><button>Go here</button></Link>
            Current Song: {spotifyApi.getMyCurrentPlayingTrack}
            </div>
            <div>
              {/* Temp Visualizer lol */}
              <center><img src='https://media.tenor.com/7rfVkJl_3igAAAAC/visualizer-colorful.gif'></img></center>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}

//allows the api call to spotify on the server-side
export async function getServerSideProps(){
    const providers = await getProviders();

    return{
      props: {
        providers
      }
    }
}