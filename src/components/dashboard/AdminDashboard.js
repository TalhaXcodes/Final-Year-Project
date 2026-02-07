import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer
} from "recharts";

export default function AdminDashboard() {
    const [responses, setResponses] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const snap = await getDocs(collection(db, "questionnaireResponses"));
            setResponses(snap.docs.map(doc => doc.data()));
        };
        fetchData();
    }, []);

    const total = responses.length;
    const packagingCount = responses.filter(
        r => r.packaging && r.packaging.toLowerCase() !== "no"
    ).length;


    // build chart data
    const personalityMap = {};
    responses.forEach(r => {
        personalityMap[r.personality] = (personalityMap[r.personality] || 0) + 1;
    });

    const chartData = Object.keys(personalityMap).map(key => ({
        name: key,
        count: personalityMap[key]
    }));
console.log(responses[0]?.packaging);

    return (
        <div className="min-h-screen bg-rose-50 p-6">
            <h1 className="text-3xl font-bold text-rose-600 mb-6">
                BASKETRIES Analytics Dashboard
            </h1>

            <div className="grid md:grid-cols-3 gap-6 mb-10">
                <div className="bg-white rounded-xl p-6 shadow border">
                    <h2 className="text-xl font-semibold">Total Responses</h2>
                    <p className="text-3xl font-bold">{total}</p>
                </div>

                <div className="bg-white rounded-xl p-6 shadow border">
                    <h2 className="text-xl font-semibold">Packaging Selected</h2>
                    <p className="text-3xl font-bold">{packagingCount}</p>
                </div>

                <div className="bg-white rounded-xl p-6 shadow border">
                    <h2 className="text-xl font-semibold">System Status</h2>
                    <p className="text-green-600 font-bold">Live & Secure</p>
                </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow border">
                <h2 className="text-xl font-semibold mb-4 text-rose-600">
                    Personality Distribution
                </h2>

                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={chartData}>
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="count" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
