import { sql } from '@vercel/postgres';

export default async function getStats(req, res) {
    const user_id = req.query.user_id;
    let message = "";
    const currentDate = getFormattedDate();

  try {
    const getTopArtists = await sql`SELECT ARTIST_RANKING, ARTIST_ID FROM USER_TOP_ARTISTS WHERE USER_ID = ${user_id} AND STATS_DATE = ${currentDate}`;
    const getTopSongs = await sql`SELECT ARTIST_RANKING, ARTIST_ID FROM USER_TOP_ARTISTS WHERE USER_ID = ${user_id} AND STATS_DATE = ${currentDate}`;

    console.log(getTopArtists)

  } catch (error) {
    console.error(error);
  }

    if(user_id !== ''){

        const doesUserExist = await sql`SELECT USER_ID FROM USERS WHERE USER_ID = ${user_id}`;
        
        if(doesUserExist.user_id === undefined){

            message = `user does not exist: ${doesUserExist.user_id}`
            //const insertNewUser = await sql`INSERT INTO USERS (USER_ID, EMAIL, SHARE_STATS) VALUES (${user_id, user_email, 'N'}) `
        }
       else{
            message = `user does exist: ${doesUserExist.user_id}`
        }
    }
    else{
        message = `user id does not exist exists: ${user_id}`
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