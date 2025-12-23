// ** React Imports
// import { useState } from 'react' // Removed - no longer needed

// ** MUI Imports
import { styled } from '@mui/material/styles'
import Box from '@mui/material/Box'

// ** Theme Config Import
import themeConfig from 'src/configs/themeConfig'

// ** Components
import AppBar from './components/vertical/appBar'
// import Navigation from './components/vertical/navigation' // Removed - sidebar no longer used
import Footer from './components/shared-components/footer'

const VerticalLayoutWrapper = styled('div')({
  height: '100%',
  display: 'flex'
})

const MainContentWrapper = styled(Box)({
  flexGrow: 1,
  minWidth: 0,
  display: 'flex',
  minHeight: '100vh',
  flexDirection: 'column'
})

const ContentWrapper = styled('main')(({ theme }) => ({
  flexGrow: 1,
  width: '100%',
  padding: theme.spacing(6),
  transition: 'padding .25s ease-in-out',
  [theme.breakpoints.down('sm')]: {
    paddingLeft: theme.spacing(4),
    paddingRight: theme.spacing(4)
  }
}))

const VerticalLayout = props => {
  // ** Props
  const { settings, children } = props

  // ** Vars
  const { contentWidth } = settings
  // const navWidth = themeConfig.navigationSize // Removed - no longer needed

  // ** States
  // const [navVisible, setNavVisible] = useState(false) // Removed - no longer needed

  // ** Toggle Functions
  // const toggleNavVisibility = () => setNavVisible(!navVisible) // Removed - no longer needed

  return (
    <>
      <VerticalLayoutWrapper className='layout-wrapper'>
        {/* Navigation sidebar removed - navigation items now in header */}
        <MainContentWrapper className='layout-content-wrapper'>
          <AppBar {...props} />

          <ContentWrapper
            className='layout-page-content'
            sx={{
              ...(contentWidth === 'boxed' && {
                mx: 'auto',
                '@media (min-width:1440px)': { maxWidth: 1440 },
                '@media (min-width:1200px)': { maxWidth: '100%' }
              })
            }}
          >
            {children}
          </ContentWrapper>

          <Footer {...props} />
        </MainContentWrapper>
      </VerticalLayoutWrapper>
    </>
  )
}

export default VerticalLayout
