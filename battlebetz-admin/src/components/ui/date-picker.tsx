"use client"

import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { FormControl } from "@/components/ui/form"

interface DatePickerProps {
  date: Date | null
  setDate: (date: Date | null) => void
  className?: string
}

export function DatePicker({ date, setDate, className }: DatePickerProps) {
  // Format date to YYYY-MM-DD for input value
  const formatDateForInput = (date: Date | null): string => {
    if (!date) return ""
    return date.toISOString().split('T')[0]
  }

  // Handle date change
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = e.target.value ? new Date(e.target.value) : null
    setDate(newDate)
  }

  return (
    <div className={cn("relative", className)}>
      <Input
        type="date"
        placeholder="Pick a date"
        value={formatDateForInput(date)}
        onChange={handleDateChange}
        className="w-full"
      />
    </div>
  )
} 