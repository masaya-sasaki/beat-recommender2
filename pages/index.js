import axios from 'axios';
import Head from 'next/head'
import Image from 'next/image';
import {useState, useEffect} from 'react'; 
import ArtistCard from '../components/ArtistCard';
import GenreCard from '../components/GenreCard';
import TrackCard from '../components/TrackCard';
import { useWebPlayback } from '../hooks/useWebPlayback';

export default function Home({signInPath}) {
  const [name, setName] = useState('')
  const [accessToken, setAccessToken] = useState('')
  const [favoriteArtists, setFavoriteArtists] = useState([])
  const [favoriteGenres, setFavoriteGenres] = useState([])
  const [selectedArtists, setSelectedArtists] = useState([])
  const [selectedGenres, setSelectedGenres] = useState([])
  const [artistsWithIds, setArtistsWithIds] = useState({})
  const [recommendation, setRecommendation] = useState([])
  const {deviceId, player, isReady, is_paused} = useWebPlayback({
    getOAuthToken: () => Promise.resolve(sessionStorage.getItem("accessToken"))
  })

  useEffect(()=>{
    if(isReady){
      console.log('try connecting to spotify connect')
      player.connect()
    }
  }, [isReady])

  const addToSaveTracks = ({
    spotify_uri,
    playerInstance: {
      _options: {
        getOAuthToken,
      }
    }
  }) => {
    getOAuthToken(access_token => {
      fetch(`https://api.spotify.com/v1/me/tracks?ids=${spotify_uri}`, {
        method: 'PUT',
        body: JSON.stringify({ ids: [spotify_uri] }),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${access_token}`
        },
      }).then(res => console.log('this is the result', res)).catch(error=>console.log('this is the error', error))
    });
  };

  const handleSave = (uri) => {
    const trimmedUri = uri.substring(uri.indexOf(':')+6).slice(1)
    addToSaveTracks({
      playerInstance: player,
      spotify_uri: trimmedUri,
    })
  }

  const addQueue = ({
    spotify_uri,
    playerInstance: {
      _options: {
        getOAuthToken,
      }
    }
  }) => {
    getOAuthToken(access_token => {
      
      fetch(`https://api.spotify.com/v1/me/player/queue?uri=${spotify_uri}&device_id=${deviceId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${access_token}`
        },
      }).catch(error => console.log('post failed', error))
    });
  };

  const handleQueue = (uri) => {addQueue({
    playerInstance: player,
    spotify_uri: uri,
  })}

  const play = ({
    spotify_uri,
    playerInstance: {
      _options: {
        getOAuthToken,
      }
    }
  }) => {
    getOAuthToken(access_token => {
      fetch(`https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`, {
        method: 'PUT',
        body: JSON.stringify({ uris: [spotify_uri] }),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${access_token}`
        },
      });
    });
  };

  const handleClick = (uri) => {play({
    playerInstance: player,
    spotify_uri: uri,
  })}

  const handlePause = () => {
    player.togglePlay() 
  }

  const signIn = () => {
    // redirect the user to the spotify authentication 
    // using the authentication code flow
    // 1. create the correct query url 
    // 2. redirect the user with the query url to the api 
    window.location.href = signInPath; 
  }

  const getInfo = async () => {
    const response = await axios.get('/api/getInfo')
    const data = await response.data
    setName(data.name)
  }

  const getTopTracks = async () => {
    const response = await axios.get('/api/getTopTracks')
    const data = await response.data

    // create artist Id Object
    const artistIdObject = {}
    data.favoriteArtistsWithIds.map(item => 
        artistIdObject[item.name] = item.id 
    )

    // get favorite artist 
    const favoriteArtist = data.favoriteArtistsWithIds.map(
      item => item.name
    )

    // set artistIdObject
    setArtistsWithIds(artistIdObject)
    // update of the array is not needed because 
    // we want the favorite artists and favorite genres to 
    // update every time
    setFavoriteArtists([...favoriteArtist])
    setFavoriteGenres([...data.favoriteGenres])
    console.log('setting accesstoken', data.accessToken)
    setAccessToken(data.accessToken)
    sessionStorage.setItem('accessToken', data.accessToken)
    console.log('get access token from session storage', sessionStorage.getItem('accessToken') )
  }

  const selectItem = (item, category) => {
    if(category==='artist'){
      if(!selectedArtists.includes(item)){
        setSelectedArtists([...selectedArtists, item])
      }
    }
    else if(category==='genre'){
      if(!selectedGenres.includes(item)){
        setSelectedGenres([...selectedGenres, item])
      }
    }
  }

  const removeItem = (item, category) => {
    if(category==='artist'){
      const newSelectedArtists = [...selectedArtists].filter((value)=> value!==item)
      setSelectedArtists([...newSelectedArtists])
    }
    else if(category==='genre'){
      const newSelectedGenres = [...selectedGenres].filter((value)=> value!==item)
      setSelectedGenres([...newSelectedGenres])
    }
  }

  const getRecommendation = async () => {
    
    // use the object artistsWithIds which is 
    // used as a key-value(artistname - id) pair to get the id
    // for each artists 
    const selectedArtistsId = selectedArtists.map(
      item => artistsWithIds[item]
    )
    
    // make sure artistsId and genres are joined with a comma
    // also empty arrray will be converted to strings using join()
    const response = await axios.get(
      '/api/getRecommendation',
      {
        params: {
          artists: selectedArtistsId.join(","),
          genres: selectedGenres.join(",")
        }
      }
      )
    const data = await response.data 
    setRecommendation([...data.tracks])
  }

  

  return (
    <div className='font-sans bg-[#191414] text-white flex flex-col items-center box-border'>
      <Head>
        <title>Beat Recommender 2</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <header className='w-full flex flex-col items-center'>
        <nav className='w-full'>
          <div className='bg-white float-right mt-3 mr-3 rounded-lg flex items-center pl-2 pr-3 hover:scale-105 cursor-pointer text-black' onClick={getInfo}>            
              {name=='' ? 
                  <>
                    <Image
                    alt='spotifylogo'
                    width='30px'
                    height='30px'
                    src={'/spotifylogo.png'}
                    />
                    <span className='text-sm'>Log in with Spotify</span>
                  </> 
                :
                  <>
                    <Image
                    alt='spotifylogo'
                    width='30px'
                    height='30px'
                    src={'/spotifylogo.png'}
                    />
                    <span className='text-sm'>Connected as {name}</span> 
                  </>
            }
            </div>
        </nav>
        <div className='flex flex-col items-center  w-4/6 mt-2'>
        <div>Your favorite 5 artist and genres</div>
        <div className='-mt-1'>↓</div>
        <h1 className='text-5xl text-center text-white -mt-3'>🎧 Beat Recommender 2</h1>
        <div className='-mb-1'>↓</div>
        <div>List of recommended tracks</div>
        </div>
      </header>
      <main className='w-full flex flex-col items-center mt-5'>
      <button className="btn-spotify" onClick={()=>{
                    play({
                        playerInstance: player,
                        spotify_uri: 'spotify:track:7xGfFoTpQ2E7fRF5lN10tr',
                      })
                }} >
                    play 
                    {/* { is_paused ? "PLAY" : "PAUSE" } */}
                </button>
        {/* <WebPlayback accessToken={accessToken}/> */}
        <section className='w-5/6 px-3 py-2 rounded-md bg-slate-500'>
          <h2 className='text-xl mb-2'>How to use in 5 steps</h2>
          <ul className='gap-3 text-black flex flex-col'>
            <li className='bg-gradient-to-r from-green-400 to-blue-500 rounded-lg py-1 px-2 cursor-pointer hover:scale-105' onClick={signIn}>1. Sign in with Spotify</li>
            <li className='bg-gradient-to-r from-green-400 to-blue-500 rounded-lg py-1 px-2 cursor-pointer hover:scale-105' onClick={getInfo}>2. Connect your account</li>
            <li className='bg-gradient-to-r from-green-400 to-blue-500 rounded-lg py-1 px-2 cursor-pointer hover:scale-105' onClick={getTopTracks}>3. Get favorite tracks</li>
          </ul>
        </section>
        <div className='w-5/6 bg-slate-500 mt-5 rounded-md px-3 py-2 '>
          <div className='grid grid-rows-1 grid-cols-4'>
            <div className='text-xl row-span-1 col-span-3'>Select from your favorite artists and genres</div>
            <div className='text-black row-span-1 col-span-1 bg-gradient-to-r from-green-400 to-blue-500 rounded-lg py-1 px-2'>4. Select up to 5 total</div>
          </div>
          <div className='grid grid-rows-4 grid-cols-4 gap-2 mt-1'>
          <section className='row-span-2 col-span-3'>
            <h2 className=''>Favorite Artists</h2>
            <ul className=''>
              { 
              favoriteArtists.length ==0 ? <div>fetching...</div> :
              favoriteArtists.map((item)=><ArtistCard
              key={item+'favoriteartist'}
              onClick={()=>{selectItem(item, 'artist')}}
              image={''}
              artist={item}
            />)
              }
            </ul>
          </section>
          <section className='col-span-1'>
            <h2 className=' bg-gradient-to-r from-green-400 to-blue-500 rounded-md px-1 text-center'>Selected Favorite Artists</h2>
            <ul className=''>
              { 
              selectedArtists.length ==0 ? <div>None selected</div> :
              selectedArtists.map((item)=><ArtistCard
              key={item+'selectedartist'}
              onClick={()=>{removeItem(item, 'artist')}}
              image={''}
              artist={item}
            />)
              }
            </ul>
          </section>
          <section className='col-span-3' >
            <h2>Favorite Genres</h2>
            <ul className='grid grid-cols-2'>
            {
              favoriteGenres.length==0 ? <div>fetching</div> :
              favoriteGenres.map((item)=>
              <GenreCard
              key={item+'favoritegenre'}
              onClick={()=>{selectItem(item, 'genre')}}
              image={''}
              genre={item}
            />
              )
            }
            </ul>
          </section>
          <section className='col-span-1' >
            <h2 className=' bg-gradient-to-r from-green-400 to-blue-500 rounded-md px-1 text-center'>Selected Favorite Genres</h2>
            <ul className='grid grid-cols-2'>
            {
              selectedGenres.length==0 ? <div>None selected</div> :
              selectedGenres.map((item)=>
              <GenreCard
              key={item+'favoritegenre'}
              onClick={()=>{removeItem(item, 'genre')}}
              image={''}
              genre={item}
              />
              )
            }
            </ul>
          </section>
          </div>
        </div>
        <div className='flex justify-center mt-5 mb-10 w-5/6 text-black'>
            <button onClick={getRecommendation} className='bg-gradient-to-r from-green-400 to-blue-500 w-5/6 rounded-lg py-1 px-2 hover:scale-105 cursor-pointer' >5. Get recommendation</button>
        </div>
        {
          recommendation.length==0 ? <div></div> :
          <section className='w-5/6 px-3 py-2 rounded-md bg-slate-500'>
          <h2 className='text-2xl  text-center'>Recommended Track List</h2>
          <ul className='grid gap-1'>
          {
            recommendation.length==0 ? <div>fetching...</div> :
            recommendation.map(
              (item)=>(
                <TrackCard
                  key={item+'recommendedtracks'}
                  image={item.image}
                  name={item.names}
                  artist={item.artist}
                  href={item.href}
                  uri={item.uri}
                  handleClick={handleClick}
                  handlePause={handlePause}
                  handleQueue={handleQueue}
                  isPaused={is_paused}
                  handleSave={handleSave}
                  />
              )
            )
          }
          </ul>
        </section>
        }
      </main>
      <footer className='bg-[#191414] w-full mt-10'>
        <hr className='border-1 border-white'></hr>
        <div className='flex justify-between p-2 text-white'>
          <div>
            Created by Masaya Sasaki
          </div>
            <div>
              <a className='hover:text-gray-200' href='https://github.com/masaya-sasaki' target='_blank' rel='noopener noreferrer'>
                Follow on Github 
              </a>
            </div>
          </div>
      </footer>
    </div>
  )
}

export async function getStaticProps(ctx){
  const parameters = new URLSearchParams()
  const scopes = [ 'streaming', 'user-read-email', 'user-read-private', 'user-top-read', 'user-library-modify']
  parameters.append('client_id', process.env.REACT_APP_CLIENT_ID)
  parameters.append('response_type', 'code')
  parameters.append('redirect_uri', process.env.REACT_APP_REDIRECT_URI)
  parameters.append('scope', scopes.join(' '))
  parameters.append('state', 'state')
    
  return {
    props: {
      signInPath: `https://accounts.spotify.com/authorize?${parameters.toString()}`
    }
  }

}