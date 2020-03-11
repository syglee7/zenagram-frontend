import React, {useCallback, useState} from 'react';
import PropTypes from 'prop-types';
import {useMutation} from "react-apollo-hooks";
import {FOLLOW, UNFOLLOW} from "./FollowButtonQueries";
import FollowButtonPresenter from './FollowButtonPresenter';

const FollowButtonContainer = ({isFollowing, id}) => {
    const [isFollowingState, setIsFollowingState] = useState(isFollowing);
    const [followMutation] = useMutation(FOLLOW, { variables : {id}});
    const [unfollowMutation] = useMutation(UNFOLLOW, { variables : {id}});

    const onClick = useCallback(() => {
        if (isFollowingState === true) {
            setIsFollowingState(false);
            try {
                unfollowMutation();
            } catch (e) {
                console.error(e);
            }
        } else {
            setIsFollowingState(true);
            try {
                followMutation();
            } catch (e) {
                console.error(e);
            }
        }
    }, [isFollowingState, setIsFollowingState, followMutation, unfollowMutation]);

    return <FollowButtonPresenter onClick={onClick} isFollowing={isFollowingState} />;
};


FollowButtonContainer.propTypes = {
    isFollowing: PropTypes.bool.isRequired,
    id: PropTypes.string.isRequired
};

export default FollowButtonContainer;