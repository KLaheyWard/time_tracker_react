import type { TimeEntry } from "../concrete/TimeEntry.js";

export interface ITimeEntryService {
  /**
   * Retrieve all time entries, regardless of cycleId.
   */
  getAllEntries(): TimeEntry[];

  /**
   * Retrieve all entries with the corresponding cycleId.
   *
   * @param cycleId the id of the cycle.
   */
  getCycleEntries(cycleId: number): TimeEntry[];

  /**
   * Return the total number of minutes worked in the current cycle.
   */
  getCycleMinutesWorked(): number;

  /**
   * Get the current (active) cycle.
   */
  getCurrentCycle(): number;

  /**
   * Save the extra or remaining hours worked/to work.
   */
  bankHours(): void;
}
