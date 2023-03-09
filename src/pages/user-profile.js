 import userProfile from '@/styles/user-profile.module.css'
import Head from 'next/head'
import {getProviders, signIn} from "next-auth/react"
import spotifyApi from 'lib/spotify'
import {useSession} from 'next-auth/react'
import Link from 'next/link'
import { useEffect } from 'react'
import SpotifyWebApi from 'spotify-web-api-node'
import { currentlyPlayingSong } from "../../lib/spotify";


export default function UserProfile({providers}) {
  const {data: session} = useSession();

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