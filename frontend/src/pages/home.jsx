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
import { getParkList, deletePark, updatePark } from "@/actions/park";
import { TrashIcon, PencilIcon } from "@heroicons/react/24/outline";
import Lottie from "react-lottie";
import loading from "@/widgets/solid_loading.json";

export function Home() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [pageNum, setPageNum] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [prevDisable, setPrevDisable] = useState(false);
  const [nextDisable, setNextDisable] = useState(false);
  const [openPageSizeMenu, setOpenPageSizeMenu] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [deleteParkId, setDeleteParkId] = useState(0);
  const [editParkIndex, setEditParkIndex] = useState(-1);
  const [editParkId, setEditParkId] = useState(0);
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [description, setDescription] = useState("");
  const [longitude, setLongitude] = useState(0);
  const [latitude, setLatitude] = useState(0);
  const [latitudeError, setLatitudeError] = useState(false);
  const [longitudeError, setLongitudeError] = useState(false);
  const park = useSelector((state) => state.park);

  const defaultLoading = {
    loop: true,
    autoplay: true,
    animationData: loading,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const TABLE_HEAD = [
    "No",
    "Name",
    "Address",
    "Latitude",
    "Longitude",
    "Action",
  ];

  useEffect(() => {
    const defaultPage = searchParams.get("page") || 1;
    const defaultSize = searchParams.get("size") || 5;

    setPageNum(Number(defaultPage));
    setPageSize(Number(defaultSize));

    const data = {
      pageNum: Number(defaultPage),
      pageSize: Number(defaultSize),
    };
    dispatch(getParkList(data));
  }, [searchParams]);

  useEffect(() => {
    const totalPages = Math.ceil(park.totalParks / pageSize);
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
    if (park.parkList && park.parkList.length > 0 && editParkIndex != -1) {
      setEditParkId(park.parkList[editParkIndex].id);
      setName(park.parkList[editParkIndex].name || "");
      setAddress(park.parkList[editParkIndex].address || "");
      setDescription(park.parkList[editParkIndex].description || "");
      setLatitude(park.parkList[editParkIndex].latitude);
      setLongitude(park.parkList[editParkIndex].longitude);
    }
  }, [editParkIndex]);

  const handlePlusPageNum = () => {
    const totalPages = Math.ceil(park.totalParks / pageSize);
    if (pageNum == totalPages) {
      return;
    }
    navigate(`/?page=${pageNum + 1}&size=${pageSize}`);
  };

  const handleMinusPageNum = () => {
    if (pageNum == 1) {
      return;
    }
    navigate(`/?page=${pageNum - 1}&size=${pageSize}`);
  };

  const handleChangePageNum = (e) => {
    const value = handleCheckPageNum(e.target.value);
    navigate(`/?page=${value}&size=${pageSize}`);
  };

  const handleCheckPageNum = (value) => {
    if (value < 1) {
      return 1;
    }
    if (value > Math.ceil(park.totalParks / pageSize)) {
      return Math.ceil(park.totalParks / pageSize);
    }
    return Number(value);
  };

  const handleChangePageSize = (value) => {
    navigate(`/?page=${pageNum}&size=${value}`);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      const value = handleCheckPageNum(e.target.value);
      navigate(`/?page=${value}&size=${pageSize}`);
    }
  };

  const handleOpenDeleteDialog = (id) => {
    setDeleteParkId(id);
    setOpenDeleteDialog(true);
  };

  const handleDeletePark = () => {
    const data = {
      id: deleteParkId,
      pageNum,
      pageSize,
    };
    setIsLoading(true);
    dispatch(deletePark(data)).finally(() => {
      setIsLoading(false);
      setOpenDeleteDialog(false);
    });
  };

  const handleOpenEditDialog = (index) => {
    setEditParkIndex(index);
    setOpenEditDialog(true);
  };

  const handleChangeLatitude = (e) => {
    setLatitude(e.target.value);
  };

  const handleChangeLongitude = (e) => {
    setLongitude(e.target.value);
  };

  const handleEditPark = () => {
    if (Number(latitude) < -90 || Number(latitude) > 90) {
      setLatitudeError(true);
      return;
    }
    if (Number(longitude) < -180 || Number(longitude) > 180) {
      setLongitudeError(true);
      return;
    }

    const data = {
      id: editParkId,
      name,
      address,
      description,
      longitude: Number(longitude),
      latitude: Number(latitude),
      pageNum,
      pageSize,
    };
    setIsLoading(true);
    dispatch(updatePark(data)).finally(() => {
      setIsLoading(false);
      setOpenEditDialog(false);
    });
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
              {park.parkList &&
                park.parkList.map((item, index) => {
                  const isLast = index === park.parkList.length - 1;
                  const classes = isLast
                    ? "p-4"
                    : "p-4 border-b border-blue-gray-50";

                  return (
                    <tr key={index}>
                      <td className={classes}>
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {index + 1}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <Typography
                          variant="small"
                          className="font-normal hover:text-[blue]"
                        >
                          <a href={`/spot?park=${item.id}`}>{item.name}</a>
                        </Typography>
                      </td>
                      <td className={classes}>
                        <Typography variant="small" className="font-normal">
                          {item.address}
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
        <DialogHeader>Delete Park</DialogHeader>
        <DialogBody>
          <Typography className="text-base font-normal text-black">
            Are you sure you want to delete this park?
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
            onClick={handleDeletePark}
          >
            {isLoading && (
              <Lottie options={defaultLoading} height={36} width={36} />
            )}
            Delete
          </Button>
        </DialogFooter>
      </Dialog>
      <Dialog open={openEditDialog} handler={setOpenEditDialog}>
        <DialogHeader>Edit Park</DialogHeader>
        <DialogBody>
          <div className="h-full w-full">
            <div className="my-4 flex h-full w-full items-center">
              <Typography className="w-24 text-base font-medium text-black">
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
              <Typography className="w-24 text-base font-medium text-black">
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
            onClick={handleEditPark}
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

export default Home;
