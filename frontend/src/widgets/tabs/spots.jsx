import React, { useEffect, useState } from "react";
import Lottie from "react-lottie";
import loading from "@/widgets/solid_loading.json";
import {
  Typography,
  Input,
  Textarea,
  Button,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Avatar,
  Alert,
} from "@material-tailwind/react";
import { useDispatch, useSelector } from "react-redux";
import { createSpot } from "@/actions/spot";
import { getParkList } from "@/actions/park";

const Spots = () => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [latitude, setLatitude] = useState(0);
  const [latitudeError, setLatitudeError] = useState(false);
  const [longitude, setLongitude] = useState(0);
  const [longitudeError, setLongitudeError] = useState(false);
  const [parkId, setParkId] = useState(0);
  const [parkName, setParkName] = useState("Select Park");
  const [imgFileList, setImgFileList] = useState([]);
  const [imgFileNameList, setImgFileNameList] = useState([]);
  const [videoFileList, setVideoFileList] = useState([]);
  const [videoFileNameList, setVideoFileNameList] = useState([]);
  const [isSuccess, setIsSuccess] = useState(false);
  const park = useSelector((state) => state.park);

  const defaultLoading = {
    loop: true,
    autoplay: true,
    animationData: loading,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  useEffect(() => {
    const data = {
      pageNum: 1,
      pageSize: 0,
    };
    dispatch(getParkList(data));
  }, []);

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

  const handleCreateSpot = async () => {
    if (latitudeError || longitudeError) return;
    if (parkName === "Select Park" || name === "" || description === "") return;

    setIsLoading(true);
    try {
      // Upload images and collect URLs
      const imageUrls = await Promise.all(
        imgFileList.map(async (file) => {
          const fileName = `${Date.now()}-${file.name}`;
          const formData = new FormData();
          formData.append("file", file);
          formData.append("fileName", fileName);

          const response = await fetch(
            `${import.meta.env.VITE_API_BASED_URL}/upload/image`,
            {
              method: "POST",
              body: formData,
            }
          );
          const { url } = await response.json();
          return url;
        })
      );

      // Upload videos and collect URLs
      const videoUrls = await Promise.all(
        videoFileList.map(async (file) => {
          const fileName = `${Date.now()}-${file.name}`;
          const formData = new FormData();
          formData.append("file", file);
          formData.append("fileName", fileName);

          const response = await fetch(
            `${import.meta.env.VITE_API_BASED_URL}/upload/video`,
            {
              method: "POST",
              body: formData,
            }
          );
          const { url } = await response.json();
          return url;
        })
      );

      dispatch(
        createSpot({
          name,
          description,
          latitude,
          longitude,
          parkId,
          images: imageUrls,
          videos: videoUrls,
        })
      ).then(() => {
        setIsSuccess(true);
        setTimeout(() => {
          setIsSuccess(false);
        }, 3000);
      });
    } catch (error) {
      console.error("Error creating spot:", error);
      // You might want to show an error message to the user here
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChanger = (e) => {
    let imgFiles = [...imgFileList];
    let videoFiles = [...videoFileList];
    let imgFileNames = [...imgFileNameList];
    let videoFileNames = [...videoFileNameList];

    if (e.target.files.length != 0) {
      for (let i = 0; i < e.target.files.length; i++) {
        const file = e.target.files[i];

        if (
          imgFileNames.includes(file.name) == false &&
          file.type.startsWith("image/")
        ) {
          imgFiles.push(file);
          imgFileNames.push(file.name);
          setImgFileList(imgFiles);
          setImgFileNameList(imgFileNames);
        }

        if (
          videoFileNames.includes(file.name) == false &&
          file.type.startsWith("video/")
        ) {
          videoFiles.push(file);
          videoFileNames.push(file.name);
          setVideoFileList(videoFiles);
          setVideoFileNameList(videoFileNames);
        }
      }
    }
  };

  const handleDeleteFile = (idx, type) => {
    if (type == "img") {
      setImgFileList(imgFileList.filter((_, i) => i !== idx));
      setImgFileNameList(imgFileNameList.filter((_, i) => i !== idx));
    } else if (type == "video") {
      setVideoFileList(videoFileList.filter((_, i) => i !== idx));
      setVideoFileNameList(videoFileNameList.filter((_, i) => i !== idx));
    }
  };

  return (
    <div className="flex h-full w-full flex-col">
      {isSuccess && <Alert>Spot created successfully</Alert>}
      <div className="mx-auto h-full w-[560px]">
        <div className="my-4 flex h-full w-full items-center">
          <Typography className="w-24 text-lg font-semibold text-black">
            Park
          </Typography>
          <div className="mx-4 flex-1">
            <Menu>
              <MenuHandler>
                <Button
                  variant="outlined"
                  className="line-clamp-1 flex h-10 w-full items-center justify-center border-[1px] border-[#D5D5D5] p-0 text-base font-normal normal-case text-black"
                >
                  {parkName}
                </Button>
              </MenuHandler>
              <MenuList>
                {park.parkList &&
                  park.parkList.map((park, idx) => (
                    <MenuItem
                      key={idx}
                      value={park.id}
                      onClick={() => {
                        setParkName(park.name);
                        setParkId(park.id);
                      }}
                      className="text-black"
                    >
                      {idx + 1}. {park.name}
                    </MenuItem>
                  ))}
              </MenuList>
            </Menu>
          </div>
        </div>

        <div className="my-4 flex h-full w-full items-center">
          <Typography className="w-24 text-lg font-semibold text-black">
            Spot
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
            Spot Description
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
        <div className="mt-8 flex w-full flex-col items-start">
          <Typography className="my-2 w-24 text-lg font-semibold text-black">
            Attachments
          </Typography>
          {imgFileNameList.length > 0 &&
            imgFileNameList.map((item, idx) => {
              return (
                <div key={idx} className="my-2 flex h-6 items-center">
                  <Avatar
                    src="/img/file.svg"
                    className="h-5 w-5 rounded-none"
                  />
                  <Typography className="mx-4 mt-1 text-base font-normal text-black">
                    {item}
                  </Typography>
                  <Button
                    onClick={() => handleDeleteFile(idx, "img")}
                    variant="outlined"
                    className="mx-4 flex h-8 w-8 items-center justify-center rounded-full border-[1px] border-[#D5D5D5] p-0"
                  >
                    <Avatar
                      src="/img/trash.svg"
                      className="h-auto w-5 rounded-none"
                    />
                  </Button>
                </div>
              );
            })}
          {videoFileNameList.length > 0 &&
            videoFileNameList.map((item, idx) => {
              return (
                <div key={idx} className="my-2 flex h-6 items-center">
                  <Avatar src="/img/file.svg" className="h-5 w-5" />
                  <Typography className="mx-4 mt-1 text-base font-normal text-black">
                    {item}
                  </Typography>
                  <Button
                    onClick={() => handleDeleteFile(idx, "video")}
                    variant="outlined"
                    className="mx-4 flex h-8 w-8 items-center justify-center rounded-full border-[1px] border-[#D5D5D5] p-0"
                  >
                    <Avatar src="/img/trash.svg" className="h-auto w-5" />
                  </Button>
                </div>
              );
            })}
          <div className="my-4 flex w-full items-center justify-center rounded-lg border-[1px] border-[#D5D5D5]">
            <label
              htmlFor="dropzone-file1"
              className="flex h-10 w-full cursor-pointer items-center justify-center"
            >
              <div className="flex items-center justify-center text-base font-normal text-black">
                Upload files
              </div>
              <input
                id="dropzone-file1"
                type="file"
                accept="image/*,video/*"
                onChange={handleFileChanger}
                className="hidden"
                multiple
              />
            </label>
          </div>
        </div>
        <div className="my-5 flex h-full w-full items-center justify-end">
          <Button
            onClick={handleCreateSpot}
            variant="outlined"
            className="flex h-10 w-[180px] items-center justify-center border-[#D5D5D5] px-6 py-2 text-base font-semibold normal-case text-black"
          >
            {isLoading && (
              <Lottie options={defaultLoading} height={36} width={36} />
            )}
            Create Spot
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Spots;
