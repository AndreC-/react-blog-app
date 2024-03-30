import { useAppDispatch } from "../../store/hooks"
import authService from "../../appwrite/auth"
import { logout } from "../../store/authSlice"

export default function LogoutBtn(){
    const dispatch = useAppDispatch()

    const logoutHandler = () => {
        authService.logout().then(() => {
            dispatch(logout())
        })
    }

    return (
        <button
        className='inline-block px-6 py-2 duration-200 hover:bg-blue-900 rounded-full'
        onClick={logoutHandler}>
            Logout
        </button>
    )
}