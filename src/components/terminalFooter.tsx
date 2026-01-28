import { useGlobalActions, useGlobalState } from "@/store/global";
import React, { useEffect } from "react";
import TerminalInput from "./terminalInput";
import Caret from "./caret";

const TerminalFooter = () => {
  const { time: timeActions } = useGlobalActions();
  const globalState = useGlobalState();

  useEffect(() => {
    const interval = setInterval(() => {
      const currentDate = new Date();
      timeActions.setTime(currentDate);
    }, 1000 * 10);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col gap-0 pt-1 mt-1 shrink-0">
      <div className="flex flex-row justify-between items-center px-2">
        <p className="text-sm lg:text-lg text-blue">
          {globalState.currentDirectory}
        </p>
        <p className="text-sm lg:text-lg text-yellow">
          {timeActions.getFormatted(globalState.time)}
        </p>
      </div>
      <div className="flex flex-row flex-nowrap items-center justify-start gap-2">
        <Caret />
        <TerminalInput />
      </div>
    </div>
  );
};

export default TerminalFooter;
