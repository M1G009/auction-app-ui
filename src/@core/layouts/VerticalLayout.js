import { useRouter } from 'next/router'

import { styled } from '@mui/material/styles'
import Box from '@mui/material/Box'

import AppBar from './components/vertical/appBar'
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
  const router = useRouter()
  const { settings, children } = props
  const { contentWidth } = settings
  const isAuctionPage = router.pathname === '/auction'

  return (
    <>
      <VerticalLayoutWrapper className='layout-wrapper'>
        <MainContentWrapper className='layout-content-wrapper'>
          {!isAuctionPage && <AppBar {...props} />}

          <ContentWrapper
            className='layout-page-content'
            sx={{
              ...(isAuctionPage && { padding: 0 }),
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
