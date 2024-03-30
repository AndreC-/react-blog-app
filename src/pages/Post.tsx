import { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import appwriteService from "../appwrite/config.ts"
import Button from "../components/Button.tsx"
import Container from "../components/container/Container.tsx"
import parse from "html-react-parser"
import { useSelector } from "react-redux"
import { RootState } from "../store/store"
import { Models } from "appwrite"

export default function Post(){

    const [post, setPost] = useState<postItem | Models.Document>()

    const {slug} = useParams()
    const navigate = useNavigate()
    const userData = useSelector((state: RootState) => state.auth.userData)

    const isAuthor = post && userData ? post.userId === userData.$id : false

    useEffect(() => {
        if (slug) {
            appwriteService.getPost(slug).then((post) => {
                if(post){
                    setPost(post)
                }
                else{
                    navigate('/')
                }
            })
        }
    }, [slug, navigate])

    const deletePost = () => {
        appwriteService.deletePost(post!.$id).then((status) => {
            if (status){
                appwriteService.deleteFile(post!.featuredImage);
                navigate("/")
            }
        })
    }

    return post ? (
        <div className="py-8">
            <Container>
                <div className="w-full flex justify-center mb-4 relative border rounded-xl p-2 flex-wrap">
                    <img src={appwriteService.getFilePreview(post.featuredImage)} alt={post.title} className="rounded-xl"/>
                    {isAuthor && (
                        <div className="absolute right-6 top-6">
                            <Link to={`/edit-post/${post.$id}`}>
                                <Button bgColour="bg-green-500" className="mr-3">Edit</Button>
                            </Link>
                            <Button bgColour="bg-red-500" onClick={deletePost}>Delete</Button>
                        </div>
                    )}
                    <div className="w-full mb-6">
                        <h1 className="text-2xl font-bold">{post.title}</h1>
                        <div className="browser-css">
                            {parse(post.content)}
                        </div>
                    </div>
                </div>
            </Container>
        </div>
    ) : null
}
export type postItem = Models.Document & {
    content: string,
    featuredImage: string,
    status: string,
    title: string,
    userId: string,
    slug: string,
    image: File[]
}
