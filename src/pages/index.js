import Head from 'next/head'
import index from '@/styles/index.module.css'


export default function Home() {
  return (
    <>
      <Head>
        <title>Tunefy</title>
        <meta name="description" content="Spotify Statistic Tracker" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={index.background}>
        hi
      </main>
    </>
  )
}
