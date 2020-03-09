import React, {useState, useEffect, useCallback} from "react";
import PropTypes from "prop-types";
import useInput from "../../Hooks/useInput";
import PostPresenter from "./PostPresenter";
import {useMutation} from "react-apollo-hooks";
import {ADD_COMMENT, TOGGLE_LIKE} from "./PostQueries";
import {toast} from "react-toastify";

const PostContainer = ({
   id,
   user,
   files,
   likeCount,
   isLiked,
   comments,
   createdAt,
   caption,
   location
}) => {
    const [isLikedState, setIsLiked] = useState(isLiked);
    const [likeCountState, setLikeCount] = useState(likeCount);
    const [currentItem, setCurrentItem] = useState(0);
    const [selfComments, setSelfComments] = useState([]);
    const comment = useInput("");

    const [toggleLikeMutation] = useMutation(TOGGLE_LIKE, {
        variables: {postId: id}
    });
    const [addCommentMutation] = useMutation(ADD_COMMENT, {
        variables: { postId: id, text: comment.value }
    });

    useEffect(() => {
        const totalFiles = files.length;
        if(currentItem === totalFiles-1){
            setTimeout(() => setCurrentItem(0), 3000);
        }else {
            setTimeout(() => setCurrentItem(currentItem + 1), 3000);
        }
    }, [currentItem, files]);

    const toggleLike = useCallback( () => {
        if (isLikedState === true) {
            setIsLiked(false);
            setLikeCount(likeCountState - 1);
        } else {
            setIsLiked(true);
            setLikeCount(likeCountState + 1);
        }
        toggleLikeMutation();

    },[isLikedState, toggleLikeMutation, likeCountState]);

    const onKeyPress = useCallback(async (e) => {
        const { which } = e;
        if (which === 13) {
            e.preventDefault();
            try {
                const {data: { addComment }} = await addCommentMutation();
                setSelfComments([
                    ...selfComments,
                    addComment
                ]);
                comment.setValue("");
            } catch (e) {
                toast.error("Can't send comment");
            }

        }
    },[comment, addCommentMutation, setSelfComments, selfComments]);

    return (
        <PostPresenter
            user={user}
            files={files}
            likeCount={likeCountState}
            location={location}
            caption={caption}
            isLiked={isLikedState}
            comments={comments}
            createdAt={createdAt}
            newComment={comment}
            setIsLiked={setIsLiked}
            setLikeCount={setLikeCount}
            currentItem={currentItem}
            toggleLike={toggleLike}
            onKeyPress={onKeyPress}
            selfComments={selfComments}
        />
    );
};

PostContainer.propTypes = {
    id: PropTypes.string.isRequired,
    user: PropTypes.shape({
        id: PropTypes.string.isRequired,
        avatar: PropTypes.string,
        username: PropTypes.string.isRequired
    }).isRequired,
    files: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string.isRequired,
            url: PropTypes.string.isRequired
        })
    ).isRequired,
    likeCount: PropTypes.number.isRequired,
    isLiked: PropTypes.bool.isRequired,
    comments: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string.isRequired,
            text: PropTypes.string.isRequired,
            user: PropTypes.shape({
                id: PropTypes.string.isRequired,
                username: PropTypes.string.isRequired
            }).isRequired
        })
    ).isRequired,
    caption: PropTypes.string.isRequired,
    location: PropTypes.string,
    createdAt: PropTypes.string.isRequired
};

export default PostContainer;