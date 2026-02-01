"use client"

import React, { createContext, useContext, useState, ReactNode } from "react"

export type FilterType = "all" | "today" | "overdue" | "high" | "completed" | "quick" | "week"

interface FilterContextType {
    activeFilter: FilterType
    setFilter: (filter: FilterType) => void
}

const FilterContext = createContext<FilterContextType | undefined>(undefined)

export function FilterProvider({ children }: { children: ReactNode }) {
    const [activeFilter, setActiveFilter] = useState<FilterType>("all")

    return (
        <FilterContext.Provider value={{ activeFilter, setFilter: setActiveFilter }}>
            {children}
        </FilterContext.Provider>
    )
}

export function useFilter() {
    const context = useContext(FilterContext)
    if (context === undefined) {
        throw new Error("useFilter must be used within a FilterProvider")
    }
    return context
}
