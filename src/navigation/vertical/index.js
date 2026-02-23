// ** Icon imports
import HomeOutline from 'mdi-material-ui/HomeOutline'
import AccountCogOutline from 'mdi-material-ui/AccountCogOutline'
import CogOutline from 'mdi-material-ui/CogOutline'
import Gavel from 'mdi-material-ui/Gavel'

const navigation = () => {
  return [
    {
      title: 'Dashboard',
      icon: HomeOutline,
      path: '/'
    },
    {
      title: 'Auction',
      icon: Gavel,
      path: '/auction'
    },
    {
      title: 'Players',
      icon: AccountCogOutline,
      path: '/players'
    },
    {
      title: 'Settings',
      icon: CogOutline,
      path: '/settings'
    },
    {
      title: 'Pending Registrations',
      icon: AccountCogOutline,
      path: '/temp-users'
    }
  ]
}

export default navigation
