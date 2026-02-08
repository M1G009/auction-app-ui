// ** MUI Theme Provider
import { deepmerge } from '@mui/utils'

// ** Theme Override Imports
import palette from './palette'
import spacing from './spacing'
import shadows from './shadows'
import breakpoints from './breakpoints'

const themeOptions = settings => {
  // ** Vars
  const { mode, themeColor } = settings

  const themeConfig = {
    palette: palette(mode, themeColor),
    typography: {
      fontFamily: [
        'Inter',
        'sans-serif',
        '-apple-system',
        'BlinkMacSystemFont',
        '"Segoe UI"',
        'Roboto',
        '"Helvetica Neue"',
        'Arial',
        'sans-serif',
        '"Apple Color Emoji"',
        '"Segoe UI Emoji"',
        '"Segoe UI Symbol"'
      ].join(',')
    },
    shadows: shadows(mode),
    ...spacing,
    breakpoints: breakpoints(),
    shape: {
      borderRadius: 6
    },
    mixins: {
      toolbar: {
        minHeight: 64
      }
    }
  }

  const validColorKeys = ['primary', 'secondary', 'success', 'error', 'warning', 'info']
  const primarySource = validColorKeys.includes(themeColor) ? themeConfig.palette[themeColor] : null
  const primaryPalette = primarySource?.main && /^#|^rgb|^rgba|^hsl|^hsla/.test(String(primarySource.main))
    ? primarySource
    : themeConfig.palette.primary

  return deepmerge(themeConfig, {
    palette: {
      primary: { ...primaryPalette }
    }
  })
}

export default themeOptions
