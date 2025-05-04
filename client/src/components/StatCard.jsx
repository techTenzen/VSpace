// components/StatCard.jsx
export default function StatCard({ label, value }) {
    return (
        <div className="bg-[#232a36] rounded-xl shadow-md p-6 flex flex-col items-center min-w-[140px]">
            <span className="text-3xl font-bold text-[#ff9100]">{value}</span>
            <span className="text-sm text-[#b0b8c1] mt-2">{label}</span>
        </div>
    );
}
