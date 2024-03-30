import Container from '../container/Container'
import Logo from '../Logo'
import { Link, useNavigate } from 'react-router-dom'
import LogoutBtn from './LogoutBtn'
import { RootState } from '../../store/store'
import { useSelector } from 'react-redux'

export default function Header() {

    const authStatus = useSelector((state: RootState) => state.auth.status)

    const navigate = useNavigate()

    const navItems = [
        {
            name: 'Home',
            slug: '/',
            active: authStatus
        },
        {
            name: 'Login',
            slug: '/login',
            active: !authStatus
        },
        {
            name: 'Signup',
            slug: '/signup',
            active: !authStatus
        },
        {
            name: 'All Posts',
            slug: '/all-posts',
            active: authStatus,
        },
        {
            name: 'Add Post',
            slug: '/add-post',
            active: authStatus
        }
    ]

    return (
        <header className='py-3 shadow bg-blue-700 text-white'>
            <Container>
                <nav className='flex'>
                    <div className='mr-auto'>
                        <Link to='/'>
                            <Logo/>
                        </Link>
                    </div>
                    <ul className='m1-auto my-auto flex justify-end'>
                        {
                            navItems.map((item) => item.active ? (
                            <li key={item.name}>
                                <button onClick={() => navigate(item.slug)} className='inline-block px-4 py-2 duration-200 hover:bg-blue-900 rounded-full'>
                                    {item.name}
                                </button>
                            </li>) : null)
                        }
                        {authStatus && (
                            <li>
                                <LogoutBtn  />
                            </li>
                        )}
                    </ul>

                </nav>
            </Container>
        </header>
    )
}