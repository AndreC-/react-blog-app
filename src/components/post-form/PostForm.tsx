import { useCallback, useEffect, useState } from "react";
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


export default function PostForm({post}:{post: postItem | Models.Document | undefined}){
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
    const [postInfo, setPostInfo] = useState(getValues("content"))

    useEffect(() => {
        if(post){
            setPostInfo(getValues("content"))
            console.log(postInfo)
            setValue("title", post.title)
            setValue("content", post.content)
            setValue("status", post.status)
            setValue("slug", post.$id)
        }
    }
    , [setValue, getValues, postInfo, post])

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
                defaultValue={postInfo}>
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