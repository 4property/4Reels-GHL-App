import React from "react";
import { FaYoutube, FaInstagram, FaFacebook, FaLinkedin } from "react-icons/fa";

export default function SocialEditPage() {
  const socialMediaPlatforms = [
    { name: "YouTube", icon: FaYoutube },
    { name: "Instagram", icon: FaInstagram },
    { name: "Facebook", icon: FaFacebook },
    { name: "LinkedIn", icon: FaLinkedin },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Social Edit Page</h1>
      <div className=" border border-gray-300 rounded-lg p-4">
        <div className="grid grid-cols-[1fr_2fr_2fr] p-2 *:mx-2  *:text-lg">
          <h4>Social media</h4>
          <h4>Change title</h4>
          <h4>Change description</h4>
        </div>
        {socialMediaPlatforms.map((platform) => (
          <div
            key={platform.name}
            className="grid grid-cols-[1fr_2fr_2fr] p-2 *:mx-2 rounded-lg"
          >
            <div className="flex gap-2 items-center">
              <platform.icon className="text-2xl" />
              <span className="text-lg">{platform.name}</span>
            </div>
            <input
              type="text"
              placeholder={`Enter ${platform.name} title`}
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-950"
            />
            <input
              type="text"
              placeholder={`Enter ${platform.name} description`}
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-950"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
