export function getImageUrl(path) {
    if (!path) return `/default-avatar.png`
    
    return `${process.env.NEXT_PUBLIC_BASE_URL}${path}`;
}