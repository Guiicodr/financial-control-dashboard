import "../../styles/ui/ProgressBar.css"

function ProgressBar({

    value = 0,

    color = "primary",

    height = "10px"

}) {

    const percentage = Math.min(Math.max(value, 0), 100)

    return (

        <div
            className="progress"
            style={{ height }}
        >

            <div

                className={`progress-fill ${color}`}

                style={{
                    width: `${percentage}%`
                }}

            />

        </div>

    )

}

export default ProgressBar