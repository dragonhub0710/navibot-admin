import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Button, Typography, Input, Avatar } from "@material-tailwind/react";
import Lottie from "react-lottie";
import Loading_Animation from "../widgets/solid_loading.json";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { useNavigate, useLocation } from "react-router-dom";
import { signin, loadUser } from "@/actions/auth";
import setAuthToken from "@/utils/setAuthToken";

export function SignIn() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordShow, setPasswordShow] = useState(false);
  const [emailRequired, setEmailRequired] = useState(false);
  const [passwordRequired, setPasswordRequired] = useState(false);
  const loadingOptions = {
    loop: true,
    autoplay: true,
    animationData: Loading_Animation,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const queryToken = queryParams.get("token");

    if (queryToken) {
      setAuthToken(queryToken);
      dispatch(loadUser())
        .then(() => {
          navigate("/");
        })
        .catch((err) => console.log(err));
    }
  }, [location]);

  const handleSubmit = () => {
    if (email == "") {
      setEmailRequired(true);
      return;
    }
    if (password == "") {
      setPasswordRequired(true);
      return;
    }
    setLoading(true);
    const data = { email, password };
    dispatch(signin(data))
      .then(() => {
        setLoading(false);
        navigate("/");
      })
      .catch(() => setLoading(false));
  };

  const handleEmailChange = (e) => {
    if (e.target.value == "") {
      setEmailRequired(true);
    } else {
      setEmailRequired(false);
    }
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    if (e.target.value == "") {
      setPasswordRequired(true);
    } else {
      setPasswordRequired(false);
    }
    setPassword(e.target.value);
  };

  return (
    <>
      <div className="container mx-auto flex h-screen w-full items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="w-full text-center">
            <Typography variant="h1" className="text-center font-semibold">
              Sign In
            </Typography>
          </div>
          <div className="relative mx-auto mt-4 flex w-full flex-col justify-center lg:mt-8">
            <div className="mx-auto my-2 w-80">
              <div className="flex items-center rounded-full border-[1px] border-[#77777763] bg-[#eff2f6] pl-3">
                <Input
                  label=""
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={handleEmailChange}
                  className="!w-[272px] !border-none !text-base !text-black"
                  labelProps={{
                    className: "before:content-none after:content-none",
                  }}
                />
              </div>
              {emailRequired && (
                <Typography color="red" className="text-sm font-normal">
                  *This field is required
                </Typography>
              )}
            </div>
            <div className="mx-auto my-2 w-80">
              <div className="flex items-center rounded-full border-[1px] border-[#77777763] bg-[#eff2f6] pl-3">
                <Input
                  label=""
                  value={password}
                  placeholder="Password"
                  type={passwordShow ? "text" : "password"}
                  onChange={handlePasswordChange}
                  className="!border-none !text-base !text-black"
                  labelProps={{
                    className: "before:content-none after:content-none",
                  }}
                />
                {passwordShow ? (
                  <EyeIcon
                    className="mx-2 h-5 w-5 cursor-pointer"
                    onClick={() => setPasswordShow(!passwordShow)}
                  />
                ) : (
                  <EyeSlashIcon
                    className="mx-2 h-5 w-5 cursor-pointer"
                    onClick={() => setPasswordShow(!passwordShow)}
                  />
                )}
              </div>
              {passwordRequired && (
                <Typography color="red" className="text-sm font-normal">
                  *This field is required
                </Typography>
              )}
            </div>
            <Button
              variant="filled"
              onClick={handleSubmit}
              className="mx-auto mt-6 flex h-[50px] w-[250px] items-center justify-center rounded-full bg-[#D31500] normal-case shadow-none hover:shadow-none"
            >
              <div className="flex items-center justify-center">
                {loading && (
                  <div className="flex h-8 w-8 items-center justify-center">
                    <Lottie
                      options={loadingOptions}
                      isClickToPauseDisabled={true}
                    />
                  </div>
                )}
                <Typography className="text-base font-semibold">
                  Sign In
                </Typography>
              </div>
            </Button>
            <a href={`${import.meta.env.VITE_API_BASED_URL}/auth/google`}>
              <Button
                variant="filled"
                className="mx-auto mt-6 flex h-[50px] w-[250px] items-center justify-center rounded-full border-[1px] border-[#D31500] bg-white normal-case shadow-none hover:shadow-none"
              >
                <div className="relative flex items-center justify-center">
                  <Avatar src="img/google.svg" className="h-auto w-4" />
                  <Typography className="ml-4 text-base font-semibold text-[#D31500]">
                    Sign In with Google
                  </Typography>
                </div>
              </Button>
            </a>
            <div className="my-2 flex w-full justify-center">
              <Typography className="text-base font-normal">
                Don't have an account?&nbsp;&nbsp;
                <a
                  href="/signup"
                  className="border-b-[1px] border-[#D31500] text-[#D31500]"
                >
                  Sign Up
                </a>
              </Typography>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default SignIn;
