import { connect } from 'react-redux';
import TwitchDigits from '../components/TwitchDigits'
import { operations as snapshotOperations } from '../store/modules/snapshot';
import { operations as summaryOperations } from '../store/modules/summarySnapshots';

function mapStateToProps(state) {
    return {
        summaries: state.summarySnapshots,
        snapshot: state.snapshot
    };
}

function mapDispatchToProps(dispatch) {
    return {
        loadSummaries: () => dispatch(summaryOperations.fetchSummaries()),
        addSummary: (summary) => dispatch(summaryOperations.addSummary(summary)),
        loadSnapshot: (time) => dispatch(snapshotOperations.fetchSnapshot(time))
    };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TwitchDigits);