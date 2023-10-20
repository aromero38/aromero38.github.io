import { useSession, getProviders, signOut } from "next-auth/react";
import { useRecoilState } from 'recoil';
import { currentTrackIdState, isPlayingState } from "atoms/songAtom";
import { useCallback, useEffect, useState } from 'react';
import { debounce } from 'lodash';
import ProgressBar from 'react-progressbar';

import useSpotify from 'hooks/useSpotify.js';
import useSongInfo from 'hooks/useSongInfo.js';
import usePlayer from 'hooks/usePlayer.js';

import { PlayIcon, PauseIcon, ForwardIcon, BackwardIcon, ArrowPathRoundedSquareIcon, ArrowsRightLeftIcon} from '@heroicons/react/24/solid';

const MusicPlayer = () => {
    const spotifyApi = useSpotify();
    const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState);
    const [volume, setVolume] = useState();
    const [scrollText, setScrollText] = useState(false);
    const songInfo = useSongInfo();
    const [currentTrack, setCurrentTrack] = useState(null);
    const [songProgress, setSongProgress] = useState(0); // Change initial value to 0
    const [shuffle, setShuffle] = useState(false);
    
    spotifyApi.getMyCurrentPlaybackState()
    .then(function(data) {
      // Output items
      if (data.body && data.body.is_playing) {
        //console.log(data.body);
        setSongProgress(data.body.progress_ms)
      } else {
        //console.log("User is not playing anything, or doing so in private.");
      }
    }, function(err) {
      console.log('Something went wrong!', err);
    });
    
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

    useEffect(() => {
        if (isPlaying) {
            setScrollText(true);
        } else {
            setScrollText(false);
        }
    }, [isPlaying]);

    // useEffect(() => {
    //     const timer = setInterval(updateSongProgress, 1000);
    //     return () => clearInterval(timer);
    // }, [isPlaying, currentTrack]);

	const updateSongProgress = (positionMs) => {
		if (isPlaying && currentTrack) {
            spotifyApi.seek(positionMs)
            .then(function() {
              console.log('Seek to ' + positionMs);
            }, function(err) {
              //if the user making the request is non-premium, a 403 FORBIDDEN response code will be returned
              console.log('Something went wrong!', err);
            });
        }
	  };

    const isShuffled = () => {
        if(shuffle){
            spotifyApi.setShuffle(false)
            .then(function() {
                console.log('Shuffle is on.');
            }, function  (err) {
            //if the user making the request is non-premium, a 403 FORBIDDEN response code will be returned
            console.log('Something went wrong!', err);
            });
            setShuffle(false);
        }
        else{

            spotifyApi.setShuffle(true)
            .then(function() {
                console.log('Shuffle is on.');
            }, function  (err) {
            //if the user making the request is non-premium, a 403 FORBIDDEN response code will be returned
            console.log('Something went wrong!', err);
            });
            setShuffle(true);
        }
    };

    const handlePlayPause = () => {
        spotifyApi.getMyCurrentPlaybackState().then((data) => {
            if (data.body?.is_playing) {
                spotifyApi.pause();
                setIsPlaying(false);
            } else {
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

    function convertMillisecondsToMinutesAndSeconds(milliseconds) {
        let seconds = Math.floor(milliseconds / 1000);
        let minutes = 0;
    
        if (seconds >= 60) {
            minutes = Math.floor(seconds / 60);
            seconds = seconds % 60;
        }
    
        const formattedSeconds = seconds.toString().padStart(2, '0');
    
        return `${minutes}:${formattedSeconds}`;
    }

    return (
		<>
		<div className='bg-gradient-to-t from-black to-gray-900 text-white rounded-t-[8px] fixed h-36 w-full grid grid-cols-3 bottom-0'>
			{/* left/album-picture */}
			<div className="flex items-center px-4 ">
				<img className='h-28 w-28 rounded-[12px] object-center shadow-2xl hover:scale-[1.025]' src={currentTrack?.album?.images?.[0]?.url} />
                {currentTrack?.artists?.[0]?.name}
                <br/>
                {currentTrack?.name}
			</div>

			{/* middle/player-stuff */}
			<div className="flex flex-col place-self-center">
				{/* artist - song_name */}
				<div className="place-self-center font-bold text-[20px]" id="scroll-container">
					{/* <p id={scrollText ? "scroll-text" : ""}>{currentTrack?.artists?.[0]?.name} - {currentTrack?.name}</p> */}
				</div>
				{/* album_name */}
				<div className="place-self-center text-[15px]">
					<p>{songInfo?.album?.name}</p>
				</div>
				{/* song progress */}
				<div className="place-self-center">
					{/* <div className="progress-bar-container">
						<ProgressBar completed={(songProgress / currentTrack?.duration_ms) * 100} bgColor="#1DB954" height="10px" />
					</div> */}
                    <div className="flex items-center justify-end">
                        <span>{convertMillisecondsToMinutesAndSeconds(songProgress)}</span>
                        <input
                            className="hover:scale-[1.015]"
                            type="range"
                            value={songProgress}
                            onChange={(e) => updateSongProgress(Number(e.target.value))}
                            min={0}
                            max={currentTrack?.duration_ms}
                        />
                        <span>{convertMillisecondsToMinutesAndSeconds(currentTrack?.duration_ms)}</span>
                    </div>
				</div>
				{/* controls */}
                <div class="inline-flex items-center">
                    <span class="ml-6">
                     {shuffle ? 
                      <ArrowsRightLeftIcon alt="Shuffle" class="w-6 text-green-500 hover:scale-105" onClick={() => isShuffled()}></ArrowsRightLeftIcon> : 
                       <ArrowsRightLeftIcon alt="Shuffle" class="w-6 text-white-500 hover:scale-105" onClick={() => isShuffled()}></ArrowsRightLeftIcon>
                    }
                    </span>
                    <span class="ml-24">
                     <ArrowPathRoundedSquareIcon alt="Repeat" class="w-6 text-white hover:scale-105"></ArrowPathRoundedSquareIcon>
                    </span>
                </div>
				<div className="flex place-self-center">
					{/* <BackwardIcon alt="Previous" className="w-8 text-white hover:scale-105" onClick={() => { spotifyApi.skipToPrevious(); setSongProgress(0) }} /> */}
                    <BackwardIcon alt="Previous" className="w-8 text-white hover:scale-105" onClick={() => { spotifyApi.skipToPrevious();}} />
					{isPlaying ? (
						<PauseIcon alt="Pause" className="h-12 w-12 text-white hover:scale-105" onClick={handlePlayPause} />
					) : (
						<PlayIcon alt="Play" className="h-12 w-12 text-white hover:scale-105" onClick={handlePlayPause} />
					)}
					{/* <ForwardIcon alt="Next" className="w-8 text-white hover:scale-105" onClick={() => { spotifyApi.skipToNext(); setSongProgress(0) }} /> */}
					<ForwardIcon alt="Next" className="w-8 text-white hover:scale-105" onClick={() => { spotifyApi.skipToNext(); }} />
				</div>
			</div>

			{/* right/volume-control */}
			<div className="flex items-center justify-end">
				<input
					className="hover:scale-[1.015]"
					type="range"
					value={volume}
					onChange={(e) => setVolume(Number(e.target.value))}
					min={0}
					max={100}
				/>
			</div>
		</div>
	</>
    );
}

export async function getServerSideProps() {
    const providers = await getProviders();

    return {
        props: {
            providers
        }
    }
}

export default MusicPlayer;