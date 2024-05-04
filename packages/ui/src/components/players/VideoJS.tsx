import React, { useEffect } from "react";

import "video.js/dist/video-js.css";
import "videojs-wavesurfer/dist/css/videojs.wavesurfer.css";

import videojs from "video.js";
import "videojs-wavesurfer";

interface VideoJSProps {
  options: any;
  onReady?: (player: any) => void;
}

export const VideoJS = (props: VideoJSProps) => {
  const videoRef = React.useRef<HTMLDivElement>(null);
  const playerRef = React.useRef<any>(null);
  const { options, onReady } = props;

  React.useEffect(() => {
    // Make sure Video.js player is only initialized once
    if (!playerRef.current) {
      // The Video.js player needs to be _inside_ the component el for React 18 Strict Mode.
      const videoElement = document.createElement("video-js");

      videoElement.classList.add("vjs-big-play-centered");

      if (!videoRef.current) return;

      videoRef.current.appendChild(videoElement);

      const player = (playerRef.current = videojs(videoElement, options, () => {
        videojs.log("player is ready");
        onReady && onReady(player);
      }));

      // You could update an existing player in the `else` block here
      // on prop change, for example:
    } else {
      const player = playerRef.current;

      player.autoplay(options.autoplay);
      player.src(options.sources);
    }
  }, [options]);

  useEffect(() => {
    const player = playerRef.current;

    return () => {
      if (player && !player.isDisposed()) {
        player.dispose();
        playerRef.current = null;
      }
    };
  }, [playerRef]);

  return (
    <div data-vjs-player className="h-full w-full">
      <div ref={videoRef} />
    </div>
  );
};

export default VideoJS;
