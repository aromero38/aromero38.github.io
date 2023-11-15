import { getProviders } from "next-auth/react"
import { useSession } from 'next-auth/react'
import { useEffect, useState } from "react";
import useSpotify from 'hooks/useSpotify.js'


export default function DiscoverContent() {
	const {data: session} = useSession();
	const spotifyApi = useSpotify();
    
    // SeedList will be songs that will be given to SpotifyAPI, on default it will have users Top Songs
    // Will be filled with any songs the user likes.
    const [SeedList, setSeedList] = useState([]);

    // DiscoverQueue will have songs generated from SpotifyAPI call. 
    // Anytime the DiscoverQueue goes under 5 songs, the top song in SeedList will be used in the SpotifyAPI
    // and those generated songs will be put into the DiscoverQueue.
    const [DiscoverQueue, setDiscoverQueue] = useState([]);

    // Disliked Songs
    const [DislikedSongs, setDislikedSongs] = useState([]);


    useEffect(() => {
        if (SeedList.length === 0) {
            // Fill with user Top Songs (THIS SHOULD BE TAKEN FROM THE DATABASE, placeholder for now)
            if (spotifyApi.getAccessToken()) {
                spotifyApi.getMyTopTracks({limit: 5})
                    .then(function(data) {
                        setSeedList(prevSeedList => {
                            const newSeedList = [...prevSeedList, ...data.body.items];
                            //console.log("Updated SeedList", newSeedList);
                            return newSeedList;
                        })
                    })
                    .catch(function(err) {
                        console.error(err);
                    })
            }
        }
        if (DiscoverQueue.length < 5) {
            if (spotifyApi.getAccessToken()) {
                // get recommendations
                spotifyApi.getRecommendations({seed_tracks: [SeedList?.[0]?.id], min_popularity: 0})
                    .then(function(data) {
                        setDiscoverQueue(prevDiscoverQueue => {
                            const newQueue = [...prevDiscoverQueue, ...data.body.tracks];
                            console.log("Updated Queue", newQueue)

                            const filteredQueue = newQueue.filter(song => {
                                return !DislikedSongs.some(dislikedSong => dislikedSong.id === song.id)
                            })
                            
                            return filteredQueue;
                        });
                    })
                    .catch(function(err) {
                        console.error(err);
                    });
            }
            SeedList.shift();
        }
    }, [spotifyApi, session, DiscoverQueue, SeedList, DislikedSongs]);

    // USED FOR LOGGING THE VARIOUS LIST STATES
    useEffect(() => {console.log("DislikedSongs Updated", DislikedSongs)}, [DislikedSongs])
    useEffect(() => {console.log("SeedList/LikedSongs Updated", SeedList)}, [SeedList])

    const LikeSong = () => {
        setSeedList(prevSeedList => {
            const newSeedList = [...prevSeedList, DiscoverQueue?.[0]]
            console.log("Current DiscoverQueue", DiscoverQueue)
            DiscoverQueue.shift();

            return newSeedList;
        })
    }

    const DislikeSong = () => {
        setDislikedSongs(prevDislikedSongs => {
            const newDislikedSongs = [...prevDislikedSongs, DiscoverQueue?.[0]];
            console.log("Current DiscoverQueue", DiscoverQueue);
            DiscoverQueue.shift();

            return newDislikedSongs;
        })
    }

    return (
        <>
            <div className="h-[600px] text-white">
                <div className="flex flex-col items-center pt-28">
                    <h1 className='text-xl'>{DiscoverQueue?.[0]?.artists?.[0]?.name}</h1>
                    <h1 className='text-xl pb-10'>{DiscoverQueue?.[0]?.name}</h1>

                    <button className="mb-4" onClick={() => {LikeSong()}}>I LIKE</button>
                    <button className="mb-4" onClick={() => {DislikeSong()}}>I DISLIKE</button>
                </div>
            </div>
        </>
    )
}

export async function getServerSideProps(){
	const providers = await getProviders();

	return {
		props: {
			providers
		}
	}
}