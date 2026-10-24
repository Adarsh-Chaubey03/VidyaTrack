import React from 'react';
import { assets, dummyTestimonial } from '../../assets/assets';

function TestimonialSection() {
    return (
        <div className='pb-14 px-8 md:px-20 mt-10'>
            {/* Badge */}
            <div className="inline-flex items-center border border-gray-300 bg-white rounded-full px-3 py-1 mb-4">
                <span className="text-gray-500 text-xs font-semibold tracking-widest uppercase">Testimonials</span>
            </div>

            <h2 className='text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight max-w-[560px] mb-3'>
                Hear from students who transformed their careers
            </h2>

            <p className='text-gray-400 text-sm sm:text-base max-w-md'>
                Real outcomes from real learners, placed at companies you know.
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
                                loading="lazy"
                                width="56"
                                height="56"
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
                                    loading="lazy"
                                    width="16"
                                    height="16"
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
