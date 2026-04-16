import React from "react";

export default function ReelCustomisation() {
  const mediaData = [
    // Just placeholder video data, even if most of these things should be images. only used for the measurements and site-layout
    {src: "src/assets/video.mp4", title: "Video 1", id: 1, type: "video"},
    {src: "src/assets/video.mp4", title: "Video 2", id: 2, type: "video"},
    {src: "src/assets/video.mp4", title: "Video 3", id: 3, type: "video"},
    {src: "src/assets/video.mp4", title: "Video 4", id: 4, type: "video"},
    {src: "src/assets/video.mp4", title: "Video 5", id: 5, type: "video"},
    {src: "src/assets/video.mp4", title: "Video 6", id: 6, type: "video"},
    {src: "src/assets/video.mp4", title: "Video 7", id: 7, type: "video"},
    
  ]
  const audioData = [
    {src: "src/assets/video.mp4", title: "Video 1", id: 1, type: "video"},
    {src: "src/assets/video.mp4", title: "Video 2", id: 2, type: "video"},
    {src: "src/assets/video.mp4", title: "Video 3", id: 3, type: "video"},
    {src: "src/assets/video.mp4", title: "Video 4", id: 4, type: "video"},
    {src: "src/assets/video.mp4", title: "Video 5", id: 5, type: "video"},
    {src: "src/assets/video.mp4", title: "Video 6", id: 6, type: "video"},
    {src: "src/assets/video.mp4", title: "Video 7", id: 7, type: "video"},
  ]
  
  return (
    <div className="flex">
      <div className="flex-1">
        <h1>Reel Customisation</h1>
        {/* The div for changing the order of the images */} 
        <div className="w-full p-2 m-4 flex border border-slate-200 rounded-xl">
          <div className="flex items-center">
            {mediaData.map((media, index) => (
              <div
                key={media.id}
                className={`rounded-xl overflow-hidden hover:z-100 ${index !== 0 ? "-ml-40" : ""}`}
                // style={{ zIndex: index }}
              >
                <video src={media.src} className=" object-cover" />
              </div>
            ))}
          </div>
        </div>
          {/* The div for the media player */}
          <div className="w-full p-2 m-4 flex flex-col items-center border border-slate-200 rounded-xl">
            <h2 className="w-full">Select Music for the Video</h2>
            <div className="w-full max-h-60 overflow-y-auto border:hidden">
              <ul className="w-full h-auto flex gap-2 flex-col justify-center px-2 py-2">
                {audioData.map((media) => (
                  <li className="w-full">
                    <audio controls className="w-full">
                      <source src={media.src} title={media.title} type="audio/mpeg" />
                      Your browser does not support the audio element.
                    </audio>
                  </li>
                ))}
              </ul>
            </div>
        </div>
      </div>
      <div className="flex-1">
        <h2>Preview</h2>
        <div className="w-full p-2 m-4 flex border border-slate-200 rounded-xl">
          
        </div>
        <div className="w-full p-2 m-4 flex border border-slate-200 rounded-xl">

        </div>
      </div>
      <div>
        <h2>Preview2</h2>
        <div className="w-full h-full p-2 m-4 flex border border-slate-200 rounded-xl">
          <p>Preview area 2</p>
        </div>
      </div>
    </div>

  );
}
