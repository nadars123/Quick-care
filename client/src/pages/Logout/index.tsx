import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { clearUser} from "@/stores/userSlice";

const Logout = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        // Clear user data from Redux
        dispatch(clearUser());

        // Remove user info from localStorage
        localStorage.removeItem("role");
        localStorage.removeItem("user");

        // Redirect to login page after clearing data
        navigate("/login", { replace: true });
    }, [dispatch, navigate]);

    return null; // No UI needed, just performs the logout action
};

export default Logout;
