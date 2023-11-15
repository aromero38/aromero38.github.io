import { sql } from '@vercel/postgres';

export default async function getStats(req, res) {
    let user_id = req.query.user_id;
    const user_email = req.query.user_email;
    let message = "";
    let doesUserExist;
    let getTopArtists;
    let getTopSongs;


  try {
    if(user_id === ''){
      doesUserExist = await sql`SELECT USER_ID FROM USERS WHERE EMAIL = ${user_email}`;
      user_id = doesUserExist.rows[0].user_id;
    }
    else{
      doesUserExist = await sql`SELECT USER_ID FROM USERS WHERE USER_ID = ${user_id}`;
      user_id = doesUserExist.rows[0].user_id;
    }


    if(doesUserExist.rowCount < 1){
      message = "User does not exist";
      return res.status(204).json({message});
    }

    getTopArtists = await sql`SELECT ARTIST_RANKING, ARTIST_INFO FROM USER_TOP_ARTISTS WHERE USER_ID = ${user_id} AND STATS_DATE = (SELECT DISTINCT MAX(STATS_DATE) FROM USER_TOP_ARTISTS WHERE USER_ID = ${user_id})`;
    getTopSongs = await sql`SELECT SONG_RANKING, SONG_INFO FROM USER_TOP_SONGS WHERE USER_ID = ${user_id} AND STATS_DATE = (SELECT DISTINCT MAX(STATS_DATE) FROM USER_TOP_SONGS WHERE USER_ID = ${user_id})`;



  } catch (error) {
    console.error(error);
  }

  return res.status(200).json({
    user_id: user_id,
    //user_name: username
    //user_image: image
    topArtists: getTopArtists.rows,
    topSongs: getTopSongs.rows
  });
}