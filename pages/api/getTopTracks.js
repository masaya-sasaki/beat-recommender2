import axios from "axios"
import withSession from "../../lib/withSession"

const getTopTracks = async(req, res) => {
    // get accessToken from session data 
    const accessToken = req.session.user.accessToken
    
    // make sure that you have authorization to access the api 
    // make a get request to top tracks
    const response = await axios.get(
        'https://api.spotify.com/v1/me/top/artists',
        {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            }
        }
    )

    // create an array of objects with name and id attributes
    const favoriteArtistsWithIds = response.data.items.slice(0,10).map(
        (item)=>{
        return {
        name: item.name,
        id: item.id
        }
    })

    // create an array of genres
    const favoriteGenres = [];
    response.data.items.forEach((item)=>favoriteGenres.push(...item.genres))
    
    res.status(200)
    res.json({
        favoriteArtistsWithIds,
        favoriteGenres: favoriteGenres.slice(0,10),
    })
}


export default withSession(getTopTracks)

