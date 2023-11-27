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
      const fileInput = document.getElementById("picture");
      if (fileInput) {
        for (const file of fileInput.files) {
          // console.log(URL.createObjectURL(file));
          let payload = new FormData();
          payload.append("file", file);
          payload.append("user", "hannes");
          const response = await fetch("/api/image", {
            method: "POST",
            body: payload,
          });
          const body = await response.json();
          console.log(body);
        }
      }
    } catch (e: any) {
      console.log(e);
      const errorDiv = document.getElementById("errorDiv");
      if (errorDiv) {
        errorDiv.innerText = e + e.stack;
      }
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
      <div id="errorDiv"></div>
      <h1>Hello from Upload Page!</h1>
      <div
        className="p-8 border-black border-2 cursor-pointer w-32 bg-gray-300"
        onClick={() => upload()}
      >
        Upload Photo
      </div>

      <label htmlFor="picture">Upload:</label>
      <input
        id="picture"
        type="file"
        name="picture"
        accept="image/*"
        capture="user"
      />
      <div
        className="p-8 border-black border-2 cursor-pointer w-32 bg-gray-500"
        onClick={() => getPhoto()}
      >
        Get Photo
      </div>

      <img id="preview" alt="" width={300} height={300} />
    </div>
  );
}
