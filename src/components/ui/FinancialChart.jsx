import { useEffect, useState } from "react";
import {
    ResponsiveContainer,
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    Legend
} from "recharts";
import { buscarGastosMensais } from "../../services/api";
import "../../styles/components/FinancialChart.css";

function FinancialChart() {
    const [dados, setDados] = useState([]);

    useEffect(() => {
        buscarGastosMensais().then((response) => {
            console.log("Dados do Gráfico recebidos da API:", response);
            setDados(response || []);
        });
    }, []);

    return (
        <section className="financial-chart">
            <div className="chart-header">
                <div>
                    <h2>Monthly Expense Analysis</h2>
                    <span>Spending by category throughout the year</span>
                </div>
            </div>

            <div className="chart-content">
                <ResponsiveContainer width="100%" height={260}>
                    <LineChart data={dados}>
                        <CartesianGrid stroke="#243041" strokeDasharray="4 4" />
                        <XAxis dataKey="month" stroke="#8EA2C0" />
                        <YAxis stroke="#8EA2C0" />
                        <Tooltip
                            contentStyle={{ backgroundColor: "#1E293B", borderColor: "#334155", color: "#FFF" }}
                        />
                        <Legend />

                        <Line
                            type="monotone"
                            dataKey={dados[0]?.Food !== undefined ? "Food" : "food"}
                            name="Food"
                            stroke="#3B82F6"
                            strokeWidth={3}
                            dot={{ fill: "#3B82F6", r: 4 }}
                        />

                        <Line
                            type="monotone"
                            dataKey={dados[0]?.Transport !== undefined ? "Transport" : "transport"}
                            name="Transport"
                            stroke="#10B981"
                            strokeWidth={3}
                            dot={{ fill: "#10B981", r: 4 }}
                        />

                        <Line
                            type="monotone"
                            dataKey={dados[0]?.Leisure !== undefined ? "Leisure" : "leisure"}
                            name="Leisure"
                            stroke="#F59E0B"
                            strokeWidth={3}
                            dot={{ fill: "#F59E0B", r: 4 }}
                        />

                        <Line
                            type="monotone"
                            dataKey={dados[0]?.Education !== undefined ? "Education" : "education"}
                            name="Education"
                            stroke="#EC4899"
                            strokeWidth={3}
                            dot={{ fill: "#EC4899", r: 4 }}
                        />

                        <Line
                            type="monotone"
                            dataKey={dados[0]?.Others !== undefined ? "Others" : "others"}
                            name="Others"
                            stroke="#8B5CF6"
                            strokeWidth={3}
                            dot={{ fill: "#8B5CF6", r: 4 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </section>
    );
}

export default FinancialChart;