import React from "react";
import { useParams } from "react-router-dom";
import Profile from "./Profile";

export default function ProfileWrapper(props) {
  const params = useParams();
  return <Profile {...props} params={params} />;
}
