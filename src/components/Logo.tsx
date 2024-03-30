import blogLogo from "../assets/Blog_logo.png"

export default function Logo({width = '80px', borderRadius='50%'}){
    return (
        <img src={blogLogo} style={{width, borderRadius}} alt='Logo placeholder'/>
    )
}