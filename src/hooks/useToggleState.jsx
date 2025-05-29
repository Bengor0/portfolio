import { useState, useCallback } from "react";

export default function useToggleState(initialState = false) {
    const [state, setState] = useState(initialState);

    const toggle = useCallback(() => {
        setState(prevState => !prevState);
    }, []);

    return [state, toggle];
}