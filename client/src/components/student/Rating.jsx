import React, { useState } from 'react'

function Rating({ initialRating = 0, onRatingChange, readonly = false }) {
    const [rating, setRating] = useState(initialRating);
    const [hover, setHover] = useState(0);

    const handleClick = (starValue) => {
        if (!readonly) {
            setRating(starValue);
            if (onRatingChange) {
                onRatingChange(starValue);
            }
        }
    };

    const handleMouseEnter = (starValue) => {
        if (!readonly) {
            setHover(starValue);
        }
    };

    const handleMouseLeave = () => {
        if (!readonly) {
            setHover(0);
        }
    };

    return (
        <div className="flex items-center gap-1">
            {Array.from({ length: 5 }, (_, index) => {
                const starValue = index + 1;
                const isFilled = readonly ? starValue <= rating : starValue <= (hover || rating);
                
                return (
                    <span 
                        key={index} 
                        className={`text-xl sm:text-2xl cursor-pointer transition-colors ${
                            isFilled ? 'text-yellow-400' : 'text-gray-300'
                        } ${readonly ? 'cursor-default' : 'hover:text-yellow-400'}`}
                        onClick={() => handleClick(starValue)}
                        onMouseEnter={() => handleMouseEnter(starValue)}
                        onMouseLeave={handleMouseLeave}
                    >
                        &#9733; {/* Unicode for star symbol */}
                    </span>   
                );
            })}
        </div>
    );
}

export default Rating;
