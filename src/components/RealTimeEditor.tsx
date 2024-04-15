import { Control, Controller } from "react-hook-form"
import { Editor } from "@tinymce/tinymce-react"
import conf from "../conf/conf"
import { postItem } from "../pages/Post"
import { ReactNode } from "react"

export default function RealTimeEditor({children, name, control, label, defaultValue}:{control: Control<postItem>, label: string, defaultValue: string, name:string, children: ReactNode}){
    return (
        <div className="w-full">
            <div className="flex">
            {
                label && <label className="mb-1 pl-1">{label}</label>
            }
            &nbsp;
            {children}
            </div>
            <Controller
            name={name}
            control={control}
            rules={{maxLength: {value: 1000, message: "Max character limit reached"}, required: {value:true, message:"Content is required"}}}
            render={({field: {onChange}} ) => (
                <Editor
                apiKey={conf.tinymceApiKey}
                initialValue={defaultValue}
                value={defaultValue}
                init={{
                    branding: false,
                    height: 500,
                    menubar: true,
                    plugins: [
                        'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                        'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                        'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
                      ],
                      toolbar: 'undo redo | blocks | ' +
                      'bold italic forecolor | alignleft aligncenter ' +
                      'alignright alignjustify | bullist numlist outdent indent | ' +
                      'removeformat | help',
                    content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
                }}
                onEditorChange={onChange}
                />
            )}
            />
        </div>
    )
}