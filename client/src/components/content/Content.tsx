import "./content.css";
import ContentActions from "../content_actions/ContentActions";

export type ContentProps = {
	user?: {
		first_name: string;
		last_name: string;
		email: string;
	} | null;
};

// Main content component
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
			<p>Also if you wish, please register with us, if not already</p>

			<ContentActions user={user}></ContentActions>
		</div>
	);
};

export default Content;
