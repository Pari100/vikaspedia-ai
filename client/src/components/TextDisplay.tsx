import { Box, Paper, Typography } from '@mui/material';
import { useMemo, useEffect, useRef } from 'react';

interface TextDisplayProps {
  text: string;
  activeCharIndex: number;
}

export default function TextDisplay({ text, activeCharIndex }: TextDisplayProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const words = useMemo(() => {
    const result: { word: string; start: number; end: number }[] = [];
    const regex = /\S+/g;
    let match;

    while ((match = regex.exec(text)) !== null) {
      result.push({
        word: match[0],
        start: match.index,
        end: match.index + match[0].length
      });
    }
    
    return result;
  }, [text]);

  const activeWordIndex = useMemo(() => {
    if (activeCharIndex < 0) return -1;
    return words.findIndex(w => activeCharIndex >= w.start && activeCharIndex < w.end);
  }, [words, activeCharIndex]);

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

  return (
    <Box
      ref={scrollRef}
      sx={{
        p: 1.5,
        minHeight: 250,
        height: '100%',
        overflowY: 'auto',
        lineHeight: 1.8,
        flex: 1,
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
          const isActive = activeWordIndex === wordIdx;
          
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
                transition: 'all 0.1s ease',
                color: isActive ? 'white' : 'text.primary',
                backgroundColor: isActive ? 'primary.main' : 'transparent',
                fontWeight: isActive ? 700 : 400,
                borderRadius: '4px',
                px: isActive ? 0.6 : 0,
                boxShadow: isActive ? '0 4px 12px rgba(124, 58, 237, 0.4)' : 'none',
                position: 'relative',
                zIndex: isActive ? 1 : 0,
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
