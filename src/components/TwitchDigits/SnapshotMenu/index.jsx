import React from 'react';
import { array, string } from 'prop-types';
import classNames from 'classnames';
import util from '../../../helpers/util';
import './styles.css';

SnapshotMenu.propTypes = {
    times: array,
    selected: string
};

function SnapshotMenu({ times, selected, handleLink }) {
    var maxViewers = times
        .map(a => a.viewers)
        .reduce((a, b) => Math.max(a || 0, b), 0);
    var sortedTimes = times.sort((a, b) => {
        if (!a._time) return 1;
        if (!b._time) return -1;
        return new Date(a._time) - new Date(b._time);
    });
    var snapshotLinks = sortedTimes.map(t => {
        return (<a className={classNames('snapshot-link', {'selected': t._time === selected || !t._time && !selected})}
                key={t._time || 'now'}
                style={{ height: util.prettyPercent(t.viewers / maxViewers, 2) }}
                onClick={handleLink.bind(this, t._time)}
                data-tip={util.prettyTime(t._time)}>
                <span className="text">{ util.prettySimpleTime(t._time) }</span>
            </a>);
    });
    return (
        <div className="snapshot-menu">
            {snapshotLinks}
        </div>
    );
};

export default SnapshotMenu;
