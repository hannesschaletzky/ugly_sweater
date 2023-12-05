/* eslint-disable @next/next/no-img-element */

import Spinner from "../app/components/spinner";

async function fetchPhoto(filename: string) {
  const response = await fetch(
    `http://localhost:3000/api/images?filename=${filename}`,
    {
      method: "GET",
    }
  );
  // receives base64 representation of image
  const base64 = await response.json();
  // concat to valid format for html img tag
  return "data:image/png;base64, " + base64;
}

// This gets called on every request
export async function getServerSideProps() {
  const res = await fetch("http://localhost:3000/api/db");
  const body = await res.json();
  const entries: Entry[] = Object.values(body);
  // fetch photos
  for (let i = 0; i < entries.length; i++) {
    const entry = entries[i];
    entry.base64img = await fetchPhoto(entry.filename);
  }
  // sort desc
  entries.sort((a, b) => b.upvotes - a.upvotes);
  // return
  // console.log(entries);
  return { props: { entries } };
}

export default function Page({ entries }: { entries: Entry[] }) {
  console.log(entries);

  let remainingUpvotes = 3;
  let loading = false;

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
          <div className="slider flex flex-col items-center justify-center w-screen h-screen gap-3 text-white text-xl">
            <Spinner />
            <div>Sorry for the wait...</div>
            <div>It is rather a prototype</div>
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
                      // onClick={() => {
                      //   upvote(entry.name);
                      // }}
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
