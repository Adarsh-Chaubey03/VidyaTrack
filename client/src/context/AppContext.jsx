import React, { createContext, useEffect, useState } from "react";
import { dummyCourses } from "../assets/assets";

export const AppContext = createContext();

export const AppContextProvider = (props) => {
    const [user, setUser] = useState(null);
    const [allCourses, setAllCourses] = useState([]);
    const[isEducator,setIsEducator] = useState(true)
    const currency = import.meta.env.VITE_CURRENCY;
    

    // Initialize course data from dummy list
    const loadDummyCourses = () => {
        setAllCourses(dummyCourses);
    };

    // Calculate average course rating
    const calculateRate = (course) => {
        if (!course?.courseRating?.length) return 0;
        const total = course.courseRating.reduce((acc, curr) => acc + curr.rating, 0);
        return total / course.courseRating.length;
    };

    useEffect(() => {
        loadDummyCourses();
    }, []);

    const value = {
        user,
        setUser,
        currency,
        allCourses,
        calculateRate
    };

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    );
};
