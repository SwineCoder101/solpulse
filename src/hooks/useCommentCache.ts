import { useState, useEffect, useCallback } from 'react';

const commentCacheService = new CommentCacheService();

const useCommentCache = (initialProgramId: string) => {
  const [programId, setProgramId] = useState(initialProgramId);
  const [comments, setComments] = useState<CacheComment[]>([]);

  useEffect(() => {
    if (programId) {
      const fetchedComments = commentCacheService.getCommentsForProgram(programId);
      const extractedComments = fetchedComments.flatMap(item => item.comments);
      setComments(extractedComments);
    }
  }, [programId]);

  const addComment = useCallback((programId: string, comment: CacheComment) => {
    commentCacheService.addComment(programId, comment);
    const updatedComments = commentCacheService.getCommentsForProgram(programId).flatMap(item => item.comments);
    setComments(updatedComments);
  }, [programId]);

  return {
    programId,
    setProgramId,
    comments,
    addComment,
  };
};

export default useCommentCache;