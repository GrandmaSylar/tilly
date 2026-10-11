"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { DownloadSimple, ShareNetwork, X } from "@phosphor-icons/react";

type InstallEvent = Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: "accepted" | "dismissed" }> };

const DISMISS_KEY = "tilly-install-dismissed";
const DISMISS_DAYS = 14;

/**
 * Install state shared by the footer button and the banner.
 * Chrome/Edge/Android fire `beforeinstallprompt`, which we hold on to. iOS (Safari, Chrome and Firefox alike)
 * has no prompt API at all, so there we explain Share -> Add to Home Screen instead.
 */
function useInstall() {
  const [event, setEvent] = useState<InstallEvent | null>(null);
  const [ios, setIos] = useState<null | "safari" | "other">(null);
  const [installed, setInstalled] = useState(true); // hidden until we know otherwise
  const [desktop, setDesktop] = useState<"safari" | "firefox" | "chromium">("chromium");

  useEffect(() => {
    const ua = navigator.userAgent;
    const standalone = window.matchMedia("(display-mode: standalone)").matches || (navigator as { standalone?: boolean }).standalone === true;
    setInstalled(standalone);

    // iPadOS reports itself as a Mac, so also look for touch.
    const iosDevice = /iphone|ipad|ipod/i.test(ua) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
    setDesktop(/firefox/i.test(ua) ? "firefox" : /safari/i.test(ua) && !/chrome|chromium|edg/i.test(ua) ? "safari" : "chromium");
    setIos(iosDevice ? (/crios|fxios|edgios|opios/i.test(ua) ? "other" : "safari") : null);

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

  const available = !installed && (!!event || !!ios);

  async function install() {
    if (!event) return false;
    await event.prompt();
    await event.userChoice;
    setEvent(null);
    return true;
  }

  return { available, installed, ios, desktop, install };
}

function Steps({ ios, desktop }: { ios: "safari" | "other" | null; desktop: "safari" | "firefox" | "chromium" }) {
  if (!ios) {
    if (desktop === "safari") return <>In Safari, choose <strong>File → Add to Dock</strong>.</>;
    if (desktop === "firefox") return <>Firefox can&apos;t install web apps on desktop. Open this site in Chrome or Edge, then use the install icon in the address bar.</>;
    return <>Use the install icon at the right of the address bar, or open the browser menu and choose <strong>Install Tilly&apos;s Gallery</strong>.</>;
  }
  return (
    <>
      Tap <ShareNetwork size={16} className="-mt-0.5 inline" aria-label="Share" />{" "}
      {ios === "other" ? "in the address bar at the top" : "in the toolbar at the bottom"}, then choose <strong>Add to Home Screen</strong>.
    </>
  );
}

/** "Install app" entry: a footer link on the store, a sidebar item in the admin. */
export function InstallApp({ variant = "store" }: { variant?: "store" | "admin" }) {
  const { installed, ios, desktop, install } = useInstall();
  const [help, setHelp] = useState(false);

  if (installed) return null;

  const label = variant === "admin" ? "Install admin app" : "Install our app";
  const buttonClass =
    variant === "admin"
      ? "press flex h-11 w-full items-center gap-3 rounded-full px-4 font-semibold text-ink hover:bg-mist"
      : "inline-flex min-h-11 items-center gap-2 text-left hover:text-white active:text-white sm:min-h-9";

  return (
    <>
      <button type="button" onClick={async () => !(await install()) && setHelp(true)} className={buttonClass}>
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
            <Steps ios={ios} desktop={desktop} />
          </p>
        </div>
      )}
    </>
  );
}

/** One-time banner on phones, a few seconds after arriving. Dismissing it silences it for two weeks. */
export function InstallBanner() {
  const { available, ios, desktop, install } = useInstall();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!available || !window.matchMedia("(pointer: coarse)").matches) return;
    try {
      const at = Number(localStorage.getItem(DISMISS_KEY));
      if (at && Date.now() - at < DISMISS_DAYS * 86_400_000) return;
    } catch {}
    const timer = setTimeout(() => setVisible(true), 4000);
    return () => clearTimeout(timer);
  }, [available]);

  function dismiss() {
    setVisible(false);
    try {
      localStorage.setItem(DISMISS_KEY, String(Date.now()));
    } catch {}
  }

  if (!visible || !available) return null;

  return (
    <div
      role="dialog"
      aria-label="Install Tilly's Gallery"
      className="fixed inset-x-3 bottom-[max(0.75rem,env(safe-area-inset-bottom))] z-[45] flex items-start gap-3 rounded-2xl border border-line bg-white p-4 text-ink shadow-[0_24px_48px_-16px_oklch(30%_0.03_45/0.45)]"
    >
      <Image src="/icons/icon-192.png" alt="" width={48} height={48} className="size-12 shrink-0 rounded-xl" />
      <div className="min-w-0 flex-1">
        <p className="font-display font-bold">Add Tilly&apos;s Gallery to your phone</p>
        {ios ? (
          <p className="mt-0.5 text-sm text-slate">
            <Steps ios={ios} desktop={desktop} />
          </p>
        ) : (
          <>
            <p className="mt-0.5 text-sm text-slate">Shop faster and keep your wishlist one tap away.</p>
            <button
              type="button"
              onClick={async () => {
                await install();
                dismiss();
              }}
              className="press mt-3 inline-flex h-10 items-center rounded-full bg-brand px-5 text-sm font-semibold text-white"
            >
              Install app
            </button>
          </>
        )}
      </div>
      <button type="button" onClick={dismiss} aria-label="Not now" className="-m-1 grid size-10 shrink-0 place-items-center rounded-full text-slate hover:bg-mist">
        <X size={18} />
      </button>
    </div>
  );
}
