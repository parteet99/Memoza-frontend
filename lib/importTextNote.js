export default async function importNoteFromText(file) {
    if (!file) {
        throw new Error("Please select a text file");
    }
    if (file.type !== "text/plain" && !file.name.toLowerCase().endsWith(".txt")) {
        throw new Error("Please select a valid text file")
    }

    try {
        const content = await file.text();

        if (!content.trim()) {
            onError("The text file is empty")
            return;
        }

        const title = file.name.replace(/\.txt$/i, "");

        return {
            title,
            content,
            is_pinned: false,
            is_favorite: false,
            is_archived: false
        }
    } catch (error) {
        throw new Error("Failed to read the text file");
    }
}