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

  async function upvote(name: string) {
    const response = await fetch(`/api/db/upvote?name=${name}`, {
      method: "POST",
    });
    if (response.ok) {
      console.log("Upvote ok!");
    } else {
      console.log("Upvote failed!");
    }
  }

  return (
    <div className="slider">
      {entries.map((entry, i) => (
        <section key={crypto.randomUUID()}>
          <img src={entry.base64img} alt={entry.name} />
          <div className="flex justify-around items-center px-8 py-2">
            <div>
              <div>{entry.name}</div>
              <div>{entry.upvotes} 👍</div>
            </div>
            <div>
              <button
                onClick={() => {
                  upvote(entry.name);
                }}
                className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-6 border border-gray-400 rounded shadow"
              >
                👍
              </button>
              <div>votes left: 3</div>
            </div>
          </div>
        </section>
      ))}
    </div>
  );
}
