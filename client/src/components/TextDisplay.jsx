import { Box, Paper, Typography } from '@mui/material';
import { useMemo, useEffect, useRef } from 'react';

/**
 * @typedef {Object} TextDisplayProps
 * @property {string} text
 * @property {number} activeCharIndex
 */

export default function TextDisplay({ text, activeCharIndex }) {
  const scrollRef = useRef(null);
  
  // Calculate dynamic spacing based on text length
  const textLength = text.length;
  const isLongText = textLength > 500;
  const isVeryLongText = textLength > 1000;
  
  const dynamicSpacing = useMemo(() => {
    if (isVeryLongText) {
      return {
        padding: 0.8,
        lineHeight: 1.4,
        fontSize: { xs: '0.95rem', md: '1.2rem' },
        marginBottom: '0.4rem'
      };
    } else if (isLongText) {
      return {
        padding: 1,
        lineHeight: 1.5,
        fontSize: { xs: '1rem', md: '1.4rem' },
        marginBottom: '0.6rem'
      };
    } else {
      return {
        padding: 1.5,
        lineHeight: 1.8,
        fontSize: { xs: '1.25rem', md: '1.6rem' },
        marginBottom: '0.8rem'
      };
    }
  }, [textLength, isLongText, isVeryLongText]);
  
  // Detect sentences with proper boundaries
  const sentences = useMemo(() => {
    const result = [];
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
    const result = [];
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

  const handleKeyDown = (e) => {
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
        p: dynamicSpacing.padding,
        minHeight: 250,
        height: '100%',
        overflowY: 'auto',
        lineHeight: dynamicSpacing.lineHeight,
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
                fontSize: dynamicSpacing.fontSize,
                lineHeight: 1.6,
                fontFamily: 'inherit',
                transition: 'background-color 0.1s ease, color 0.1s ease',
                color: isActive ? 'white' : 'text.primary',
                backgroundColor: isActive 
                  ? '#1e40af'  // Dark blue for active word
                  : isInActiveSentence 
                  ? '#dbeafe'  // Light blue for active sentence
                  : 'transparent',
                fontWeight: 400,
                borderRadius: '4px',
                px: 0.4,
                py: 0.2,
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
