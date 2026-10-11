"use client";

import { useEffect, useState } from "react";
import { DownloadSimple, ShareNetwork, X } from "@phosphor-icons/react";

type InstallEvent = Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: "accepted" | "dismissed" }> };

/**
 * "Install app" entry. Chrome/Edge/Android show a real install prompt; iPhone Safari has no
 * prompt API, so we explain Share -> Add to Home Screen. Renders nothing once the app is installed.
 */
export function InstallApp({ variant = "store" }: { variant?: "store" | "admin" }) {
  const [event, setEvent] = useState<InstallEvent | null>(null);
  const [ios, setIos] = useState(false);
  const [installed, setInstalled] = useState(true); // hidden until we know otherwise
  const [help, setHelp] = useState(false);

  useEffect(() => {
    const standalone = window.matchMedia("(display-mode: standalone)").matches || (navigator as { standalone?: boolean }).standalone === true;
    setInstalled(standalone);
    setIos(/iphone|ipad|ipod/i.test(navigator.userAgent) && !/crios|fxios/i.test(navigator.userAgent));

    const onPrompt = (e: Event) => {
      e.preventDefault();
      setEvent(e as InstallEvent);
    };
    const onInstalled = () => setInstalled(true);
    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  if (installed || (!event && !ios)) return null;

  const label = variant === "admin" ? "Install admin app" : "Install our app";

  async function install() {
    if (event) {
      await event.prompt();
      await event.userChoice;
      setEvent(null);
    } else {
      setHelp(true);
    }
  }

  const buttonClass =
    variant === "admin"
      ? "press flex h-11 w-full items-center gap-3 rounded-full px-4 font-semibold text-ink hover:bg-mist"
      : "inline-flex min-h-11 items-center gap-2 text-left hover:text-white active:text-white sm:min-h-9";

  return (
    <>
      <button type="button" onClick={install} className={buttonClass}>
        <DownloadSimple size={variant === "admin" ? 20 : 18} />
        {label}
      </button>
      {help && (
        <div role="dialog" aria-label={label} className="fixed inset-x-3 bottom-[max(0.75rem,env(safe-area-inset-bottom))] z-[60] rounded-2xl bg-white p-4 text-ink shadow-2xl">
          <button type="button" onClick={() => setHelp(false)} aria-label="Close" className="absolute top-2 right-2 grid size-10 place-items-center rounded-full text-slate hover:bg-mist">
            <X size={18} />
          </button>
          <p className="pr-8 font-display font-bold">{label}</p>
          <p className="mt-1 text-sm text-slate">
            Tap <ShareNetwork size={16} className="inline -mt-0.5" aria-label="Share" /> in Safari&apos;s toolbar, then choose <strong>Add to Home Screen</strong>.
          </p>
        </div>
      )}
    </>
  );
}
