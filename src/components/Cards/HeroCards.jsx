import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import Card from "@mui/material/Card";
import eJobs from "../../assets/images//Ejobs.jpg";
import eDriveIcon from "../../assets/images/Edrive.jpg";
import eNews from "../../assets/images/Enews.jpg";
import eSchools from "../../assets/images/Eschools.jpg";
import edirect from "../../assets/images/Edirect.png";
import eroot from "../../assets/images/Eroot.png";
import ebnb from "../../assets/images/ebnb.jpg";
import companion from "../../assets/images/ecompanion.png";
import autograph from "../../assets/images/autograph2.png";
import etech from "../../assets/images/etech.png";
import estores from "../../assets/images/estores.png";
import eproperties from "../../assets/images/eproperties.png";
import pride from "../../assets/images/pride.png";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import AOS from "aos";
import "aos/dist/aos.css";

const HeroCard = ({ title, description, iconSrc, url }) => (
  <>
    <Link target="blank" to={url} className="no-underline">
      <Card
        className="h-full flex flex-col transition-all duration-300 hover:scale-105 hover:shadow-lg group"
        data-aos="fade-up"
        data-aos-duration="1000"
      >
        <CardMedia
          component="img"
          height="200"
          image={iconSrc}
          alt={title}
          className="object-cover h-60 transition-transform duration-300 group-hover:scale-105"
        />
        <CardContent className="bg-pink-100 flex-grow flex flex-col justify-between transition-colors duration-300 group-hover:bg-pink-200">
          <Typography
            gutterBottom
            variant="h6"
            component="div"
            className="text-center font-bold text-lg text-gray-700 group-hover:text-red-500 transition-colors duration-300"
          >
            {title}
          </Typography>
          <Typography
            variant="body2"
            className="text-center mt-2 text-lg text-gray-600 group-hover:text-gray-800 transition-colors duration-300"
          >
            {description}
          </Typography>
        </CardContent>
      </Card>
    </Link>
  </>
);

const ServiceCards = () => {
  useEffect(() => {
    AOS.init();
  }, []);

  const services = [
    {
      title: "E-BNB",
      description: "Lorem ipsum dolor sit amet consectetur.",
      iconSrc: ebnb,
      category: "People",
      url: "http://ebnbhotel.com",
    },
    {
      title: "E-Jobs",
      description: "Lorem ipsum dolor sit amet consectetur.",
      iconSrc: eJobs,
      url: "http://ejobs.com.ng",
      category: "Technology",
    },
    {
      title: "E-Drive",
      description: "Lorem ipsum dolor sit amet consectetur.",
      iconSrc: eDriveIcon,
      url: "http://edrive.ng",
      category: "Technology",
    },
    {
      title: "E-News",
      description: "Lorem ipsum dolor sit amet consectetur.",
      iconSrc: eNews,
      url: "http://essentialnews.ng",
    },
    {
      title: "E-Direct",
      description: "Lorem ipsum dolor sit amet consectetur.",
      iconSrc: edirect,
      url: "http://edirect.ng",
      category: "Technology",
    },
    {
      title: "E-schools",
      description: "Lorem ipsum dolor sit amet consectetur.",
      iconSrc: eSchools,
      url: "http://eschoolconnect.ng",
      category: "Technology",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-12">
        {services.map((service, index) => (
          <HeroCard key={index} {...service} />
        ))}
      </div>
      <div className="flex justify-end mt-5">
        <Link to={"/AllServiceCards"}>
          <span className="text-red-600 underline font-semibold text-lg hover:text-NavClr  transition-transform duration-300 group-hover:scale-105  cursor-pointer">
            See All
          </span>
        </Link>
      </div>
    </div>
  );
};

export default ServiceCards;
