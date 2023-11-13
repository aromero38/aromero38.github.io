import { sql } from '@vercel/postgres';
import { v4 } from "uuid";

export default async function setStats(req, res) {
	const user_email = req.body.user_email;
	const top_artists = req.body.top_artists;
	const top_songs = req.body.top_songs;
	
	console.log("req body", user_email, top_artists, top_songs);
	let message = undefined;

	try {
		// Delete Tables
		// await sql`DROP TABLE USERS`;
		// await sql`DROP TABLE USER_TOP_ARTISTS`;
		// await sql`DROP TABLE USER_TOP_SONGS`;

		// Create Users Table
		await sql`CREATE TABLE IF NOT EXISTS USERS (USER_ID varchar(200), EMAIL varchar(320), SHARE_STATS varchar(1), LAST_UPDATE varchar(20), PRIMARY KEY(USER_ID, EMAIL));`;
		// Create Top Artists Table
		await sql`CREATE TABLE IF NOT EXISTS USER_TOP_ARTISTS (USER_ID varchar(200), ARTIST_RANKING int, ARTIST_ID varchar(200));`;
		// Create Top Songs Table
		await sql`CREATE TABLE IF NOT EXISTS USER_TOP_SONGS (USER_ID varchar(200), SONG_RANKING int, SONG_ID varchar(200));`;

		// Check If User Exists
		const doesUserExist = await sql`SELECT USER_ID FROM USERS WHERE EMAIL = ${user_email}`;

		// Create User In Table If Not
		if (doesUserExist.rowCount < 1) {
			const newUserId = v4();
			const currentDate = getFormattedDate();

			await sql`INSERT INTO USERS (USER_ID, EMAIL, SHARE_STATS, LAST_UPDATE) VALUES (${newUserId}, ${user_email}, 'Y', ${currentDate})`

			// Insert Top Songs/Artists
			for (let i = 0; i < 5; i++) {
				await sql`INSERT INTO USER_TOP_SONGS (USER_ID, SONG_RANKING, SONG_ID) VALUES (${newUserId}, ${i}, ${top_songs?.[i]?.id})`;
				await sql`INSERT INTO USER_TOP_ARTISTS (USER_ID, ARTIST_RANKING, ARTIST_ID) VALUES (${newUserId}, ${i}, ${top_artists?.[i]?.id})`;
			}

			message = "Created User & Stats Up-to-date"
		}
		// Update Stats If Outdated
		else {
			const user_id_query = await sql`SELECT USER_ID FROM USERS WHERE EMAIL=${user_email}`;
			const user_id = user_id_query.rows[0].user_id;

			const storedDate_query = await sql`SELECT LAST_UPDATE FROM USERS WHERE USER_ID = ${user_id}`;
			const storedDate = storedDate_query.rows[0].last_update;

			if (storedDate !== getFormattedDate()) {
				await sql`DELETE FROM USER_TOP_SONGS WHERE USER_ID=${user_id}`
				await sql`DELETE FROM USER_TOP_ARTISTS WHERE USER_ID=${user_id}`

				for (let i = 0; i < 5; i++) {
					await sql`INSERT INTO USER_TOP_SONGS (USER_ID, SONG_RANKING, SONG_ID) VALUES (${user_id}, ${i}, ${top_songs?.[i]?.id})`;
					await sql`INSERT INTO USER_TOP_ARTISTS (USER_ID, ARTIST_RANKING, ARTIST_ID) VALUES (${user_id}, ${i}, ${top_artists?.[i]?.id})`;
				}

				await sql`UPDATE USERS SET LAST_UPDATE=${getFormattedDate()} WHERE USER_ID=${user_id}`;
				message = "User Exists & Stats Updated"
			}
			else {
				message = "User Exists & Stats Already Up-to-date"
			}
		}
	} 
	catch (error) {
		message = "Error saving stats";
		console.error(message, error);
	}

	return res.status(200).json({message});
}

function getFormattedDate() {
	const currentDate = new Date();
	
	// Get year, month, and day separately
	const year = currentDate.getFullYear();
	const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Months are zero-based
	const day = String(currentDate.getDate()).padStart(2, '0');
  
	// Concatenate parts into 'yyyy-mm-dd' format
	const formattedDate = `${year}-${month}-${day}`;
  
	return formattedDate;
  }