import { useState, useCallback } from "react";

export default function useDelayedToggle (initialState = false, initialTime = 3000) {
    const [state, setState] = useState(initialState);
    const [time, setTime] = useState(initialTime);

    const delayedToggle = useCallback(() => {
        setTimeout(() => {
            
        }, timeout);
    }, []);
}