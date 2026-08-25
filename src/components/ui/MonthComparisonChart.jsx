import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import "../../styles/components/MonthComparisonChart.css";

function MonthComparisonChart({ transacoes }) {
    const now = new Date(); const current = now.getMonth(); const previous = current === 0 ? 11 : current - 1; const year = now.getFullYear();
    const totals = ["ALIMENTACAO", "TRANSPORTE", "LAZER", "ESTUDOS", "OUTROS"].map((categoria) => ({ name: categoria, atual: total(transacoes, categoria, year, current), anterior: total(transacoes, categoria, year - (current === 0 ? 1 : 0), previous) }));
    function total(items, categoria, targetYear, targetMonth) { return items.filter(item => item.tipo === "SAIDA" && item.categoria === categoria && item.data && new Date(`${item.data}T00:00:00`).getFullYear() === targetYear && new Date(`${item.data}T00:00:00`).getMonth() === targetMonth).reduce((sum, item) => sum + Number(item.valor), 0); }
    return <section className="month-comparison"><span className="chart-kicker">Tendência</span><h2>Este mês vs. mês anterior</h2><ResponsiveContainer width="100%" height={280}><BarChart data={totals}><CartesianGrid strokeDasharray="3 3" stroke="#2b3955" /><XAxis dataKey="name" stroke="#94a3b8" /><YAxis stroke="#94a3b8" /><Tooltip /><Legend /><Bar dataKey="atual" name="Atual" fill="#4f8cff" radius={[5, 5, 0, 0]} /><Bar dataKey="anterior" name="Anterior" fill="#64748b" radius={[5, 5, 0, 0]} /></BarChart></ResponsiveContainer></section>
}
export default MonthComparisonChart;