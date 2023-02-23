import Head from 'next/head'
import Link from 'next/link';
import testImage from 'next/image'
import userProfile from '@/styles/user-profile.module.css'

export default function UserProfile() {
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
            </div>
          </div>
        </div>
      </main>
    </>
  );
}