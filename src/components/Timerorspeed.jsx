import React from "react";
import { useEffect } from "react";

const Timerorspeed = (props) => {
    const { time, timerRunning, setTimerRunning } = props;

    useEffect(() => {
        if (time <= 0 && timerRunning) {
            setTimerRunning(false);
        }
    }, [time, timerRunning, setTimerRunning]);

    if (timerRunning) {
        return <div className="text-[var(--timer)] text-4xl">{time}</div>;
    } else {
        if (time > 0)
            return <div className="text-[var(--timer)] text-4xl"></div>;
        else {
            return (
                <div className="text-[var(--text-active)] text-3xl md:text-4xl font-semibold mx-2 md:mx-8 lg:mx-16 mt-16">
                    Results:
                </div>
            );
        }
    }
};

export default Timerorspeed;
