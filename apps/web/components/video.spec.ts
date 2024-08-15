import { DateTime, Settings } from "luxon";
import { beforeEach, describe, expect, test } from "vitest";

import { hasPast } from "./videos";

describe("hasPast's test", () => {
  beforeEach(() => {
    const timeTravel = DateTime.fromISO("2024-08-15T09:25:00.000Z");
    Settings.now = () => timeTravel.toMillis();
  });
  test("Return true if the current time is past the streaming start time", () => {
    expect(hasPast("2024-08-15T09:24:59.000Z")).toBe(true);
  });
  test("Return false if the current time is not past the streaming start time", () => {
    expect(hasPast("2024-08-15T09:25:00.000Z")).toBe(false);
  });
});
