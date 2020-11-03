document.addEventListener("DOMContentLoaded", function(){
            tail.DateTime(".tail-datetime-field", {
                animate: true,
                classNames: false,
                closeButton: true,
                dateFormat: "YYYY-mm-dd",
                dateStart: false,
                dateRanges: [],
                dateBlacklist: true,
                dateEnd: new Date(Date.now()),
                locale: "ru",
                position: "bottom",
                rtl: "auto",
                startOpen: false,
                stayOpen: false,
                time12h: false,
                timeFormat: "HH:ii:ss",
                timeHours: true,
                timeMinutes: true,
                timeSeconds: true,
                timeIncrement: true,
                timeStepHours: 1,
                timeStepMinutes: 1,
                timeStepSeconds: 1,
                today: true,
                tooltips: [],
                viewDefault: "days",
                viewDecades: false,
                viewYears: true,
                viewMonths: true,
                viewDays: true,
                weekStart: 1
            });
        });


























