import { useHistoryState } from "@/store/history";
import HistoryItem from "./historyItem";
import WelcomeAscii from "./welcomeAscii";
import { useEffect, useRef } from "react";
import SocialNavbar from "./socialNavbar";

const Terminal = () => {
  const historyState = useHistoryState();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.scrollTo({
        top: ref.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [historyState.history]);

  return (
    <div
      className="flex-1 min-h-0 overflow-y-auto w-full lg:overflow-x-hidden"
      ref={ref}
    >
      <div className="flex flex-col gap-2 h-full">
        {historyState.history.map((command, index) => (
          <HistoryItem key={index} data={command} />
        ))}
        {historyState.history.length === 0 && (
          <>
            <SocialNavbar blog="" github="" linkedin="" email="" />
            <div className="flex flex-col justify-center text-[10px] lg:text-xl items-center h-full w-full text-center">
              <WelcomeAscii />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Terminal;
