"use client"

import { useRouter, useSearchParams } from "next/navigation";

export default function Pagination({ currentPage, totalPages }) {
    const router = useRouter();
    const searchParams = useSearchParams();

    if (totalPages <= 1) {
        return null;
    }

    const handlePageChange = (page) => {
        const params = new URLSearchParams(searchParams.toString());

        params.set("page", page);

        router.push(`?${params.toString()}`);
    }

    return (
        <div className="mt-8 flex items-center justify-center gap-4">
            <button
                type="button"
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
                className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 cursor-pointer"
            >
                Previous
            </button>

            <span className="text-sm text-gray-600 dark:text-gray-400">
                Page {currentPage} of {totalPages}
            </span>

            <button
                type="button"
                disabled={currentPage === totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
                className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 cursor-pointer"
            >
                Next
            </button>
        </div>
    )
}