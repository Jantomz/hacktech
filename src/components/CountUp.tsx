import React, { useEffect, useState } from "react";

interface CountUpProps {
    targetNumber: number;
    format?: boolean; // Optional boolean prop
}

const CountUp: React.FC<CountUpProps> = ({ targetNumber, format = false }) => {
    const [currentNumber, setCurrentNumber] = useState(0);

    const formatNumber = (num: number) => {
        return num.toLocaleString("en-US", {
            style: "currency",
            currency: "USD",
        });
    };

    useEffect(() => {
        let current = 0;
        const totalDuration = 4000; // Total duration in ms
        const steps = 100; // Number of steps
        const stepTime = totalDuration / steps;

        const interval = setInterval(() => {
            const remaining = targetNumber - current;
            const increment = Math.ceil(remaining / (remaining > 10 ? 10 : 20)); // Slow down more as it gets closer
            current += increment;
            if (current >= targetNumber) {
                current = targetNumber;
                clearInterval(interval);
            }
            setCurrentNumber(current);
        }, stepTime);

        return () => clearInterval(interval);
    }, [targetNumber]);

    return <div>{format ? formatNumber(currentNumber) : currentNumber}</div>;
};

export default CountUp;
