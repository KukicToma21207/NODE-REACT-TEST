import { Link } from "react-router-dom";
import "./content-actions.css";

type ContentActionProps = {
	user?: { first_name: string } | null;
};

const ContentActions = ({ user }: ContentActionProps) => {
	return (
		<div className='content-actions-container'>
			{!user && <h3>Loading</h3>}

			{user && !user.first_name && (
				<>
					<Link className='button' to={"/register"}>
						Register
					</Link>
					<Link className='button' to={"/login"}>
						Login
					</Link>
				</>
			)}

			{user && user.first_name && (
				<Link className='button' to={"/logout"}>
					Logout
				</Link>
			)}
		</div>
	);
};

export default ContentActions;
