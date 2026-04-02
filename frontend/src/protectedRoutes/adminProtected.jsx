import Cookies from "js-cookie";
import { Navigate } from "react-router-dom";

export const AdminRoute = ({ children }) => {
    const cookieData = Cookies.get("hos_users");
 
    if (!cookieData) {
        return <Navigate to="/login" replace />;
    }

    try {
        const user = JSON.parse(cookieData);
        if (user?.role === "admin") {
            return children;
        } else {
            return <Navigate to="/login" replace />;
        }
    } catch (error) {
         console.error("Auth Error:", error);
        return <Navigate to="/login" replace />;
    }
};