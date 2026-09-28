import DashboardWish from "./DashboardWish"
import DashboardShortcuts from "./DashboardShortcuts"

export default function Dashboard() {
    return (
        <>
            <div className="grid grid-cols-1 p-2">
                <DashboardWish />
            </div>
            <div className="grid grid-cols-2 px-2 py-1">
                <DashboardShortcuts />
            </div>
        </>
    )
}