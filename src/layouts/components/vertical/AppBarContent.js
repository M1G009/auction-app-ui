// ** Next Import
import { useRouter } from 'next/router'
import Link from 'next/link'
import React from 'react'
import { useEffect, useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import useMediaQuery from '@mui/material/useMediaQuery'
import { styled, alpha } from '@mui/material/styles'

// ** Icons Imports
import LogoutVariant from 'mdi-material-ui/LogoutVariant'
import AccountPlus from 'mdi-material-ui/AccountPlus'

// ** Navigation Import
import getNavigationItems from 'src/navigation/vertical'

// ** Axios Import
import axios from 'axios'

const StyledLogoutButton = styled(Button)(({ theme }) => ({
  borderRadius: '12px',
  padding: '6px 12px',
  fontSize: '12px',
  fontWeight: 600,
  textTransform: 'none',
  background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%)',
  color: '#FFFFFF',
  boxShadow: '0 4px 12px rgba(238, 90, 111, 0.3)',
  transition: 'all 0.3s ease',
  '&:hover': {
    background: 'linear-gradient(135deg, #ee5a6f 0%, #ff6b6b 100%)',
    color: '#FFFFFF',
    boxShadow: '0 6px 16px rgba(238, 90, 111, 0.4)',
    transform: 'translateY(-2px)'
  },
  '&:active': {
    transform: 'translateY(0px)'
  }
}))

const StyledRegisterButton = styled(Button)(({ theme }) => ({
  borderRadius: '12px',
  padding: '6px 12px',
  fontSize: '12px',
  fontWeight: 600,
  textTransform: 'none',
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  color: '#FFFFFF',
  boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
  transition: 'all 0.3s ease',
  '&:hover': {
    background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
    color: '#FFFFFF',
    boxShadow: '0 6px 16px rgba(102, 126, 234, 0.4)',
    transform: 'translateY(-2px)'
  },
  '&:active': {
    transform: 'translateY(0px)'
  }
}))

const StyledNavButton = styled(Button)(({ theme }) => ({
  borderRadius: '12px',
  padding: '6px 12px',
  fontSize: '12px',
  fontWeight: 600,
  textTransform: 'none',
  marginRight: theme.spacing(1),
  transition: 'all 0.3s ease',
  backgroundColor: alpha('#667eea', 0.08),
  color: theme.palette.text.primary,
  '&:hover': {
    backgroundColor: alpha('#667eea', 0.15),
    transform: 'translateY(-2px)'
  },
  '&.active': {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: '#fff',
    boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)',
    '&:hover': {
      background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
      transform: 'translateY(-2px)'
    }
  }
}))

const AppBarContent = props => {
  // ** Props
  const { hidden } = props

  // ** Hooks
  const router = useRouter()
  const hiddenSm = useMediaQuery(theme => theme.breakpoints.down('sm'))
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [registrationActive, setRegistrationActive] = useState(false)

  // ** Get navigation items
  const navItems = getNavigationItems()

  // ** Check login status
  useEffect(() => {
    const checkLoginStatus = () => {
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('authorization')
        setIsLoggedIn(!!token)
      }
    }

    // Check on mount
    checkLoginStatus()

    // Listen for storage changes (e.g., when token is removed elsewhere)
    const handleStorageChange = () => {
      checkLoginStatus()
    }

    window.addEventListener('storage', handleStorageChange)

    // Also check periodically in case token is removed in same window
    const interval = setInterval(checkLoginStatus, 1000)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      clearInterval(interval)
    }
  }, [])

  // ** Check registration status (only when not logged in)
  useEffect(() => {
    if (!isLoggedIn) {
      const checkRegistrationStatus = async () => {
        try {
          const response = await axios.get(
            `${process.env.API_BASE_URL}/api/v1/auction-setting/registration-status?t=${Date.now()}`,
            { headers: { 'Cache-Control': 'no-cache', Pragma: 'no-cache' } }
          )
          setRegistrationActive(response.data.registrationActive || false)
        } catch (err) {
          setRegistrationActive(false)
        }
      }

      checkRegistrationStatus()

      // Check registration status periodically
      const interval = setInterval(checkRegistrationStatus, 5000)

      return () => {
        clearInterval(interval)
      }
    } else {
      setRegistrationActive(false)
    }
  }, [isLoggedIn])

  // ** Handlers
  const handleLogout = () => {
    // Clear authorization token from localStorage
    localStorage.removeItem('authorization')
    setIsLoggedIn(false)

    // Redirect to login page
    router.push('/login')
  }

  // ** Check if route is active
  const isActive = path => {
    return router.pathname === path
  }

  // Show registration button if not logged in and registration is active
  if (!isLoggedIn) {
    return (
      <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
        {registrationActive && (
          <Link href='/registration' passHref>
            <StyledRegisterButton
              component='a'
              variant='contained'
              startIcon={<AccountPlus />}
              sx={{
                ...(hiddenSm && {
                  fontSize: '11px',
                  padding: '6px 10px'
                })
              }}
            >
              Register
            </StyledRegisterButton>
          </Link>
        )}
      </Box>
    )
  }

  return (
    <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <Box className='actions-left' sx={{ mr: 2, display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
        {navItems.map((item, index) => {
          const IconTag = item.icon
          const active = isActive(item.path)

          return (
            <Link key={index} href={item.path || '/'} passHref>
              <StyledNavButton
                component='a'
                className={active ? 'active' : ''}
                startIcon={<IconTag />}
                sx={{
                ...(hiddenSm && {
                  fontSize: '11px',
                  padding: '6px 10px',
                  marginRight: 0.5
                })
                }}
          >
                {item.title}
              </StyledNavButton>
            </Link>
          )
        })}
      </Box>
      <Box className='actions-right' sx={{ display: 'flex', alignItems: 'center' }}>
        <StyledLogoutButton
          variant='contained'
          startIcon={<LogoutVariant />}
          onClick={handleLogout}
          sx={{
            mr: 2,
            ...(hiddenSm && {
              fontSize: '11px',
              padding: '6px 10px'
            })
          }}
        >
          Logout
        </StyledLogoutButton>
      </Box>
    </Box>
  )
}

export default AppBarContent
