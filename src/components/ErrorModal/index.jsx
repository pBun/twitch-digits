import React from 'react';
import { string, func } from 'prop-types';
import classNames from 'classnames';
import './styles.css';

ErrorModal.propTypes = {
	error: string,
	onRefresh: func,
	onClose: func
};

function ErrorModal({ error, onRefresh, onClose }) {
	const visible = !!error;
	return (
		<div className={classNames('error-modal', { 'visible': visible })}>
		    <p className="error api-error">{ error }</p>
				<a className="button refresh" onClick={onRefresh}>try refreshing</a>
				<a className="button close" onClick={onClose}>whatever</a>
		</div>
	);
};

export default ErrorModal;
