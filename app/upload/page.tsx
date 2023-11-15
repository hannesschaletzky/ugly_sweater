"use client";

declare global {
  interface HTMLElement {
    files: any;
  }
}

export default function Page() {
  async function upload() {
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
  }

  async function getPhoto() {
    const response = await fetch("/api/image", {
      method: "GET",
    });
    const body = await response.formData();
    console.log(body);

    // let imgTag = document.getElementById("preview") as HTMLImageElement;
    // imgTag.src = URL.createObjectURL(body);
  }

  return (
    <div>
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

      <img id="preview" src="" alt="" width={300} height={300} />
    </div>
  );
}
