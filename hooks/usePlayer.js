import { useEffect, useState } from "react";
import { signIn, useSession } from "next-auth/react";
import spotifyApi from "lib/spotify";

function usePlayer() {
    const {data: session, status } = useSession();
    const [player, setPlayer] = useState(undefined);

    useEffect(() =>{

        const script = document.createElement("script");
        script.src = "https://sdk.scdn.co/spotify-player.js";
        script.async = true;

        document.body.appendChild(script);

        window.onSpotifyWebPlaybackSDKReady = () => {

            const player = new window.Spotify.Player({
                name: 'Web Playback SDK',
                getOAuthToken: cb => { cb(spotifyApi.getAccessToken()) },
                volume: 0.5
            });

            if(!player){
                setPlayer(player);
            }

            player.connect();

            player.setName("Tunefy").then(() => {
                console.log('Player name updated!');
              });

        };
        
        
    }, [session, spotifyApi]);
}

export default usePlayer;