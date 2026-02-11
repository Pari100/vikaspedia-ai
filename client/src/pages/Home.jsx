import { useState, useEffect, useRef } from 'react';
import { Box, Container, Grid, Typography, Fade, Alert, Snackbar, TextField, Paper, Stack, CircularProgress } from '@mui/material';
import Header from '@/components/Header';
import Controls from '@/components/Controls';
import TextDisplay from '@/components/TextDisplay';

const DEFAULT_TEXT = `The objective of this task is to design and implement a frontend-only solution that synchronizes Text-to-Speech (TTS) audio playback with real-time text highlighting in the user interface. 

Select a language from the dropdown below. The text will automatically translate into that language and highlight each word as it is spoken. Support is available for Hindi, Gujarati, Marathi, Tamil, Telugu, and English.`;

export default function Home() {
  const [text, setText] = useState(DEFAULT_TEXT);
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [rate, setRate] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [charIndex, setCharIndex] = useState(-1);
  const [error, setError] = useState(null);
  const [isTranslating, setIsTranslating] = useState(false);

  const utteranceRef = useRef(null);

  const indianLanguages = {
    'en': ['en-IN'],
    'hi': ['hi-IN'],
    'gu': ['gu-IN'],
    'mr': ['mr-IN'],
    'ta': ['ta-IN'],
    'te': ['te-IN']
  };

  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      if (availableVoices.length > 0) {
        const indianVoices = availableVoices.filter(v => 
          Object.values(indianLanguages).flat().some(lang => v.lang.includes(lang.split('-')[0]))
        );
        
        if (indianVoices.length > 0) {
          setVoices(indianVoices);
          const browserLang = navigator.language.split('-')[0];
          const matchedVoice = indianVoices.find(v => v.lang.startsWith(browserLang))
            || indianVoices.find(v => v.lang.includes('en-IN'))
            || indianVoices.find(v => v.lang.includes('en'))
            || indianVoices.find(v => v.lang.includes('hi-IN'))
            || indianVoices[0];
          setSelectedVoice(matchedVoice);
        } else {
          setVoices(availableVoices);
          setSelectedVoice(availableVoices[0] || null);
        }
      }
    };
    
    loadVoices();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  const translateText = async (targetLang) => {
    if (!text.trim()) return;
    const targetCode = targetLang.split('-')[0];
    setIsTranslating(true);
    try {
      const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetCode}&dt=t&q=${encodeURIComponent(text)}`;
      const response = await fetch(url);
      const data = await response.json();
      const translatedText = data[0].map((x) => x[0]).join('');
      setText(translatedText);
    } catch (err) {
      console.error("Translation error", err);
      setError("Translation service failed. Using current text.");
    } finally {
      setIsTranslating(false);
    }
  };

  const handleVoiceChange = (voice) => {
    setSelectedVoice(voice);
    if (voice && text.trim()) {
      translateText(voice.lang);
    }
  };

  const handlePlay = () => {
    if (!selectedVoice) {
      setError("Voice synthesis not ready.");
      return;
    }

    if (!text.trim()) {
      setError("Please enter some text.");
      return;
    }

    window.speechSynthesis.cancel();
    setTimeout(() => {
      setCharIndex(-1);
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.voice = selectedVoice;
      utterance.rate = rate;
      utterance.lang = selectedVoice.lang;
      
      let startTime = null;
      let pauseTime = null;
      let animationFrameId = null;
      const charsPerSecond = 12; // Estimate average speaking speed

      const updateCharIndexByTime = () => {
        if (!startTime) return;
        const now = Date.now();
        const elapsedMs = now - startTime;
        const elapsedChars = Math.floor((elapsedMs / 1000) * charsPerSecond * rate);
        setCharIndex(Math.min(elapsedChars, text.length - 1));
        
        if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
          animationFrameId = requestAnimationFrame(updateCharIndexByTime);
        }
      };
      
      utterance.onstart = () => {
        setIsPlaying(true);
        setIsPaused(false);
        startTime = Date.now();
        animationFrameId = requestAnimationFrame(updateCharIndexByTime);
      };

      utterance.onend = () => {
        setIsPlaying(false);
        setIsPaused(false);
        setCharIndex(-1);
        if (animationFrameId) cancelAnimationFrame(animationFrameId);
      };
      
      utterance.onerror = (event) => {
        console.error("Speech synthesis error", event);
        setIsPlaying(false);
        setIsPaused(false);
        setError("Playback failed. Try another voice or refresh.");
        if (animationFrameId) cancelAnimationFrame(animationFrameId);
      };

      utterance.onpause = () => {
        setIsPaused(true);
        pauseTime = Date.now();
        if (animationFrameId) cancelAnimationFrame(animationFrameId);
      };

      utterance.onresume = () => {
        setIsPaused(false);
        if (pauseTime) {
          startTime += Date.now() - pauseTime;
          pauseTime = null;
        }
        animationFrameId = requestAnimationFrame(updateCharIndexByTime);
      };

      // Primary: Use onboundary if available (better support on desktop)
      utterance.onboundary = (event) => {
        if (event.name === 'word') {
          setCharIndex(event.charIndex);
        }
      };

      utteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    }, 100);
  };

  const handlePause = () => {
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.pause();
    }
  };

  const handleResume = () => {
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
    }
  };

  const handleStop = () => {
    window.speechSynthesis.cancel();
    setIsPlaying(false);
    setIsPaused(false);
    setCharIndex(-1);
  };

  const handleRateChange = (newRate) => {
    setRate(newRate);
    if (isPlaying) {
      handlePlay();
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      <Header />
      
      <Container maxWidth="xl"  sx={{ py: { xs: 4, md: 8 } }}>
        <Fade in timeout={800}>
          <Box>
            <Box mb={8} textAlign="center" sx={{ bgcolor: 'white', py: 6, borderRadius: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
              <Box 
                component="img"
                src="/vikaspedia.png"
                alt="Vikaspedia Logo"
                sx={{ 
                  width: { xs: 80, md: 120 },
                  height: { xs: 80, md: 120 },
                  objectFit: 'contain',
                  margin: '0 auto',
                  mb: 2,
                  display: 'block'
                }}
              />
              <Typography variant="h1" gutterBottom sx={{ 
                fontWeight: 500,
                color: '#2e7d32',
                letterSpacing: '-0.05em',
                fontSize: { xs: '3rem', md: '5rem' },
                animation: 'slideInDown 0.8s ease-out',
                '@keyframes slideInDown': {
                  from: {
                    opacity: 0,
                    transform: 'translateY(-30px) scale(0.9)',
                  },
                  to: {
                    opacity: 1,
                    transform: 'translateY(0) scale(1)',
                  },
                }
              }}>
                Vikaspedia
              </Typography>
              <Box display="flex" alignItems="center" gap={3} justifyContent="center" mt={3} mb={3}>
                <Box 
                  component="img"
                  src="/cdac.png"
                  alt="CDAC Logo"
                  sx={{ 
                    height: { xs: 35, md: 45 },
                    width: 'auto',
                    objectFit: 'contain'
                  }}
                />
                <Box 
                  component="img"
                  src="/ministry.png"
                  alt="Ministry Logo"
                  sx={{ 
                    height: { xs: 35, md: 45 },
                    width: 'auto',
                    objectFit: 'contain'
                  }}
                />
              </Box>
              <Typography variant="h6" sx={{ mx: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, fontWeight: 400, color: '#475569', fontSize: { xs: '1rem', md: '1.25rem' }, letterSpacing: '0.3px' }}>
                High-performance synchronized text-to-speech
                {isTranslating && <CircularProgress size={24} thickness={6} />}
              </Typography>
            </Box>

            {/* Reader Section Only */}
            <Paper elevation={0} sx={{ 
              p: 0, 
              borderRadius: 4, 
              border: '3px solid', 
              borderColor: '#2563eb',
              overflow: 'hidden',
              bgcolor: 'white',
              display: 'flex',
              flexDirection: 'column',
              minWidth: 0,
              mb: 6,
              boxShadow: '0 4px 20px rgba(37, 99, 235, 0.15)'
            }}>
              <Box sx={{ p: 2, borderBottom: '3px solid #2563eb', bgcolor: '#f1f5f9' }}>
                <Typography variant="subtitle2" fontWeight={700} color="#1e293b" sx={{ fontSize: '0.85rem' }}>
                  Reader
                </Typography>
              </Box>
              {isTranslating && (
                <Box sx={{ 
                  position: 'absolute', 
                  inset: 0, 
                  bgcolor: 'rgba(255,255,255,0.9)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  zIndex: 10,
                  backdropFilter: 'blur(4px)',
                  borderRadius: 4
                }}>
                  <Box sx={{ textAlign: 'center' }}>
                    <CircularProgress size={80} thickness={5} sx={{ mb: 2 }} />
                    <Typography variant="body1" color="text.secondary">
                      Processing...
                    </Typography>
                  </Box>
                </Box>
              )}
              <TextDisplay 
                text={text} 
                activeCharIndex={charIndex} 
              />
            </Paper>

            {/* Playback Control below */}
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4, width: '100%' }}>
              <Box sx={{ width: { xs: '90%', sm: '50%' } }}>
                <Controls 
                  isPlaying={isPlaying}
                  isPaused={isPaused}
                  onPlay={handlePlay}
                  onPause={handlePause}
                  onResume={handleResume}
                  onStop={handleStop}
                  voices={voices}
                  selectedVoice={selectedVoice}
                  onVoiceChange={handleVoiceChange}
                  rate={rate}
                  onTextChange={setText}
                  onRateChange={handleRateChange}
                  text={text}
                />
              </Box>
            </Box>
          </Box>
        </Fade>
      </Container>

      <Snackbar 
        open={!!error} 
        autoHideDuration={6000} 
        onClose={() => setError(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setError(null)} 
          severity="error" 
          variant="filled"
          sx={{ width: '100%', borderRadius: 4, fontWeight: 700 }}
        >
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
}
