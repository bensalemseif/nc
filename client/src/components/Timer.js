import { useCallback, useEffect, useState } from "react";

const Timer3 = ({ countDownTime, textCol }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: "00",
    hours: "00",
    minutes: "00",
    seconds: "00",
  });

  const getTimeDifference = (targetTime) => {
    const currentTime = new Date().getTime();
    const timeDifference = targetTime - currentTime;

    if (timeDifference < 0) {
      return {
        days: "00",
        hours: "00",
        minutes: "00",
        seconds: "00",
      };
    }

    const days = Math.floor(timeDifference / (24 * 60 * 60 * 1000));
    const hours = Math.floor(
      (timeDifference % (24 * 60 * 60 * 1000)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor(
      (timeDifference % (60 * 60 * 1000)) / (1000 * 60)
    );
    const seconds = Math.floor((timeDifference % (60 * 1000)) / 1000);

    return {
      days: days < 10 ? `0${days}` : days,
      hours: hours < 10 ? `0${hours}` : hours,
      minutes: minutes < 10 ? `0${minutes}` : minutes,
      seconds: seconds < 10 ? `0${seconds}` : seconds,
    };
  };

  const startCountDown = useCallback(() => {
    const targetTime = new Date(countDownTime).getTime();
    const intervalId = setInterval(() => {
      setTimeLeft(getTimeDifference(targetTime));
    }, 1000);

    return intervalId;
  }, [countDownTime]);

  useEffect(() => {
    const intervalId = startCountDown();

    return () => clearInterval(intervalId);
  }, [startCountDown]);

  return (
    <div className="p-4 sm:p-6 max-w-sm mx-auto text-center">
      <div className="flex justify-center gap-4">
        {Object.entries(timeLeft).map(([unit, value]) => (
          <div key={unit} className="flex flex-col items-center">
            <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 flex items-center justify-center bg-gray-200 rounded-full shadow-md">
              <span
                className={`text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold text-${textCol}-500`}
              >
                {value}
              </span>
            </div>
            <span className="text-xs sm:text-sm md:text-base lg:text-lg text-white mt-2 capitalize">
              {unit === "days"
                ? value === "01"
                  ? "Day"
                  : "Days"
                : unit.charAt(0).toUpperCase() + unit.slice(1) + "s"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Timer3;
