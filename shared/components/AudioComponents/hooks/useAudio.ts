import { useCallback, useEffect, useState } from "react";

export const useAudio = () => {
  const [audio] = useState(new Audio());
  const [playing, setPlaying] = useState(false);
  const [src, setSrc] = useState('');

  const toggle = useCallback(() => {
    setPlaying(oldPlaying => !oldPlaying)
  }, []);

  useEffect(() => {
    audio.src = src;
  }, [src])

  useEffect(() => {
    playing ? audio.play() 
            : audio.pause();
  }, [playing]);

  useEffect(() => {
    audio.addEventListener('ended', () => setPlaying(false));
    return () => {
      audio.removeEventListener('ended', () => setPlaying(false));
    };
  }, []);

  return [playing, toggle, setSrc];
}