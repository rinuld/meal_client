import React, {useContext} from "react";

function Header(props){
    
    console.log("Render Header"+props.title);
    return (
        <div className="header">
            <h2>{props.title}</h2>
        </div>
    )
}

export default Header