/* eslint-disable @next/next/no-img-element */
"use client";

import { randomUUID } from "crypto";
import { useEffect, useState } from "react";

export default function Voting() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(false);
  const [remainingUpvotes, setRemainingUpvotes] = useState(3);

  useEffect(() => {
    const remainingUpvotes = localStorage.getItem("remainingUpvotes");
    if (remainingUpvotes) {
      setRemainingUpvotes(Number(remainingUpvotes));
    } else {
      localStorage.setItem("remainingUpvotes", "3");
    }

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
      localStorage.setItem(
        "remainingUpvotes",
        (remainingUpvotes - 1).toString()
      );
      alert("✅ Upvote saved! Reloading...");
    } else {
      console.log("Upvote failed!");
      alert("❌ upvote failed");
    }
    window.location.reload();
  }

  return (
    <div className="slider">
      {entries.map((entry, i) => (
        <section key={crypto.randomUUID()}>
          <img src={entry.base64img} alt={entry.name} />
          <div className="flex justify-around items-center px-8 py-2">
            <div>
              <div className="text-md">{entry.name}</div>

              <div className="font-semibold ">{entry.upvotes} 👍</div>
            </div>

            <div>
              {remainingUpvotes == 0 && (
                <button className="bg-blue-200 text-white font-bold py-2 px-4 rounded my-4">
                  <s>Upvote!</s> <br />
                  {remainingUpvotes} 👍 left
                </button>
              )}
              {remainingUpvotes > 0 && (
                <button
                  onClick={() => {
                    upvote(entry.name);
                  }}
                  className="bg-blue-500 text-white font-bold py-2 px-4 rounded my-4"
                >
                  Upvote! <br />
                  {remainingUpvotes} 👍 left
                </button>
              )}
            </div>
            <div>
              <b>{i + 1}</b> of <b>{entries.length}</b>
            </div>
          </div>
        </section>
      ))}
    </div>
  );
}
