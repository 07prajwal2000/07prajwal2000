import { useTerminalContext } from "@/context/terminal";
import { useThrottleFn } from "@/hooks/useThrottleFn";
import React, { useEffect, useRef, useState } from "react";
import { FloatingAutocomplete } from "./floatingAutocomplete";
import { useHistoryActions } from "@/store/history";
import { useGlobalState } from "@/store/global";
import { IGNORED_COMMANDS } from "@/context/terminal";

const TerminalInput = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [input, setInput] = useState("");
  const { cliParser } = useTerminalContext();
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const { addHistory } = useHistoryActions();
  const globalState = useGlobalState();
  const [isAutocompleteActive, setIsAutocompleteActive] = useState(false);
  const setThrottledSuggestions = useThrottleFn((value: string) => {
    setSuggestions(
      cliParser.getSuggestions(value).filter((s) => s !== value.toLowerCase()),
    );
  }, 150);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState<number>(0);
  const optionsContainerRef = useRef<HTMLDivElement>(null);
  const showSuggestions = suggestions.length > 0 && isAutocompleteActive;

  useEffect(() => {
    document.addEventListener("keydown", focusInput);
    setThrottledSuggestions(input);
    document.addEventListener("click", onBlur);
    return () => {
      document.removeEventListener("keydown", focusInput);
      document.removeEventListener("click", onBlur);
    };
  }, []);

  useEffect(() => {
    setThrottledSuggestions(input);
    setIsAutocompleteActive(input.length > 0);
  }, [input]);

  function handleKeyDown(ev: React.KeyboardEvent<HTMLInputElement>) {
    if (ev.key === "ArrowUp") {
      ev.preventDefault();
      setActiveSuggestionIndex((prevIndex) => {
        let idx = prevIndex - 1;
        if (idx < 0) idx = suggestions.length - 1;
        return idx;
      });
    }
    if (ev.key === "ArrowDown") {
      ev.preventDefault();
      setActiveSuggestionIndex((prevIndex) => {
        let idx = prevIndex + 1;
        if (idx > suggestions.length - 1) idx = 0;
        return idx;
      });
    }
    if (ev.key === "Enter") {
      selectSuggestion(activeSuggestionIndex);
    }
    if (ev.key === "Tab") {
      ev.preventDefault();
      suggestions[activeSuggestionIndex] &&
        setInput(suggestions[activeSuggestionIndex]);
      setActiveSuggestionIndex(activeSuggestionIndex);
      setSuggestions([]);
    }
    if (ev.key === "Escape") {
      inputRef.current?.blur();
    }
  }

  function selectSuggestion(index: number) {
    let blurred = false;
    if (suggestions.length === 0 && input.length > 0) {
      const command = input;
      const result = cliParser.parse(command);
      if (!IGNORED_COMMANDS.includes(command)) {
        addHistory({
          currentDirectory: globalState.currentDirectory,
          input: command,
          output: result.output,
          status: result.status,
          time: new Date(),
        });
        inputRef.current?.blur();
        blurred = true;
      }
      setInput("");
      setIsAutocompleteActive(false);
      return;
    }
    if (suggestions[index]) {
      setInput(suggestions[index] || "");
    }
    setActiveSuggestionIndex(index);
    if (!blurred) {
      inputRef.current?.focus();
    }
  }

  const focusInput = (e: KeyboardEvent) => {
    if (["Escape", "Control", "Alt", "Meta"].includes(e.key)) {
      inputRef.current?.blur();
      return;
    }
    if (e.key !== "Enter") inputRef.current?.focus();
  };

  function onInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    setInput(e.target.value.toLowerCase());
    setActiveSuggestionIndex(0);
  }

  function onBlur(e: PointerEvent) {
    if (
      !optionsContainerRef.current?.contains(e.target as Node) &&
      inputRef.current !== e.target
    ) {
      setIsAutocompleteActive(false);
    }
  }

  return (
    <div className="w-full">
      <input
        placeholder={"type 'help' for list of commands"}
        ref={inputRef}
        onFocus={() => setIsAutocompleteActive(true)}
        type="text"
        style={{ caretShape: "block" }}
        className="text-sm lg:text-lg w-full lowercase outline-none border-none selection:bg-gray selection:text-dark caret-green"
        value={input}
        onChange={onInputChange}
        onKeyDown={handleKeyDown}
      />
      <FloatingAutocomplete
        className=""
        inputRef={inputRef}
        open={showSuggestions}
      >
        <div
          ref={optionsContainerRef}
          className="p-2 flex flex-col gap-2 border border-green min-w-42 max-w-72 rounded-sm"
        >
          {suggestions.map((suggestion, index) => (
            <div
              key={suggestion}
              onClick={() => selectSuggestion(index)}
              className={`p-1 cursor-pointer rounded-sm ${index === activeSuggestionIndex ? "bg-blue text-dark" : "hover:bg-gray hover:text-dark rounded-md"}`}
            >
              {suggestion}
            </div>
          ))}
        </div>
      </FloatingAutocomplete>
    </div>
  );
};

export default TerminalInput;
