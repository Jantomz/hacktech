import { OAuth2Client } from "google-auth-library";
import { google } from "googleapis";

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REDIRECT_URI = "http://localhost:3000/api/auth/callback/google"; // Change this to your deployed URI for production

const oauth2Client = new google.auth.OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    REDIRECT_URI
);

export default async function handler(req, res) {
    if (req.method === "POST") {
        const { credential } = req.body;

        try {
            const ticket = await new OAuth2Client(CLIENT_ID).verifyIdToken({
                idToken: credential,
                audience: CLIENT_ID,
            });

            const payload = ticket.getPayload();
            console.log("User Info:", payload);

            // Store the user's tokens in your DB (refresh tokens)
            // Here, let's use the tokens temporarily for demo purposes

            const { tokens } = await oauth2Client.getToken(credential);
            oauth2Client.setCredentials(tokens);

            // Now that the user is authenticated, let's list their Gmail messages
            const gmail = google.gmail({ version: "v1", auth: oauth2Client });

            // List the user's Gmail messages
            const res = await gmail.users.messages.list({
                userId: "me",
                maxResults: 10, // Fetch up to 10 messages
            });

            const messages = res.data.messages || [];
            res.send({ messages });
        } catch (error) {
            console.error(
                "Error verifying Google token or fetching messages",
                error
            );
            res.status(400).send(
                "Authentication failed or error fetching messages"
            );
        }
    }
}
