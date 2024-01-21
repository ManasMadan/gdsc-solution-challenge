"use client";
import React from "react";
import {
  PlusCircleIcon,
  TrashIcon,
  ChevronDoubleRightIcon,
} from "@heroicons/react/24/solid";
import {
  ProgressCircle,
  Card,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
  Title,
  Button,
} from "@tremor/react";
import { Badge } from "@tremor/react";
import { Dialog } from "@tremor/react";
import { DialogPanel } from "@tremor/react";
import Link from "next/link";
import { deleteRegion } from "@/lib/firebase/firestore";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function Regions({ regions }) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [selected, setSelected] = React.useState(null);
  const router = useRouter();

  return (
    <section>
      <Link href="/dashboard/create-region">
        <Button className="w-full py-12">
          <span className="flex items-center gap-4">
            <PlusCircleIcon color="white" width={50} />
            <Title>Create a New Region</Title>
          </span>
        </Button>
      </Link>
      <Card className="mt-8">
        <Title>Your Regions</Title>
        <Table className="mt-5">
          <TableHead>
            <TableRow>
              <TableHeaderCell>Name</TableHeaderCell>
              <TableHeaderCell>Area</TableHeaderCell>
              <TableHeaderCell className="text-center">
                Unread Notifications
              </TableHeaderCell>
              <TableHeaderCell className="text-center">
                Last Updated
              </TableHeaderCell>
              <TableHeaderCell className="text-center">
                Trees Percentage
              </TableHeaderCell>
              <TableHeaderCell className="text-center">Actions</TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {regions.map((item, i) => (
              <TableRow key={item.name}>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.area}</TableCell>
                <TableCell className="text-center">
                  <Badge color="sky">{item.notifications_count}</Badge>
                </TableCell>
                <TableCell className="text-center">
                  <Badge color="amber">
                    {
                      new Date(item.last_updated.seconds * 1000)
                        .toISOString()
                        .split("T")[0]
                    }
                  </Badge>
                </TableCell>
                <TableCell>
                  <ProgressCircle
                    color="green"
                    value={item.percentage_trees}
                    size="md"
                  >
                    <span className="text-xs font-medium">
                      {item.percentage_trees.toFixed(2)}%
                    </span>
                  </ProgressCircle>
                </TableCell>

                <TableCell>
                  <div className="flex justify-center gap-4">
                    <Button
                      color="red"
                      icon={TrashIcon}
                      onClick={() => {
                        setIsOpen(true);
                        setSelected(regions[i]);
                      }}
                    >
                      Delete
                    </Button>

                    <Link href={`/dashboard/` + item.id}>
                      <Button color="green" icon={ChevronDoubleRightIcon}>
                        Enter
                      </Button>
                    </Link>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
      <Dialog
        open={isOpen}
        onClose={() => {
          setIsOpen(false);
          setSelected(null);
        }}
        static={true}
      >
        <DialogPanel>
          <Title className="mb-3">Do You Wish to Delete {selected?.name}</Title>
          Note this action is irreversible.
          <div className="mt-3">
            <Button
              variant="light"
              onClick={async () => {
                try {
                  await deleteRegion(selected.id);
                  toast.success("Region Deleted Success");
                  router.refresh();
                } catch (e) {
                  console.log(e);
                  toast.error("Something Went Wrong");
                }
                setIsOpen(false);
                setSelected(null);
              }}
            >
              Confirm Deletion
            </Button>
          </div>
        </DialogPanel>
      </Dialog>
    </section>
  );
}
