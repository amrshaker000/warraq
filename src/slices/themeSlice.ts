import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export type Theme = 'light' | 'dark';

interface ThemeState {
  currentTheme: Theme;
  systemTheme: Theme;
}

const initialState: ThemeState = {
  currentTheme: (localStorage.getItem('theme') as Theme) || 'light',
  systemTheme: (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) ? 'dark' : 'light',
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<Theme>) => {
      state.currentTheme = action.payload;
      localStorage.setItem('theme', action.payload);
    },
    toggleTheme: (state) => {
      state.currentTheme = state.currentTheme === 'light' ? 'dark' : 'light';
      localStorage.setItem('theme', state.currentTheme);
    },
    setSystemTheme: (state, action: PayloadAction<Theme>) => {
      state.systemTheme = action.payload;
    },
  },
});

export const { setTheme, toggleTheme, setSystemTheme } = themeSlice.actions;
export default themeSlice.reducer;
