type CacheKey = {
    programId: string;
  };
  
  type CacheComment = {
    comment: string;
    walletAddress: string;
    dateTime: string;
    thumbsUp: number;
    thumbsDown: number;
    type?: 'account' | 'instruction';
    name?: string;
  };
  
  class CommentCacheService {
    private cache: Map<string, CacheComment[]> = new Map();
  
    public addComment(programId: string, comment: CacheComment): void {
      if (!this.cache.has(programId)) {
        this.cache.set(programId, []);
      }
      this.cache.get(programId)!.push(comment);
    }
  
    public getCommentsForProgram(programId: string): { type: 'account' | 'instruction'; id: string; walletAddress: string; comments: CacheComment[] }[] {
      const result: { type: 'account' | 'instruction'; id: string; walletAddress: string; comments: CacheComment[] }[] = [];
      for (const [key, comments] of this.cache.entries()) {
        const [cachedProgramId, type, id, walletAddress] = key.split('_');
        if (cachedProgramId === programId) {
          result.push({ type: type as 'account' | 'instruction', id, walletAddress, comments });
        }
      }
      return result;
    }
  }
  
//   // Usage example:
//   const commentCache = new CommentCacheService();
  
//   // Adding comments
//   commentCache.addComment(
//     { programId: 'program1', type: 'account', id: 'account1', walletAddress: 'wallet1' },
//     { comment: 'This is a comment for account1', walletAddress: 'wallet1', dateTime: new Date().toISOString(), thumbsUp: 0, thumbsDown: 0 }
//   );
  
//   commentCache.addComment(
//     { programId: 'program1', type: 'instruction', id: 'instruction1', walletAddress: 'wallet2' },
//     { comment: 'This is a comment for instruction1', walletAddress: 'wallet2', dateTime: new Date().toISOString(), thumbsUp: 0, thumbsDown: 0 }
//   );
  
//   // Fetching comments for a program
//   const comments = commentCache.getCommentsForProgram('program1');
//   console.log(comments);