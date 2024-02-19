"use client";
import {
  ArrowUturnLeftIcon,
  PlusCircleIcon,
  EyeSlashIcon,
} from "@heroicons/react/24/solid";
import { Title } from "@tremor/react";
import { Button } from "@tremor/react";
import Link from "next/link";
import React, { useState } from "react";
import { AreaChart, Card } from "@tremor/react";
import DividerComponent from "./DividerComponent";
import { ProgressCircle } from "@tremor/react";
import { Text } from "@tremor/react";
import { Table } from "@tremor/react";
import { TableHead } from "@tremor/react";
import { TableRow } from "@tremor/react";
import { TableHeaderCell } from "@tremor/react";
import { Badge } from "@tremor/react";
import { TableBody } from "@tremor/react";
import { TableCell } from "@tremor/react";
import { deleteNotification } from "@/lib/firebase/firestore";
import { useRouter } from "next/navigation";
import GeminiChatbot from "./GeminiChatbot";

const CompareComponent = ({ data }) => (
  <Card className="flex flex-col items-center gap-8">
    <Title>{data.id}</Title>
    <img src={data.image} width={256} height={256} />
    <div className="flex gap-4 items-center">
      <Title>Forest Fire : </Title>
      <ProgressCircle
        color="red"
        value={data.forest_fire_pred.prediction}
        size="lg"
      >
        <Text className="text-xl font-medium">
          {data.forest_fire_pred.prediction.toFixed(2)}%
        </Text>
      </ProgressCircle>
    </div>
    <div className="flex gap-4 items-center">
      <Title>Trees Cover : </Title>
      <ProgressCircle
        color="red"
        value={data.trees_pred.predictions.trees}
        size="lg"
      >
        <Text className="text-xl font-medium">
          {data.trees_pred.predictions.trees.toFixed(2)}%
        </Text>
      </ProgressCircle>
    </div>
    <div className="flex gap-4 items-center">
      <Title>Chainsaw : </Title>
      <Title>{data.chainsaw_pred.prediction.length ? "Yes" : "No"}</Title>
    </div>
    <Badge color="amber">
      {new Date(data.timestamp.seconds * 1000).toISOString().split("T")[0]}
    </Badge>
  </Card>
);

