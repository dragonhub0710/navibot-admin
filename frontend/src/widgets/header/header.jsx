import React from "react";
import {
  Typography,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Avatar,
  Button,
} from "@material-tailwind/react";
import { useDispatch, useSelector } from "react-redux";
import { signout } from "@/actions/auth";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const auth = useSelector((state) => state.auth);

  const handleSignOut = () => {
    dispatch(signout());
    navigate("/signin");
  };

  const navList = (
    <MenuList className="min-w-[150px] rounded-xl border-none bg-[white] shadow-[0_10px_20px_10px_rgb(0,0,0)]">
      <MenuItem>
        <div onClick={handleSignOut} className="flex items-center gap-3">
          <div className="h-auto w-6">
            <Avatar
              src={"/img/logout.svg"}
              className="h-auto w-5 rounded-none"
            />
          </div>
          <Typography className="text-base text-[#26262b]">Sign Out</Typography>
        </div>
      </MenuItem>
    </MenuList>
  );

  return (
    <div className="fixed top-0 z-40 flex h-16 w-full border-b-[2px] bg-white">
      <div className="container mx-auto flex h-full items-center justify-between px-4">
        <a href="/">
          <Typography className="font-custom text-xl font-semibold uppercase tracking-[0.05em] text-black">
            Navibot
          </Typography>
        </a>
        {auth.isAuthenticated && (
          <Menu
            placement="bottom-end"
            animate={{
              mount: { y: 10 },
              unmount: { y: 0 },
            }}
          >
            <MenuHandler>
              <div className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border-[1px] border-[black] text-lg font-medium uppercase text-black hover:shadow-lg">
                {auth.user.email[0]}
              </div>
            </MenuHandler>
            {navList}
          </Menu>
        )}
      </div>
    </div>
  );
};

export default Header;
