import { useEffect, useState, useRef } from "react";
import spotifyApi from "lib/spotify";

function usePlayer() {
  const [player, setPlayer] = useState(null);
  const playerRef = useRef(null);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://sdk.scdn.co/spotify-player.js";
    script.async = true;

    script.onload = () => {
      if (!playerRef.current) {
        const playerInstance = new window.Spotify.Player({
          name: "Tunefy",
          getOAuthToken: (cb) => {
            cb(spotifyApi.getAccessToken());
          },
          volume: 0.5,
        });

        playerInstance.addListener("ready", ({ device_id }) => {
          console.log("Device ID", device_id);
          // Here you can set your site as the active device playing music
          // You can use the device_id to play music on this device
          // Example: spotifyApi.play({ device_id, uris: ["spotify:track:your_track_uri"] });
        });

        playerInstance.connect();

        playerRef.current = playerInstance;
        setPlayer(playerInstance);
      }
    };

    document.body.appendChild(script);

    return () => {
      if (playerRef.current) {
        playerRef.current.disconnect();
      }
    };
  }, []);

  return player;
}

export default usePlayer;