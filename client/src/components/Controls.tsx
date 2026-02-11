import { 
  Box, 
  Button, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  Slider, 
  Typography, 
  Stack,
  Paper,
  SelectChangeEvent,
  IconButton,
  Tooltip,
  Snackbar,
  Alert
} from '@mui/material';
import { 
  PlayArrowRounded, 
  PauseRounded, 
  StopRounded, 
  SpeedRounded,
  RecordVoiceOverRounded,
  ContentPasteRounded,
  ContentCopyRounded,
  FileUploadRounded,
  DeleteOutlineRounded,
  CheckCircleRounded
} from '@mui/icons-material';
import { useRef, useState } from 'react';

interface ControlsProps {
  isPlaying: boolean;
  isPaused: boolean;
  onPlay: () => void;
  onPause: () => void;
  onResume: () => void;
  onStop: () => void;
  voices: SpeechSynthesisVoice[];
  selectedVoice: SpeechSynthesisVoice | null;
  onVoiceChange: (voice: SpeechSynthesisVoice | null) => void;
  rate: number;
  onRateChange: (rate: number) => void;
  text: string;
  onTextChange: (text: string) => void;
}

export default function Controls({
  isPlaying,
  isPaused,
  onPlay,
  onPause,
  onResume,
  onStop,
  voices,
  selectedVoice,
  onVoiceChange,
  rate,
  onRateChange,
  text,
  onTextChange
}: ControlsProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [pasteSuccess, setPasteSuccess] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  
  const handleVoiceChange = (event: SelectChangeEvent) => {
    const voiceName = event.target.value;
    const voice = voices.find(v => v.name === voiceName) || null;
    onVoiceChange(voice);
  };

  const handlePaste = async () => {
    try {
      const clipboardText = await navigator.clipboard.readText();
      onTextChange(clipboardText);
      setPasteSuccess(true);
      setTimeout(() => setPasteSuccess(false), 2000);
    } catch (err) {
      console.error('Failed to read clipboard', err);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        onTextChange(content);
      };
      reader.readAsText(file);
    }
  };

  const handleClear = () => {
    onTextChange('');
  };

  // Supported Indian languages only
  const supportedLangs = ['hi-IN', 'gu-IN', 'mr-IN', 'ta-IN', 'te-IN', 'en-IN'];
  
  // Language code mapping for display
  const langNames: Record<string, string> = {
    'en': 'English',
    'hi': 'हिन्दी (Hindi)',
    'gu': 'ગુજરાતી (Gujarati)',
    'mr': 'मराठी (Marathi)',
    'ta': 'தமிழ் (Tamil)',
    'te': 'తెలుగు (Telugu)'
  };

  // Filter and group voices by language
  const filteredVoices = voices.filter(v => 
    supportedLangs.some(lang => v.lang.includes(lang.split('-')[0]))
  );

  const groupedVoices = filteredVoices.reduce((acc, voice) => {
    const langCode = voice.lang.split('-')[0];
    if (!acc[langCode]) {
      acc[langCode] = [];
    }
    acc[langCode].push(voice);
    return acc;
  }, {} as Record<string, SpeechSynthesisVoice[]>);

  // Sort language codes by Indian priority
  const sortedLangCodes = Object.keys(groupedVoices).sort((a, b) => {
    const priority: Record<string, number> = { 'en': 0, 'hi': 1, 'gu': 2, 'mr': 3, 'ta': 4, 'te': 5 };
    return (priority[a] || 999) - (priority[b] || 999);
  });

  const sortedVoices = sortedLangCodes.flatMap(langCode => groupedVoices[langCode]);

  const showResume = isPlaying && isPaused;
  const showPause = isPlaying && !isPaused;
  const showPlay = !isPlaying;

  return (
    <>
    <Paper 
      elevation={0}
      sx={{ 
        p: { xs: 1.5, md: 2.5 }, 
        borderRadius: 2, 
        background: 'white',
        border: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Stack spacing={1} >
        {/* Playback & Utility Controls */}
        <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={0.5} >
          <Box display="flex" gap={0.5} flexWrap="wrap">
            {showPlay && (
              <Button
                variant="contained"
                color="primary"
                size="small"
                startIcon={<PlayArrowRounded sx={{ fontSize: '22px' }} />}
                onClick={onPlay}
                disabled={voices.length === 0 || !text.trim()}
                sx={{ px: 2, py: 0.5, borderRadius: '8px', fontSize: '0.8rem' }}
              >
                Start
              </Button>
            )}

            {showResume && (
              <Button
                variant="contained"
                color="primary"
                size="small"
                startIcon={<PlayArrowRounded sx={{ fontSize: '22px' }} />}
                onClick={onResume}
                sx={{ px: 2, py: 0.5, borderRadius: '8px', fontSize: '0.8rem' }}
              >
                Resume
              </Button>
            )}

            {showPause && (
              <Button
                variant="outlined"
                color="primary"
                size="small"
                startIcon={<PauseRounded sx={{ fontSize: '22px' }} />}
                onClick={onPause}
                sx={{ px: 2, py: 0.5, borderRadius: '8px', borderWidth: 1, fontSize: '0.8rem' }}
              >
                Pause
              </Button>
            )}

            <Button
              variant="text"
              color="error"
              size="small"
              startIcon={<StopRounded sx={{ fontSize: '22px' }} />}
              onClick={onStop}
              disabled={!isPlaying}
              sx={{ px: 2, py: 0.5, borderRadius: '8px', fontSize: '0.8rem' }}
            >
              Stop
            </Button>
          </Box>

          <Box display="flex" gap={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: '8px', overflow: 'hidden' }}>
            <Tooltip title="Paste from Clipboard">
              <IconButton onClick={handlePaste} color="primary" size="small" sx={{ bgcolor: 'transparent', borderRadius: 0, '&:not(:last-child)': { borderRight: '1px solid', borderColor: 'divider' } }}>
                <ContentPasteRounded sx={{ fontSize: '22px' }} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Copy to Clipboard">
              <IconButton onClick={handleCopy} color="primary" size="small" sx={{ bgcolor: 'transparent', borderRadius: 0, '&:not(:last-child)': { borderRight: '1px solid', borderColor: 'divider' } }} disabled={!text}>
                <ContentCopyRounded sx={{ fontSize: '22px' }} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Clear Text">
              <IconButton onClick={handleClear} color="error" size="small" sx={{ bgcolor: 'transparent', borderRadius: 0 }} disabled={!text}>
                <DeleteOutlineRounded sx={{ fontSize: '22px' }} />
              </IconButton>
            </Tooltip>
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: 'none' }}
              accept=".txt"
              onChange={handleFileUpload}
            />
          </Box>
        </Box>

        {/* Settings Row */}
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems="flex-start" sx={{ overflow: 'visible' }}>
          
          {/* Voice Selector */}
          <FormControl fullWidth variant="outlined" sx={{ flex: 2, display: { xs: 'block', md: 'block' }, minWidth: 0 }}>
            <InputLabel id="voice-select-label" sx={{ fontSize: '0.85rem' }}>Language</InputLabel>
            <Select
              labelId="voice-select-label"
              value={selectedVoice?.name || ''}
              onChange={handleVoiceChange}
              label="Language"
              startAdornment={<RecordVoiceOverRounded sx={{ mr: 1, color: 'text.secondary', fontSize: '22px' }} />}
              sx={{ borderRadius: '8px', fontSize: '0.85rem' }}
              size="small"
              MenuProps={{
                PaperProps: {
                  sx: {
                    maxHeight: '200px',
                    fontSize: '0.8rem'
                  }
                }
              }}
            >
              {sortedLangCodes.map((langCode) => [
                <MenuItem key={`label-${langCode}`} disabled sx={{ fontWeight: 'bold', color: 'primary.main', fontSize: '0.8rem' }}>
                  {langNames[langCode] || langCode}
                </MenuItem>,
                ...groupedVoices[langCode].slice(0, langCode === 'en' ? 1 : undefined).map((voice) => (
                  <MenuItem key={voice.name} value={voice.name} sx={{ pl: 2, fontSize: '0.8rem' }}>
                    <Typography sx={{ fontSize: '0.8rem' }}>{voice.name}</Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ ml: 1, fontSize: '0.7rem' }}>
                      ({voice.lang})
                    </Typography>
                  </MenuItem>
                ))
              ]).flat()}
              {filteredVoices.length === 0 && (
                <MenuItem disabled value="">
                  Loading voices...
                </MenuItem>
              )}
            </Select>
          </FormControl>

          {/* Speed Slider */}
          <Box sx={{ flex: 1, minWidth: { md: 120 }, width: '100%', display: { xs: 'none', md: 'block' } }}>
            <Box display="flex" alignItems="center" gap={0.5} mb={0.5}>
              <SpeedRounded color="action" sx={{ fontSize: '20px' }} />
              <Typography variant="caption" fontWeight={500} color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                Speed: {rate}x
              </Typography>
            </Box>
            <Slider
              value={rate}
              min={0.5}
              max={2}
              step={0.1}
              onChange={(_, value) => onRateChange(value as number)}
              valueLabelDisplay="auto"
              marks={[
                { value: 0.5, label: '0.5x' },
                { value: 1, label: '1x' },
                { value: 1.5, label: '1.5x' },
                { value: 2, label: '2x' },
              ]}
              sx={{
                '& .MuiSlider-markLabel': { fontSize: '0.7rem' }
              }}
            />
          </Box>
        </Stack>
      </Stack>
    </Paper>

    {/* Success Notifications */}
    <Snackbar 
      open={pasteSuccess} 
      autoHideDuration={2000} 
      onClose={() => setPasteSuccess(false)}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
    >
      <Alert 
        severity="success" 
        variant="filled"
        icon={<CheckCircleRounded />}
        sx={{ borderRadius: 2, fontWeight: 600 }}
      >
        Text pasted to reader successfully!
      </Alert>
    </Snackbar>

    <Snackbar 
      open={copySuccess} 
      autoHideDuration={2000} 
      onClose={() => setCopySuccess(false)}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
    >
      <Alert 
        severity="success" 
        variant="filled"
        icon={<CheckCircleRounded />}
        sx={{ borderRadius: 2, fontWeight: 600 }}
      >
        Text copied to clipboard!
      </Alert>
    </Snackbar>
    </>
  );
}
