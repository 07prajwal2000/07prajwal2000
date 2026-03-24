import { useHistoryState } from "@/store/history";
import HistoryItem from "./historyItem";
import WelcomeAscii from "./welcomeAscii";
import { useEffect, useRef } from "react";
import SocialNavbar from "./socialNavbar";
import { useTerminalContext } from "@/context/terminal";

const Terminal = () => {
	const { socialLinks } = useTerminalContext();
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
						<SocialNavbar
							blog={
								socialLinks.find((link) => link.label.toLowerCase() === "blog")
									?.url || ""
							}
							github={
								socialLinks.find(
									(link) => link.label.toLowerCase() === "github",
								)?.url || ""
							}
							linkedin={
								socialLinks.find(
									(link) => link.label.toLowerCase() === "linkedin",
								)?.url || ""
							}
							email={
								socialLinks.find((link) => link.label.toLowerCase() === "email")
									?.url || ""
							}
						/>
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
