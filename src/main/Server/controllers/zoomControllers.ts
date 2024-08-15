import asyncHandler from "express-async-handler";
import dotenv from 'dotenv'
dotenv.config()

import KJUR from "jsrsasign";

import { getZoomAPIAccessToken, makeZoomAPIRequest } from "../api/zoomAPI";

import { clickJoinMeetingButton } from "../helpers/meetingBot";

/// TODO
export const handleGetMeetingDetails = async (meetingNumber) => {
  return
};

export const generateSDKSignature = asyncHandler(async (req: any, res: any) => {
  const iat = Math.round(new Date().getTime() / 1000) - 30;
  const exp = iat + 60 * 60 * 2;

  console.log("generateSDKSignature", req.body.meetingNumber, req.body.role);

  const oHeader = { alg: "HS256", typ: "JWT" };

  const oPayload = {
    sdkKey: process.env.ZOOM_MSDK_KEY,
    mn: req.body.meetingNumber,
    role: req.body.role,
    iat: iat,
    exp: exp,
    tokenExp: iat + 60 * 60 * 2,
  };

  const sHeader = JSON.stringify(oHeader);
  const sPayload = JSON.stringify(oPayload);
  const signature = KJUR.jws.JWS.sign(
    "HS256",
    sHeader,
    sPayload,
    process.env.ZOOM_MSDK_SECRET
  );

  res.json({
    signature: signature,
  });
});

// To Remove
export const getMeetingDetails = asyncHandler(async (req, res: any) => {
  try {
    // Make a request to the Zoom API to get the meeting details and ZAK token
    // const meetingDetails =  await makeZoomAPIRequest("GET", "https://api.zoom.us/v2/users/me/token?type=zak")

    res.status(201).json({ id: "94992962195", passWord: "371741" });
  } catch (error: any) {
    res.status(400);
    throw new Error(error);
  }
});

export const getHostZAKToken = asyncHandler(async (req: any, res: any) => {
  try {
    const { token } = await makeZoomAPIRequest(
      "GET",
      "https://api.zoom.us/v2/users/me/token?type=zak"
    );

    res.status(201).json({ token });
  } catch (error: any) {
    res.status(400);
    throw new Error(error);
  }
});
