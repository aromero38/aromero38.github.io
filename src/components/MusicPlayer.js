import { useSession, getProviders, signOut } from "next-auth/react";
import { useRecoilState } from 'recoil';
import { currentTrackIdState, isPlayingState } from "atoms/songAtom";
import { useCallback, useEffect, useState } from 'react';
import {debounce} from 'lodash';

import useSpotify from 'hooks/useSpotify.js';
import useSongInfo from 'hooks/useSongInfo.js';
import usePlayer from 'hooks/usePlayer.js';

import { PlayIcon, PauseIcon, ForwardIcon, BackwardIcon } from '@heroicons/react/24/solid';


const MusicPlayer = () => {
    const spotifyApi = useSpotify();

	const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState);	
	const [volume, setVolume] = useState();
	const [scrollText, setScrollText] = useState(false);
	const songInfo = useSongInfo();
	const [currentTrack, setCurrentTrack] = useState(null);
	const player = usePlayer();

    useEffect(() => {
		if (player) {
		  player.addListener("player_state_changed", (state) => {
			if (state && state.track_window && state.track_window.current_track) {
			  setCurrentTrack(state.track_window.current_track);
			  setIsPlaying(!state.paused);
			} else {
			  setCurrentTrack(null);
			  setIsPlaying(false);
			}
		  });
		}
	  }, [player]);

	useEffect(() => {
		if (volume > 0 && volume < 100) {
			debouncedAdjustVolume(volume);
		}
	  }, [volume]);

	useEffect(() =>{
			if (isPlaying) {
				setScrollText(true);
			}
			else {
				setScrollText(false);
			}
	}, [isPlaying]);

	const handlePlayPause = () =>{
		spotifyApi.getMyCurrentPlaybackState().then((data) =>{
			if (data.body?.is_playing) {
				spotifyApi.pause();
				setIsPlaying(false);
			}
			else{
				spotifyApi.play();
				setIsPlaying(true);
			}
			});
		};

	const debouncedAdjustVolume = useCallback(
		debounce((volume) => {
			spotifyApi.setVolume(volume);
		}, 250),
		[]
	);

    return (
		<>
		<div className='bg-gradient-to-t from-black to-gray-900 text-white rounded-t-[8px] fixed h-36 w-full grid grid-cols-3 bottom-0'>
			{/* left/album-picture */}
			<div className="flex items-center px-4 ">
				<img className='h-28 w-28 rounded-[12px] object-center shadow-2xl hover:scale-[1.025]' src={currentTrack?.album?.images?.[0]?.url} />
			</div>

			{/* middle/player-stuff */}
			<div className="flex flex-col place-self-center">

				{/* artist - song_name */}
				<div className=" place-self-center font-bold text-[20px]" id="scroll-container">
					<p id={scrollText ? "scroll-text" : ""}>{currentTrack?.artists?.[0]?.name} - {currentTrack?.name}</p>
				</div>
				{/* album_name */}
				<div className="place-self-center text-[15px]">
					<p>{songInfo?.album?.name}</p>
				</div>
				{/* song progress */}
				{/* <div className="place-self-center text-[10px]"> */}
					{/* <p> 0:00 ------------------------------------------------------------------------------------------- 0:00 </p> */}
				{/* </div> */}
				{/* controls */}
				<div className="flex place-self-center">
					<BackwardIcon alt="Previous" className="w-8 text-white hover:scale-105" onClick={() => { spotifyApi.skipToPrevious(); } } />
					
					{isPlaying?
					(<PauseIcon alt="Pause" className="h-12 w-12 text-white hover:scale-105" onClick={handlePlayPause} />) :
					<PlayIcon alt="Play" className="h-12 w-12 text-white hover:scale-105" onClick={handlePlayPause} />}
					
					<ForwardIcon alt="Next" className="w-8 text-white hover:scale-105" onClick={() => { spotifyApi.skipToNext(); } } />
				</div>
			</div>

			{/* right/volume-control */}
			<div className="flex items-center justify-end">
				<input
					className="hover:scale-[1.015]"
					type="range"
					value={volume}
					onChange={(e) => setVolume(Number(e.target.value))} 	
					// step={1}				
					min={0}
					max={100}/>

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