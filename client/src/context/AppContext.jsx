import React, { createContext, useEffect, useState } from "react";
import { dummyCourses } from "../assets/assets";
import { useNavigate} from "react-router-dom";

export const AppContext = createContext();

export const AppContextProvider = (props) => {
    const [user, setUser] = useState(null);
    const [allCourses, setAllCourses] = useState([]);
    const [isEducator, setIsEducator] = useState(true);

    const currency = import.meta.env.VITE_CURRENCY;
    const navigate = useNavigate();

    const loadDummyCourses = () => {
        setAllCourses(dummyCourses);
    };

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
        calculateRate,
        navigate,
        isEducator,
        setIsEducator,
    };

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    );
};
