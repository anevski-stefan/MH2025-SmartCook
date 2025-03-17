'use client';

import { IconButton, Tooltip } from '@mui/material';
import { useThemeMode } from '@/contexts/ThemeContext';
import Brightness4Icon from '@mui/icons-material/Brightness4'; 
import Brightness7Icon from '@mui/icons-material/Brightness7'; 

export default function ThemeToggle() {
  const { mode, toggleTheme } = useThemeMode();
  
  return (
    <Tooltip title={mode === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}>
      <IconButton onClick={toggleTheme} color="inherit" aria-label="toggle theme" sx={{ color: 'white' }}>
        {mode === 'light' ? <Brightness4Icon /> : <Brightness7Icon />}
      </IconButton>
    </Tooltip>
  );
} 