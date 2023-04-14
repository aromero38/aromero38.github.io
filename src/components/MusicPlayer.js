import { useSession, getProviders, signOut } from "next-auth/react";
import { useRecoilState } from 'recoil';
import { currentTrackIdState, isPlayingState } from "atoms/songAtom";
import { useEffect, useState } from 'react';

import useSpotify from 'hooks/useSpotify.js';
import useSongInfo from 'hooks/useSongInfo.js';

import { PlayIcon, PauseIcon, ForwardIcon, BackwardIcon } from '@heroicons/react/24/solid';

const MusicPlayer = ({providers}) => {
    const spotifyApi = useSpotify();
	const {data: session, status} = useSession();

	const [currentTrackId, setCurrentIdTrack] = 
		useRecoilState(currentTrackIdState);
	const [isPlaying, setIsPlaying] = 
		useRecoilState(isPlayingState);
	const [volume, setVolume] = useState(20);

	const songInfo = useSongInfo();

	const fetchCurrentSong = async () => {
		if (!songInfo) {
			spotifyApi.getMyCurrentPlayingTrack().then((data) => {
				console.log("Now playing: ", data.body?.item);
				setCurrentIdTrack(data.body?.item?.id);
				
				spotifyApi.getMyCurrentPlaybackState().then((data) => {
					setIsPlaying(data.body?.is_playing);
				});
			});
		}
	};

	const fetchCurrentVolume = async () => {
		spotifyApi.setVolume(volume)
		.then(function () {
		  console.log('Setting volume to ' + {volume});
		  }, function(err) {
		  //if the user making the request is non-premium, a 403 FORBIDDEN response code will be returned
		  console.log('Something went wrong!', err);
		});
	}

	useEffect(() => {
		if (spotifyApi.getAccessToken() && !currentTrackId) {
				fetchCurrentSong();
		}
	}, [currentTrackIdState, spotifyApi, session]);

	useEffect(() => {
		if (spotifyApi.getAccessToken()) {
			fetchCurrentVolume();
		}
	}, [volume, spotifyApi, session]);

	console.log(songInfo?.album?.images?.[0]?.url);


    return (
		<>
		<div className='bg-gradient-to-t from-black to-gray-900 text-white rounded-t-[8px] fixed h-36 w-full grid grid-cols-3 bottom-0'>
			{/* left/album-picture */}
			<div className="flex items-center px-4 ">
				<img className='h-28 w-28 rounded-[12px] object-center shadow-2xl hover:shadow-green-500/25 hover:scale-[1.025]' src={songInfo?.album?.images?.[0]?.url} />
			</div>

			{/* middle/player-stuff */}
			<div className="flex flex-col place-self-center">
				{/* artist - song_name */}
				<div className="place-self-center font-bold text-[20px]">
					<p>{songInfo?.artists?.[0]?.name} &mdash; {songInfo?.name}</p>
				</div>
				{/* album_name */}
				<div className="place-self-center text-[15px]">
					<p>{songInfo?.album?.name}</p>
				</div>
				{/* song progress */}
				<div className="place-self-center text-[10px]">
					<p> 0:00 ------------------------------------------------------------------------------------------- 0:00 </p>
				</div>
				{/* controls */}
				<div className="flex place-self-center">
					<BackwardIcon alt="Previous" className="w-8 text-white hover:scale-105" onClick={() => { spotifyApi.skipToPrevious() } } />
					
					{isPlaying?
					(<PauseIcon alt="Pause" className="h-12 w-12 text-white hover:scale-105" onClick={() => { spotifyApi.pause() } } />) :
					<PlayIcon alt="Play" className="h-12 w-12 text-white hover:scale-105" onClick={() => { spotifyApi.play() } } />}
					
					<ForwardIcon alt="Next" className="w-8 text-white hover:scale-105" onClick={() => { spotifyApi.skipToNext() } } />
				</div>
			</div>

			{/* right/volume-control */}
			<div className="flex items-center justify-end hover:scale-[1.015]">
				<input
					type="range"
					min={0}
					max={100}
					value={volume}
					onChange={(event) => {
					setVolume(event.target.valueAsNumber);
				}}
        />

				
			</div>
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

export default MusicPlayer;