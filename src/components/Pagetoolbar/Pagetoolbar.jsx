import Icon from "../../assets/Icons/Icon";
import "./Pagetoolbar.css";

function PageToolbar({ icon, title, description, children }) {
    return (
        <section className="app-toolbar">
            <div className="app-toolbar-intro">
                <span className="app-toolbar-icon"><Icon name={icon} size={24} /></span>
                <div>
                    <strong>{title}</strong>
                    <p>{description}</p>
                </div>
            </div>
            {children}
        </section>
    );
}
 
export default PageToolbar;