import {
    ResponsiveContainer,
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid
} from "recharts";

import { useState } from "react";

import "../../styles/components/FinancialChart.css";

import ChartToolbar from "./ChartToolbar";

function FinancialChart(){

    const [mode,setMode]=useState("categories");

    const chartData = [
        {
            month:"Jan",
            food:420,
            transport:180,
            leisure:220,
            education:90,
            others:120,
            income:3200,
            expenses:1030,
            balance:2170
        },
        {
            month:"Feb",
            food:510,
            transport:200,
            leisure:170,
            education:150,
            others:80,
            income:3500,
            expenses:1110,
            balance:2390
        },
        {
            month:"Mar",
            food:620,
            transport:210,
            leisure:320,
            education:180,
            others:130,
            income:3800,
            expenses:1460,
            balance:2340
        },
        {
            month:"Apr",
            food:540,
            transport:260,
            leisure:200,
            education:140,
            others:160,
            income:3900,
            expenses:1300,
            balance:2600
        }
    ];

    return(

        <section className="financial-chart">

            <div className="chart-header">

                <div>

                    <h2>Financial Analytics</h2>

                    <span>
                        Visualize your financial evolution
                    </span>

                </div>

            </div>

            <div className="chart-content">

                <ChartToolbar
                    mode={mode}
                    setMode={setMode}
                />

                <div className="chart-area">

                    <ResponsiveContainer
                        width="100%"
                        height={380}
                    >

                        <LineChart data={chartData}>

                            <CartesianGrid
                                stroke="#243041"
                                strokeDasharray="4 4"
                            />

                            <XAxis
                                dataKey="month"
                                stroke="#8EA2C0"
                            />

                            <YAxis
                                stroke="#8EA2C0"
                            />

                            <Tooltip />

                            {
                                mode==="categories" && (
                                    <>
                                        <Line
                                            dataKey="food"
                                            stroke="#4F8CFF"
                                            strokeWidth={3}
                                        />

                                        <Line
                                            dataKey="transport"
                                            stroke="#22C55E"
                                            strokeWidth={3}
                                        />

                                        <Line
                                            dataKey="leisure"
                                            stroke="#F59E0B"
                                            strokeWidth={3}
                                        />

                                        <Line
                                            dataKey="education"
                                            stroke="#EC4899"
                                            strokeWidth={3}
                                        />

                                        <Line
                                            dataKey="others"
                                            stroke="#A855F7"
                                            strokeWidth={3}
                                        />
                                    </>
                                )
                            }

                            {
                                mode==="overview" && (
                                    <>
                                        <Line
                                            dataKey="income"
                                            stroke="#22C55E"
                                            strokeWidth={3}
                                        />

                                        <Line
                                            dataKey="expenses"
                                            stroke="#EF4444"
                                            strokeWidth={3}
                                        />

                                        <Line
                                            dataKey="balance"
                                            stroke="#4F8CFF"
                                            strokeWidth={3}
                                        />
                                    </>
                                )
                            }

                        </LineChart>

                    </ResponsiveContainer>

                </div>

            </div>

        </section>

    )

}

export default FinancialChart;