import React, { useState } from "react";
import Lottie from "react-lottie";
import loading from "@/widgets/solid_loading.json";
import {
  Typography,
  Input,
  Button,
  Textarea,
  Alert,
} from "@material-tailwind/react";
import { useDispatch } from "react-redux";
import { createPark } from "@/actions/park";

const Parks = () => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [description, setDescription] = useState("");
  const [latitude, setLatitude] = useState(0);
  const [latitudeError, setLatitudeError] = useState(false);
  const [longitude, setLongitude] = useState(0);
  const [longitudeError, setLongitudeError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const defaultLoading = {
    loop: true,
    autoplay: true,
    animationData: loading,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const handleLatitudeChange = (e) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value) && value >= -90 && value <= 90) {
      setLatitude(value);
      setLatitudeError(false);
    } else {
      setLatitudeError(true);
    }
  };

  const handleLongitudeChange = (e) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value) && value >= -180 && value <= 180) {
      setLongitude(value);
      setLongitudeError(false);
    } else {
      setLongitudeError(true);
    }
  };

  const handleCreatePark = () => {
    if (latitudeError || longitudeError) return;
    if (name === "" || address === "" || description === "") return;

    setIsLoading(true);
    dispatch(
      createPark({ name, address, description, latitude, longitude })
    ).then(() => {
      setIsLoading(false);
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
      }, 3000);
      setName("");
      setAddress("");
      setDescription("");
      setLatitude(0);
      setLongitude(0);
      setLatitudeError(false);
      setLongitudeError(false);
    });
  };

  return (
    <div className="flex h-full w-full flex-col">
      {isSuccess && <Alert>Park created successfully</Alert>}
      <div className="mx-auto h-full w-[560px]">
        <div className="my-4 flex h-full w-full items-center">
          <Typography className="w-24 text-lg font-semibold text-black">
            Park
          </Typography>
          <div className="mx-4 flex-1 rounded-lg border-[1px] border-[#D5D5D5] p-[2px]">
            <Input
              onChange={(e) => setName(e.target.value)}
              value={name}
              variant="outlined"
              className="!border-none !text-base !text-black"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
            />
          </div>
        </div>
        <div className="my-4 flex h-full w-full items-center">
          <Typography className="w-24 text-lg font-semibold text-black">
            Address
          </Typography>
          <div className="mx-4 flex-1 rounded-lg border-[1px] border-[#D5D5D5] p-[2px]">
            <Input
              onChange={(e) => setAddress(e.target.value)}
              value={address}
              variant="outlined"
              className="!border-none !text-base !text-black"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
            />
          </div>
        </div>
        <div className="mt-4 flex h-full w-full items-center">
          <Typography className="w-24 text-lg font-semibold text-black">
            Latitude
          </Typography>
          <div className="mx-4 rounded-lg border-[1px] border-[#D5D5D5] p-[2px]">
            <Input
              onChange={handleLatitudeChange}
              value={latitude}
              variant="outlined"
              className="!border-none !text-base !text-black"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
            />
          </div>
        </div>
        {latitudeError && (
          <div className="mt-1 flex w-[205px] items-center justify-end">
            <Typography className="text-sm font-normal text-red-500">
              Invalid latitude
            </Typography>
          </div>
        )}
        <div className="mt-4 flex h-full w-full items-center">
          <Typography className="w-24 text-lg font-semibold text-black">
            Longitude
          </Typography>
          <div className="mx-4 rounded-lg border-[1px] border-[#D5D5D5] p-[2px]">
            <Input
              onChange={handleLongitudeChange}
              value={longitude}
              variant="outlined"
              className="!border-none !text-base !text-black"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
            />
          </div>
        </div>
        {longitudeError && (
          <div className="mt-1 flex w-[218px] items-center justify-end">
            <Typography className="text-sm font-normal text-red-500">
              Invalid longitude
            </Typography>
          </div>
        )}
        <div className="my-4 flex h-full w-full items-center">
          <Typography className="w-24 text-lg font-semibold text-black">
            Park Description
          </Typography>
          <div className="mx-4 flex-1 rounded-lg border-[1px] border-[#D5D5D5] p-[2px]">
            <Textarea
              onChange={(e) => setDescription(e.target.value)}
              value={description}
              variant="outlined"
              className="!resize !border-none !text-base !text-black"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
            />
          </div>
        </div>
        <div className="my-5 flex h-full w-full items-center justify-end px-4">
          <Button
            onClick={handleCreatePark}
            variant="outlined"
            className="flex h-10 w-[180px] items-center justify-center border-[#D5D5D5] px-6 py-2 text-base font-semibold normal-case text-black"
          >
            {isLoading && (
              <Lottie options={defaultLoading} height={36} width={36} />
            )}
            Create Park
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Parks;
