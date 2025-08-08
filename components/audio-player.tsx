'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Volume2, VolumeX, Music, SkipForward } from 'lucide-react'

interface AudioPlayerProps {
  className?: string
}

export function AudioPlayer({ className = "" }: AudioPlayerProps) {
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null)
  const [currentTrack, setCurrentTrack] = useState(0)
  const [isInitialized, setIsInitialized] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [volume, setVolume] = useState(0.3)
  const oscillatorRef = useRef<OscillatorNode | null>(null)
  const gainNodeRef = useRef<GainNode | null>(null)

  // Background music tracks with more audible frequencies and patterns
  const tracks = [
    {
      name: "FLAREUP Theme",
      description: "Epic romantic chaos vibes",
      baseFreq: 220, // A3 - lower, more audible
      pattern: [1, 1.25, 1.5, 1.25, 1, 0.75, 1, 1.25], // Melody pattern
      type: 'sine' as OscillatorType
    },
    {
      name: "Love Destruction",
      description: "Brutal compatibility beats",
      baseFreq: 261.63, // C4
      pattern: [1, 1.33, 1, 1.5, 1, 1.2, 1, 1.4],
      type: 'triangle' as OscillatorType
    },
    {
      name: "Heart Breaker",
      description: "Savage relationship roasts",
      baseFreq: 329.63, // E4
      pattern: [1, 0.8, 1.2, 1, 1.4, 1, 0.9, 1.1],
      type: 'square' as OscillatorType
    },
    {
      name: "Compatibility Chaos",
      description: "Wild prediction energy",
      baseFreq: 392, // G4
      pattern: [1, 1.6, 1.2, 0.8, 1.4, 1, 1.3, 0.9],
      type: 'sawtooth' as OscillatorType
    }
  ]

  const initializeAudio = async () => {
    if (typeof window === 'undefined' || isInitialized) return

    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)()
      
      // Resume context if suspended
      if (ctx.state === 'suspended') {
        await ctx.resume()
      }
      
      setAudioContext(ctx)
      setIsInitialized(true)
      
      // Start playing immediately
      setTimeout(() => playTrack(ctx, 0), 100)
    } catch (error) {
      console.error('Audio initialization error:', error)
    }
  }

  const playTrack = (ctx: AudioContext, trackIndex: number) => {
    if (!ctx) return

    const track = tracks[trackIndex]
    const duration = 15 // 15 seconds per track
    const noteLength = duration / track.pattern.length
    
    track.pattern.forEach((multiplier, index) => {
      const startTime = ctx.currentTime + (index * noteLength)
      const endTime = startTime + noteLength * 0.8 // Leave small gap between notes
      
      // Create oscillator for this note
      const osc = ctx.createOscillator()
      const gainNode = ctx.createGain()
      const filterNode = ctx.createBiquadFilter()
      
      // Set up the audio chain: oscillator -> filter -> gain -> destination
      osc.connect(filterNode)
      filterNode.connect(gainNode)
      gainNode.connect(ctx.destination)
      
      // Configure oscillator
      osc.type = track.type
      osc.frequency.setValueAtTime(track.baseFreq * multiplier, startTime)
      
      // Add some vibrato for more interesting sound
      const lfo = ctx.createOscillator()
      const lfoGain = ctx.createGain()
      lfo.frequency.setValueAtTime(5, startTime) // 5Hz vibrato
      lfoGain.gain.setValueAtTime(10, startTime) // Vibrato depth
      lfo.connect(lfoGain)
      lfoGain.connect(osc.frequency)
      
      // Configure filter for warmer sound
      filterNode.type = 'lowpass'
      filterNode.frequency.setValueAtTime(2000, startTime)
      filterNode.Q.setValueAtTime(1, startTime)
      
      // Configure envelope (attack, decay, sustain, release)
      gainNode.gain.setValueAtTime(0, startTime)
      gainNode.gain.linearRampToValueAtTime(0.15, startTime + 0.1) // Attack
      gainNode.gain.exponentialRampToValueAtTime(0.08, startTime + 0.3) // Decay
      gainNode.gain.setValueAtTime(0.08, endTime - 0.1) // Sustain
      gainNode.gain.exponentialRampToValueAtTime(0.001, endTime) // Release
      
      // Start and stop
      osc.start(startTime)
      lfo.start(startTime)
      osc.stop(endTime)
      lfo.stop(endTime)
    })
    
    // Schedule next track
    setTimeout(() => {
      const nextTrack = (trackIndex + 1) % tracks.length
      setCurrentTrack(nextTrack)
      playTrack(ctx, nextTrack)
    }, duration * 1000)
  }

  const togglePlay = async () => {
    if (!audioContext) return

    try {
      if (audioContext.state === 'suspended') {
        await audioContext.resume()
      }

      if (isPlaying) {
        // Stop current oscillator
        if (oscillatorRef.current) {
          oscillatorRef.current.stop()
          oscillatorRef.current.disconnect()
          oscillatorRef.current = null
        }
        setIsPlaying(false)
      } else {
        // Start new oscillator
        const currentTrackData = tracks[currentTrack]
        playTrack(audioContext, currentTrack)
        setIsPlaying(true)
      }
    } catch (error) {
      console.error('Audio error:', error)
    }
  }

  const toggleMute = () => {
    if (gainNodeRef.current) {
      if (isMuted) {
        gainNodeRef.current.gain.setValueAtTime(volume * 0.05, audioContext!.currentTime)
      } else {
        gainNodeRef.current.gain.setValueAtTime(0, audioContext!.currentTime)
      }
    }
    setIsMuted(!isMuted)
  }

  const nextTrack = () => {
    // Stop current track
    if (oscillatorRef.current) {
      oscillatorRef.current.stop()
      oscillatorRef.current.disconnect()
      oscillatorRef.current = null
    }
    setIsPlaying(false)
    setCurrentTrack((prev) => (prev + 1) % tracks.length)
  }

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value)
    setVolume(newVolume)
    if (gainNodeRef.current && !isMuted) {
      gainNodeRef.current.gain.setValueAtTime(newVolume * 0.05, audioContext!.currentTime)
    }
  }

  // Initialize audio on first user interaction
  useEffect(() => {
    const handleUserInteraction = () => {
      if (!isInitialized) {
        initializeAudio()
      }
    }

    // Try to start immediately
    initializeAudio()

    // Also listen for user interactions to ensure audio starts
    document.addEventListener('click', handleUserInteraction, { once: true })
    document.addEventListener('keydown', handleUserInteraction, { once: true })
    document.addEventListener('touchstart', handleUserInteraction, { once: true })

    return () => {
      document.removeEventListener('click', handleUserInteraction)
      document.removeEventListener('keydown', handleUserInteraction)
      document.removeEventListener('touchstart', handleUserInteraction)
      
      if (audioContext) {
        audioContext.close()
      }
    }
  }, [])

  // Render UI for control
  return (
    <div className={`fixed bottom-4 right-4 z-50 ${className}`}>
      <div className="bg-gradient-to-r from-pink-500/90 to-purple-600/90 backdrop-blur-sm rounded-lg p-3 shadow-lg border border-white/20">
        <div className="flex items-center gap-2 mb-2">
          <Music className="h-4 w-4 text-white animate-pulse" />
          <span className="text-white text-sm font-medium">
            {tracks[currentTrack].name}
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={togglePlay}
            className="text-white hover:bg-white/20 p-1 h-8 w-8"
          >
            {isPlaying ? (
              <div className="w-3 h-3 flex gap-0.5">
                <div className="w-1 h-3 bg-white animate-pulse"></div>
                <div className="w-1 h-3 bg-white animate-pulse delay-100"></div>
              </div>
            ) : (
              <div className="w-0 h-0 border-l-[6px] border-l-white border-t-[4px] border-t-transparent border-b-[4px] border-b-transparent ml-0.5"></div>
            )}
          </Button>

          <Button
            size="sm"
            variant="ghost"
            onClick={nextTrack}
            className="text-white hover:bg-white/20 p-1 h-8 w-8"
          >
            <SkipForward className="h-3 w-3" />
          </Button>

          <Button
            size="sm"
            variant="ghost"
            onClick={toggleMute}
            className="text-white hover:bg-white/20 p-1 h-8 w-8"
          >
            {isMuted ? <VolumeX className="h-3 w-3" /> : <Volume2 className="h-3 w-3" />}
          </Button>

          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={volume}
            onChange={handleVolumeChange}
            className="w-16 h-1 bg-white/30 rounded-lg appearance-none cursor-pointer slider"
          />
        </div>

        <p className="text-white/80 text-xs mt-1 truncate max-w-[200px]">
          {tracks[currentTrack].description}
        </p>
      </div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: white;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
        
        .slider::-moz-range-thumb {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: white;
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
      `}</style>
    </div>
  )
}
