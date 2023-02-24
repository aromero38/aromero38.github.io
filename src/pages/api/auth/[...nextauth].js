import NextAuth from 'next-auth';
import SpotifyProvier from 'next-auth/providers/spotify';
import spotifyApi, {LOGIN_URL} from "lib/spotify";

async function refreshAccessToken(token){
    try{
        spotifyApi.setAccessToken(token.accessToken);
        spotifyApi.setRefreshToken(token.refreshToken);

        const { body: refreshToken} = await spotifyApi.refreshAccessToken();

        return{
            ...token,
            accessToken: refreshedToken.accessToken,
            accessTokenExpires: Date.now + refreshToken.expires_in * 1000, // expires in 1 hours
            refreshToken: refreshedToken.refreshToken ?? token.refreshToken, //if refresh token the use it, otherwise refresh
        };

    } catch(error){
        console.error(error)
        
        return {
            ...token, 
            error: "RefreshAccessTokenError"
        };
    }
}

export default NextAuth({
    providers: [
    SpotifyProvier({
        clientId: process.env.NEXT_PUBLIC_CLIENT_ID,
        clientSecret: process.env.NEXT_PUBLIC_CLIENT_SECRET,
        authorization: LOGIN_URL
    })
    ],
    secret: process.env.JWT_SECRET,
    pages: {
        signIn: '/index'
    },
    callbacks: {
        async jwt({token, account, user}){
            
            //initial sign in
            if(account && user){
                return{
                    ...token,
                    accessToken: account.access_token, 
                    refreshToken: account.refresh_token,
                    username: account.providerAccountId,
                    accessTokenExpires: account.expires_at * 1000, //value of when token expires
                }
            }

            //return previous token if access token has not expired
            if(Date.now() < token.accessTokenExpires){
                return token;
            }

            //Access token expires so we need to refresh it
            return await refreshAccessToken(token)
        },

        async session({ session, token}){
            session.user.accessToken = token.accessToken;
            session.user.refreshToken = token.refreshToken;
            session.user.username = token.username;

            return session;
        },
        },
    });