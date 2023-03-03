import { useState } from "react";
import "../styles/Dropdown.css";

import arrow from "../images/dropdown_arrow.png";

function Dropdown (props) {
    const [menuOpen, setMenuOpen] = useState(null)

    return (
        <div className="dropdown" tabIndex="0" onBlur={() => {setMenuOpen(false)}} onClick={() => {
            if(!props.disabled) {
                setMenuOpen(!menuOpen)
            }
            }}>
            <p>{props.selected} {props.extra}</p>
            <img className={menuOpen !== null ? menuOpen ? "opened" : "closed" : ""} src={arrow} alt="dropdown arrow" />

            {menuOpen === true ?
            <div className="options">
                {props.options.map((ele, i) => <div key={i} className="option"  onClick={() => {props.setter(ele)}}>{ele}</div>)}
            </div>
            :
            <></> }

        </div>
    );
}

export default Dropdown;