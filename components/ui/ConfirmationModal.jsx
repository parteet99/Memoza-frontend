"use client";

export default function ConfirmationModal({
    isOpen,
    title,
    message,
    actionText = "Confirm",
    cancelText = "Cancel",
    onAction,
    onCancel
}) {
    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm"
            onClick={onCancel}
        >
            <div
                className="w-full max-w-sm rounded-xl border border-gray-200 bg-white p-5 shadow-xl dark:border-gray-700 dark:bg-gray-900"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Content */}
                <div>
                    <h2 className="text-base font-semibold text-gray-900 dark:text-white">
                        {title}
                    </h2>

                    <p className="mt-2 text-sm leading-5 text-gray-500 dark:text-gray-400">
                        {message}
                    </p>
                </div>

                {/* Actions */}
                <div className="mt-5 flex justify-end gap-2">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                    >
                        {cancelText}
                    </button>

                    <button
                        type="button"
                        onClick={onAction}
                        className="rounded-lg bg-black px-3 py-2 text-sm font-medium text-white transition hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200"
                    >
                        {actionText}
                    </button>
                </div>
            </div>
        </div>
    );
}