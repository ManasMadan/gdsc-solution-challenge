"use client";
import { Divider } from "@tremor/react";
import React from "react";

export default function DividerComponent(props) {
  return <Divider {...props}>{props.children}</Divider>;
}
