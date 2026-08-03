import "../../styles/components/ChartToolbar.css";
import {
    FaChartLine,
    FaArrowRightArrowLeft,
    FaBullseye
} from "react-icons/fa6";

function ChartToolbar({ mode, setMode }) {

    return (

        <div className="chart-toolbar">

            <button
                className={mode === "categories" ? "active" : ""}
                onClick={() => setMode("categories")}
            >
                <FaChartLine />
            </button>

            <button
                className={mode === "overview" ? "active" : ""}
                onClick={() => setMode("overview")}
            >
                <FaArrowRightArrowLeft />
            </button>

            <button
                className={mode === "goals" ? "active" : ""}
                onClick={() => setMode("goals")}
            >
                <FaBullseye />
            </button>

        </div>

    );

}

export default ChartToolbar;