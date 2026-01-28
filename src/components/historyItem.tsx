import { useGlobalActions } from "@/store/global";
import { CommandHistory } from "@/store/history";
import React from "react";
import Caret from "./caret";

type Props = {
  data: CommandHistory;
};

const HistoryItem = ({ data }: Props) => {
  const { time: timeActions } = useGlobalActions();

  return (
    <div>
      <div className="flex flex-col gap-1">
        <div className="flex flex-row justify-between items-center px-2">
          <p className="text-sm lg:text-lg text-blue">
            {data.currentDirectory}
          </p>
          <p className="text-sm lg:text-lg text-yellow">
            {timeActions.getFormatted(data.time)}
          </p>
        </div>
        <div className="flex flex-row flex-nowrap items-center justify-start gap-2">
          <Caret />
          <p className="text-sm lg:text-lg text-white">{data.input}</p>
        </div>
        <div
          className={`flex flex-row flex-nowrap items-center justify-start gap-2 lg:text-lg px-2 ${data.status === "SUCCESS" ? "text-green" : "text-red"}`}
        >
          {typeof data.output !== "function" &&
          typeof data.output !== "object" ? (
            <pre>{data.output}</pre>
          ) : (
            data.output
          )}
        </div>
      </div>
    </div>
  );
};

export default HistoryItem;
