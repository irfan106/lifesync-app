import { UnistylesRegistry } from 'react-native-unistyles';
import { theme } from './theme';
import { breakpoints } from './breakpoints';

type AppBreakpoints = typeof breakpoints;
type AppTheme = typeof theme;

declare module 'react-native-unistyles' {
  export interface UnistylesBreakpoints extends AppBreakpoints {}
  export interface UnistylesThemes {
    dark: AppTheme;
    // light: AppTheme; // We can add light theme later
  }
}

UnistylesRegistry.addBreakpoints(breakpoints)
  .addThemes({
    dark: theme,
  })
  .addConfig({
    initialTheme: 'dark',
  });
