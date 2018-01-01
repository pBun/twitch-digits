import React from 'react';
import { string, bool } from 'prop-types';
import classNames from 'classnames';
import './styles.css';

ControlPanel.propTypes = {
    open: bool,
    toggleText: string,
    position: string
};

function ControlPanel({ open, handleToggle, toggleText='controls', position='bottom', children }) {
    const status = open ? 'open' : 'closed';
    return (
        <div className={classNames('control-panel', position, status)}>
            <a className="control-toggle" onClick={handleToggle}><span className="toggle-text">{toggleText}</span></a>
            <div className="control-content">
                {children}
            </div>
        </div>
    );
};

export default ControlPanel;
