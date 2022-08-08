import axios from "axios";
import withSession from "../../lib/withSession";

const handler = async (req, res) => {
    const accessToken = req.session.user.accessToken;

    // send a get request to the /v1/me endpoint to get info. 
    // use the access token for authorization
    const response = await axios.get(
        'https://api.spotify.com/v1/me',
        {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            }
        }
    );
    
    // get name and country of user
    const {display_name, country} = response.data
    
    // return json object to the frontend
    res.status(200)
    res.json({
        name: display_name,
        country: country 
    })

}

export default withSession(handler); 