/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState } from "react";
import Spinner from "../components/spinner";

const initialRemainingUpvotes = 3;

export default function Voting() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);
  const [photosFetched, setPhotosFetched] = useState(0);
  const [amountPhotos, setAmountPhotos] = useState(0);
  const [remainingUpvotes, setRemainingUpvotes] = useState(
    initialRemainingUpvotes
  );

  useEffect(() => {
    const remainingUpvotes = localStorage.getItem("remainingUpvotes");
    if (remainingUpvotes) {
      setRemainingUpvotes(Number(remainingUpvotes));
    } else {
      localStorage.setItem(
        "remainingUpvotes",
        initialRemainingUpvotes.toString()
      );
    }

    fetch("/api/db")
      .then((res) => res.json())
      .then(async (body) => {
        const cachedEntries: Entry[] = Object.values(body);
        setAmountPhotos(cachedEntries.length);
        // fetch photos
        for (let i = 0; i < cachedEntries.length; i++) {
          const entry = cachedEntries[i];
          entry.base64img = await fetchPhoto(entry.filename);
          setPhotosFetched(photosFetched + 1);
        }
        // sort desc
        cachedEntries.sort((a, b) => b.upvotes - a.upvotes);
        // display
        console.log(cachedEntries);
        setEntries(cachedEntries);
        setLoading(false);
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
      alert("❌ Upvote failed");
    }
    window.location.reload();
  }

  function scrollTo(id: number) {
    const element = document.getElementById(id.toString());
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  }

  return (
    <>
      {loading && (
        <>
          <div className="flex flex-col items-center justify-center w-screen h-screen gap-3">
            <Spinner />
            {amountPhotos > 0 && (
              <div>
                {photosFetched} of {amountPhotos} loaded...
              </div>
            )}
            <div>Sorry for the wait 😇</div>
          </div>
        </>
      )}
      {!loading && (
        <div className="slider">
          {entries.map((entry, i) => (
            <section key={crypto.randomUUID()} id={i.toString()}>
              <img src={entry.base64img} alt={entry.name} />
              <div className="flex justify-around items-center px-8 py-2">
                <div>
                  <div className="text-lg font-bold ">{entry.name}</div>

                  <div className="font-semibold text-2xl">
                    {entry.upvotes} 👍
                  </div>
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
                      className="bg-blue-500 text-white font-bold py-2 px-4 rounded my-4 shadow-lg shadow-cyan-500/50"
                    >
                      Upvote! <br />
                      {remainingUpvotes} 👍 left
                    </button>
                  )}
                </div>
                <div className="text-xl ">
                  <b>{i + 1}</b> of <b>{entries.length}</b>
                  <div className="text-2xl flex">
                    <div
                      onClick={() => {
                        scrollTo(i - 1);
                      }}
                    >
                      ⬅️
                    </div>
                    &nbsp;&nbsp;
                    <div
                      onClick={() => {
                        scrollTo(i + 1);
                      }}
                    >
                      ➡️
                    </div>
                  </div>
                </div>
              </div>
            </section>
          ))}
        </div>
      )}
    </>
  );
}
