import { useEffect, useState } from 'react';
import useSpotify from './useSpotify'

function useTop() {
    const spotifyApi = useSpotify();
    const [topInfo, setTopInfo] = useState(null);
    
    useEffect(() => {
        const fetchTopInfo = async () => {
                const top = await fetch (
                    `https://api.spotify.com/v1/me/top/artists`,
                    {
                        headers: {
                            Authorization: `Bearer ${spotifyApi.getAccessToken()}`,
                        },
                    }
                ).then((res) => res.json());

                setTopInfo(top);
        };

        fetchTopInfo();
    }, [spotifyApi]);


    return topInfo;
}

export default useTop;