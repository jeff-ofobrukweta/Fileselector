import axios from "axios";

// getting the api url from the env
const apiUrl = process.env["VUE_APP_API_URL"];

// get function
export const axiosGet = async (url = apiUrl ? apiUrl : "") => {
  try {
    let response = await axios.get(url);
    return response.data;
  } catch (err) {
    return err;
  }
};
