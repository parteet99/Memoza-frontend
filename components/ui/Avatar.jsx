import React, { useState } from "react";

function getInitials(name) {
    if (!name) return "?";
    const parts = name.trim().split(" ").filter(Boolean);
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

// Generates a consistent background color based on the name
function getColorFromName(name) {
    const colors = [
        "#F87171", "#FBBF24", "#34D399", "#60A5FA",
        "#A78BFA", "#F472B6", "#38BDF8", "#4ADE80",
    ];
    if (!name) return colors[0];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
}

export default function Avatar({ src, name, size = 112, className = "" }) {
    const [imgError, setImgError] = useState(false);
    const showImage = src && !imgError;

    return (
        <div
            className={`rounded-full ring-4 ring-muted overflow-hidden flex items-center justify-center ${className}`}
            style={{
                width: size,
                height: size,
                backgroundColor: showImage ? "transparent" : getColorFromName(name),
            }}
        >
            {showImage ? (
                <img
                    src={src}
                    alt={name}
                    onError={() => setImgError(true)}
                    className="h-full w-full object-cover"
                />
            ) : (
                <span
                    className="font-medium text-white select-none"
                    style={{ fontSize: size * 0.35 }}
                >
                    {getInitials(name)}
                </span>
            )}
        </div>
    );
}