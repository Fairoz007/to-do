"use client"

import React, { useState } from "react"
import { useFilter } from "./filter-context"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer"
import { TaskInputAdvanced } from "./task-input-advanced"

export function AddTaskFab() {
    const { activeFilter } = useFilter()
    const [open, setOpen] = useState(false)

    // Hide FAB when a filter is active
    if (activeFilter !== 'all') return null

    return (
        <div className="md:hidden fixed bottom-20 right-4 z-40">
            <Drawer open={open} onOpenChange={setOpen}>
                <DrawerTrigger asChild>
                    <Button size="icon" className="size-14 rounded-full shadow-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-all hover:scale-105 active:scale-95">
                        <Plus className="size-6" />
                    </Button>
                </DrawerTrigger>
                <DrawerContent className="h-[85vh]">
                    <DrawerHeader>
                        <DrawerTitle>Add New Task</DrawerTitle>
                    </DrawerHeader>
                    <div className="p-4 overflow-y-auto pb-safe">
                        <TaskInputAdvanced onSuccess={() => setOpen(false)} />
                    </div>
                </DrawerContent>
            </Drawer>
        </div>
    )
}
