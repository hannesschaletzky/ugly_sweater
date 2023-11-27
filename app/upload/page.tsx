/* eslint-disable @next/next/no-img-element */
"use client";

declare global {
  interface HTMLElement {
    files: any;
  }
}

export default function Page() {
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
        let payload = new FormData();
        payload.append("file", inputPhoto.files[0]);
        payload.append("user", name);
        const response = await fetch("/api/image", {
          method: "POST",
          body: payload,
        });
        const body = await response.json();
        console.log(body);
        if (body.status == 201) {
          alert("✅");
          window.location.reload();
        } else {
          alert(body);
        }
      }
    } catch (e: any) {
      alert(e);
    }
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
      <div className="flex flex-col justify-center items-center gap-2 text-center m-8">
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
          className="cursor-pointer p-4 rounded bg-gray-300"
          onClick={() => upload()}
        >
          Upload
        </div>
      </div>
    </div>
  );
}
