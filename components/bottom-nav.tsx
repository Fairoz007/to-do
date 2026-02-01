"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, CheckSquare, Calendar, FileText, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"

const mobileItems = [
    { icon: LayoutDashboard, label: "Home", href: "/" },
    { icon: CheckSquare, label: "Tasks", href: "/tasks" },
    { icon: FileText, label: "Monthly", href: "/monthly" },
    // { icon: Calendar, label: "Calendar", href: "/calendar" },
]

export function BottomNav() {
    const pathname = usePathname()
    const isActive = (href: string) => pathname === href

    return (
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50 safe-area-bottom">
            <div className="flex items-center justify-around p-2">
                {mobileItems.map((item) => (
                    <Link key={item.href} href={item.href} className="flex-1">
                        <Button
                            variant="ghost"
                            className={`w-full flex flex-col items-center gap-1 h-16 rounded-none ${isActive(item.href) ? "text-primary bg-primary/5" : "text-muted-foreground"}`}
                        >
                            <item.icon className={`size-6 ${isActive(item.href) ? "fill-current" : ""}`} />
                            <span className="text-[10px] font-medium">{item.label}</span>
                        </Button>
                    </Link>
                ))}
            </div>
        </div>
    )
}
