/* eslint-disable @next/next/no-img-element */
"use client";

import { randomUUID } from "crypto";
import { useEffect, useState } from "react";

export default function Voting() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/db")
      .then((res) => res.json())
      .then(async (body) => {
        const cachedEntries: Entry[] = Object.values(body);
        for (let i = 0; i < cachedEntries.length; i++) {
          const entry = cachedEntries[i];
          entry.base64img = await fetchPhoto(entry.filename);
        }
        console.log(cachedEntries);
        setEntries(cachedEntries);
      });
  }, []);

  async function fetchPhoto(filename: string) {
    const response = await fetch(`/api/images?filename=${filename}`, {
      method: "GET",
    });
    // will receive base64 representation of image
    const img = await response.json();
    return "data:image/png;base64, " + img;
  }

  return (
    <div className="slider">
      {entries.map((entry, i) => (
        <section key={crypto.randomUUID()}>
          <img src={entry.base64img} alt={entry.name} />
        </section>
      ))}
    </div>
  );
}
