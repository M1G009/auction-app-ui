import { hexToRGBA } from 'src/@core/utils/hex-to-rgba'

const Slider = theme => {
  const primaryMain = theme.palette.primary?.main && theme.palette.primary.main.startsWith('#')
    ? theme.palette.primary.main
    : '#9155FD'
  const thumbShadow = hexToRGBA(primaryMain, 0.16)

  return {
    MuiSlider: {
      styleOverrides: {
        root: {
          color: primaryMain
        },
        thumb: {
          '&:hover, &.Mui-focusVisible': {
            boxShadow: `0px 0px 0px 8px ${thumbShadow}`
          },
          '&.Mui-active': {
            boxShadow: `0px 0px 0px 14px ${thumbShadow}`
          }
        }
      }
    }
  }
}

export default Slider
