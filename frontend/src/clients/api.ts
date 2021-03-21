import axios from "axios";

export default axios.create({
  baseURL:
    "https://cors-anywhere.herokuapp.com/https://us-central1-teste-869ba.cloudfunctions.net/api",
});
