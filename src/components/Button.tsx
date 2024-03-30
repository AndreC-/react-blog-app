interface ButtonProps extends React.ComponentProps<'button'> {
    bgColour?: string,
    textColour?: string
}

const Button: React.FC<ButtonProps> = ({
    bgColour = "bg-blue-600",
    textColour = "text-white",
    className,
    type = "button",
    children,
    onClick,
}) => {
    return (
        <button
        className={`px-4 py-2 rounded-lg ${bgColour} ${textColour} ${className}`}
        type={type}
        onClick={onClick}>
            {children}
        </button>
    )
}

export default Button