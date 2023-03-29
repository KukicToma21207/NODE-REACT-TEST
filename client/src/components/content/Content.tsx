import "./content.css";
import ContentActions from "../content_actions/ContentActions";
import { ReactNode } from "react";

type ContentProps = {
	user?: {
		first_name: string;
		last_name: string;
		email: string;
		_id: string;
	} | null;
};

const Content = ({ user }: ContentProps) => {
	let firstName = "";
	let lastName = "";

	if (user) {
		firstName = user.first_name;
		lastName = user.last_name;
	}

	return (
		<div className='content-container'>
			<h2>
				Welcome {firstName} {lastName}
			</h2>

			<p>This is my personal React + Node website example</p>
			<p>Please feel free to test and explore</p>
			<p>Also if you wish, please register with us</p>

			<ContentActions user={user}></ContentActions>
		</div>
	);
};

export default Content;
