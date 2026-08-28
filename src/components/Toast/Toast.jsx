import Icon from "../../assets/Icons/Icon";
import "./Toast.css";
 
const ICON_BY_TYPE = { success: "check", info: "info", warning: "info", whatsapp: "whatsapp" };

function Toast({ toast }) {
    if (!toast) return null;
    const { message, type } = typeof toast === "string" ? { message: toast, type: "success" } : toast;
 
    return (
        <div className={`app-toast app-toast-${type}`} role="status">
            <span className="app-toast-icon"><Icon name={ICON_BY_TYPE[type] || "check"} size={18} /></span>
            <div>{message}</div>
        </div>
    );
}
 
export default Toast;