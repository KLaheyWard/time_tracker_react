export enum DayType {
  REGULAR = "regular",
  HOLIDAY = "holiday",
}

export interface TimeEntryProps {
  id?: string;
  cycleId: string | number;
  startTime: Date | string | number; // Date, ISO string, or epoch
  endTime: Date | string | number; // Date, ISO string, or epoch
  unpaidBreakMin?: number; // minutes
  note?: string;
  dayType: DayType;
}

export class TimeEntry {
  readonly id: string;
  cycleId: string | number;
  startTime: Date;
  endTime: Date;
  unpaidBreakMin: number;
  note?: string;
  dayType: DayType;

  constructor(props: TimeEntryProps) {
    this.id = props.id ?? TimeEntry.newId();
    this.cycleId = props.cycleId;
    this.startTime = TimeEntry.toDate(props.startTime);
    this.endTime = TimeEntry.toDate(props.endTime);
    this.unpaidBreakMin = Math.max(0, Math.floor(props.unpaidBreakMin ?? 0));
    this.note = props.note?.trim() || undefined;
    this.dayType = props.dayType;
    this.assertValid();
  }

  // ---- helpers ----
  private static toDate(d: Date | string | number): Date {
    const date = new Date(d);
    if (Number.isNaN(date.getTime())) throw new Error("Invalid date value");
    return date;
  }

  private static newId(): string {
    // Prefer UUID if available; otherwise a compact fallback
    const g = (globalThis as any)?.crypto?.randomUUID?.();
    return (
      g ??
      `te_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`
    );
  }

  private assertValid() {
    if (this.endTime <= this.startTime) {
      throw new Error("endTime must be after startTime");
    }
    const diffMs = this.endTime.getTime() - this.startTime.getTime();
    const dayMs = 24 * 60 * 60 * 1000;
    if (diffMs > dayMs) {
      throw new Error("startTime and endTime must be within 24 hours");
    }
    if (this.unpaidBreakMin > this.totalMinutes()) {
      // clamp (or throw if you prefer strictness)
      this.unpaidBreakMin = this.totalMinutes();
    }
  }

  // ---- derived values ----
  totalMinutes(): number {
    return Math.round(
      (this.endTime.getTime() - this.startTime.getTime()) / 60000
    );
  }

  netMinutes(): number {
    return Math.max(this.totalMinutes() - this.unpaidBreakMin, 0);
  }

  netHours(precision = 2): number {
    const hours = this.netMinutes() / 60;
    const f = 10 ** precision;
    return Math.round(hours * f) / f;
  }

  // Keep duration, move to a new calendar date (preserves time-of-day & span)
  shiftToDate(newDate: Date | string | number): TimeEntry {
    const base = TimeEntry.toDate(newDate);
    const start = new Date(base);
    start.setHours(
      this.startTime.getHours(),
      this.startTime.getMinutes(),
      this.startTime.getSeconds(),
      this.startTime.getMilliseconds()
    );
    const durationMs = this.endTime.getTime() - this.startTime.getTime();
    const end = new Date(start.getTime() + durationMs);
    return new TimeEntry({
      ...this.toJSON(),
      startTime: start,
      endTime: end,
    });
  }

  // ---- serialization ----
  toJSON() {
    return {
      id: this.id,
      cycleId: this.cycleId,
      startTime: this.startTime.toISOString(),
      endTime: this.endTime.toISOString(),
      unpaidBreakMin: this.unpaidBreakMin,
      note: this.note,
      dayType: this.dayType,
    } as const;
  }

  static fromJSON(json: {
    id?: string;
    cycleId: string | number;
    startTime: string;
    endTime: string;
    unpaidBreakMin?: number;
    note?: string;
    dayType: DayType;
  }): TimeEntry {
    return new TimeEntry(json);
  }
}
