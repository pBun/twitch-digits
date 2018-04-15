import React from 'react';
import { array, object, func } from 'prop-types';
import classNames from 'classnames';
import util from '../../../lib/util';
import './styles.css';

DayMenu.propTypes = {
    days: array,
    selected: object,
    handleLink: func
};

function DayMenu({ days, selected, handleLink }) {
    const sortedDays = days.sort((a, b) => {
        if (!a) return 1;
        if (!b) return -1;
        return new Date(a) - new Date(b);
    });
    const dayLinks = days.map(d => {
        let isSelected = d.getTime() === selected.getTime();
        let date = util.prettyDate(d);
        let day = util.prettyDay(d);
        return <a className={classNames('day-link', { 'selected': isSelected })} onClick={handleLink.bind(this, d)} data-tip={date} key={d}>{day}</a>;
    });
    return (
        <div className="day-menu">
            { dayLinks }
        </div>
    );
};

export default DayMenu;
