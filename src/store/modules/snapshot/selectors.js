import util from '../../../lib/util';

export function getGame(state, id) {
    let g = state.games.filter(g => g.id === id);
    g = g.length ? g[0] : {};
    return g;
};

export function getChannel(state, id) {
    let c = state.channels.filter(c => c.id === id);
    c = c.length ? c[0] : {};
    return c;
};

export function getSnapshotGames(state) {
    return state.gameSnapshots.filter(gs => gs.time === time);
};

export function getSnapshotChannels(state) {
    return state.channelSnapshots.filter(cs => cs.time === time);
};

export function getSnapshotGameChannels(state, gameId) {
    return state.channelSnapshots.filter(cs => cs.gameId === gameId);
};
