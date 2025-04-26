import { OAuth2Client } from "google-auth-library";
import { google } from "googleapis";

const CLIENT_ID = process.env.VITE_GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.VITE_GOOGLE_CLIENT_SECRET;
const REDIRECT_URI = "http://localhost:3000"; // Change this to your deployed URI for production

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

            // OPTIONAL: Here you can also start Gmail API calls
            // - store tokens
            // - or start fetching emails immediately

            res.send({ status: "success", email: payload.email });
        } catch (error) {
            console.error("Error verifying Google token", error);
            res.status(400).send("Authentication failed");
        }
    }
}
