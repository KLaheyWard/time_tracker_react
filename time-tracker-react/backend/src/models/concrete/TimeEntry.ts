import { start } from "repl";
import { DayType } from "./DayType.js";

// TODO : create consts for defaults and maybe also

/**
 * Defines the data for a single time entry.
 */
export class TimeEntry {
  _id: number;
  _cycleId: number;
  _startTime: Date;
  _endTime: Date;
  _unpaidBreakMin: number;
  _note: string;
  _dayType: DayType;

  constructor(
    id: number,
    cycleId: number,
    startTime: Date,
    endTime: Date,
    unpaidBreakMin?: number,
    note?: string,
    dayType?: DayType
  ) {
    this._id = id;
    this._cycleId = cycleId;
    this._startTime = startTime;
    this._endTime = endTime;
    this._unpaidBreakMin = unpaidBreakMin ?? 30;
    this._note = note ?? "";
    this._dayType = dayType ?? DayType.REGULAR;
  }
}
