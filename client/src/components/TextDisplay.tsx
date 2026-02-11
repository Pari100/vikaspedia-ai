import { Box, Paper, Typography } from '@mui/material';
import { useMemo, useEffect, useRef } from 'react';

interface TextDisplayProps {
  text: string;
  activeCharIndex: number;
}

export default function TextDisplay({ text, activeCharIndex }: TextDisplayProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  
  // Detect sentences with proper boundaries
  const sentences = useMemo(() => {
    const result: { start: number; end: number; sentenceIndex: number }[] = [];
    let sentenceStart = 0;
    let sentenceCount = 0;

    for (let i = 0; i < text.length; i++) {
      if (text[i] === '.' || text[i] === '!' || text[i] === '?') {
        result.push({
          start: sentenceStart,
          end: i + 1,
          sentenceIndex: sentenceCount
        });
        sentenceStart = i + 1;
        sentenceCount++;
      }
    }

    // Handle last sentence if text doesn't end with punctuation
    if (sentenceStart < text.length) {
      result.push({
        start: sentenceStart,
        end: text.length,
        sentenceIndex: sentenceCount
      });
    }

    return result;
  }, [text]);

  const words = useMemo(() => {
    const result: { word: string; start: number; end: number; sentenceIndex: number }[] = [];
    const regex = /\S+/g;
    let match;

    while ((match = regex.exec(text)) !== null) {
      // Find which sentence this word belongs to
      const wordPos = match.index;
      const sentenceData = sentences.find(
        s => wordPos >= s.start && wordPos < s.end
      );
      const sentenceIndex = sentenceData ? sentenceData.sentenceIndex : 0;
      
      result.push({
        word: match[0],
        start: match.index,
        end: match.index + match[0].length,
        sentenceIndex: sentenceIndex
      });
    }
    
    return result;
  }, [text, sentences]);

  const activeWordIndex = useMemo(() => {
    if (activeCharIndex < 0) return -1;
    return words.findIndex(w => activeCharIndex >= w.start && activeCharIndex < w.end);
  }, [words, activeCharIndex]);

  const activeSentenceIndex = useMemo(() => {
    if (activeWordIndex < 0) return -1;
    return words[activeWordIndex]?.sentenceIndex ?? -1;
  }, [words, activeWordIndex]);

  useEffect(() => {
    if (activeWordIndex >= 0 && scrollRef.current) {
      const activeElement = scrollRef.current.querySelector(`[data-word-index="${activeWordIndex}"]`);
      if (activeElement) {
        activeElement.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        });
      }
    }
  }, [activeWordIndex]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Only allow paste via button, not keyboard shortcut
    if ((e.ctrlKey || e.metaKey) && (e.key === 'v' || e.key === 'V')) {
      e.preventDefault();
    }
  };

  return (
    <Box
      ref={scrollRef}
      onKeyDown={handleKeyDown}
      sx={{
        p: 1.5,
        minHeight: 250,
        height: '100%',
        overflowY: 'auto',
        lineHeight: 1.8,
        flex: 1,
        userSelect: 'text',
      }}
    >
      <Box sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
        {text.split(/(\s+)/g).map((part, index) => {
          const prevParts = text.split(/(\s+)/g).slice(0, index).join('');
          const startOffset = prevParts.length;
          
          if (/^\s+$/.test(part)) {
            return <span key={index}>{part}</span>;
          }

          const wordIdx = words.findIndex(w => w.start === startOffset);
          const wordData = words[wordIdx];
          const isActive = activeWordIndex === wordIdx;
          const sentenceIndex = wordData?.sentenceIndex ?? -1;
          const isInActiveSentence = sentenceIndex === activeSentenceIndex && activeSentenceIndex >= 0;
          
          return (
            <Typography
              component="span"
              key={index}
              data-word-index={wordIdx}
              sx={{
                display: 'inline-block',
                fontSize: { xs: '1.25rem', md: '1.6rem' },
                lineHeight: 1.6,
                fontFamily: 'inherit',
                transition: 'all 0.15s ease',
                color: isActive ? 'white' : 'text.primary',
                backgroundColor: isActive 
                  ? '#1e40af'  // Dark blue for active word
                  : isInActiveSentence 
                  ? '#dbeafe'  // Light blue for active sentence
                  : 'transparent',
                fontWeight: isActive ? 700 : 400,
                borderRadius: isActive ? '6px' : '2px',
                px: isActive ? 0.8 : isInActiveSentence ? 0.3 : 0,
                py: isActive ? 0.4 : isInActiveSentence ? 0.15 : 0,
                boxShadow: isActive ? '0 4px 12px rgba(30, 64, 175, 0.4)' : 'none',
                position: 'relative',
                zIndex: isActive ? 2 : isInActiveSentence ? 1 : 0,
                verticalAlign: 'baseline'
              }}
            >
              {part}
            </Typography>
          );
        })}
        {text.length === 0 && (
          <Typography color="text.secondary" sx={{ fontStyle: 'italic' }}>
            Text will appear here...
          </Typography>
        )}
      </Box>
    </Box>
  );
}
