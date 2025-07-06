import React, { useContext } from 'react'
import { assets } from '../../assets/assets'
import { NavLink } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';

function Sidebar(){
    const {isEducator} = useContext(AppContext)

    const menuItems = [
        {name:'Dashboard', path:'/educator', icon: assets.home_icon},
        {name: 'Add Courses', path:'/educator/add-courses', icon: assets.add_icon},
        {name: 'My Courses', path: '/educator/my-courses', icon:assets.my_course_icon},
        {name:'Student Enrolled', path:'/educator/student-enrolled', icon: assets.person_tick_icon}
    ];
    return isEducator && (
       <div className='md:w-64 w-16 border-r min-h-screen text-base border-gray-500 py-2 flex flex-col'>
       {menuItems.map((item)=> (
    <NavLink 
    to={item.path}
    key={item.name}
    end={item.path==='/educator'}
    className={({isActive})=> `flex items-center md:flex-row flex-col md:justify-start justify-center py-3.5 md:px-10 gap-3 ${isActive ? 'bg-emerald-100 text-emerald-700 font-bold' : 'text-gray-700'}`}
    >
        <img src={item.icon} alt="" className='w-6 h-6' />
        <p className='md:block hidden text-center'>{item.name}</p>
    </NavLink>
   ))}
       </div> 
    )
}

export default Sidebar
