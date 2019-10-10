import { lazy } from 'react';
import { Route, Switch, Redirect, withRouter } from 'react-router';
import ReportAnalytics from 'Components/analytics/common';
import { GetAdditionalAttributes } from '@/utils/helper';

const Home = lazy(() => import("Components/home"));
const UserDetails = lazy(() => import("Components/userdetails"));
const ComingSoon = lazy(() => import("Components/coming-soon"));
const CallUs = lazy(() => import("Components/error/callUs"));
const AdditionalInfo = lazy(() => import("Components/additional-info"));
const PageUnavailable = lazy(() => import("Components/error/pageUnavailable"));
const SessionTimeout = lazy(() => import("Components/error/sessionTimeout"));
const SystemError = lazy(() => import("Components/error/systemError"));
const SystemTemporarilyUnavailable = lazy(() => import("Components/error/systemTemporarilyUnavailable"));
const OtherBusiness = lazy(() => import("Components/registration-options"));
const SeamlessInvitation = lazy(() => import("Components/seamlessInvitation"));
const SeamlessUserExists = lazy(() => import("Components/seamlessUserExists"));
const SeamlessError = lazy(() => import("Components/error/seamlessError"));

export class Routes extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isFirstTime: true
        };
        this.setUserTime = this.setUserTime.bind(this);

    }

    componentWillMount() {
        if (this.props.location.pathname) {
            this.setUserTime();
            ReportAnalytics('nav', 'init', 'start', '', this.props.location.pathname, {});
        }
    }

    componentDidMount() {
        if (this.props.location.pathname) {
            ReportAnalytics('nav', this.props.location.pathname.replace('/', ''), 'success', '', this.props.location.pathname, {});
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.location !== this.props.location) {
            ReportAnalytics('nav', '', 'start', '', this.props.location.pathname, GetAdditionalAttributes());
            window.scrollTo(0, 1);
        }
    }


    componentDidUpdate(previousProps) {
        if (this.props.location.pathname !== previousProps.location.pathname) {
            ReportAnalytics('nav', this.props.location.pathname.replace('/', ''), 'success', '', this.props.location.pathname, GetAdditionalAttributes());
        }
    }

    componentDidCatch() {
        if (this.props.location.pathname) {
            ReportAnalytics('nav', '', 'error', '', this.props.location.pathname, {});
        }
    }

    setUserTime() {
        if (this.state.isFirstTime) {
            this.setState({ isFirstTime: false });
            ReportAnalytics('debug', 'home', 'userTime', '', new Date() - window.userStartTime, {});
        }
    }


    render() {
        return (
            < Switch >
                <Route exact path="/" component={() => (<Redirect to="home" />)} />
                <Route exact path="/home" component={(props) => <Home {...props} />} />
                <Route exact path="/user-details" component={(props) => <UserDetails {...props} />} />
                <Route exact path="/additional-info" component={props => <AdditionalInfo {...props} />} />
                <Route exact path="/registration-options/:policyNumber?/:zipCode?" component={props => <OtherBusiness {...props} />} />
                <Route exact path="/seamlessInvitation" component={props => <SeamlessInvitation {...props} />} />
                <Route exact path="/seamlessUserExists" component={props => <SeamlessUserExists {...props} />} />
                <Route exact path="/comingsoon" component={(props) => <ComingSoon {...props} />} />
                <Route exact path="/callus" component={props => <CallUs {...props} />} />
                <Route exact path="/temporarily-unavailable" component={props => <SystemTemporarilyUnavailable {...props} />} />
                <Route exact path="/notfound" component={props => <PageUnavailable {...props} />} />
                <Route exact path="/timeout" component={props => <SessionTimeout {...props} />} />
                <Route exact path="/system-error" component={props => <SystemError {...props} />} />
                <Route exact path="/seamlessError" component={props => <SeamlessError {...props} />} />
                <Route path='*' exact={true} component={() => (<Redirect to="/notfound" />)} />

            </Switch >
        );
    }
}
export default withRouter(Routes);
