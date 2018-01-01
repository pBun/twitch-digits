import React from 'react';
import { number } from 'prop-types';
import './styles.css';

WalkingLoader.propTypes = {
	numDots: number
};

function WalkingLoader({ numDots=5 }) {
	var dots = [];
	for (var i = 0; i < numDots; i++) {
	    dots.push(<div className="dot" key={i}></div>);
	}
	return (
		<div className="walking-loader">
		    {dots}
		</div>
	);
};

export default WalkingLoader;
