import React from 'react'
import { assets, dummyTestimonial } from '../../assets/assets'

const TestimonialsSection = () => {
  return (
    <div className='pb-14 px-8 md:px-0'>
      <h2 className='text-3xl font-medium text-gray-800'>Testimonials</h2>
      <p className='md:text-base text-gray-500 mt-3'>
        Hear from our learners as they share their journeys of transformation, success, and how our
        <br /> platform has made a difference in their lives.
      </p>
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mt-14 max-w-6xl mx-auto'>
        {dummyTestimonial.map((testimonial, index) => (
          <div
            key={index}
            className='text-sm text-left border border-gray-500/30 pb-6 rounded-lg bg-white shadow-[0px_4px_15px_0px] shadow-black/5 flex flex-col justify-between'
          >
            <div>
              <div className='flex items-center gap-4 px-5 py-4 bg-gray-500/10 rounded-t-lg'>
                <img
                  className='h-12 w-12 rounded-full object-cover'
                  src={testimonial.image}
                  alt={testimonial.name}
                />
                <div>
                  <h1 className='text-lg font-medium text-gray-800'>{testimonial.name}</h1>
                  <p className='text-gray-800/80 text-xs'>{testimonial.role}</p>
                </div>
              </div>
              <div className='p-5 pb-4'>
                <div className='flex gap-0.5'>
                  {[...Array(5)].map((_, i) => (
                    <img
                      className='h-5'
                      key={i}
                      src={i < Math.floor(testimonial.rating) ? assets.star : assets.star_blank}
                      alt="star"
                    />
                  ))}
                </div>
                <p className='text-gray-500 mt-4 leading-relaxed'>{testimonial.feedback}</p>
              </div>
            </div>
            <a href="#" className='text-blue-500 underline px-5 text-sm'>
              Read more
            </a>
          </div>
        ))}
      </div>
    </div>
  )
}

export default TestimonialsSection
