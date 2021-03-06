(function () {
  "use strict";

  describe("HijriCalendar", function () {
    describe("dayOfWeek", function () {
      describe("when the first day of the week is Sunday", function () {
        it("expects 20th Rabi al-Aakhar 1432H to be on Friday", function () {
          var calendar = new HijriCalendar(1432, 3);
          expect(calendar.dayOfWeek(20)).toBe(5);
        });
      });

      describe("when the first day of the week is Monday", function () {
        it("expects 20th Rabi al-Aakhar 1432H to be on Friday", function () {
          var calendar = new HijriCalendar(1432, 3, true);
          expect(calendar.dayOfWeek(20)).toBe(4);
        });
      });
    });

    describe("days", function () {
      var calendar,
          days;

      beforeEach(function () {
        calendar = new HijriCalendar(1432, 4);
        days = calendar.days();
      });

      it("expects to return an array of days for this month and year", function () {
        expect(Array.isArray(days)).toBeTruthy();
      });

      it("expects each day object to contain specific data", function () {
        days.forEach(function (day) {
          expect(day.hijri.year).toBeDefined();
          expect(day.hijri.month).toBeDefined();
          expect(day.hijri.date).toBeDefined();
          expect(day.gregorian.year).toBeDefined();
          expect(day.gregorian.month).toBeDefined();
          expect(day.gregorian.date).toBeDefined();
          expect(day.ajd).toBeDefined();
        });
      });

      it("expects the first day in the array to correspond to the first day of the month", function () {
        expect(days[0].hijri.date).toBe(1);
      });

      it("expects the last day in the array to correspond to the last day of the month", function () {
        expect(days[days.length - 1].hijri.date).toBe(days.length);
      });
    });

    describe("weeks", function () {
      var calendar,
          weeks;

      beforeEach(function () {
        calendar = new HijriCalendar(1432, 3);
        weeks = calendar.weeks();
      });

      it("expects to return an array", function () {
        expect(Array.isArray(weeks)).toBeTruthy();
      });

      it("expects the array to contain 5 or 6 weeks", function () {
        expect(weeks.length).toBeGreaterThan(4);
        expect(weeks.length).toBeLessThan(7);
      });

      it("expects each week in the array to be an array", function () {
        weeks.forEach(function (week) {
          expect(Array.isArray(week)).toBeTruthy();
        });
      });

      it("expects each week in the array to contain 7 days", function () {
        weeks.forEach(function (week) {
          expect(week.length).toBe(7);
        });
      });
    });

    describe("previousDays", function () {
      describe("when the first day of the week is Sunday", function () {
        describe("when the month begins on a Sunday", function () {
          it("expects to return an empty array", function () {
            var calendar = new HijriCalendar(1432, 3);
            expect(calendar.previousDays()).toEqual([]);
          });
        });

        describe("when the month doesn't begin on a Sunday", function () {
          var calendar,
              previousMonth,
              days;

          beforeEach(function () {
            calendar = new HijriCalendar(1432, 5);
            previousMonth = calendar.previousMonth();
            days = calendar.previousDays();
          });

          it("expects to return an array of days from the previous month", function () {
            days.forEach(function (day) {
              expect(day.hijri.month).toBe(previousMonth.getMonth());
            });
          });

          it("expects to return an array of days beginning on Sunday", function () {
            expect(previousMonth.dayOfWeek(days[0].hijri.date)).toBe(0);
          });

          it("expects to return an array of days ending the day before this month begins", function () {
            var lastDay = previousMonth.dayOfWeek(days[days.length - 1].hijri.date);
            expect(lastDay).toBe(calendar.dayOfWeek(1) - 1);
          });
        });
      });

      describe("when the first day of the week is Monday", function () {
        describe("when the month begins on a Monday", function () {
          it("expects to return an empty array", function () {
            var calendar = new HijriCalendar(1432, 4, true);
            expect(calendar.previousDays()).toEqual([]);
          });
        });

        describe("when the month doesn't begin on a Monday", function () {
          var calendar,
              previousMonth,
              days;

          beforeEach(function () {
            calendar = new HijriCalendar(1432, 5, true);
            previousMonth = calendar.previousMonth();
            days = calendar.previousDays();
          });

          it("expects to return an array of days from the previous month", function () {
            days.forEach(function (day) {
              expect(day.hijri.month).toBe(previousMonth.getMonth());
            });
          });

          it("expects to return an array of days beginning on Monday", function () {
            expect(previousMonth.dayOfWeek(days[0].hijri.date)).toBe(0);
          });

          it("expects to return an array of days ending the day before this month begins", function () {
            var lastDay = previousMonth.dayOfWeek(days[days.length - 1].hijri.date);
            expect(lastDay).toBe(calendar.dayOfWeek(1) - 1);
          });
        });
      });

      describe("when the month is 0 and the year is MIN_CALENDAR_YEAR", function () {
        var calendar,
            days;

        beforeEach(function () {
          calendar = new HijriCalendar(HijriCalendar.getMinYear(), 0);
          days = calendar.previousDays();
        });

        it("expects to return an array of NULL values or an empty array", function () {
          if (days.length > 0) {
            days.forEach(function (day) {
              expect(day).toBeNull();
            });
          } else {
            expect(days).toEqual([]);
          }
        });

        it("expects to return an array with enough values to complete the week", function () {
          var firstDay = calendar.dayOfWeek(1) + 1;
          expect(days.length + firstDay).toBe(7);
        });
      });

      describe("irrespective of the first day of the week, month or year", function () {
        var calendar,
            days;

        beforeEach(function () {
          calendar = new HijriCalendar(1432, 11);
          days = calendar.previousDays();
        });

        it("expects each day to have a 'filler' attribute", function () {
          if (days.length > 0) {
            days.forEach(function (day) {
              expect(day.filler).toBeDefined();
            });
          } else {
            expect(days).toEqual([]);
          }
        });
      });
    });

    describe("nextDays", function () {
      describe("when the first day of the week is Sunday", function () {
        describe("when the month ends on a Saturday", function () {
          it("expects to return an empty array", function () {
            var calendar = new HijriCalendar(1432, 2);
            expect(calendar.nextDays()).toEqual([]);
          });
        });

        describe("when the month doesn't end on a Saturday", function () {
          var calendar,
              nextMonth,
              days;

          beforeEach(function () {
            calendar = new HijriCalendar(1432, 5);
            nextMonth = calendar.nextMonth();
            days = calendar.nextDays();
          });

          it("expects to return an array of days from the next month", function () {
            days.forEach(function (day) {
              expect(day.hijri.month).toBe(nextMonth.getMonth());
            });
          });

          it("expects to return an array of days ending on Saturday", function () {
            expect(nextMonth.dayOfWeek(days[days.length - 1].hijri.date)).toBe(6);
          });

          it("expects to return an array of days beginning the day after this month ends", function () {
            var firstDay = nextMonth.dayOfWeek(days[0].hijri.date);
            expect(firstDay).toBe(calendar.dayOfWeek(29) + 1);
          });
        });
      });

      describe("when the first day of the week is Monday", function () {
        describe("when the month ends on a Sunday", function () {
          it("expects to return an empty array", function () {
            var calendar = new HijriCalendar(1432, 3, true);
            expect(calendar.nextDays()).toEqual([]);
          });
        });

        describe("when the month doesn't end on a Sunday", function () {
          var calendar,
              nextMonth,
              days;

          beforeEach(function () {
            calendar = new HijriCalendar(1432, 5);
            nextMonth = calendar.nextMonth();
            days = calendar.nextDays();
          });

          it("expects to return an array of days from the next month", function () {
            days.forEach(function (day) {
              expect(day.hijri.month).toBe(nextMonth.getMonth());
            });
          });

          it("expects to return an array of days ending on Sunday", function () {
            expect(nextMonth.dayOfWeek(days[days.length - 1].hijri.date)).toBe(6);
          });

          it("expects to return an array of days beginning the day after this month ends", function () {
            var firstDay = nextMonth.dayOfWeek(days[0].hijri.date);
            expect(firstDay).toBe(calendar.dayOfWeek(29) + 1);
          });
        });
      });

      describe("when the month is 11 and the year is MAX_CALENDAR_YEAR", function () {
        var calendar,
            days;

        beforeEach(function () {
          calendar = new HijriCalendar(HijriCalendar.getMaxYear(), 11);
          days = calendar.nextDays();
        });

        it("expects to return an array of NULL values or an empty array", function () {
          if (days.length > 0) {
            days.forEach(function (day) {
              expect(day).toBeNull();
            });
          } else {
            expect(days).toEqual([]);
          }
        });

        it("expects to return an array with enough values to complete the week", function () {
          var daysInMonth = HijriDate.daysInMonth(calendar.getYear(), calendar.getMonth()),
              lastDay = calendar.dayOfWeek(daysInMonth) + 1;
          expect(lastDay + days.length).toBe(7);
        });
      });

      describe("irrespective of the first day of the week, month or year", function () {
        var calendar,
            days;

        beforeEach(function () {
          calendar = new HijriCalendar(1432, 11);
          days = calendar.nextDays();
        });

        it("expects each day to have a 'filler' attribute", function () {
          if (days.length > 0) {
            days.forEach(function (day) {
              expect(day.filler).toBeDefined();
            });
          } else {
            expect(days).toEqual([]);
          }
        });
      });
    });

    describe("previousMonth", function () {
      describe("when the month is greater than 0", function () {
        it("expects to subtract 1 from the month", function () {
          var calendar = new HijriCalendar(1432, 3);
          expect(calendar.previousMonth().getMonth()).toBe(2);
        });
      });

      describe("when the month is 0", function () {
        var calendar;

        beforeEach(function () {
          calendar = (new HijriCalendar(1432, 0)).previousMonth();
        });

        it("expects to set the month to 11", function () {
          expect(calendar.getMonth()).toBe(11);
        });

        it("expects to subtract 1 from the year", function () {
          expect(calendar.getYear()).toBe(1431);
        });
      });

      describe("when the month is 0 and the year is MIN_CALENDAR_YEAR", function () {
        var calendar;

        beforeEach(function () {
          calendar = (new HijriCalendar(HijriCalendar.getMinYear(), 0)).previousMonth();
        });

        it("expects the month to stay the same", function () {
          expect(calendar.getMonth()).toBe(0);
        });

        it("expects the year to stay the same", function () {
          expect(calendar.getYear()).toBe(HijriCalendar.getMinYear());
        });
      });
    });

    describe("nextMonth", function () {
      describe("when the month is less than 11", function () {
        it("expects to add 1 to the month", function () {
          var calendar = new HijriCalendar(1432, 3)
          expect(calendar.nextMonth().getMonth()).toBe(4);
        });
      });

      describe("when the month is 11", function () {
        var calendar;

        beforeEach(function () {
          calendar = (new HijriCalendar(1432, 11)).nextMonth();
        });

        it("expects to set the month to 0", function () {
          expect(calendar.getMonth()).toBe(0);
        });

        it("expects to add 1 to the year", function () {
          expect(calendar.getYear()).toBe(1433);
        });
      });

      describe("when the month is 11 and the year is MAX_CALENDAR_YEAR", function () {
        var calendar;

        beforeEach(function () {
          calendar = (new HijriCalendar(HijriCalendar.getMaxYear(), 11)).nextMonth();
        });

        it("expects the month to stay the same", function () {
          expect(calendar.getMonth()).toBe(11);
        });

        it("expects the year to stay the same", function () {
          expect(calendar.getYear()).toBe(HijriCalendar.getMaxYear());
        });
      });
    });

    describe("previousYear", function () {
      describe("when the year is greater than MIN_CALENDAR_YEAR", function () {
        it("expects to subtract 1 from the year", function () {
          var calendar = new HijriCalendar(1432, 3);
          expect(calendar.previousYear().getYear()).toEqual(1431);
        });
      })

      describe("when the year is MIN_CALENDAR_YEAR", function () {
        it("expects the year to remain the same", function () {
          var calendar = new HijriCalendar(HijriCalendar.getMinYear(), 3),
              calendarPreviousYear = calendar.previousYear();
          expect(calendarPreviousYear.getYear()).toEqual(calendar.getYear());
        });
      });
    });

    describe("nextYear", function () {
      describe("when the year is less than MAX_CALENDAR_YEAR", function () {
        it("expects to add 1 to the year", function () {
          var calendar = new HijriCalendar(1432, 3);
          expect(calendar.nextYear().getYear()).toEqual(1433);
        });
      });

      describe("when the year is MAX_CALENDAR_YEAR", function () {
        it("expects the year to remain the same", function () {
          var calendar = new HijriCalendar(HijriCalendar.getMaxYear(), 3),
              calendarNextYear = calendar.nextYear();
          expect(calendarNextYear.getYear()).toEqual(calendar.getYear());
        });
      });
    });
  });
})();
