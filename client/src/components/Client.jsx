import React, { useState } from 'react';
import { FaStar } from "react-icons/fa";
import { FaStarHalfStroke } from "react-icons/fa6";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import assets from '../assets/assets';

const client = [
    {
        image: assets.client1,
        name: "Disha",
        description: "We’re here to serve only the best products for you. Enriching your homes with the best essentials.",
        reviews: (
            <div className='flex'>
                <FaStar color="gold" />
                <FaStar color="gold" />
                <FaStar color="gold" />
                <FaStar color="gold" />
                <FaStarHalfStroke color="gold" />
            </div>
        )
    },
    {
        image: assets.client2,
        name: "Smit",
        description: "We’re here to serve only the best products for you. Enriching your homes with the best essentials.",
        reviews: (
            <div className='flex'>
                <FaStar color="gold" />
                <FaStar color="gold" />
                <FaStar color="gold" />
                <FaStar color="gold" />
                <FaStarHalfStroke color="gold" />
            </div>
        )
    },
];


function ClientSlide({ image, name, description, reviews }) {
    return (
        <div className="relative min-h-[300px] flex items-center justify-center bg-gray-100 rounded p-6">

            <div>
                <img src={assets.topquotes} className="absolute top-3 items-start w-10" alt="" />
            </div>

            <div className="flex flex-col items-center text-center">
                <img src={image} className="rounded-full w-20 mb-3" alt={name} />
                <p className="text-sm text-gray-500 w-xl mb-3">{description}</p>
                <h1 className="text-lg text-gray-700 mb-3">{name}</h1>
                <div className="text-lg">{reviews}</div>
            </div>

            <div>
                <img src={assets.bottomquotes} className="absolute bottom-3  w-10" alt="" />
            </div>

        </div>

    );
}

function Client() {
    const [activeIndex, setActiveIndex] = useState(0);

    return (
        <div className='px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw] pb-20'>
            <Swiper
                modules={[Pagination, Autoplay]}
                pagination={{ clickable: true }}
                autoplay={{ delay: 7000, disableOnInteraction: false }}
                speed={1000}
                loop
                onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
                className="w-full"
            >
                {client.map((item, index) => (
                    <SwiperSlide key={index}>
                        <ClientSlide
                            image={item.image}
                            description={item.description}
                            name={item.name}
                            reviews={item.reviews}
                        />
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
}

export default Client;
