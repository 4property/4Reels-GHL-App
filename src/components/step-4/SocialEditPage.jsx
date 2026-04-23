import React from "react";
import {
  FaYoutube,
  FaFacebook,
  FaLinkedin,
  FaTiktok,
  FaGoogle,
  FaPinterest,
} from "react-icons/fa";
import { FaSquareThreads, FaSquareBluesky } from "react-icons/fa6";
import { AiFillInstagram } from "react-icons/ai";

export default function SocialEditPage() {
  const [activePlatformIndex, setActivePlatformIndex] = React.useState(0);
  const [socialMediaPlatforms, setSocialMediaPlatforms] = React.useState([
    {
      name: "YouTube",
      icon: FaYoutube,
      title: "My YouTube title",
      description: "My YouTube description",
    },
    {
      name: "Instagram",
      icon: AiFillInstagram,
      title: "My Instagram title",
      description: "My Instagram description",
    },
    {
      name: "Facebook",
      icon: FaFacebook,
      title: "My Facebook title",
      description: "My Facebook description",
    },
    {
      name: "LinkedIn",
      icon: FaLinkedin,
      title: "My LinkedIn title",
      description: "My LinkedIn description",
    },
    {
      name: "TikTok",
      icon: FaTiktok,
      title: "My TikTok title",
      description: "My TikTok description",
    },
    {
      name: "Google My Business",
      icon: FaGoogle,
      title: "My Google My Business title",
      description: "My Google My Business description",
    },
    {
      name: "Threads",
      icon: FaSquareThreads,
      title: "My Threads title",
      description: "My Threads description",
    },
    {
      name: "Pinterest",
      icon: FaPinterest,
      title: "My Pinterest title",
      description: "My Pinterest description",
    },
    {
      name: "Bluesky",
      icon: FaSquareBluesky,
      title: "My Bluesky title",
      description: "My Bluesky description",
    },
  ]);

  const handleChange = (field, value) => {
    setSocialMediaPlatforms((platforms) =>
      platforms.map((platform, index) =>
        index === activePlatformIndex
          ? {
              ...platform,
              [field]: value,
            }
          : platform,
      ),
    );
  };

  const activePlatform = socialMediaPlatforms[activePlatformIndex];
  const ActiveIcon = activePlatform.icon;

  return (
    // Still to do: add functionality, that shows, which social media account has yet to be connected through a highlight or something

    <div className="h-full">
      <div className="mb-6">
        <h1 className="mt-2 text-3xl font-bold text-blue-950">
          Edit your social captions
        </h1>
      </div>

      <div className="rounded-3xl border border-gray-200 bg-white p-4 shadow-sm">
        <div
          className="flex gap-2 overflow-x-auto border-b border-gray-200 pb-4"
          role="tablist"
          aria-label="Social media platforms"
        >
          {socialMediaPlatforms.map((platform, index) => {
            const Icon = platform.icon;
            const isActive = index === activePlatformIndex;

            return (
              <button
                key={platform.name}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setActivePlatformIndex(index)}
                className={`flex shrink-0 items-center gap-2 rounded-2xl border px-4 py-3 text-left text-sm font-semibold transition ${
                  isActive
                    ? "border-blue-950 bg-blue-950 text-white shadow-md"
                    : "border-gray-200 bg-gray-50 text-gray-700 hover:border-blue-950/30 hover:bg-white"
                }`}
              >
                <Icon className="text-xl" />
                <span>{platform.name}</span>
              </button>
            );
          })}
        </div>

        <div className="mt-6 rounded-3xl">
          <div className="mb-6 flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-3xl text-blue-950 shadow-sm">
              <ActiveIcon />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">
                Editing content for
              </p>
              <h2 className="text-2xl font-bold text-blue-950">
                {activePlatform.name}
              </h2>
            </div>
          </div>

          <div className="grid gap-5">
            <label className="grid gap-2">
              <span className="text-lg font-semibold text-gray-900">Title</span>
              <input
                type="text"
                value={activePlatform.title}
                onChange={(e) => handleChange("title", e.target.value)}
                className="min-h-14 rounded-2xl border border-gray-300 bg-white px-5 py-4 text-lg text-gray-950 shadow-sm outline-none transition placeholder:text-gray-400 focus:border-blue-950 focus:ring-4 focus:ring-blue-950/10"
              />
            </label>

            <label className="grid gap-2">
              <span className="text-lg font-semibold text-gray-900">
                Description
              </span>
              <textarea
                value={activePlatform.description}
                onChange={(e) => handleChange("description", e.target.value)}
                rows={7}
                className="min-h-48 resize-y rounded-2xl border border-gray-300 bg-white px-5 py-4 text-lg leading-8 text-gray-950 shadow-sm outline-none transition placeholder:text-gray-400 focus:border-blue-950 focus:ring-4 focus:ring-blue-950/10"
              />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
