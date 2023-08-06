import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
export const notify = (type, message) => {
    toast[type](message);
}
