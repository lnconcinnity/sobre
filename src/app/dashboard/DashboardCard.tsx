
export default function DashboardCard({ title, count, children }: { title: string, count: number, children: React.ReactNode }) {
    return (
        <div className="bg-white p-6 rounded-3xl border border-black/5 shadow-xs">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-neutral-400">{title}</h3>
                <span className="text-[10px] font-bold bg-neutral-100 px-2 py-0.5 rounded-full">{count}</span>
            </div>
            {children}
        </div>
    );
}