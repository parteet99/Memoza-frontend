export function exportNoteAsJson(note) {
    const exportData = {
        app: "Memoza",
        version: 1,
        exportedAt: new Date().toISOString(),
        note: {
            title: note.title,
            content: note.content,
            is_pinned: note.is_pinned,
            is_favorite: note.is_favorite,
            is_archived: note.is_archived,
            created_at: note.created_at,
            updated_at: note.updated_at
        }
    }

    const jsonString = JSON.stringify(exportData, null, 2);

    const blob = new Blob([jsonString], {
        type: "application/json"
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `${note.title || "memoza-note"}.json`;

    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}


export function exportNoteAsText(note) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(note.content || "", "text/html");

    const textContent = doc.body.innerText || "";
    const text = `${note.title || "Untitled note"} 
    
    ${textContent}
    -------------------------------------
    Exported from Memoza
    Exported At: ${new Date().toLocaleString()}`

    const blob = new Blob([text], {
        type: "text/plain;charset=utf-8"
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `${note.title || "memoza-note"}.txt`;

    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}