import { useState, useEffect, useRef } from 'react';



// takes callback function to get accessToken 
// and then returns 
export function useWebPlayback({getOAuthToken}) {
    const playerRef = useRef(null)
    const [isReady, setIsReady] = useState(false)
    const [is_paused, setPaused] = useState(false);
    const [is_active, setActive] = useState(false);
    const [deviceId, setDeviceId] = useState('')

    useEffect(() => {
            if(!window.Spotify){
                console.log('adding web player sdk script to the document')
                const script = document.createElement("script");
                script.src = "https://sdk.scdn.co/spotify-player.js";
                script.async = true;
                document.body.appendChild(script);
                console.log('web player sdk script appended to the body')
            }
            window.onSpotifyWebPlaybackSDKReady= () => {
                playerRef.current = new window.Spotify.Player({
                    name: 'Beat Recommender 2',
                    getOAuthToken: async cb => { 
                        const token = await getOAuthToken(); 
                        cb(token); 
                    },
                    volume: 0.2
                });
                setIsReady(true);
            };
        } 
    ,[]);

    useEffect(()=>{
        if(playerRef==null) return; 
        const player = playerRef.current; 
        if(isReady){
            player.addListener('ready', ({ device_id }) => {
                console.log('Ready with Device ID', device_id);
                setDeviceId(device_id)
            });
        
            player.addListener('not_ready', ({ device_id }) => {
                console.log('Device ID has gone offline', device_id);
            });
        
            player.addListener('player_state_changed', ( state => {
                if (!state) {
                    return;
                }
                // console.log('Currently Playing', current_track);
                console.log('the current state is', state)
                // setTrack(state.track_window.current_track);
                setPaused(state.paused);
            
                player.getCurrentState().then( state => { 
                    (!state)? setActive(false) : setActive(true) 
                });
            
            }));

            return () => {
                // write what to do when removed from dom 
            }
        }
    },[isReady])

   return {
       isReady,
       deviceId,
       player: playerRef.current,
       is_active,
       is_paused
   }
}