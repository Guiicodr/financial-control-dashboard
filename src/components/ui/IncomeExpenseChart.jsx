import {
    Cell,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    Legend,
} from "recharts";
import "../../styles/components/IncomeExpenseChart.css";

function IncomeExpenseChart({ totalRendas, totalSaidas }) {
    const data = [
        { name: "Receitas", value: Number(totalRendas), color: "#22c55e" },
        { name: "Despesas", value: Number(totalSaidas), color: "#ef4444" },
    ];

    return (
        <section className="income-expense-chart">
            <div className="chart-section-heading">
                <div>
                    <span className="chart-kicker">Visão mensal</span>
                    <h2>Receitas vs. despesas</h2>
                </div>
                <span className="chart-total">R$ {(Number(totalRendas) - Number(totalSaidas)).toLocaleString("pt-BR", { minimumFractionDigits: 2 })} disponíveis</span>
            </div>
            <div className="income-expense-chart-content">
                <ResponsiveContainer width="100%" height={270}>
                    <PieChart>
                        <Pie data={data} dataKey="value" nameKey="name" innerRadius={72} outerRadius={104} paddingAngle={4} stroke="none">
                            {data.map((entry) => <Cell key={entry.name} fill={entry.color} />)}
                        </Pie>
                        <Tooltip formatter={(value) => `R$ ${Number(value).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`} />
                        <Legend verticalAlign="bottom" iconType="circle" />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </section>
    );
}

export default IncomeExpenseChart;
