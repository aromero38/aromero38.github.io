import Head from 'next/head'
import index from '@/styles/index.module.css'
import Link from 'next/link'


export default function Home() {
  return (
    <>
      <Head className={index.background}>
        <title>Tunefy</title>
        <meta name="description" content="Spotify Statistic Tracker" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={index.background}>
        <div>
          <h1>LOGO | TUNEFY</h1>
          <div>
            <div>
              <center style={{fontSize: 56}}>WELCOME TO TUNEFY
              <div style={{fontSize:20}}>
                View your Spotify stats and share them with anyone <br></br>
                Get music recommendations, listen to music, and more
              </div></center>
            </div>
            <div>
                <Link href="/user-profile">
                  <center style={{fontSize: 24}}><button className={index.button}>LOGIN</button></center>
                </Link>
            </div>
            <div>
              <center><img src='https://media.tenor.com/7rfVkJl_3igAAAAC/visualizer-colorful.gif'></img></center>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}