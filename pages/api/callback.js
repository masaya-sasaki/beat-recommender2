import axios from "axios";
import withSession from "../../lib/withSession";

const callback = async (req, res) => {
    // extract the code and state for the request query 
    const {code, state} = req.query

    // create a query url using URLSearchParams
    const params = new URLSearchParams();
    params.append('grant_type', 'authorization_code')
    params.append('code', code)
    params.append('redirect_uri', process.env.REACT_APP_REDIRECT_URI)

    // send a post request to the api/token to get access token
    const response = await axios.post(
        'https://accounts.spotify.com/api/token',
        params,
        {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': `Basic ${Buffer.from(`${process.env.REACT_APP_CLIENT_ID}:${ process.env.REACT_APP_CLIENT_SECRET}`, 'utf-8').toString('base64')}`
            }
        }
    );

    // save the access token into session
    req.session.user = {
        accessToken: response.data.access_token,
        expiresIn: response.data.expires_in,
        refreshToken: response.data.refresh_token,
        scope: response.data.scope
    };

    await req.session.save()
    
    // redirect to the main page 
    res.status(200).redirect('/');

}

// Need to save the token into session data on the server
// for simple cookie uses like this we can use iron-session
// wrap the api handler with the wrapper function to use iron-session
// called withSession()
export default withSession(callback); 