import React, { createContext, useEffect, useState } from "react";
import { dummyCourses } from "../assets/assets";


export const AppContext = createContext();

export const AppContextProvider = (props) => {
    const [user, setUser] = useState(null);

    const currency = import.meta.env.VITE_CURRENCY;

    const [allCourses,setAllCourses] = useState([])
    //fetch all courses
    const fetchAllCourses = async () =>{
        setAllCourses(dummyCourses)
    }

    useEffect(()=>{
        fetchAllCourses()
    },[])
    const value = {
        user,
        setUser,
        currency,
        allCourses
    };

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    );
};
