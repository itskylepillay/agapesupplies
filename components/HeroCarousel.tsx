"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";

const slides = [
  {
    image: "/safety.jpg",
  },
  {
    image: "/roadsafety.jpg",
  },
  {
    image: "/storage.jpg",
  }, 
{
   image: "/waste.jpg",
  },
  {
    image: "/lockers.jpg",
  },
  {
    image: "/box.jpg",
  },
  
  {
    image: "/bench.jpg",
  },
  
{
    image: "/tools.jpg",
  },
];

export default function HeroCarousel() {
  return (
    <Swiper
      modules={[Autoplay, Pagination]}
      autoplay={{
        delay: 1000,
        disableOnInteraction: false,
      }}
      pagination={{
        clickable: true,
      }}
      loop={true}
      className="hero-swiper"
    >
      {slides.map((slide, index) => (
        <SwiperSlide key={index}>
          <img
            src={slide.image}
            alt={`Slide ${index + 1}`}
            className="hero-carousel-image"
          />
        </SwiperSlide>
      ))}
    </Swiper>
  );
}