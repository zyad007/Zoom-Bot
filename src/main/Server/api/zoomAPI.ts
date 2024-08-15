import axios from "axios";
import btoa from "btoa";
import dotenv from 'dotenv'
dotenv.config()

export const getZoomAPIAccessToken = async () => {
  try {
    const base_64 = btoa(process.env.CLIENT_ID + ":" + process.env.CLIENT_SECRET);
    
    const resp = await axios({
      method: "POST",
      url:
        "https://zoom.us/oauth/token?grant_type=client_credentials&account_id=" +
        `${process.env.ACCOUNT_ID}`,
      headers: {
        Authorization: "Basic" + `${base_64} `,
        "Content-Type": 'application/x-www-form-urlencoded'
      },
    });
    console.log('Succ');
    return resp.data.access_token;
  } catch (err) {
    // Handle Error Here
    console.error(err);
  }
};

console.log(getZoomAPIAccessToken());


export const makeZoomAPIRequest = async (method, endpoint, data = null) => {
  try {
    const resp = await axios({
      method: method,
      url: endpoint,
      headers: {
        Authorization: "Bearer " + `${await getZoomAPIAccessToken()} `,
        "Content-Type": "application/json",
      },
    });

    console.log("ZakMeeting", resp.data);

    return resp.data;
  } catch (err: any) {
    if (err.status == undefined) {
      console.log("Error : ", err);
    }
  }
};