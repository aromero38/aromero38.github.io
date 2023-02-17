import Head from 'next/head'
import index from '@/styles/index.module.css'


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
              <center style={{fontSize: 56}}>WELCOME TO TUNEFY</center>
            </div>
            <div>
              <center style={{fontSize: 24}}><button className={index.button}>LOGIN</button></center>
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