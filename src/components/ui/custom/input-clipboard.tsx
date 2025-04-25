import React, { useState } from 'react';
import { Copy } from 'lucide-react';
import { cn } from '@/lib/utils';


export function CopyButton({value}: {value: string}) {

    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(value);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Copy failed:', err);
        }
    };
    return (
        <button
            onClick={handleCopy}
            className="absolute right-2 p-1 text-gray-500 hover:text-black"
            title={copied ? 'Copied!' : 'Copy to clipboard'}
            type="button"
        >
            <Copy size={18} />
        </button>
    )
}

type CopyInputProps = {
    value: string;
    placeholder?: string;
    disabled?: boolean;
    onChange?: (value: string) => void;
    className?: string;
};

export default function CopyInput({
    value,
    placeholder = 'Enter text...',
    disabled = true,
    onChange,
    className,
}: CopyInputProps) {

    return (
        <div className={cn("relative flex items-center w-full", className)}>
            <input
                type="text"
                className="w-full pr-10 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={disabled ? undefined : value}
                placeholder={placeholder}
                disabled={disabled}
                onChange={(e) => onChange?.(e.target.value)}
            />
            <CopyButton value={value} />
        </div>
    );
}
