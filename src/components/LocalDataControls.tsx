"use client";
import { useState } from "react";
import Link from "next/link";
import { clearLocalData } from "@/lib/storage/local-history";

export function LocalDataControls() {
  const [status, setStatus] = useState("");
  return (
    <div className="privacy-panel">
      <div>
        <strong>Your local workspace</strong>
        <p>
          {status ||
            "Clear saved leads and search history from this browser at any time."}
        </p>
      </div>
      <Link href="/about/data">Data and privacy details →</Link>
      <button
        onClick={() =>
          void clearLocalData().then(() =>
            setStatus("Local data cleared from this browser."),
          )
        }
      >
        Clear my local data
      </button>
    </div>
  );
}
