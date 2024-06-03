import axios, { AxiosResponse } from "axios";
import api_url from "../../config.json";

const Authentication = async (): Promise<boolean> => {
  try {
    const res: AxiosResponse = await axios.get(api_url + "/me", {
      withCredentials: true,
    });
    return res.status === 200;
  } catch (error) {
    return false;
  }
}

export default Authentication;