export default function Region({ _region, _data, _notifications, regionId }) {
  const region = JSON.parse(_region);
  const data = JSON.parse(_data);
  const router = useRouter();

  const chartData = data.map((d) => {
    return {
      y: d["trees_pred"]["predictions"]["trees"].toFixed(2),
      x: new Date(d["timestamp"]["seconds"] * 1000).toISOString().split("T")[0],
    };
  });
  const notifications = JSON.parse(_notifications);
  const [compare1, setCompare1] = useState(null);
  const [compare2, setCompare2] = useState(null);
  return (
    <main className="flex flex-col gap-8 container py-12">
      <GeminiChatbot />
      <Link href="/dashboard" className="w-fit">
        <Button color="red" icon={ArrowUturnLeftIcon}>
          Go Back
        </Button>
      </Link>
      <Link href={`/dashboard/${region.id}/create-data-point`}>
        <Button className="w-full py-12">
          <span className="flex items-center gap-4">
            <PlusCircleIcon color="white" width={50} />
            <Title>Create a New Data Point</Title>
          </span>
        </Button>
      </Link>
      {data.length !== 0 && (
        <div>
          <DividerComponent>Visualisations</DividerComponent>
          <Card decoration="top" decorationColor="yellow">
            <Title>Trees Cover over Time</Title>
            <AreaChart
              className="h-72 mt-4"
              data={chartData}
              index="x"
              categories={["y"]}
              colors={["indigo"]}
              yAxisWidth={30}
              connectNulls={true}
            />
          </Card>
          <DividerComponent>Latest Data Analysis</DividerComponent>
          <div className="gap-8 grid grid-cols-3">
            <Card
              decoration="top"
              decorationColor="red"
              className="flex flex-col gap-4"
            >
              <Title>Forest Fire Prediction</Title>
              <ProgressCircle
                color="red"
                value={data[0].forest_fire_pred.prediction}
                size="lg"
              >
                <Text className="text-xl font-medium">
                  {data[0].forest_fire_pred.prediction.toFixed(2)}%
                </Text>
              </ProgressCircle>
            </Card>
            <Card
              decoration="top"
              decorationColor="green"
              className="flex flex-col gap-4"
            >
              <Title>Chainsaw Audio Prediction</Title>
              <Text className="text-xl font-medium">
                {data[0].chainsaw_pred.prediction.length ? "Yes" : "No"}
              </Text>
            </Card>
            <Card
              decoration="top"
              decorationColor="blue"
              className="flex flex-col gap-4"
            >
              <Title>Trees Cover Percentage</Title>
              <ProgressCircle
                color="blue"
                value={data[0].trees_pred.predictions.trees}
                size="lg"
              >
                <Text className="text-xl font-medium">
                  {data[0].trees_pred.predictions.trees.toFixed(2)}%
                </Text>
              </ProgressCircle>
            </Card>
          </div>
          <DividerComponent>Recent Notifications</DividerComponent>
          <Card>
            <Title>Recent Notifications</Title>
            <Table className="mt-5">
              <TableHead>
                <TableRow>
                  <TableHeaderCell>Content</TableHeaderCell>
                  <TableHeaderCell className="text-center">
                    Date
                  </TableHeaderCell>
                  <TableHeaderCell className="text-center">
                    Actions
                  </TableHeaderCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {notifications.map((item, i) => (
                  <TableRow key={i}>
                    <TableCell>
                      {item.type == "chainsaw"
                        ? "Chainsaw Sound"
                        : "Forest Fire Alert"}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge color="amber">
                        {
                          new Date(item.timestamp.seconds * 1000)
                            .toISOString()
                            .split("T")[0]
                        }
                      </Badge>
                    </TableCell>

                    <TableCell className="text-center">
                      <Button
                        color="red"
                        icon={EyeSlashIcon}
                        onClick={async () => {
                          await deleteNotification(item.id, regionId);
                          router.refresh();
                        }}
                      >
                        Mark as Read
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
          <DividerComponent>Data Points</DividerComponent>
          <Card>
            <Title>Data Points</Title>
            <Table className="mt-5">
              <TableHead>
                <TableRow>
                  <TableHeaderCell>ID</TableHeaderCell>
                  <TableHeaderCell className="text-center">
                    Image
                  </TableHeaderCell>
                  <TableHeaderCell className="text-center">
                    Date
                  </TableHeaderCell>
                  <TableHeaderCell className="text-center">
                    Forest Fire
                  </TableHeaderCell>
                  <TableHeaderCell className="text-center">
                    Chain Saw
                  </TableHeaderCell>
                  <TableHeaderCell className="text-center">
                    Trees Cover
                  </TableHeaderCell>
                  <TableHeaderCell className="text-center">
                    Actions
                  </TableHeaderCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map((item, i) => (
                  <TableRow key={i}>
                    <TableCell>{item.id}</TableCell>
                    <TableCell className="flex justify-center">
                      <img src={item.image} width={128} height={128} />
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge color="amber">
                        {
                          new Date(item.timestamp.seconds * 1000)
                            .toISOString()
                            .split("T")[0]
                        }
                      </Badge>
                    </TableCell>
                    <TableCell className="flex justify-center">
                      <ProgressCircle
                        color="red"
                        value={item.forest_fire_pred.prediction}
                        size="lg"
                      >
                        <Text className="text-xl font-medium">
                          {item.forest_fire_pred.prediction.toFixed(2)}%
                        </Text>
                      </ProgressCircle>
                    </TableCell>
                    <TableCell className="text-center">
                      <Text className="text-xl font-medium">
                        {item.chainsaw_pred.prediction.length ? "Yes" : "No"}
                      </Text>
                    </TableCell>
                    <TableCell className="flex justify-center">
                      <ProgressCircle
                        color="blue"
                        value={item.trees_pred.predictions.trees}
                        size="lg"
                      >
                        <Text className="text-xl font-medium">
                          {item.trees_pred.predictions.trees.toFixed(2)}%
                        </Text>
                      </ProgressCircle>
                    </TableCell>
                    <TableCell className="text-center">
                      <Button
                        className="block mb-2"
                        onClick={() => setCompare1(item)}
                      >
                        Add to Compare 1
                      </Button>
                      <Button
                        className="block"
                        onClick={() => setCompare2(item)}
                      >
                        Add to Compare 2
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
          <DividerComponent>Compare</DividerComponent>
          <div className="grid grid-cols-2 gap-8">
            {compare1 && <CompareComponent data={compare1} />}
            {compare2 && <CompareComponent data={compare2} />}
          </div>
        </div>
      )}
    </main>
  );
}
