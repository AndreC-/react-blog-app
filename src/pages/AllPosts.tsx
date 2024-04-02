import { useEffect, useState } from "react"
import appwriteService from "../appwrite/config"
import Container from "../components/container/Container"
import PostCard from "../components/PostCard"
import { postItem } from "./Post"
import { useSelector } from "react-redux"
import { RootState } from "../store/store"

export default function AllPosts(){

    const [posts, setPosts] = useState<postItem[]>()
    const userData = useSelector((state: RootState) => state.auth.userData)

    useEffect(() => {
        appwriteService.getPosts([]).then((posts) => {
            if(posts){
                setPosts(posts.documents)
            }
        })
    }, [])


    if (posts === undefined){
        return(
            <Container>
                <div className="flex flex-wrap justify-center relative top-32">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <h1>Loading blog posts</h1>
                </div>
            </Container>
        )
    }

    if (posts.length === 0){
        return (
            <div className="w-full py-8">
            <Container>
                <div className="flex flex-wrap">
                    <h1>There are no posts to read. Click "Add Post" to create one.</h1>
                </div>
            </Container>
        </div>
        )
    }

    return (
        <div className="w-full py-8">
            <Container>
                <div className="flex flex-wrap">
                    {
                        posts.map((post) => {
                            const isAuthor = post && userData ? post.userId === userData.$id : false
                            if (post.status === 'active' || isAuthor){
                                return (
                                    <div className="p-2 md:w-1/3 lg:w-1/4" key={post.$id}>
                                        <PostCard {...post}/>
                                    </div>
                                )
                            }
                        })
                    }
                </div>
            </Container>
        </div>
    )
}