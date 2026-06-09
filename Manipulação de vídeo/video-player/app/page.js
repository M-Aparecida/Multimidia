"use client";
import { useState, useRef, useEffect } from "react";
import { 
  Play, Pause, Volume2, VolumeX, FastForward, Rewind, 
  Video, Eye, SkipBack, SkipForward
} from "lucide-react";

export default function VideoLabFinal() {
  const playlist = [
    { 
      title: "Wind of Change", 
      artist: "Scorpions", 
      src: "/video1.mp4" 
    },
    { 
      title: "Lonely day", 
      artist: "System of a Dawn", 
      src: "/video2.mp4"
    },
    { 
      title: "Sweet Child O' Mine", 
      artist: "Guns N' Roses", 
      src: "/video3.mp4"
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1); 
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  
  const [currentFilter, setCurrentFilter] = useState("normal");

  const videoRef = useRef(null);

  const videoFilters = {
    normal: "contrast-100 saturate-100",
    cinza: "grayscale-100 contrast-125 brightness-90",
    vermelho: "grayscale-100 contrast-150 brightness-75",
    verde: "grayscale-100 contrast-150 brightness-75",
    azul: "grayscale-100 contrast-150 brightness-75"
  };

  const overlayColors = {
    normal: "transparent",
    cinza: "transparent",
    vermelho: "bg-red-600 mix-blend-color-burn",
    verde: "bg-emerald-500 mix-blend-color-burn",
    azul: "bg-blue-600 mix-blend-color-burn"
  };

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      setCurrentTime(0);
      videoRef.current.volume = isMuted ? 0 : volume;

      if (isPlaying) {
        videoRef.current.play().catch((err) => console.log("Aguardando interação:", err));
      }
    }
  }, [currentIndex]);

  const togglePlay = () => {
    isPlaying ? videoRef.current.pause() : videoRef.current.play();
    setIsPlaying(!isPlaying);
  };

  const changeVideo = (direction) => {
    let nextIndex = currentIndex + direction;
    if (nextIndex < 0) nextIndex = playlist.length - 1;
    if (nextIndex >= playlist.length) nextIndex = 0;
    setCurrentIndex(nextIndex);
  };

  const skipTime = (amount) => {
    if (videoRef.current) videoRef.current.currentTime += amount;
  };

  const handleVolume = (e) => {
    const v = parseFloat(e.target.value);
    setVolume(v);
    videoRef.current.volume = v;
    setIsMuted(v === 0);
  };

  const handleProgress = (e) => {
    const time = parseFloat(e.target.value);
    if (videoRef.current) videoRef.current.currentTime = time;
    setCurrentTime(time);
  };

  const formatTime = (time) => {
    const min = Math.floor(time / 60);
    const sec = Math.floor(time % 60);
    return `${min}:${sec < 10 ? "0" : ""}${sec}`;
  };

  const progressPercent = duration ? (currentTime / duration) * 100 : 0;

  return (
    <div className="h-screen w-full bg-[#09070b] flex items-center justify-center p-3 overflow-hidden font-sans text-white">
      <div className="bg-gradient-to-b from-purple-950/40 to-[#121212] border border-purple-500/10 w-full max-w-[420px] max-h-[96vh] rounded-[2rem] p-4 shadow-2xl flex flex-col justify-between overflow-hidden">
        
        <div className="flex flex-col items-center w-full">
          <div className="w-full aspect-video bg-black rounded-xl shadow-xl mb-4 relative overflow-hidden border border-purple-500/10 shrink-0 flex items-center justify-center">
            
            <video 
              ref={videoRef}
              src={playlist[currentIndex].src}
              onTimeUpdate={() => setCurrentTime(videoRef.current.currentTime)}
              onLoadedMetadata={() => setDuration(videoRef.current.duration)}
              onEnded={() => changeVideo(1)}
              className={`w-full h-full object-cover transition-all duration-200 ${videoFilters[currentFilter]}`}
            />

            <div className={`absolute inset-0 pointer-events-none transition-all duration-200 ${overlayColors[currentFilter]}`} />
          </div>
          
          <div className="w-full px-1 text-left">
            <h1 className="text-lg font-bold truncate tracking-tight">{playlist[currentIndex].title}</h1>
            <p className="text-purple-400 text-xs font-medium truncate mb-3">{playlist[currentIndex].artist}</p>
          </div>
        </div>

        <div className="bg-white/5 border border-white/5 rounded-xl p-2.5 mb-4">
          <p className="text-[10px] uppercase tracking-widest text-slate-400 mb-2 font-bold flex items-center gap-1.5">
            <Eye size={12} /> Filtros de Cor 
          </p>
          <div className="grid grid-cols-5 gap-1 text-[11px] font-medium">
            <button 
              onClick={() => setCurrentFilter("normal")}
              className={`py-1 rounded transition ${currentFilter === "normal" ? "bg-purple-600 text-white font-bold" : "bg-white/5 hover:bg-white/10 text-slate-300"}`}
            >
              Normal
            </button>
            <button 
              onClick={() => setCurrentFilter("cinza")}
              className={`py-1 rounded transition ${currentFilter === "cinza" ? "bg-slate-600 text-white font-bold" : "bg-white/5 hover:bg-white/10 text-slate-300"}`}
            >
              Cinza
            </button>
            <button 
              onClick={() => setCurrentFilter("vermelho")}
              className={`py-1 rounded transition ${currentFilter === "vermelho" ? "bg-red-600 text-white font-bold" : "bg-white/5 hover:bg-white/10 text-slate-300"}`}
            >
              Vermelho
            </button>
            <button 
              onClick={() => setCurrentFilter("verde")}
              className={`py-1 rounded transition ${currentFilter === "verde" ? "bg-emerald-600 text-white font-bold" : "bg-white/5 hover:bg-white/10 text-slate-300"}`}
            >
              Verde
            </button>
            <button 
              onClick={() => setCurrentFilter("azul")}
              className={`py-1 rounded transition ${currentFilter === "azul" ? "bg-blue-600 text-white font-bold" : "bg-white/5 hover:bg-white/10 text-slate-300"}`}
            >
              Azul
            </button>
          </div>
        </div>

        <div className="space-y-1 mb-4 px-1">
          <input 
            type="range" min="0" max={duration || 0} step="0.1"
            value={currentTime} onChange={handleProgress}
            className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-purple-500 transition-all"
            style={{
              background: `linear-gradient(to right, #a855f7 0%, #a855f7 ${progressPercent}%, rgba(255,255,255,0.1) ${progressPercent}%, rgba(255,255,255,0.1) 100%)`
            }}
          />
          <div className="flex justify-between text-[10px] text-slate-400 font-mono">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        <div className="flex flex-col gap-3 items-center">
          <div className="flex items-center justify-between w-full px-2">
            <SkipBack size={22} onClick={() => changeVideo(-1)} className="cursor-pointer text-slate-400 hover:text-white transition" />
            <Rewind size={22} onClick={() => skipTime(-10)} className="cursor-pointer text-slate-400 hover:text-white transition" />
            
            <button onClick={togglePlay} className="w-12 h-12 bg-white text-black rounded-full flex items-center justify-center hover:scale-105 active:scale-95 transition shadow-md">
              {isPlaying ? <Pause size={22} fill="black" /> : <Play size={22} fill="black" className="ml-0.5" />}
            </button>

            <FastForward size={22} onClick={() => skipTime(10)} className="cursor-pointer text-slate-400 hover:text-white transition" />
            <SkipForward size={22} onClick={() => changeVideo(1)} className="cursor-pointer text-slate-400 hover:text-white transition" />
          </div>

          <div className="w-full flex items-center gap-2.5 bg-white/5 p-1.5 px-3 rounded-full">
            <button onClick={() => { if(videoRef.current) videoRef.current.muted = !isMuted; setIsMuted(!isMuted); }}>
              {isMuted || volume === 0 ? <VolumeX size={14} className="text-purple-400" /> : <Volume2 size={14} className="text-purple-400" />}
            </button>
            <input 
              type="range" min="0" max="1" step="0.01" 
              value={isMuted ? 0 : volume} onChange={handleVolume}
              className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-purple-500"
              style={{
                background: `linear-gradient(to right, #a855f7 0%, #a855f7 ${volume * 100}%, rgba(255,255,255,0.2) ${volume * 100}%, rgba(255,255,255,0.2) 100%)`
              }}
            />
          </div>
        </div>

        <div className="mt-4 border-t border-white/5 pt-2.5 text-center">
          <p className="text-[10px] text-slate-500 font-semibold flex items-center justify-center gap-1.5 uppercase tracking-wider">
            <Video size={12} /> Manipulação de Vídeo
          </p>
        </div>

      </div>
    </div>
  );
}