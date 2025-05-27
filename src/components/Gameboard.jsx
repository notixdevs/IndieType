import { useState, useEffect, useRef, useLayoutEffect } from "react";
import Cursor from "./Cursor";

const Gameboard = (props) => {
    const {
        wordList,
        currentWordIndex,
        setCurrentWordIndex,
        currentLetterIndex,
        setCurrentLetterIndex,
        //theme,
        startTimer,
        letterStates,
        setLetterStates,
        wrongSpaces,
        setWrongSpaces,
        time,
        firstAttemptStates,
        setFirstAttemptStates,
        timerRunning,
        setTimerRunning,
        animate,
    } = props;

    const lastExecutionTime = useRef(0);
    const wordsContainerRef = useRef(null);
    const gameRef = useRef(null);
    const mouseMoveTimeoutRef = useRef(null);

    const [fontSize, setFontSize] = useState("text-2xl");
    const [containerPadding, setContainerPadding] = useState("mx-4");
    const [gameHeight, setGameHeight] = useState("min-h-[8rem]");
    const [wordsHeight, setWordsHeight] = useState(
        "min-h-[7.75rem] max-h-[7.75rem]"
    );

    useEffect(() => {
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [currentWordIndex, currentLetterIndex, letterStates, timerRunning]);


    useEffect(() => {
        const now = Date.now();
        if (now - lastExecutionTime.current > 200) {
            adjustWordsPosition();
            lastExecutionTime.current = now;
        }
    }, [currentWordIndex]);

    useEffect(() => {
        setTimeout(resetPositionOnResize, 100);
    }, [fontSize]);

    useEffect(() => {
        function handleMouseMove() {
            if (timerRunning) {
                setTimerRunning(false);

                // Clear any existing timeout
                if (mouseMoveTimeoutRef.current) {
                    clearTimeout(mouseMoveTimeoutRef.current);
                }

                // Set a small debounce timeout to prevent constant triggers
                mouseMoveTimeoutRef.current = setTimeout(() => {
                    mouseMoveTimeoutRef.current = null;
                }, 100);
            }
        }

        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, [timerRunning, setTimerRunning]);

    useLayoutEffect(() => {
        function handleResize() {
            let oldFontSize = fontSize;
            if (window.innerWidth >= 1280) {
                // xl breakpoint
                setFontSize("text-4xl");
                setContainerPadding("mx-16");
                setGameHeight("min-h-[10.50rem]");
                setWordsHeight("min-h-[10.25rem] max-h-[10.25rem]");
            } else if (window.innerWidth >= 1024) {
                // lg breakpoint
                setFontSize("text-3xl");
                setContainerPadding("mx-12");
                setGameHeight("min-h-[9.50rem]");
                setWordsHeight("min-h-[9.25rem] max-h-[9.25rem]");
            } else if (window.innerWidth >= 768) {
                // md breakpoint
                setFontSize("text-2xl");
                setContainerPadding("mx-8");
                setGameHeight("min-h-[8.50rem]");
                setWordsHeight("min-h-[8.25rem] max-h-[8.25rem]");
            } else {
                // sm breakpoint
                setFontSize("text-xl");
                setContainerPadding("mx-4");
                setGameHeight("min-h-[7.50rem]");
                setWordsHeight("min-h-[7.25rem] max-h-[7.25rem]");
            }
            if (oldFontSize !== fontSize) {
                setTimeout(resetPositionOnResize, 100);
            }
        }
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    function resetPositionOnResize() {
        if (!wordsContainerRef.current) return;

        wordsContainerRef.current.style.marginTop = "0px";

        const currentWord = document.querySelector(".word.current");
        if (currentWord) {
            setTimeout(() => {
                const gameRect = gameRef.current.getBoundingClientRect();
                const wordRect = currentWord.getBoundingClientRect();

                if (wordRect.top < gameRect.top) {
                    const offset = gameRect.top - wordRect.top + 20;
                    wordsContainerRef.current.style.marginTop = `${offset}px`;
                }

                if (wordRect.bottom > gameRect.bottom) {
                    const offset = gameRect.bottom - wordRect.bottom - 20;
                    wordsContainerRef.current.style.marginTop = `${offset}px`;
                }
            }, 50);
        }
    }

    function handleKeyDown(e) {
        const functionalKeys = [
            "Shift",
            "Control",
            "Alt",
            "Tab",
            "CapsLock",
            "Escape",
            "Meta",
            "ArrowUp",
            "ArrowDown",
            "ArrowLeft",
            "ArrowRight",
            "Delete",
            "NumLock",
        ];
        if (functionalKeys.includes(e.key)) {
            e.preventDefault();
            return;
        }

        if (!timerRunning && time > 0 && e.key.length === 1 && e.key !== " ") {
            setTimerRunning(true);
            startTimer();
        }

        if (
            !wordList.length ||
            currentWordIndex >= wordList.length ||
            time <= 0
        ) {
            return;
        }

        const currentWord = wordList[currentWordIndex].split("");
        const currentLetter = currentWord[currentLetterIndex];
        const isLetter = e.key.length === 1 && e.key !== " ";
        const isSpace = e.key === " ";
        const isBackspace = e.key === "Backspace";

        let newLetterStates = [...letterStates];
        let newFirstAttemptStates = [...firstAttemptStates];
        let newWrongSpaces = [...wrongSpaces];

        if (!newLetterStates[currentWordIndex]) {
            newLetterStates[currentWordIndex] = new Array(
                currentWord.length
            ).fill("");
        }
        if (!newFirstAttemptStates[currentWordIndex]) {
            newFirstAttemptStates[currentWordIndex] = new Array(
                currentWord.length
            ).fill(undefined);
        }
        if (!newWrongSpaces[currentWordIndex]) {
            newWrongSpaces[currentWordIndex] = false;
        }

        if (isLetter) {
            if (currentLetterIndex < currentWord.length) {
                const isCorrect = e.key === currentLetter;
                const hasBeenAttempted =
                    newFirstAttemptStates[currentWordIndex][
                        currentLetterIndex
                    ] !== undefined;

                if (!hasBeenAttempted) {
                    newFirstAttemptStates[currentWordIndex][
                        currentLetterIndex
                    ] = isCorrect ? "correct" : "incorrect";
                }
                newLetterStates[currentWordIndex][currentLetterIndex] =
                    isCorrect ? "correct" : "incorrect";
                setCurrentLetterIndex((prev) => prev + 1);
            }
        } else if (isSpace) {
            if (currentLetterIndex === 0) {
                return;
            }
            else {
                if (currentLetterIndex < currentWord.length) {
                    newWrongSpaces[currentWordIndex] = true;
                    for (let i = currentLetterIndex; i < currentWord.length; i++) {
                        if (newFirstAttemptStates[currentWordIndex][i] === undefined) {
                            newFirstAttemptStates[currentWordIndex][i] = "missed";
                        }
                        newLetterStates[currentWordIndex][i] = "missed";
                    }
                }
                setCurrentWordIndex((prev) => prev + 1);
                setCurrentLetterIndex(0);
            }
        }else if (isBackspace) {
            if (currentLetterIndex > 0) {
                const prevIndex = currentLetterIndex - 1;
                newLetterStates[currentWordIndex][prevIndex] = "";
                setCurrentLetterIndex((prev) => prev - 1);
            } else if (currentWordIndex > 0) {
                const prevWordIndex = currentWordIndex - 1;
                const prevWordCompleted =
                    newLetterStates[prevWordIndex]?.every(
                        (status, index) =>
                            status === "correct" ||
                            wordList[prevWordIndex][index] === undefined
                    ) && !newWrongSpaces[prevWordIndex];

                if (prevWordCompleted) {
                    return;
                }

                const previousWordElement =
                    document.querySelectorAll(".word")[prevWordIndex];
                const currentWordElement =
                    document.querySelectorAll(".word")[currentWordIndex];


                if (
                    previousWordElement &&
                    currentWordElement &&
                    gameRef.current
                ) {
                    const gameBoxRect = gameRef.current.getBoundingClientRect();
                    const previousWordRect =
                        previousWordElement.getBoundingClientRect();

                    const isPreviousWordVisible =
                        previousWordRect.bottom >= gameBoxRect.top &&
                        previousWordRect.top <= gameBoxRect.bottom;

                    const currentTop =
                        currentWordElement.getBoundingClientRect().top;
                    const previousTop = previousWordRect.top;
                    const isOnSameLine = currentTop === previousTop;
                    const isPreviousLineVisible =
                        isPreviousWordVisible && !isOnSameLine;

                    if (isOnSameLine || isPreviousLineVisible) {
                        setCurrentWordIndex((prev) => prev - 1);

                        const prevWordStates =
                            newLetterStates[prevWordIndex] || [];
                        let lastTypedIndex = prevWordStates.length;

                        while (
                            lastTypedIndex > 0 &&
                            (prevWordStates[lastTypedIndex - 1] === "missed" ||
                                prevWordStates[lastTypedIndex - 1] === "")
                        ) {
                            newLetterStates[prevWordIndex][lastTypedIndex - 1] =
                                "";
                            lastTypedIndex--;
                        }
                        setCurrentLetterIndex(lastTypedIndex);
                    }
                }
            }
        }
        // console.log(newLetterStates);
        // console.log(newFirstAttemptStates);
        // console.log(newWrongSpaces);

        setLetterStates(newLetterStates);
        setFirstAttemptStates(newFirstAttemptStates);
        setWrongSpaces(newWrongSpaces);
    }

    function adjustWordsPosition() {
        if (!wordsContainerRef.current) return;

        const wordElement = document.querySelector(".word.current");
        if (!wordElement) return;

        const wordBox = wordsContainerRef.current;
        if (!wordBox) return;

        let threshold = 380;
        let scrollAmount = 57;

        // ?? not properly working in
        if (fontSize === "text-xl") {
            scrollAmount = 48;
        } else if (fontSize === "text-2xl") {
            scrollAmount = 50;
        } else if (fontSize === "text-3xl") {
            scrollAmount = 52;
        }

        if (wordElement.getBoundingClientRect().top > threshold) {
            const margin = parseInt(
                getComputedStyle(wordBox).marginTop || "0",
                10
            );
            wordBox.style.marginTop = margin - scrollAmount + "px";
        }
    }

    const getTextClasses = (status) => {
        if (status === "correct") return "text-[var(--correct)]";
        if (status === "incorrect") return "text-[var(--wrong)]";
        if (status === "missed")
            return "text-[var(--skipped)] underline decoration-red-400 decoration-[2px] underline-offset-4";
        return "text-[var(--default)]";
    };

    return (
        <div
            id="game"
            ref={gameRef}
            className={`p-4 text-zinc-500 rounded-lg ${containerPadding} mb-10 py-2 overflow-hidden ${gameHeight}
transition-opacity duration-200 ease-out ${
                animate ? "opacity-0" : "opacity-100"
            }
                `}
        >
            <div
                id="words"
                ref={wordsContainerRef}
                className={`relative ${wordsHeight} ${fontSize}`}
                style={{ transition: "margin-top 0.2s ease-out" }}
            >
                {wordList.map((word, wordIndex) => (
                    <div
                        className={`word inline-block mr-3 my-2 ${
                            wordIndex === currentWordIndex ? "current" : ""
                        }`}
                        key={wordIndex}
                    >
                        {word.split("").map((letter, letterIndex) => (
                            <span
                                key={letterIndex}
                                className={`letter relative ${getTextClasses(
                                    letterStates[wordIndex]?.[letterIndex] || ""
                                )} ${
                                    wordIndex === currentWordIndex &&
                                    letterIndex === currentLetterIndex
                                        ? "current"
                                        : ""
                                }
                  ${wordIndex === 0 && letterIndex === 0 ? "firstLetter" : ""}`}
                            >
                                {letter}
                                {wordIndex === currentWordIndex &&
                                    letterIndex === currentLetterIndex && (
                                        <Cursor
                                            timerRunning={timerRunning}
                                            //theme={theme}
                                        />
                                    )}
                            </span>
                        ))}
                        {wordIndex === currentWordIndex &&
                            currentLetterIndex === word.length && (
                                <span className="letter relative">
                                    <Cursor
                                        timerRunning={timerRunning}
                                        //theme={theme}
                                    />
                                </span>
                            )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Gameboard;
