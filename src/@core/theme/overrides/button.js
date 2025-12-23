// ** Theme Config Imports
import themeConfig from 'src/configs/themeConfig'

const Button = theme => {
  return {
    MuiButton: {
      styleOverrides: {
        root: {
          fontWeight: 600,
          borderRadius: '12px',
          lineHeight: 1.71,
          letterSpacing: '0.3px',
          padding: `${theme.spacing(1.875, 3)}`,
          textTransform: 'none',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-2px)'
          },
          '&:active': {
            transform: 'translateY(0px)'
          }
        },
        contained: {
          boxShadow: '0 8px 16px rgba(102, 126, 234, 0.3)',
          padding: `${theme.spacing(1.875, 5.5)}`,
          color: '#FFFFFF',
          '&:hover': {
            boxShadow: '0 12px 24px rgba(102, 126, 234, 0.4)',
            color: '#FFFFFF'
          }
        },
        outlined: {
          padding: `${theme.spacing(1.625, 5.25)}`,
          borderWidth: '2px',
          '&:hover': {
            borderWidth: '2px'
          }
        },
        sizeSmall: {
          borderRadius: '10px',
          padding: `${theme.spacing(1, 2.25)}`,
          '&.MuiButton-contained': {
            padding: `${theme.spacing(1, 3.5)}`
          },
          '&.MuiButton-outlined': {
            padding: `${theme.spacing(0.75, 3.25)}`
          }
        },
        sizeLarge: {
          borderRadius: '14px',
          padding: `${theme.spacing(2.125, 5.5)}`,
          fontSize: '16px',
          '&.MuiButton-contained': {
            padding: `${theme.spacing(2.125, 6.5)}`
          },
          '&.MuiButton-outlined': {
            padding: `${theme.spacing(1.875, 6.25)}`
          }
        }
      }
    },
    MuiButtonBase: {
      defaultProps: {
        disableRipple: themeConfig.disableRipple
      }
    }
  }
}

export default Button
