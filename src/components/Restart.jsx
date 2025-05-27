import React from "react";

const Restart = (props) => {
    const {onRestart} = props;
    
    const handleRestart = (e) => {
        onRestart();
        e.currentTarget.blur();
    };
    
    return(
        <button  
            onClick={handleRestart} 
            className="text-[var(--default)] hover:text-[var(--text-active)] p-0 border-none text-3xl w-10 h-10"
        >
            <i className="fa-solid fa-rotate-right"></i>
        </button>
    )
}

export default Restart;