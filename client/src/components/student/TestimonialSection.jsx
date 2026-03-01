import React from 'react';
import { assets, dummyTestimonial } from '../../assets/assets';

function TestimonialSection() {
    return (
        <div className='pb-14 px-8 md:px-20 mt-10'>
            <h2 className='text-3xl font-semibold text-gray-800 dark:text-white'>Testimonials</h2>
        
                <p className='md:text-base text-sm text-gray-600 dark:text-gray-400 mt-3 max-w-2xl mx-auto text-center'>
                    Hear from our students who have benefited from our expert courses and transformed their careers.
                </p>
           


            <div className="grid gap-8 mt-10 sm:grid-cols-2 lg:grid-cols-3">
                {dummyTestimonial.map((testimonial, index) => (
                    <div
                        key={index}
                        className="bg-emerald-50/60 border border-emerald-100 rounded-2xl shadow-sm p-6 transition-all duration-300 hover:shadow-md hover:-translate-y-1"
                    >
                        <div className="flex items-center gap-4">
                            <img
                                src={testimonial.image}
                                alt={testimonial.name}
                                className="w-14 h-14 rounded-full object-cover ring-2 ring-emerald-400 ring-offset-2"
                            />
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800">
                                    {testimonial.name}
                                </h3>
                                <p className="text-sm text-gray-500">
                                    {testimonial.role}
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-0.5 mt-4">
                            {[...Array(5)].map((_, i) => (
                                <img
                                    key={i}
                                    src={
                                        i < Math.floor(testimonial.rating)
                                            ? assets.star
                                            : assets.star_blank
                                    }
                                    alt="star"
                                    className="w-4 h-4"
                                />
                            ))}
                        </div>

                        <p className="text-sm text-gray-600 mt-5 leading-relaxed">
                            {testimonial.feedback}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default TestimonialSection;
