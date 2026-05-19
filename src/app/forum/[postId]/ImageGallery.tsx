import Image from "next/image";

export default function ImageGallery ({ attachments, onOpen }: { attachments: string[], onOpen: (url: string) => void }) {
    if (!attachments || attachments.length === 0) return null;
    return (
        <div className="flex flex-wrap gap-3 mt-6">
            {attachments.map((url, i) => (
                <button 
                    key={i} 
                    onClick={() => onOpen(url)}
                    className="magnetic cursor-pointer size-20 rounded-xl overflow-hidden border border-neutral-200 hover:opacity-80 transition-opacity relative"
                >
                    <Image src={url} alt="Attachment" className="object-cover" fill />
                </button>
            ))}
        </div>
    );
};