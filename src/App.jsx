import { useState, useEffect } from "react";

import { ThemeProvider } from "./context/ThemeContext";

import Header from "./components/Header";
import Timerorspeed from "./components/Timerorspeed";
import Restart from "./components/Restart";
import Gameboard from "./components/Gameboard";
import Settingbar from "./components/Settingsbar";
import Results from "./components/Results";

import { FaLock } from "react-icons/fa";

function App() {
    const getStoredValue = (key, defaultValue) => {
        const stored = localStorage.getItem(key);
        return stored !== null ? JSON.parse(stored) : defaultValue;
    };

    const [wordList, setWordList] = useState([]);
    const [currentWordIndex, setCurrentWordIndex] = useState(0);
    const [currentLetterIndex, setCurrentLetterIndex] = useState(0);
    const [initialTime, setInitialTime] = useState(
        getStoredValue("initialTime", 30)
    );
    const [time, setTime] = useState(initialTime);
    //const [theme, setTheme] = useState(getStoredValue("theme", "Dark"));
    const [language, setLanguage] = useState(
        getStoredValue("language", "english")
    );
    const [timerRunning, setTimerRunning] = useState(false);
    const [letterStates, setLetterStates] = useState([]);
    const [firstAttemptStates, setFirstAttemptStates] = useState([]);
    const [wrongSpaces, setWrongSpaces] = useState([]);
    const [timerVisible, setTimerVisible] = useState(false);
    const [animate, setAnimate] = useState(false);
    const [isCapsLockOn, setIsCapsLockOn] = useState(false);

    const startNewGame = async () => {
        setAnimate(true);

        const languageModule = await import(
            `./data/languages/${language}.json`
        ).catch((err) => {
            console.error(`Error loading language module: ${err}`);
            return { words: ["error", "loading", "words"] };
        });

        const wordsArray = languageModule.words || [];

        let newWords = [];

        while (newWords.length < 200) {
            const randomWord =
                wordsArray[Math.floor(Math.random() * wordsArray.length)];

            if (randomWord.includes(" ")) {
                newWords.push(...randomWord.split(" "));
            } else {
                newWords.push(randomWord);
            }
        }

        setWordList(newWords);
        setCurrentWordIndex(0);
        setCurrentLetterIndex(0);
        setLetterStates([]);
        setTimerRunning(false);
        setTimerVisible(false);
        setTime(initialTime);
    };

    const handleRestart = () => {
        setAnimate(true);
        setTimeout(() => {
            startNewGame();
        }, 50);
    };

    function startTimer() {
        setTimerVisible(true);
        setTimerRunning(true);
    }

    useEffect(() => {
        if (animate) {
            const timer = setTimeout(() => {
                setAnimate(false);
            }, 100);

            return () => clearTimeout(timer);
        }
    }, [animate]);

    useEffect(() => {
        startNewGame();
    }, [language, initialTime]);

    // useEffect(() => {
    //     localStorage.setItem("theme", JSON.stringify(theme));
    // }, [theme]);

    useEffect(() => {
        localStorage.setItem("initialTime", JSON.stringify(initialTime));
    }, [initialTime]);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.getModifierState) {
                const capsOn = e.getModifierState("CapsLock");
                setIsCapsLockOn(capsOn);
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, []);


    function getTypingStats() {
        let correctChars = 0;
        let incorrectChars = 0;
        let missedChars = 0;
        let correctWords = 0;
        let totalWords = 0;
        let wrongSpaceCount = 0;

        const wordsToProcessCount = currentWordIndex + 1;

        for (let wordIndex = 0; wordIndex < wordsToProcessCount; wordIndex++) {
            const originalWord = wordList[wordIndex];
            const firstAttempts = firstAttemptStates[wordIndex] || [];
            const hasWrongSpace = wrongSpaces[wordIndex] || false;

            const wordWasAttempted =
                firstAttempts.some((attempt) => attempt !== undefined) ||
                hasWrongSpace;

            if (!wordWasAttempted && originalWord.length === 0) continue;

            if (hasWrongSpace) {
                wrongSpaceCount++;
            }
            const charsToProcess =
                wordIndex === currentWordIndex
                    ? Math.min(currentLetterIndex, originalWord.length) // Only characters typed so far
                    : originalWord.length;

            for (let charIndex = 0; charIndex < charsToProcess; charIndex++) {
                const firstAttempt = firstAttempts[charIndex];

                if (firstAttempt === "correct") {
                    correctChars++;
                } else if (firstAttempt === "incorrect") {
                    incorrectChars++;
                } else if (firstAttempt === "missed") {
                    missedChars++;
                } else if (firstAttempt === undefined) {
                    missedChars++;
                }
            }

            if (wordIndex < currentWordIndex) {
                const allCharactersCorrectInFirstAttempt = originalWord
                    .split("")
                    .every((_, index) => firstAttempts[index] === "correct");

                if (allCharactersCorrectInFirstAttempt && !hasWrongSpace) {
                    correctWords++;
                }
                totalWords++; 
            } else if (wordIndex === currentWordIndex) {
                if (currentLetterIndex > 0 || hasWrongSpace) {
                    totalWords++;
                }
            }

            totalWords++;
        }

        const elapsedTime = Math.max(initialTime - time, 1);
        const timeInMinutes = elapsedTime / 60;

        const totalTypedChars = correctChars + incorrectChars;
        const totalPossibleChars = correctChars + incorrectChars + missedChars;

        const netWPM =
            timeInMinutes > 0
                ? Math.round(correctChars / 5 / timeInMinutes)
                : 0;

        const grossWPM =
            timeInMinutes > 0
                ? Math.round(totalTypedChars / 5 / timeInMinutes)
                : 0;

        const netAccuracy =
            totalPossibleChars > 0
                ? ((correctChars / totalPossibleChars) * 100).toFixed(2)
                : "100.00";

        const grossAccuracy =
            totalTypedChars > 0
                ? ((correctChars / totalTypedChars) * 100).toFixed(2)
                : "100.00";

        const totalErrors = incorrectChars + missedChars + wrongSpaceCount;

        return {
            wpm: netWPM,
            rawWpm: grossWPM,
            accuracy: parseFloat(netAccuracy),
            rawAccuracy: parseFloat(grossAccuracy),
            correctChars,
            incorrectChars,
            extraChars: 0,
            missedChars,
            wrongSpaces: wrongSpaceCount,
            correctWords,
            totalWords,
            elapsedTime,
            timeInMinutes,
            totalTypedChars,
            totalPossibleChars,
            totalErrors,
        };
    }

    useEffect(() => {
        if (time > 0 && timerRunning) {
            const timer = setInterval(() => {
                setTime((prev) => Math.max(prev - 1, 0));
            }, 1000);
            return () => clearInterval(timer);
        }
        // if(time <= 0){
        //   console.log(wordList);
        //   console.log(letterStates);
        // }
    }, [time, timerRunning]);
    // ?? setinterval is used not recommend with tab is in background.

    useEffect(() => {
        setTime(initialTime);
    }, [initialTime]);

    return (
        <ThemeProvider>
            <main className="min-h-screen px-15 py-5 bg-[var(--bg)]">
                <Header
                    //theme={theme}
                    startNewGame={startNewGame}
                />
                <div className="flex justify-center items-center min-h-[6rem]">
                    {!timerRunning && (
                        <Settingbar
                            initialTime={initialTime}
                            setInitialTime={setInitialTime}
                            language={language}
                            setLanguage={setLanguage}
                            //theme={theme}
                            //setTheme={setTheme}
                            startNewGame={startNewGame}
                        />
                    )}
                </div>
                <div className="relative px-20 mb-4 min-h-[40px] flex items-center">
                    {timerVisible && (
                        <div className="flex-shrink-0">
                            <Timerorspeed
                                time={time}
                                timerRunning={timerRunning}
                                setTimerRunning={setTimerRunning}
                            />
                        </div>
                    )}

                    {isCapsLockOn && time > 0 && (
                        <div className="absolute flex left-1/2 transform -translate-x-1/2 bg-[var(--settingBg)] px-5 py-3 rounded-md text-[var(--text-active)]">
                            <div className="flex items-center gap-2">
                                <FaLock />
                                <span className="transform translate-y-[1px]">
                                    Caps Lock
                                </span>
                            </div>
                        </div>
                    )}
                </div>
                {time > 0 ? (
                    <Gameboard
                        wordList={wordList}
                        setWordList={setWordList}
                        letterStates={letterStates}
                        setLetterStates={setLetterStates}
                        firstAttemptStates={firstAttemptStates}
                        setFirstAttemptStates={setFirstAttemptStates}
                        wrongSpaces={wrongSpaces}
                        setWrongSpaces={setWrongSpaces}
                        currentWordIndex={currentWordIndex}
                        currentLetterIndex={currentLetterIndex}
                        setCurrentWordIndex={setCurrentWordIndex}
                        setCurrentLetterIndex={setCurrentLetterIndex}
                        startNewGame={startNewGame}
                        //theme={theme}
                        startTimer={startTimer}
                        time={time}
                        timerRunning={timerRunning}
                        setTimerRunning={setTimerRunning}
                        animate={animate}
                        isCapsLockOn={isCapsLockOn}
                        setIsCapsLockOn={setIsCapsLockOn}
                    />
                ) : (
                    <Results
                        // getWPM={getWPM}
                        initialTime={initialTime}
                        getTypingStats={getTypingStats}
                        // getRawSpeed={getRawSpeed}
                        //theme={theme}
                        // getAccuracy={getAccuracy}
                    />
                )}
                <div className="flex flex-col justify-center items-center">
                    <Restart
                        onRestart={handleRestart}
                        //theme={theme}
                    />
                </div>
            </main>
        </ThemeProvider>
    );
}

export default App;
