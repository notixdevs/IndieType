import React, { useState } from "react";
import ThemeToggle from "./ThemeToggleButton";
import { useTheme } from "../context/ThemeContext";


const Settingbar = (props) => {
    const {
        initialTime,
        setInitialTime,
        language,
        setLanguage,
    } = props;

    const {theme} = useTheme();

    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const timeOptions = [15, 30, 45, 60];
    //const themeOptions = ["Light", "Dark"];
    const languageOptions = [
        { value: "english", label: "English" },
        { value: "english_1k", label: "English 1K" },
        { value: "hinglish", label: "Hinglish" },
        { value: "telugu", label: "Telugu" },
        { value: "bengali", label: "Bengali" },
        { value: "marathi", label: "Marathi" },
        { value: "gujarati", label: "Gujarati" },
        { value: "malayalam", label: "Malayalam" },
        { value: "kannada", label: "Kannada" },
        { value: "punjabi", label: "Punjabi" },
        { value: "tamil", label: "Tamil" },
        { value: "weeb", label: "Weeb" },
        { value: "brainrot", label: "Brainrot" },
    ];

    // const handleThemeChange = (themeOption) => {
    //     setTheme(theme === "Dark" ? "Light" : "Dark")
    //     localStorage.setItem("theme", JSON.stringify(themeOption));
    // };

    const handleTimeChange = (timeOption) => {
        if (initialTime !== timeOption) {
            setInitialTime(timeOption);
            localStorage.setItem("initialTime", JSON.stringify(timeOption));
        }
    };

    const handleLanguageChange = (e) => {
        const selectedLanguage = e.target.value;
        //console.log(selectedLanguage);
        if (language !== selectedLanguage) {
            setLanguage(selectedLanguage);
            localStorage.setItem("language", JSON.stringify(selectedLanguage));
        }
    };

    const togglePopup = () => {
        setIsPopupOpen(!isPopupOpen);
    };

    const renderSettingsContent = () => (
        <>
            <div className="flex flex-col md:flex-row md:items-center gap-5">
                <div className="flex gap-5">
                    {timeOptions.map((timeOption) => (
                        <button
                            key={timeOption}
                            className={`${
                                initialTime === timeOption
                                    ? "text-[var(--text-active)]"
                                    : "text-[var(--default)]"
                                } 
                                hover:text-[var(--text-hover)]
                            `}
                            onClick={() => handleTimeChange(timeOption)}
                        >
                            {timeOption}
                        </button>
                    ))}
                </div>
                
                <div
                    className="text-2xl hidden md:block text-[var(--default)]"
                >
                    |
                </div>

                <div className="flex items-center">
                    <select
                        value={language || "english"}
                        onChange={handleLanguageChange}
                        className="
                            bg-[var(--settingBg)] text-[var(--text-active)] border-[var(--default)] hover:text-[var(--text-hover)]
                            border rounded px-2 py-1 border-none focus:outline-none w-full md:w-auto cursor-pointer"
                    >
                        {languageOptions.map((option) => (
                            <option key={option.value} value={option.value} className="text-[var(--text)]">
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>

                <div
                    className="text-2xl hidden md:block text-[var(--default)]"
                >
                    |
                </div>

                <div className="flex gap-5">
                    <ThemeToggle/>
                </div>
            </div>
        </>
    );

    return (
        <>
            <div className="md:hidden mb-4">
                <button
                    onClick={togglePopup}
                    className="bg-[var(--settingBg)] text-[var(--text)] px-4 py-2 rounded-md flex items-center justify-center w-full"
                >
                    Settings
                </button>
            </div>

            {isPopupOpen && (
                <div className="fixed inset-0 bg-[var-(--bg)] bg-opacity-50 flex items-center justify-center z-50 md:hidden">
                    <div
                        className="bg-[var(--settingBg)] text-[var(--default)] p-5 rounded-lg w-11/12 max-w-sm"
                    >
                        <div className="flex justify-between items-center mb-4">
                            <h3
                                className="text-[var(--text)] font-medium"
                            >
                                Settings
                            </h3>
                            <button
                                onClick={togglePopup}
                                className="text-[var(--text)]"
                            >
                                ✕
                            </button>
                        </div>
                        {renderSettingsContent()}
                    </div>
                </div>
            )}

            <div
                className="bg-[var(--settingBg)] text-[var(--default)] px-4 py-2 rounded-md items-center max-w-[32rem] gap-5 mb-10 hidden md:flex"
            >
                {renderSettingsContent()}
            </div>
        </>
    );
};

export default Settingbar;
