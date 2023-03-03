import "../styles/Switcher.css"

function Switcher (props) {
    return (
        <div className="switcher" onClick={() => {
            if(!props.disabled) {
                props.setter(!props.on)
            }
            }}>
            <div className={`ball ${props.on ? "active" : "inactive"}`}></div>
        </div>
    );
}

export default Switcher;