import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import appwriteService from "../appwrite/config"
import Container from "../components/container/Container"
import PostForm from "../components/post-form/PostForm"
import { Models } from "appwrite"

export default function EditPost(){

    const [post, setPost] = useState<Models.Document>()
    const {slug} = useParams()
    const navigate = useNavigate()

    useEffect(() => {
        if(slug){
            appwriteService.getPost(slug).then((post) => {
                if(post){
                    setPost(post)
                }
                else{
                    navigate("/")
                }
            })
        }
    }, [slug, navigate])

    return (
        <div className="py-6">
            <Container>
                <PostForm post={post}/>
            </Container>
        </div>
    )
}