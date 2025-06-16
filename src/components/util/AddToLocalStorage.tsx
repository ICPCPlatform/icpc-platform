"use client";

import NoSSR from "./NoSSR";

export default function AddToLocalStorage({
  key_,
  value,
}: {
  key_: string;
  value: string;
}) {
  console.log(key_, value);
  return (
    <NoSSR>
      <AddToLocalStorageComp key_={key_} value={value} />
    </NoSSR>
  );
}

function AddToLocalStorageComp({
  key_,
  value,
}: {
  key_: string;
  value: string;
}) {
  localStorage.setItem(key_, value);
  return <></>;
}
