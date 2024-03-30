import { ReactElement } from "react";

export default function Container({children}: {children:ReactElement}){
    return (
        <div className="w-full max-w-7xl mx-auto px-4">
            {children}
        </div>
    )
}