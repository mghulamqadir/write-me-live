"use client";

import { useOthers, useSelf } from "@liveblocks/react/suspense";

export default function Presence() {
  const others = useOthers();
  const self = useSelf();
  const count = others.length + (self ? 1 : 0);
  return <p className="mt-1 text-xs text-zinc-500">{count} / 2 connected</p>;
}
