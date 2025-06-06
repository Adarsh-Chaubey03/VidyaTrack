import React, { createContext, useEffect, useState } from "react";
import { dummyCourses } from "../assets/assets";
import { useNavigate, useParams } from "react-router-dom";

export const AppContext = createContext();

export const AppContextProvider = (props) => {
    const [user, setUser] = useState(null);
    const [allCourses, setAllCourses] = useState([]);
    const [isEducator, setIsEducator] = useState(true);
    const[filteredCourse,setFilteredCourse] = useState([])

    const currency = import.meta.env.VITE_CURRENCY;
    const navigate = useNavigate();
    const { input } = useParams();

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

useEffect(() => {
    if (allCourses && allCourses.length > 0) {
        const tempCourses = [...allCourses];
        if (input) {
            const filtered = tempCourses.filter((item) =>
                item.courseTitle.toLowerCase().includes(input.toLowerCase())
            );
            setFilteredCourse(filtered);
        } else {
            setFilteredCourse(tempCourses);
        }
    }
}, [allCourses, input]);

    const value = {
        user,
        setUser,
        currency,
        allCourses,
        calculateRate,
        navigate,
        input,
        isEducator,
        setIsEducator
    };

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    );
};
