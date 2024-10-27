import { useState, useEffect, useCallback } from 'react';
import commentCacheService, { CacheComment } from '../utils/commentCacheService';
import { useWallet } from '@solana/wallet-adapter-react';

const useCommentCache = (programId: string) => {
  const [comments, setComments] = useState<CacheComment[]>([]);
  const { publicKey } = useWallet();

  useEffect(() => {
    if (programId) {
      const fetchedComments = commentCacheService.getCommentsForProgram(programId);
      setComments(fetchedComments);
    }
  }, [programId]);

  const addComment = useCallback((comment: string, name: string) => {
    const cacheComment: CacheComment = {
      comment,
      walletAddress: publicKey?.toBase58() || '',
      dateTime: new Date().toISOString(),
      thumbsUp: 0,
      thumbsDown: 0,
      name,
    };

    commentCacheService.addComment(programId, cacheComment);
    const fetchedComments = commentCacheService.getCommentsForProgram(programId);
    setComments(fetchedComments);

  }, [programId, publicKey]);


  const updateComment = useCallback((programId: string, updatedComment: CacheComment) => {
    const fetchedComments = commentCacheService.getCommentsForProgram(programId);
    const commentIndex = fetchedComments.findIndex(comment => comment.dateTime === updatedComment.dateTime);
    if (commentIndex !== -1) {
      fetchedComments[commentIndex] = updatedComment;
      setComments([...fetchedComments]);
    }
  }, []);

  const getCommentsForProgram = useCallback(() => {
    return commentCacheService.getCommentsForProgram(programId);
  }, [programId]);

  return {
    comments,
    addComment,
    getCommentsForProgram,
    updateComment,
  };
};

export default useCommentCache;