import React from 'react';
import { string } from 'prop-types';
import classNames from 'classnames';
import './styles.css';

ErrorModal.propTypes = {
	error: string
};

function ErrorModal({ error }) {
	const visible = !!error;
	return (
		<div className={classNames('error-modal', { 'visible': visible })}>
		    <p className="error api-error">{ error }</p>
		</div>
	);
};

export default ErrorModal;
