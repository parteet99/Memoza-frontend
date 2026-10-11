"use client"

import DashboardWish from "./DashboardWish"
import DashboardShortcuts from "./DashboardShortcuts"
import DashboardCount from "./DashboardCount"
import DashboardPinnedNote from "./DashboardPinnedNote"
import DashboardRecentNotes from "./DashboardRecentNotes"

export default function Dashboard() {
    return (
        <>
            <div className="grid grid-cols-1 p-2">
                <DashboardWish />
            </div> 
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 px-2 py-1">
                <DashboardShortcuts />
                <DashboardCount />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 px-2 py-1">
                <DashboardPinnedNote />
                <DashboardRecentNotes />
            </div>
        </>
    )
}