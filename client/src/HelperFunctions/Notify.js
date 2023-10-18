import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// function  that uses react toastify to send a popout side message to the user.
export const notify = (type, message) => {
    toast[type](message);
}
