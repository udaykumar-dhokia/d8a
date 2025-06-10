import React from "react";
import {useNavigate} from "react-router-dom";
import {Button} from "@/components/ui/button";

const Dashboard = () => {
	const navigate = useNavigate();

	const handleLogout = () => {
		localStorage.removeItem("token");
		navigate("/login");
	}
	return (
		<>
			<Button onClick={handleLogout}>Logout</Button>
		</>
	)
}

export default Dashboard;