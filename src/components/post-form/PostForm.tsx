import { useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import Button from "../Button";
import Input from "../Input";
import RealTimeEditor from "../RealTimeEditor";
import SelectRef from "../Select";
import appwriteService from "../../appwrite/config"
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { RootState } from "../../store/store";
import { postItem } from "../../pages/Post";
import { Models } from "appwrite";
import Container from "../container/Container";


export default function PostForm({post}:{post: Models.Document | undefined}){
    const {register, handleSubmit, watch, setValue, getValues, control, formState:{errors}} = useForm<postItem>({
        defaultValues: {
            title: post?.title || "",
            slug: post?.slug || "",
            content: post?.content || "",
            status: post?.status || "active",
            image: post?.image || []
        }
    })

    const {pathname} = useLocation()
    const navigate = useNavigate()
    const userData = useSelector((state: RootState) => state.auth.userData)

    const submit = async(data: postItem) => {
        if (post) {
            const file = data.image[0] ? await appwriteService.uploadFile(data.image[0]) : null
            if (file){
                appwriteService.deleteFile(post.featuredImage)
            }
            const dbPost = await appwriteService.updatePost(post.$id, {...data, featuredImage: file ? file.$id : post.featuredImage})
            if (dbPost){
                navigate(`/post/${dbPost.$id}`)
            }
        }
        else{
            const file = await appwriteService.uploadFile(data.image[0])
            if (file){
                const fileId = file.$id;
                data.featuredImage = fileId
                const dbPost = await appwriteService.createPost({...data, userId: userData!.$id})
                if (dbPost){
                    navigate(`/post/${dbPost.$id}`)
                }
            }
        }

    }

    const slugTransform = useCallback((value: string | undefined) => {
        if (value && typeof value === 'string') {
            return value.trim().toLowerCase().replace(/[^a-zA-Z\d]+/g, '-').substring(0, 35)
        }
        return ""
    }, [])

    useEffect(() => {
        if (pathname == "/add-post"){
            watch((value, {name}) => {
                if (name === "title"){
                    setValue('slug', slugTransform(value.title), {shouldValidate: true})
                }
            })
        }
    }, [watch, slugTransform, setValue, pathname])

    if (post === undefined && pathname !== "/add-post"){
        return(
            <Container>
                <div className="flex flex-wrap justify-center relative top-32">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <h1>Loading blog post</h1>
                </div>
            </Container>
        )
    }
    if (post !== undefined) {
        setValue("content", post.content)
        setValue("title", post.title)
        setValue("status", post.status)
        setValue("slug", post.$id)
    }
    return (
        <form onSubmit={handleSubmit(submit)}
        className="flex flex-wrap"
        >
            <p className="text-lg w-full pb-5">Fields marked with * are required</p>
            <div className="w-2/3 px-2">
                <Input
                label="Title *"
                placeholder="Title"
                className="mb-4"
                {...register("title", {required: {value:true, message:"Title is required"}})}>
                {errors.title && <p className="text-red-500">{errors.title.message}</p>}
                </Input>
                <Input
                label="Slug *"
                placeholder="Slug"
                className="mb-4"
                readOnly={post ? true : false}
                {...register("slug", {required: {value:true, message:"Slug is required"}, maxLength: {value:36, message:"Max length of slug reached"}})}
                onInput={(e) => {
                    setValue("slug", slugTransform(e.currentTarget.value), {shouldValidate: true})
                }}>
                    {errors.slug && <p className="text-red-500">{errors.slug.message}</p>}
                </Input>
                <RealTimeEditor
                label="Content *"
                name="content"
                control={control}
                defaultValue={getValues("content")}>
                    {errors.content && <p className="text-red-500">{errors.content.message}</p>}
                </RealTimeEditor>
            </div>
            <div className="w-1/3 px-2">
                <Input
                label="Featured Image * "
                type="file"
                className="mb-4"
                accept="image/png, image/jpg, image/jpeg"
                {...register("image", {required: {value: !post, message:"Featured Image is required"}})}>
                    {errors.image && <p className="text-red-500">{errors.image.message}</p>}
                </Input>
                {post && (
                    <div className="w-full mb-4">
                        <img src={appwriteService.getFilePreview(post.featuredImage)} alt={post.title} className="rounded-lg"/>
                    </div>
                )}
                <SelectRef
                options={["active", "inactive"]}
                label="Status"
                className="mb-4"
                required
                {...register("status", {required: true})}
                />
                <Button type="submit" bgColour={post ? "bg-green-500" : "bg-blue-500"} className="w-full">
                    {post ? "Update" : "Submit"}
                </Button>
            </div>
        </form>
    )
}