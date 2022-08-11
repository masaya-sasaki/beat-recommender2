import axios from 'axios';
import Head from 'next/head'
import {useState, useEffect} from 'react'; 
import Footer from '../components/Footer';
import Header from '../components/Header';
import Instructions from '../components/Instructions';
import RecommendationButton from '../components/RecommendationButton';
import RecommendationResults from '../components/RecommendationResults';
import SelectFavorites from '../components/SelectFavorites';
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
      <Header name={name} getInfo={getInfo}/>
      <main className='w-full flex flex-col items-center mt-5'>
        <Instructions
          signIn={signIn}
          getInfo={getInfo}
          getTopTracks={getTopTracks}
        />
        <SelectFavorites
          favoriteArtists={favoriteArtists}
          favoriteGenres={favoriteGenres}
          selectedArtists={selectedArtists}
          selectedGenres={selectedGenres}
          removeItem={removeItem}
          selectItem={selectItem}
        />
        <RecommendationButton
          getRecommendation={getRecommendation}
        />
        <RecommendationResults
          recommendation={recommendation}
          handleClick={handleClick}
          handlePause={handlePause}
          handleQueue={handleQueue}
          isPaused={is_paused}
          handleSave={handleSave}
        />
      </main>
      <Footer/>
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