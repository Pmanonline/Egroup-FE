import React, { useState, useEffect, useRef } from "react";
import winnerImage1 from "../../assets/images/winnerImage1.png";
import winnerImage2 from "../../assets/images/winnerImage2.png";
import winnerImage3 from "../../assets/images/winnerImage3.png";
import winnerImage4 from "../../assets/images/winnerImage4.png";
import winnerImage5 from "../../assets/images/winnerImage5.png";
import winnerImage6 from "../../assets/images/winnerImage5.png";

const CarouselCard = ({ image, name, description, tag }) => (
  <div className="flex-shrink-0 w-64 h-24 bg-white rounded-lg shadow-md mr-4 flex overflow-hidden">
    <img src={image} alt={name} className="w-24 h-24 object-cover" />
    <div className="flex flex-col justify-between p-2 flex-grow">
      <div>
        <h3 className="font-bold text-sm">{name}</h3>
        <p className="text-xs text-gray-600 line-clamp-2">{description}</p>
      </div>
    </div>
  </div>
);

const AutoScrollCarousel = ({ items }) => {
  const [isHovered, setIsHovered] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    let scrollInterval;

    const startScrolling = () => {
      scrollInterval = setInterval(() => {
        if (!isHovered && scrollContainer) {
          scrollContainer.scrollLeft += 1;
          if (
            scrollContainer.scrollLeft >=
            scrollContainer.scrollWidth - scrollContainer.clientWidth
          ) {
            scrollContainer.scrollLeft = 0;
          }
        }
      }, 20);
    };

    startScrolling();

    return () => {
      if (scrollInterval) clearInterval(scrollInterval);
    };
  }, [isHovered]);

  return (
    <div
      className="w-full hide-horizontal-scrollbar"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        ref={scrollRef}
        className="flex overflow-x-scroll scrollbar-hide"
        style={{ scrollBehavior: "smooth" }}
      >
        {items.map((item, index) => (
          <CarouselCard key={index} {...item} />
        ))}
      </div>
    </div>
  );
};

const WinnersCard = () => {
  const carouselItems = [
    {
      image: winnerImage1,
      name: "Donnie Joshua",
      description:
        "Lorem ipsum dolor sit amet, consectetur. Et rhoncus nunc dictum massa.",
    },
    {
      image: winnerImage2,
      name: "Paul Adefarsalh",
      description:
        "Lorem ipsum dolor sit amet, consectetur. Et rhoncus nunc dictum massa.",
    },
    {
      image: winnerImage3,
      name: "Lydia Thomas",
      description:
        "Lorem ipsum dolor sit amet, consectetur. Et rhoncus nunc dictum massa.",
    },
    {
      image: winnerImage4,
      name: "John Petrus",
      description:
        "Lorem ipsum dolor sit amet, consectetur. Et rhoncus nunc dictum massa.",
    },
    {
      image: winnerImage5,
      name: "Matt Damon",
      description:
        "Lorem ipsum dolor sit amet, consectetur. Et rhoncus nunc dictum massa.",
    },
    {
      image: winnerImage6,
      name: "Danny James",
      description:
        "Lorem ipsum dolor sit amet, consectetur. Et rhoncus nunc dictum massa.",
    },
  ];

  return (
    <div className="p-4">
      <AutoScrollCarousel items={carouselItems} />
    </div>
  );
};

export default WinnersCard;
