import React from "react";
import {
  Tabs,
  TabsHeader,
  TabsBody,
  Tab,
  TabPanel,
  Avatar,
  Button,
  Typography,
} from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";
import Parks from "@/widgets/tabs/parks";
import Spots from "@/widgets/tabs/spots";

export function New() {
  const navigate = useNavigate();

  const data = [
    {
      label: "Parks",
      value: "parks",
      component: <Parks />,
    },
    {
      label: "Spots",
      value: "spots",
      component: <Spots />,
    },
  ];

  return (
    <>
      <div className="flex h-full w-full flex-col p-4">
        <div className="my-5 w-full">
          <Button
            onClick={() => navigate("/")}
            variant="outlined"
            className="flex items-center justify-center border-[#D5D5D5] px-4 py-2"
          >
            <Avatar src={"/img/back.svg"} className="h-6 w-6 rounded-none" />
            <Typography className="mr-2 text-sm font-semibold text-black">
              Back
            </Typography>
          </Button>
        </div>
        <Tabs value="parks">
          <TabsHeader>
            {data.map(({ label, value }) => (
              <Tab key={value} value={value}>
                {label}
              </Tab>
            ))}
          </TabsHeader>
          <TabsBody>
            {data.map(({ value, component }) => (
              <TabPanel key={value} value={value}>
                {component}
              </TabPanel>
            ))}
          </TabsBody>
        </Tabs>
      </div>
    </>
  );
}

export default New;
