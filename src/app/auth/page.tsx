export default function AuthPage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-neutral-50 px-6">
            <div className="max-w-md w-full bg-white p-10 rounded-3xl shadow-xl border border-neutral-100">
                <h2 className="text-3xl font-black uppercase tracking-tighter mb-2">Welcome to Sobre</h2>
                <p className="text-sm text-neutral-500 mb-8 font-medium">Join the community of future-mapped students.</p>

                <button 
                    onClick={signInWithGoogle}
                    className="w-full flex items-center justify-center gap-3 py-3 border border-neutral-200 rounded-xl font-bold text-sm hover:bg-neutral-50 transition-all magnetic"
                >
                    <GoogleIcon className="w-5 h-5" />
                    Continue with Google
                </button>

                <div className="relative my-8">
                    <hr className="border-neutral-100" />
                    <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-4 text-[10px] font-bold text-neutral-300 uppercase tracking-widest">Or email</span>
                </div>

                <form className="space-y-4">
                    <input 
                        type="email" 
                        placeholder="your@email.com" 
                        className="w-full px-4 py-3 rounded-xl bg-neutral-50 border border-neutral-100 focus:border-mint-dark outline-none transition-all text-sm font-medium"
                    />
                    <button className="w-full py-4 bg-neutral-950 text-white rounded-xl font-black uppercase tracking-widest text-xs hover:bg-mint-dark transition-colors shadow-lg shadow-mint-dark/20">
                        Send Magic Link
                    </button>
                </form>

                <p className="mt-8 text-[10px] text-center text-neutral-400 font-medium px-6">
                    By continuing, you agree to Sobre&apos;s <span className="underline italic">Terms of Service</span> and <span className="underline italic">Privacy Policy</span>.
                </p>
            </div>
        </div>
    );
}