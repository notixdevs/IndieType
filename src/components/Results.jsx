import React, { useState } from "react";

const Results = (props) => {
    const { initialTime, getTypingStats } = props;
    const stats = getTypingStats();

    return (
        <div className="p-4 rounded-lg mx-2 md:mx-8 lg:mx-16 mb-6 md:mb-10 py-2 min-h-[10rem] flex flex-wrap justify-center gap-4 md:gap-6 lg:gap-8">
            <StatItem
                label="wpm"
                value={stats.wpm}
                // theme={theme}
            />
            <StatItem
                label="accuracy"
                value={`${Math.floor(stats.accuracy)}%`}
            />
            <StatItem
                label="characters"
                value={`${stats.correctChars}/${stats.incorrectChars}/${stats.missedChars}`}
                // theme={theme}
                hoverText={`correct \n incorrect \nmissed`}
            />
            <StatItem 
                label="raw" 
                value={stats.rawWpm} 
                // theme={theme} 
            />
            <StatItem 
                label="time" 
                value={`${initialTime}s`} 
                // theme={theme} 
            />
        </div>
    );
};

const StatItem = ({ label, value, hoverText }) => {
    const [showHover, setShowHover] = useState(false);

    return (
        <div
            className="flex flex-col items-center justify-center px-2 sm:px-3 md:px-4 py-2 transition-all duration-200 ease-in-out relative"
            onMouseEnter={() => setShowHover(true)}
            onMouseLeave={() => setShowHover(false)}
            onTouchStart={() => setShowHover(true)}
            onTouchEnd={() => setShowHover(false)}
        >
            <div className="text-zinc-500 text-lg sm:text-xl md:text-2xl lg:text-3xl font-medium">
                {label}
            </div>
            <div
                className="text-[var(--text-active)] text-xl sm:text-2xl md:text-4xl lg:text-5xl xl:text-6xl font-bold"
            >
                {value}
            </div>

            {showHover && hoverText && (
                <div
                    className="absolute z-10 w-auto min-w-[110px] transform -translate-x-1/2 left-1/2 
                               bottom-full mb-2 bg-gray-800 text-white px-3 py-2 rounded-md 
                               text-xs sm:text-sm whitespace-pre-line shadow-lg
                               before:content-[''] before:absolute before:top-full before:left-1/2 
                               before:-translate-x-1/2 before:border-8 before:border-transparent
                               before:border-t-gray-800"
                >
                    {hoverText.split("\n").map((line, index) => (
                        <div key={index} className="py-0.5">
                            {line}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Results;
