export default function importNoteFromJson(file) {
    return new Promise((resolve, reject) => {
        if (!file) {
            reject(new Error("Please select a JSON file"))
            return;
        }

        if (file.type !== "application/json" && !file.name.toLowerCase().endsWith(".json")) {
            reject(new Error("Please select a valid JSON file"));
            return;
        }

        const reader = new FileReader();

        reader.onload = (event) => {
            try {
                const data = JSON.parse(event.target.result);

                if (data.app !== "Memoza") {
                    reject(new Error("This file is not a valid Memoza export"));
                    return;
                }

                if (!data.note) {
                    reject(new Error("No note found in the imported file"));
                    return;
                }

                const note = data.note;

                if (typeof note.title !== "string" || typeof note.content !== "string") {
                    reject(new Error("Invalid note data"));
                    return;
                }

                resolve(note);
            } catch (error) {
                reject(new Error("Invalid JSON file"))
            }
        }

        reader.onerror = () => {
            reject(new Error("Failed to read the file"));
        }

        reader.readAsText(file);
    })
}