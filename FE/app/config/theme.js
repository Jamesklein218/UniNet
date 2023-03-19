import {useSelector} from 'react-redux';
import {useColorScheme} from 'react-native';

/**
 * Define Const color use for whole application
 */
export const BaseColor = {
  grayColor: '#9B9B9B',
  dividerColor: '#BDBDBD',
  whiteColor: '#FFFFFF',
  fieldColor: '#F5F5F5',
  yellowColor: '#FDC60A',
  navyBlue: '#3C5A99',
  kashmir: '#5D6D7E',
  orangeColor: '#E5634D',
  blueColor: '#2a63ee',
  pinkColor: '#A569BD',
  greenColor: '#58D68D',
};

/**
 * Define Const list theme use for whole application
 */
export const ThemeSupport = [
  {
    theme: 'orange',
    light: {
      dark: false,
      colors: {
        primary: '#E5634D',
        primaryDark: '#C31C0D',
        primaryLight: '#FF8A65',
        accent: '#4A90A4',
        background: 'white',
        card: '#F5F5F5',
        text: '#212121',
        border: '#c7c7cc',
      },
    },
    dark: {
      dark: true,
      colors: {
        primary: '#E5634D',
        primaryDark: '#C31C0D',
        primaryLight: '#FF8A65',
        accent: '#4A90A4',
        background: '#010101',
        card: '#121212',
        text: '#e5e5e7',
        border: '#272729',
      },
    },
  },
];

export const DefaultTheme = {
  theme: 'orange',
  light: {
    dark: false,
    colors: {
      primary: '#5DADE2',
      primaryDark: '#1281ac',
      primaryLight: '#68c9ef',
      accent: '#FF8A65',
      background: 'white',
      card: '#F5F5F5',
      text: '#212121',
      border: '#c7c7cc',
    },
  },
  dark: {
    dark: true,
    colors: {
      primary: '#5DADE2',
      primaryDark: '#1281ac',
      primaryLight: '#68c9ef',
      accent: '#FF8A65',
      background: '#010101',
      card: '#121212',
      text: '#e5e5e7',
      border: '#272729',
    },
  },
};

/**
 * Define list font use for whole application
 */
export const FontSupport = ['Raleway', 'Roboto', 'Merriweather'];

/**
 * Define font default use for whole application
 */
export const DefaultFont = 'Roboto';

/**
 * export theme and colors for application
 * @returns theme,colors
 */
export const useTheme = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const forceDark = useSelector(state => state.application.force_dark);
  const themeStorage = useSelector(state => state.application.theme);
  const theme = ThemeSupport.find(
    item => item.theme === (themeStorage ?? DefaultTheme.theme),
  );

  if (forceDark || isDarkMode) {
    return {theme: theme.dark, colors: theme.dark.colors};
  }
  return {theme: theme.light, colors: theme.light.colors};
};

/**
 * export font for application
 * @returns font
 */
export const useFont = () => {
  const font = useSelector(state => state.application.font);
  return font ?? DefaultFont;
};
