import { sql } from '@vercel/postgres';

export default async function getStats(req, res) {
    const user_id = req.query.user_id;
    let message = "";
    let userTop = {};

  try {
    const doesUserExist = await sql`SELECT USER_ID FROM USERS WHERE USER_ID = ${user_id}`;

    if(doesUserExist.rowCount < 1){
      message = "User does not exist";
      return res.status(204).json({message});
    }

    const getTopArtists = await sql`SELECT ARTIST_RANKING, ARTIST_ID FROM USER_TOP_ARTISTS WHERE USER_ID = ${user_id} AND STATS_DATE = (SELECT DISTINCT MAX(STATS_DATE) FROM USER_TOP_ARTISTS WHERE USER_ID = ${user_id})`;
    const getTopSongs = await sql`SELECT SONG_RANKING, SONG_ID FROM USER_TOP_SONGS WHERE USER_ID = ${user_id} AND STATS_DATE = (SELECT DISTINCT MAX(STATS_DATE) FROM USER_TOP_SONGS WHERE USER_ID = ${user_id})`;
    //console.log(getTopSongs)
    
    userTop = {
      user_id: user_id,
      //user_name: username
      //user_image: image
      topArtists: getTopArtists.rows,
      topSongs: getTopSongs.rows
    }

  } catch (error) {
    console.error(error);
  }

  return res.status(200).json({userTop});
}