import axios from "axios";
import withSession from "../../lib/withSession";

const handler = async (req, res) => {
    // extract the parameters from the query string
    let {artists, genres} = req.query

    // get access token from session data 
    const accessToken = req.session.user.accessToken; 
    
    // create a query url using URLSearchParams
    const params = new URLSearchParams();
    params.append('seed_artists', artists)
    params.append('seed_genres', genres)
    params.append('seed_tracks', '')

    // make a get request to spotify api endpoint
    const response = await axios.get(
        // make sure the https:// is there (if not errconnected), and params are turned into query using toString()
        `https://api.spotify.com/v1/recommendations?${params.toString()}`,
        {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            }
        }
    )

    // create an array of json objects track that contain data of 
    // names, artist, image, link, and uri 
    const recommendedTracks = response.data.tracks.map(
        (item) => {
            return {
                names: item.name,
                artist: item.artists[0].name,
                image: item.album.images[2].url,
                href: item.external_urls.spotify,
                uri: item.uri
            }
        }
    )
    
    // send the json response to the frontend 
    res.status(200)
    res.json({
        tracks: recommendedTracks
    })
}

export default withSession(handler)