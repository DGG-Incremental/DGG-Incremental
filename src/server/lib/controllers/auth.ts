import axios from "axios";
import { getCodeVerifier, getOauthRedirect, getUserInfo } from "../services/auth";
import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';

export const APP_ID = process.env.DGG_OATH_ID;
export const REDIRECT_URI = process.env.REDIRECT_URI;

export const oauthRedirect = (req, res) => res.redirect(getOauthRedirect())

export const oauth = async (req: Request, res: Response) => {
	const { code, state } = req.query;
	const code_verifier = getCodeVerifier(state);
	try {
		const { data } = await axios.get("https://www.destiny.gg/oauth/token", {
			params: {
				grant_type: "authorization_code",
				code,
				client_id: APP_ID,
				redirect_uri: REDIRECT_URI,
				code_verifier,
			},
		});
		const username = await getUserInfo(data.access_token);
		res.cookie("username", username);
		res.cookie("token", data.access_token);
		res.cookie("jwt", jwt.sign({ username }, process.env.JWT_SECRET));
		res.redirect("/");
	}
	catch (err) {
		res.statusCode = 500;
		res.send();
	}
}
