import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../store";
import { getMembers, getMemberStats } from "../slices/membersSlice";

export const useMembersData = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    list: members,
    stats,
    status,
  } = useSelector((state: RootState) => state.members);

  useEffect(() => {
    if (status === "idle") {
      dispatch(getMembers());
      dispatch(getMemberStats());
    }
  }, [status, dispatch]);

  const refreshData = async () => {
    await Promise.all([dispatch(getMembers()), dispatch(getMemberStats())]);
  };

  return {
    members,
    stats,
    status,
    refreshData,
  };
};
