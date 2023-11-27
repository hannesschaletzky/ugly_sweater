/* eslint-disable @next/next/no-img-element */
"use client";

import Spinner from "../components/spinner";
import { useEffect, useState } from "react";

declare global {
  interface HTMLElement {
    files: any;
  }
}

export default function Page() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/db")
      .then((res) => res.json())
      .then((body) => {
        console.log(body);
        setEntries(Object.values(body));
      });
  }, []);

  async function upload() {
    try {
      const inputPhoto = document.getElementById("inputPhoto");
      const inputName = document.getElementById(
        "inputName"
      ) as HTMLInputElement;
      if (inputPhoto && inputName) {
        const name = inputName.value;
        if (!/^[a-zA-Z]+$/.test(name)) {
          alert("name input field: only letters allowed");
          return;
        }
        if (inputPhoto.files.length != 1) {
          alert("one photo required");
          return;
        }
        setLoading(true);
        let payload = new FormData();
        payload.append("file", inputPhoto.files[0]);
        payload.append("user", name);
        const response = await fetch("/api/images", {
          method: "POST",
          body: payload,
        });
        const body = await response.json();
        setLoading(false);
        if (body.status == 201) {
          alert("✅");
          window.location.reload();
        } else {
          alert(`${body.status}, ${body.message}`);
        }
      }
    } catch (e: any) {
      alert(e);
    }
  }

  async function deleteEntry(name: string) {
    await fetch(`/api/db?name=${name}`, {
      method: "DELETE",
    })
      .catch((e) => {
        alert(e);
      })
      .finally(() => {
        window.location.reload();
      });
  }

  async function getPhoto() {
    const response = await fetch("/api/image", {
      method: "GET",
    });
    // will receive base64 representation of image
    const img = await response.json();
    let imgTag = document.getElementById("preview") as HTMLImageElement;
    imgTag.src = "data:image/png;base64, " + img;
  }

  return (
    <div>
      <div className="flex flex-col justify-center items-center gap-2 m-4">
        <input
          id="inputName"
          className="border-2 border-gray-500 p-2 rounded-md w-1/2"
          type="text"
          placeholder="Name..."
        />
        <input
          id="inputPhoto"
          type="file"
          name="picture"
          accept="image/*"
          capture="user"
        />
        <div
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded my-4"
          onClick={() => upload()}
        >
          Upload
        </div>
        {loading && <Spinner />}
        {entries.length}
        {entries.map((entry, i) => (
          <div
            className="flex justify-center items-center gap-1"
            key={crypto.randomUUID()}
          >
            <div key={crypto.randomUUID()}>{entry.name}</div>
            <div
              className=" hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
              key={crypto.randomUUID()}
              onClick={() => {
                deleteEntry(entry.name);
              }}
            ></div>
          </div>
        ))}
      </div>
    </div>
  );
}
