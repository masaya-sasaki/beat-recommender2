import {withIronSessionApiRoute} from 'iron-session/next';

export default function withSession (handler){
    return withIronSessionApiRoute(handler, 
        {
            password: process.env.SECRET_COOKIE_PASSWORD ?? '',
            cookieName: "next-iron-session/examples/next.js",
            cookieOptions: {
              // the next line allows to use the session in non-https environments like
              // Next.js dev mode (http://localhost:3000)
              secure: process.env.NODE_ENV === "production",
            },
        }
    )
}