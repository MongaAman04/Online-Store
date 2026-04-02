import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";
export const UserRoute = ({children})=>{
    const cookieData = Cookies.get("hos_users");
    
       if (!cookieData) {
           return <Navigate to="/login" replace />;
       }
   
       try {
           const user = JSON.parse(cookieData);
           if (user?.role === "user" || user?.role === "admin") {
               return children;
           } else {
               return <Navigate to="/login" replace />;
           }
       } catch (error) {
            console.error("Auth Error:", error);
           return <Navigate to="/login" replace />;
       }
}