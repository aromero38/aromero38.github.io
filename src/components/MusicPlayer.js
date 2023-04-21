import { useSession, getProviders, signOut } from "next-auth/react";
import { useRecoilState } from 'recoil';
import { currentTrackIdState, isPlayingState } from "atoms/songAtom";
import { useEffect, useState } from 'react';

import useSpotify from 'hooks/useSpotify.js';
import useSongInfo from 'hooks/useSongInfo.js';
import usePlayer from 'hooks/usePlayer.js';

import { PlayIcon, PauseIcon, ForwardIcon, BackwardIcon } from '@heroicons/react/24/solid';
import spotifyApi from "lib/spotify";
import { get } from "superagent";

const MusicPlayer = ({providers}) => {
    const spotifyApi = useSpotify();
	const {data: session, status} = useSession();

	const [currentTrackId, setCurrentIdTrack] = 
		useRecoilState(currentTrackIdState);
	const [isPlaying, setIsPlaying] = 
		useRecoilState(isPlayingState);
	const [volume, setVolume] = useState(20);

	const [scrollText, setScrollText] = useState(false);

	const songInfo = useSongInfo();
	const player = usePlayer();

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

	const handleVolumeChange = (event) => {
		const volume = parseInt(event.target.value);
		setVolume(volume);
		if(player){
			player.setVolume(volume/100);
		}	
	}

	const handlePlayPause = () =>{
		spotifyApi.getMyCurrentPlaybackState().then((data) =>{
			if(data.body.is_playing){
				spotifyApi.pause();
				setIsPlaying(false);
			}
			else{
				spotifyApi.play();
				setIsPlaying(true);
			}
			});
		};

	useEffect(() =>{
			if(isPlaying){
				setScrollText(true);
			}
			else{
				setScrollText(false);
			}
	}, [isPlaying]);

	useEffect(() => {
		if (spotifyApi.getAccessToken() && !currentTrackId) {
				fetchCurrentSong();
		}
	}, [currentTrackIdState, spotifyApi, session]);




	console.log(songInfo?.album?.images?.[0]?.url);


    return (
		<>
		<div className='bg-gradient-to-t from-black to-gray-900 text-white rounded-t-[8px] fixed h-36 w-full grid grid-cols-3 bottom-0'>
			{/* left/album-picture */}
			<div className="flex items-center px-4 ">
				<img className='h-28 w-28 rounded-[12px] object-center shadow-2xl hover:scale-[1.025]' src={songInfo?.album?.images?.[0]?.url} />
			</div>

			{/* middle/player-stuff */}
			<div className="flex flex-col place-self-center">

				{/* test to play after hours through browser */}


				{/* artist - song_name */}
				<div className=" place-self-center font-bold text-[20px]" id="scroll-container">
					<p id={scrollText ? "scroll-text" : ""}>{songInfo?.artists?.[0]?.name} &mdash; {songInfo?.name}</p>
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
					(<PauseIcon alt="Pause" className="h-12 w-12 text-white hover:scale-105" onClick={handlePlayPause} />) :
					<PlayIcon alt="Play" className="h-12 w-12 text-white hover:scale-105" onClick={handlePlayPause} />}
					
					<ForwardIcon alt="Next" className="w-8 text-white hover:scale-105" onClick={() => { spotifyApi.skipToNext() } } />
				</div>
			</div>

			{/* right/volume-control */}
			<div className="flex items-center justify-end">
				<input
					className="hover:scale-[1.015]"
					type="range"
					min={0}
					max={100}
					value={volume}
					onChange={handleVolumeChange} />
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