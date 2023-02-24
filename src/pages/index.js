import Head from 'next/head'
import index from '@/styles/index.module.css'
import Link from 'next/link'
import {getProviders, signIn} from "next-auth/react"
import spotifyApi from 'lib/spotify'


export default function Home({providers}) {
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
            {Object.values(providers).map((provider) =>(
            <div key={provider.name}>
                  <center style={{fontSize: 24}}><button className={index.button} onClick={() => signIn(provider.id, {callbackUrl: "/"})}>Login with {provider.name}</button></center>
            </div>
            ))}
            <div>
              <center><img src='https://media.tenor.com/7rfVkJl_3igAAAAC/visualizer-colorful.gif'></img></center>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}


export async function getServerSideProps(){
    const providers = await getProviders();

    return{
      props: {
        providers
      }
    }
}