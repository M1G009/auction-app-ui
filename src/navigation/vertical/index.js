// ** Icon imports
import HomeOutline from 'mdi-material-ui/HomeOutline'
import AccountCogOutline from 'mdi-material-ui/AccountCogOutline'

const navigation = () => {
  return [
    {
      title: 'Dashboard',
      icon: HomeOutline,
      path: '/'
    },
    {
      title: 'Players',
      icon: AccountCogOutline,
      path: '/players'
    },
    {
      title: 'Teams',
      icon: AccountCogOutline,
      path: '/team'
    }
  ]
}

export default navigation
