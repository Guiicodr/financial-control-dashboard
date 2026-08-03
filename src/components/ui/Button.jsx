import "../../styles/ui/Button.css"

function Button({

    children,

    variant = "primary",

    type = "button",

    onClick,

    className = ""

}){

    return(

        <button

            type={type}

            onClick={onClick}

            className={`btn btn-${variant} ${className}`}

        >

            {children}

        </button>

    )

}

export default Button