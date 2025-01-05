import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";
import {
  getDashboard,
  getFriends,
  getFriendRequests,
  sendFriendRequest,
  acceptFriendRequest,
  deleteFriendRequest,
} from "../api/userApi";

const Dashboard = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [friends, setFriends] = useState([]);
  const [friendRequests, setFriendRequests] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const dashboardData = await getDashboard();
        setUsers(dashboardData.users || []);
        const friendsData = await getFriends();
        setFriends(friendsData || []);
        const requestsData = await getFriendRequests();
        setFriendRequests(requestsData || []);
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };
    fetchDashboardData();
  }, []);

  const handleSendRequest = async (userId) => {
    try {
      await sendFriendRequest(userId);
      alert("Friend request sent");
    } catch (err) {
      alert(err);
    }
  };

  const handleAcceptRequest = async (userId) => {
    try {
      await acceptFriendRequest(userId);
      alert("Friend request accepted");

      // Update the state
      setFriendRequests((prevRequests) =>
        prevRequests.filter((request) => request._id !== userId)
      );
      setFriends((prevFriends) => [
        ...prevFriends,
        users.find((user) => user._id === userId),
      ]);
      setUsers((prevUsers) => prevUsers.filter((user) => user._id !== userId));
    } catch (error) {
      console.error("Error accepting friend request", error);
    }
  };

  const handleDeleteRequest = async (userId) => {
    try {
      await deleteFriendRequest(userId);
      alert("Friend request deleted");
    } catch (error) {
      console.error("Error deleting friend request", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  console.log("friend Requests:", friendRequests);

  return (
    <div className="dashboard-container">
      <h2>Dashboard</h2>
      <h3>Users</h3>
      <ul>
        {Array.isArray(users) &&
          users.map((user) => (
            <li key={user._id}>
              {user.name} ({user.email})
              <button onClick={() => handleSendRequest(user._id)}>
                Send Friend Request
              </button>
            </li>
          ))}
      </ul>
      <h3>Friends</h3>
      <ul>
        {Array.isArray(friends) &&
          friends.map((friend) => (
            <li key={friend._id}>
              {friend.name} ({friend.email})
            </li>
          ))}
      </ul>
      <h3>Friend Requests</h3>
      <ul>
        {Array.isArray(friendRequests) && friendRequests.length > 0 ? (
          friendRequests.map((request) => (
            <li key={request._id}>
              {request.name} ({request.email})
              <button onClick={() => handleAcceptRequest(request._id)}>
                Accept
              </button>
              <button onClick={() => handleDeleteRequest(request._id)}>
                Delete
              </button>
            </li>
          ))
        ) : (
          <li>No friend requests</li>
        )}
      </ul>
      <button className="logout-button" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
};

export default Dashboard;
