"use client";
import { useState } from "react";
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
      <a href="/about/data">Data and privacy details →</a>
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
