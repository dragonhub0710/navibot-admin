import React, { useEffect, useState } from "react";
import {
  Typography,
  Avatar,
  Button,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Input,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Textarea,
} from "@material-tailwind/react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Header from "@/widgets/header/header";
import { useDispatch, useSelector } from "react-redux";
import {
  getSpotList,
  deleteSpot,
  updateSpot,
  deleteImages,
  uploadImages,
} from "@/actions/spot";
import {
  TrashIcon,
  PencilIcon,
  XMarkIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";
import Lottie from "react-lottie";
import loading from "@/widgets/solid_loading.json";

export function Spot() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [parkId, setParkId] = useState(0);
  const [pageNum, setPageNum] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [prevDisable, setPrevDisable] = useState(false);
  const [nextDisable, setNextDisable] = useState(false);
  const [openPageSizeMenu, setOpenPageSizeMenu] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [deleteSpotId, setDeleteSpotId] = useState(0);
  const [editSpotIndex, setEditSpotIndex] = useState(-1);
  const [editSpotId, setEditSpotId] = useState(0);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState([]);
  const [videos, setVideos] = useState([]);
  const [longitude, setLongitude] = useState(0);
  const [latitude, setLatitude] = useState(0);
  const [latitudeError, setLatitudeError] = useState(false);
  const [longitudeError, setLongitudeError] = useState(false);
  const spot = useSelector((state) => state.spot);

  // Constants for file limits (in bytes)
  const IMAGE_SIZE_LIMIT = 5 * 1024 * 1024; // 5MB
  const VIDEO_SIZE_LIMIT = 100 * 1024 * 1024; // 100MB

  const defaultLoading = {
    loop: true,
    autoplay: true,
    animationData: loading,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const TABLE_HEAD = ["No", "Name", "Latitude", "Longitude", "Park", "Action"];

  useEffect(() => {
    const park = searchParams.get("park");
    const defaultPage = searchParams.get("page") || 1;
    const defaultSize = searchParams.get("size") || 5;

    setPageNum(Number(defaultPage));
    setPageSize(Number(defaultSize));
    setParkId(Number(park));

    const data = {
      pageNum: Number(defaultPage),
      pageSize: Number(defaultSize),
      parkId: Number(park),
    };
    dispatch(getSpotList(data));
  }, [searchParams]);

  useEffect(() => {
    const totalPages = Math.ceil(spot.totalSpots / pageSize);
    if (pageNum == totalPages) {
      setNextDisable(true);
    } else {
      setNextDisable(false);
    }
    if (pageNum == 1) {
      setPrevDisable(true);
    } else {
      setPrevDisable(false);
    }
  }, [pageNum, pageSize]);

  useEffect(() => {
    if (spot.spotList && spot.spotList.length > 0 && editSpotIndex != -1) {
      setEditSpotId(spot.spotList[editSpotIndex].id);
      setName(spot.spotList[editSpotIndex].name || "");
      setDescription(spot.spotList[editSpotIndex].description || "");
      setLatitude(spot.spotList[editSpotIndex].latitude);
      setLongitude(spot.spotList[editSpotIndex].longitude);
      if (spot.spotList[editSpotIndex].images) {
        const initialImageObjects = spot.spotList[
          editSpotIndex
        ].images.data.map((url) => ({
          preview: url,
          isExisting: true, // Flag to identify existing images vs new uploads
        }));
        setImages(initialImageObjects);
      } else {
        setImages([]);
      }
      if (spot.spotList[editSpotIndex].videos) {
        const initialVideoObjects = spot.spotList[
          editSpotIndex
        ].videos.data.map((url) => ({
          preview: url,
          isExisting: true, // Flag to identify existing images vs new uploads
        }));
        setVideos(initialVideoObjects);
      } else {
        setVideos([]);
      }
    }
  }, [editSpotIndex]);

  const handlePlusPageNum = () => {
    const totalPages = Math.ceil(spot.totalSpots / pageSize);
    if (pageNum == totalPages) {
      return;
    }
    navigate(`/spot?park=${parkId}&page=${pageNum + 1}&size=${pageSize}`);
  };

  const handleMinusPageNum = () => {
    if (pageNum == 1) {
      return;
    }
    navigate(`/spot?park=${parkId}&page=${pageNum - 1}&size=${pageSize}`);
  };

  const handleChangePageNum = (e) => {
    const value = handleCheckPageNum(e.target.value);
    navigate(`/spot?park=${parkId}&page=${value}&size=${pageSize}`);
  };

  const handleCheckPageNum = (value) => {
    if (value < 1) {
      return 1;
    }
    if (value > Math.ceil(spot.totalSpots / pageSize)) {
      return Math.ceil(spot.totalSpots / pageSize);
    }
    return Number(value);
  };

  const handleChangePageSize = (value) => {
    navigate(`/spot?park=${parkId}&page=${pageNum}&size=${value}`);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      const value = handleCheckPageNum(e.target.value);
      navigate(`/spot?park=${parkId}&page=${value}&size=${pageSize}`);
    }
  };

  const handleOpenDeleteDialog = (id) => {
    setDeleteSpotId(id);
    setOpenDeleteDialog(true);
  };

  const handleDeleteSpot = () => {
    const data = {
      id: deleteSpotId,
      parkId,
      pageNum,
      pageSize,
    };
    setIsLoading(true);
    dispatch(deleteSpot(data)).finally(() => {
      setIsLoading(false);
      setOpenDeleteDialog(false);
    });
  };

  const handleOpenEditDialog = (index) => {
    setEditSpotIndex(index);
    setOpenEditDialog(true);
  };

  const handleChangeLatitude = (e) => {
    setLatitude(e.target.value);
  };

  const handleChangeLongitude = (e) => {
    setLongitude(e.target.value);
  };

  const handleEditSpot = async () => {
    if (Number(latitude) < -90 || Number(latitude) > 90) {
      setLatitudeError(true);
      return;
    }
    if (Number(longitude) < -180 || Number(longitude) > 180) {
      setLongitudeError(true);
      return;
    }

    let newImageList = [];
    let removedImageList = [];
    let imageUrls = [];
    const originalImages = spot.spotList[editSpotIndex].images?.data || [];
    if (originalImages.length > 0) {
      removedImageList = originalImages.filter((url) => !images.includes(url));
    }
    images.forEach((image) => {
      if (!image.isExisting) {
        newImageList.push(image.file);
      } else {
        imageUrls.push(image.preview);
      }
    });

    let newVideoList = [];
    let removedVideoList = [];
    let videoUrls = [];
    const originalVideos = spot.spotList[editSpotIndex].videos?.data || [];
    if (originalVideos.length > 0) {
      removedVideoList = originalVideos.filter((url) => !videos.includes(url));
    }
    videos.forEach((video) => {
      if (!video.isExisting) {
        newVideoList.push(video.file);
      } else {
        videoUrls.push(video.preview);
      }
    });

    setIsLoading(true);
    try {
      // Upload images and collect URLs
      const imageNewUrls = await Promise.all(
        newImageList.map(async (file) => {
          if (file) {
            const fileName = `${Date.now()}-${file.name}`;
            const formData = new FormData();
            formData.append("file", file);
            formData.append("fileName", fileName);

            const response = await fetch(
              `${import.meta.env.VITE_API_BASED_URL}/media/image`,
              {
                method: "POST",
                body: formData,
              }
            );
            const { url } = await response.json();
            return url;
          }
        })
      );

      // Upload videos and collect URLs
      const videoNewUrls = await Promise.all(
        newVideoList.map(async (file) => {
          if (file) {
            const fileName = `${Date.now()}-${file.name}`;
            const formData = new FormData();
            formData.append("file", file);
            formData.append("fileName", fileName);

            const response = await fetch(
              `${import.meta.env.VITE_API_BASED_URL}/media/video`,
              {
                method: "POST",
                body: formData,
              }
            );
            const { url } = await response.json();
            return url;
          }
        })
      );

      imageUrls = [...imageNewUrls, ...imageUrls];
      videoUrls = [...videoNewUrls, ...videoUrls];
      const data = {
        id: editSpotId,
        pageNum,
        pageSize,
        parkId,
        name,
        description,
        latitude,
        longitude,
        images: imageUrls,
        videos: videoUrls,
        removedImageList,
        removedVideoList,
      };
      dispatch(updateSpot(data)).finally(() => {
        setIsLoading(false);
        setOpenEditDialog(false);
      });
    } catch (error) {
      console.error("Error creating spot:", error);
      // You might want to show an error message to the user here
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteImage = (index) => {
    let list = [...images];
    if (!list[index].isExisting) {
      URL.revokeObjectURL(list[index].preview);
    }
    list.splice(index, 1);
    setImages(list);
  };

  const handleAddImage = (e) => {
    const files = Array.from(e.target.files);

    const newImages = files
      .map((file) => {
        if (file.size > IMAGE_SIZE_LIMIT) {
          alert(`Image ${file.name} exceeds 5MB size limit`);
          return null;
        }
        return {
          file: file,
          preview: URL.createObjectURL(file),
          isExisting: false,
        };
      })
      .filter(Boolean);
    let list = [...images, ...newImages];
    setImages(list);
  };

  const handleDeleteVideo = (index) => {
    setVideos((prev) => {
      const newVideos = [...prev];
      // Only revoke URL if it's a new upload, not an existing URL
      if (!newVideos[index].isExisting) {
        URL.revokeObjectURL(newVideos[index].preview);
      }
      newVideos.splice(index, 1);
      return newVideos;
    });
  };

  const handleAddVideo = (e) => {
    const files = Array.from(e.target.files);

    const newVideos = files
      .map((file) => {
        if (file.size > VIDEO_SIZE_LIMIT) {
          alert(`Video ${file.name} exceeds 100MB size limit`);
          return null;
        }
        return {
          file: file,
          preview: URL.createObjectURL(file),
          isExisting: false,
        };
      })
      .filter(Boolean);

    setVideos((prev) => [...prev, ...newVideos]);
  };

  return (
    <>
      <div className="flex h-full w-full flex-col">
        <Header />
        <div className="container mx-auto flex h-full w-full flex-1 flex-col items-center pt-16">
          <div className="flex h-24 w-full items-center justify-end px-10">
            <Button
              onClick={() => navigate("/new")}
              variant="outlined"
              className="flex h-10 w-16 items-center justify-center border-[1px] border-[#D5D5D5] p-0 text-base font-normal normal-case text-black"
            >
              New
            </Button>
          </div>
          <table className="w-full min-w-max table-auto text-left shadow-[0_3px_3px_rgba(0,0,0,0.5)]">
            <thead>
              <tr>
                {TABLE_HEAD.map((head) => (
                  <th key={head} className="bg-[#d8d8d8] p-4 ">
                    <Typography
                      variant="small"
                      className="text-base font-normal leading-none text-black"
                    >
                      {head}
                    </Typography>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {spot.spotList &&
                spot.spotList.map((item, index) => {
                  const isLast = index === spot.spotList.length - 1;
                  const classes = isLast
                    ? "p-4"
                    : "p-4 border-b border-blue-gray-50";

                  return (
                    <tr key={index}>
                      <td className={classes}>
                        <Typography variant="small" className="font-normal">
                          {index + 1}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <Typography variant="small" className="font-normal">
                          {item.name}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <Typography variant="small" className="font-normal">
                          {item.latitude}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <Typography variant="small" className="font-normal">
                          {item.longitude}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <Typography variant="small" className="font-normal">
                          {item.park}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <div className="flex items-center gap-2">
                          <Button
                            onClick={() => handleOpenEditDialog(index)}
                            variant="text"
                            className="p-2"
                          >
                            <PencilIcon className="h-5 w-5 text-black" />
                          </Button>
                          <Button
                            onClick={() => handleOpenDeleteDialog(item.id)}
                            variant="text"
                            className="p-2"
                          >
                            <TrashIcon className="h-5 w-5 text-black" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
          <div className="mb-20 mt-10 flex w-full items-center justify-between px-10">
            <div className="flex">
              <Button
                variant="outlined"
                disabled={prevDisable}
                className="flex items-center justify-center border-[1px] border-[#D5D5D5] px-4 py-2 text-sm font-normal normal-case text-black"
                onClick={handleMinusPageNum}
              >
                Prev
              </Button>
              <div className="mx-2 flex w-fit items-center rounded-lg border-[1px] border-[#D5D5D5]">
                <Input
                  value={pageNum}
                  onChange={handleChangePageNum}
                  onKeyDown={handleKeyDown}
                  className="!border-none text-center !text-black"
                  labelProps={{
                    className: "before:content-none after:content-none",
                  }}
                />
              </div>
              <Button
                variant="outlined"
                disabled={nextDisable}
                className="flex items-center justify-center border-[1px] border-[#D5D5D5] px-4 py-2 text-sm font-normal normal-case text-black"
                onClick={handlePlusPageNum}
              >
                Next
              </Button>
            </div>
            {isLoading && (
              <Lottie options={defaultLoading} height={45} width={45} />
            )}
            <div className="flex w-[250px] items-center gap-3">
              <Typography className="text-base font-medium text-black">
                Page rows:
              </Typography>
              <Menu
                open={openPageSizeMenu}
                handler={setOpenPageSizeMenu}
                allowHover
              >
                <MenuHandler>
                  <Button
                    variant="outlined"
                    className="flex items-center justify-center gap-3 border-[1px] border-[#D5D5D5] p-0 px-4 py-2 text-base font-normal capitalize tracking-normal text-black"
                  >
                    {pageSize}&nbsp;
                    <div
                      className={`flex h-3.5 w-3.5 items-center text-black transition-transform ${
                        openPageSizeMenu ? "rotate-180" : ""
                      }`}
                    >
                      <Avatar src="/img/drop.svg" className="h-full w-full" />
                    </div>
                  </Button>
                </MenuHandler>
                <MenuList className="!min-w-24 !max-w-24">
                  <MenuItem
                    onClick={() => handleChangePageSize(5)}
                    className="text-black"
                  >
                    5
                  </MenuItem>
                  <MenuItem
                    onClick={() => handleChangePageSize(10)}
                    className="text-black"
                  >
                    10
                  </MenuItem>
                  <MenuItem
                    onClick={() => handleChangePageSize(25)}
                    className="text-black"
                  >
                    25
                  </MenuItem>
                </MenuList>
              </Menu>
            </div>
          </div>
        </div>
      </div>
      <Dialog open={openDeleteDialog} handler={setOpenDeleteDialog}>
        <DialogHeader>Delete Spot</DialogHeader>
        <DialogBody>
          <Typography className="text-base font-normal text-black">
            Are you sure you want to delete this spot?
          </Typography>
        </DialogBody>
        <DialogFooter className="flex gap-3">
          <Button
            variant="outlined"
            className="h-10 border-[#D5D5D5] px-6 py-2 text-base normal-case text-black"
            onClick={() => setOpenDeleteDialog(false)}
          >
            Cancel
          </Button>
          <Button
            variant="outlined"
            className="flex h-10 items-center justify-center border-[#D5D5D5] px-6 py-2 text-base normal-case text-black"
            onClick={handleDeleteSpot}
          >
            {isLoading && (
              <Lottie options={defaultLoading} height={36} width={36} />
            )}
            Delete
          </Button>
        </DialogFooter>
      </Dialog>
      <Dialog open={openEditDialog} handler={setOpenEditDialog}>
        <DialogHeader>Edit Spot</DialogHeader>
        <DialogBody>
          <div className="h-full w-full">
            <div className="my-4 flex h-full w-full items-center">
              <Typography className="w-24 text-base font-medium text-black">
                Name
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
              <Typography className="w-24 text-base font-medium text-black">
                Latitude
              </Typography>
              <div className="mx-4 rounded-lg border-[1px] border-[#D5D5D5] p-[2px]">
                <Input
                  onChange={handleChangeLatitude}
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
              <Typography className="w-24 text-base font-medium text-black">
                Longitude
              </Typography>
              <div className="mx-4 rounded-lg border-[1px] border-[#D5D5D5] p-[2px]">
                <Input
                  onChange={handleChangeLongitude}
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
              <Typography className="w-24 text-base font-medium text-black">
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
            <div className="my-4 flex h-full w-full">
              <Typography className="w-24 text-base font-medium text-black">
                Attachments
              </Typography>
              <div className="mx-4 flex flex-1 flex-col gap-3">
                <div className="flex w-full flex-wrap gap-2">
                  {images &&
                    images.length > 0 &&
                    images.map((item, index) => {
                      return (
                        <div key={index} className="relative">
                          <Avatar
                            src={item.preview}
                            className="h-20 w-24 rounded-none"
                          />
                          <div
                            onClick={() => handleDeleteImage(index)}
                            className="absolute right-0 top-0"
                          >
                            <XMarkIcon className="h-5 w-5 cursor-pointer rounded-full bg-[gray] p-1 text-[white]" />
                          </div>
                        </div>
                      );
                    })}
                  <label
                    htmlFor="dropzone-file2"
                    className="flex h-20 w-24 cursor-pointer items-center justify-center"
                  >
                    <div className="flex h-full w-full flex-col items-center justify-center rounded-none border-[1px] border-[#D5D5D5] p-0 font-normal text-black">
                      <PlusIcon className="h-5 w-5 text-[#000000]" />
                      Images
                    </div>
                    <input
                      id="dropzone-file2"
                      type="file"
                      accept="image/*"
                      onChange={handleAddImage}
                      className="hidden"
                      multiple
                    />
                  </label>
                </div>
                <div className="flex w-full flex-wrap gap-2">
                  {videos &&
                    videos.length > 0 &&
                    videos.map((item, index) => {
                      return (
                        <div key={index} className="relative border-2">
                          <video className="h-20 w-24 rounded-lg">
                            <source src={item.preview} type="video/mp4" />
                          </video>
                          <div
                            onClick={() => handleDeleteVideo(index)}
                            className="absolute right-0 top-0"
                          >
                            <XMarkIcon className="h-5 w-5 cursor-pointer rounded-full bg-[gray] p-1 text-[white]" />
                          </div>
                        </div>
                      );
                    })}
                  <label
                    htmlFor="dropzone-file3"
                    className="flex h-20 w-24 cursor-pointer items-center justify-center"
                  >
                    <div className="flex h-full w-full flex-col items-center justify-center rounded-none border-[1px] border-[#D5D5D5] p-0 font-normal text-black">
                      <PlusIcon className="h-5 w-5 text-[#000000]" />
                      Videos
                    </div>
                    <input
                      id="dropzone-file3"
                      type="file"
                      accept="video/*"
                      onChange={handleAddVideo}
                      className="hidden"
                      multiple
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>
        </DialogBody>
        <DialogFooter className="flex gap-3">
          <Button
            variant="outlined"
            className="h-10 border-[#D5D5D5] px-6 py-2 text-base normal-case text-black"
            onClick={() => setOpenEditDialog(false)}
          >
            Cancel
          </Button>
          <Button
            variant="outlined"
            className="flex h-10 items-center justify-center border-[#D5D5D5] px-6 py-2 text-base normal-case text-black"
            onClick={handleEditSpot}
          >
            {isLoading && (
              <Lottie options={defaultLoading} height={36} width={36} />
            )}
            Save
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
}

export default Spot;
