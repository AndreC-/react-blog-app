import conf from "../conf/conf";
import { Client, Databases, Storage, Query, ID, Models } from "appwrite";
import { postItem } from "../pages/Post";


export class Service {
    client: Client = new Client()
    databases: Databases;
    bucket: Storage;

    constructor(){
        this.client.setEndpoint(conf.appwriteUrl).setProject(conf.appwriteProjectId)
        this.databases = new Databases(this.client);
        this.bucket = new Storage(this.client);
    }

    async getPost(slug:string): Promise<Models.Document | undefined>{
        try{
            return await this.databases.getDocument(conf.appwriteDatabaseId, conf.appwriteCollectionId, slug)
        }
        catch(error){
            console.log("Appwrite service :: getPost() :: ", error)
            return undefined
        }
    }

    async getPosts(queries=[Query.equal("status", "active")]){
        try{
            return await this.databases.listDocuments<postItem>(conf.appwriteDatabaseId, conf.appwriteCollectionId, queries)
        }
        catch(error){
            console.log("Appwrite service :: getPosts() :: ", error)
            return false
        }
    }

    async createPost(
        {
            title,
            slug,
            content,
            featuredImage,
            status,
            userId
        }:{
            title:string,
            slug: string,
            content: string,
            featuredImage: string,
            status: string,
            userId: string
        }){
        try {
            return await this.databases.createDocument(
                conf.appwriteDatabaseId, conf.appwriteCollectionId, slug, {title, content, featuredImage, status, userId}
            )
        }
        catch(error){
            console.log("Appwrite service :: createPost() :: ", error)
            return false
        }
    }

    async updatePost(slug: string, {title, content, featuredImage, status}:{title: string, content: string, featuredImage: string, status: string}){
        try {
            return await this.databases.updateDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                slug,
                {title, content, featuredImage, status}
            )
        }
        catch(error){
            console.log("Appwrite service :: updatePost() :: ", error)
            return false
        }
    }

    async deletePost(slug: string){
        try {
            await this.databases.deleteDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                slug,
            )
            return true;
        }
        catch(error){
            console.log("Appwrite service :: deletePost() :: ", error)
            return false;
        }
    }

    // Storage

    async uploadFile(file: File){
        try{
            return await this.bucket.createFile(conf.appwriteBucketId, ID.unique(), file)
        }
        catch(error){
            console.log("Appwrite service :: uploadFile() :: ", error)
            return false;
        }
    }

    async deleteFile(fileId:string){
        try {
            await this.bucket.deleteFile(conf.appwriteBucketId, fileId)
            return true;
        }
        catch(error){
            console.log("Appwrite service :: deleteFile() :: ", error)
            return false;
        }
    }

    getFilePreview(fileId: string){
        return this.bucket.getFilePreview(conf.appwriteBucketId, fileId).href
    }
}

const service = new Service()
export default service
