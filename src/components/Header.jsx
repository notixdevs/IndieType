import React from "react";
import { FaBug } from "react-icons/fa"; 


const Header = (props) =>{
    const {startNewGame} = props;
    return(
        <div className={"text-[var(--heading)] py-10 mb-1 px-20"}>
            <div className="text-3xl flex justify-start gap-2 cursor-pointer items-center" onClick={startNewGame}>
                <div className="text-3xl flex items-center">
                    <FaBug />
                </div>
                <p>IndieType</p>
            </div>
        </div>
    )
}

export default Header;