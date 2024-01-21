"use client";
import { Metric } from "@tremor/react";
import Typewriter from "typewriter-effect";

export default function TypeWriterText({ finalText }) {
  return (
    <Typewriter
      component={Metric}
      onInit={(typewriter) => {
        typewriter
          .typeString("Welcome to Vanrakshak !")
          .pauseFor(500)
          .deleteAll()
          .typeString("Let's Make this World a Better Place !")
          .pauseFor(500)
          .deleteAll()
          .typeString(finalText)
          .start();
      }}
    />
  );
}
