import Image from "next/image";
import Link from "next/link";

interface datatype {
  imgSrc: string;
  heading: string;
  paragraph: string;
}

const Aboutdata: datatype[] = [
  {
    imgSrc: "/assets/features/time.svg",
    heading: "Aerial Monitoring",
    paragraph:
      "VanRakshak uses satellite imagery and drones for aerial monitoring, employing a sophisticated model architecture that combines UNet++, LinkedNet, and MobileNetV2. This enables the detection of changes in forest density and identification of deforestation areas.",
  },
  {
    imgSrc: "/assets/features/signal.svg",
    heading: "Deforestation Alert System",
    paragraph:
      "VanRakshak features a Deforestation Alert System that notifies authorities in real-time upon detecting a significant decrease in forest cover. This ensures prompt responses to potential threats, preventing further damage.",
  },
  {
    imgSrc: "/assets/features/dollar.svg",
    heading: "Audio Analysis",
    paragraph:
      "VanRakshak processes forest audio using advanced algorithms to distinguish between natural and human-made sounds. If suspicious sounds, such as chainsaw operation, are detected, alerts are generated for authorities, enabling timely intervention.",
  },
  {
    imgSrc: "/assets/features/dollar.svg",
    heading: "Criminal Apprehension",
    paragraph:
      "VanRakshak aids in criminal apprehension by identifying audio signatures linked to illegal activities like logging or poaching. This enhances law enforcement efforts to combat environmental crimes effectively.",
  },
  {
    imgSrc: "/assets/features/signal.svg",
    heading: "Forest Fire Prediction",
    paragraph:
      "VanRakshak's Forest Fire Prediction system, utilizing the CatBoost algorithm, identifies high-risk wildfire areas. Analyzing factors like weather conditions, vegetation density, and historical fire data, the model predicts and highlights regions susceptible to forest fires before they occur.",
  },
  {
    imgSrc: "/assets/features/time.svg",
    heading: "Forest Protection",
    paragraph:
      "VanRakshak integrates technologies for a holistic forest protection approach. It addresses deforestation and combats illegal activities, contributing to the overall well-being of forests. By predicting and preventing forest fires, the model supports the longevity of ecosystems crucial for sustaining life on Earth.",
  },
];

const Features = () => {
  return (
    <div className="bg-babyblue" id="features">
      <div className="mx-auto max-w-2xl py-20 px-4 sm:px-6 lg:max-w-7xl lg:px-8">
        <h3 className="text-4xl sm:text-5xl font-semibold text-black text-center my-10">
          Amazing Features.
        </h3>
        <h5 className="text-black opacity-60 text-lg font-normal text-center">
          Sed ut perspiciatis unde omnis iste natus error sit voluptatem
          accusantium doloremque <br /> laudantium, totam rem aperiam, eaque
          ipsa quae ab.
        </h5>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-16 gap-y-4 lg:gap-x-8 mt-10">
          {Aboutdata.map((item, i) => (
            <div key={i} className="bg-white rounded-2xl p-5 featureShadow">
              <Image
                src={item.imgSrc}
                alt={item.imgSrc}
                width={55}
                height={55}
                className="mb-2"
              />
              <h3 className="text-2xl font-semibold text-black mt-5">
                {item.heading}
              </h3>
              <h4 className="text-lg font-normal text-black opacity-50 my-2">
                {item.paragraph}
              </h4>
              <Link
                href={"/"}
                className="text-electricblue text-xl font-medium flex gap-2 pt-10 pb-2"
              >
                Learn more{" "}
                <Image
                  src="/assets/people/arrow-right.svg"
                  alt="arrow-right"
                  width={24}
                  height={24}
                />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Features;
