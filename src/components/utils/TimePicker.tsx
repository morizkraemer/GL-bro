'use client';
 
import * as React from "react";
import { Clock } from "lucide-react";
import { Label } from "@/components/ui/label";
import { TimePickerInput } from "@/components/ui/timepicker-input";
import { cn } from "@/lib/utils";
 
interface TimePickerDemoProps {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  disabled?: boolean;
}
 
export default function({ date, setDate, disabled }: TimePickerDemoProps) {
  const minuteRef = React.useRef<HTMLInputElement>(null);
  const hourRef = React.useRef<HTMLInputElement>(null);
 
  return (
    <div className="w-full">
      <div className="grid grid-cols-2 gap-2">
        <div>
          <Label htmlFor="hours" className="text-xs block mb-1">
            Hours
          </Label>
          <TimePickerInput
            picker="hours"
            date={date}
            setDate={setDate}
            ref={hourRef}
            disabled={disabled}
            onRightFocus={() => minuteRef.current?.focus()}
            className={cn("w-full bg-secondary/40 rounded-md h-10")}
          />
        </div>
        <div>
          <Label htmlFor="minutes" className="text-xs block mb-1">
            Minutes
          </Label>
          <TimePickerInput
            picker="minutes"
            date={date}
            setDate={setDate}
            ref={minuteRef}
            disabled={disabled}
            onLeftFocus={() => hourRef.current?.focus()}
            className={cn("w-full bg-secondary/40 rounded-md h-10")}
          />
        </div>
      </div>
    </div>
  );
}
