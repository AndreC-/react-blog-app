import { ReactNode, forwardRef, useId } from "react";

interface InputProps extends React.ComponentProps<'input'>{
    label: string
    children?: ReactNode
}

const Input = forwardRef<HTMLInputElement, InputProps>(function Input({
    type = "text",
    label,
    className = '',
    children,
    ...props
    },
    ref: React.RefAttributes<HTMLInputElement>["ref"] ){
        const id = useId()
        return (
            <div className="w-full">
                <div className="flex">
                    {label && (
                        <label htmlFor={id} className="inline-block mb-1 pl-1">
                            {label}
                        </label>
                    )}
                    &nbsp;
                    {children}
                </div>
                <input
                className={`px-3 py-2 rounded-lg bg-white text-black outline-none focus:bg-gray-50 duration-200 border border-gray-200 w-full ${className}`}
                type={type}
                ref={ref}
                {...props}
                id={id}></input>
            </div>
        )
    })

export default Input