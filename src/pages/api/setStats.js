import { sql } from '@vercel/postgres';
import { v4 } from "uuid";

export default async function getStats(req, res) {
    const user_email = req.body.user_email;
    const top_artists = req.body.top_artists;
    const top_songs = req.body.top_songs;
    let message = "";

		// await sql`DROP TABLE USERS`;
		// await sql`DROP TABLE USER_TOP_ARTISTS`;
		// await sql`DROP TABLE USER_TOP_SONGS`;

    // await sql`DELETE FROM USERS`;
		// await sql`DELETE FROM USER_TOP_ARTISTS`;
		// await sql`DELETE FROM USER_TOP_SONGS`;

  try {
    const createUsersTable = await sql`CREATE TABLE IF NOT EXISTS USERS (USER_ID varchar(200), EMAIL varchar(320), SHARE_STATS varchar(1), PRIMARY KEY(USER_ID, EMAIL));`;
    const createTopArtistsTable = await sql`CREATE TABLE IF NOT EXISTS USER_TOP_ARTISTS (USER_ID varchar(200), ARTIST_RANKING int, ARTIST_INFO json, STATS_DATE DATE);`;
    const createTopSongsTable = await sql`CREATE TABLE IF NOT EXISTS USER_TOP_SONGS (USER_ID varchar(200), SONG_RANKING int, SONG_INFO json, STATS_DATE DATE);`;
    //console.log(`Created tables`);

    const doesUserExist = await sql`SELECT USER_ID FROM USERS WHERE EMAIL = ${user_email}`;

    //Create new ID for user if we aren't storing their account info
    if(doesUserExist.rowCount < 1){

        //console.log(`user does not exist: ${doesUserExist.user_id}, making id`);
        const newUserId = v4();
        const insertNewUser = await sql`INSERT INTO USERS (USER_ID, EMAIL, SHARE_STATS) VALUES (${newUserId}, ${user_email}, 'N') `
    }

    const user_id_query = await sql`SELECT USER_ID FROM USERS WHERE EMAIL = ${user_email}`;
    const user_id = user_id_query.rows[0].user_id;
    //console.log("User id for " + user_email + " is " + user_id)

    const currentDate = getFormattedDate();

    const isArtistsUpToDate = await sql`SELECT COUNT(*) FROM USER_TOP_ARTISTS WHERE USER_ID = ${user_id} and STATS_DATE = ${currentDate}`
    if(isArtistsUpToDate.rows[0].count === '0'){
      for(let i = 0; i < 5; i++){
        const insertTopArtists = await sql`INSERT INTO USER_TOP_ARTISTS (USER_ID, ARTIST_RANKING, ARTIST_INFO, STATS_DATE) VALUES (${user_id}, ${i}, ${top_artists?.[i]}, ${currentDate})`;
      }
    }

    const isSongsUpToDate = await sql`SELECT COUNT(*) FROM USER_TOP_SONGS WHERE USER_ID = ${user_id} and STATS_DATE = ${currentDate}`
    if(isSongsUpToDate.rows[0].count === '0'){
      for(let i = 0; i < 5; i++){
        const insertTopSongs = await sql`INSERT INTO USER_TOP_SONGS (USER_ID, SONG_RANKING, SONG_INFO, STATS_DATE) VALUES (${user_id}, ${i}, ${top_songs?.[i]}, ${currentDate})`;
      }
    }

    message = "Stats Saved";
    } catch (error) {
        message = "Error saving stats";
        console.error(message, error);
    }

  return res.status(200).json({message});
}

function getFormattedDate() {
  const currentDate = new Date();
  const options = { day: 'numeric', month: 'short', year: 'numeric' };
  const dateParts = currentDate.toLocaleDateString('en-GB', options).split(' ');

  // Rearrange parts into 'dd-mmm-yyyy' format
  const formattedDate = `${dateParts[0]}-${dateParts[1]}-${dateParts[2]}`;

  return formattedDate;
}