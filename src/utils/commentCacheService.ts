export type CacheComment = {
    comment: string;
    walletAddress: string;
    dateTime: string;
    thumbsUp: number;
    thumbsDown: number;
    type?: 'account' | 'instruction';
    name?: string;
  };
  
class CommentCacheService {
    private static instance: CommentCacheService;
    private cache: Map<string, CacheComment[]> = new Map();
  
    private constructor() {}
  
    public static getInstance(): CommentCacheService {
      if (!CommentCacheService.instance) {
        CommentCacheService.instance = new CommentCacheService();
      }
      return CommentCacheService.instance;
    }
  
    public addComment(programId: string, comment: CacheComment): void {
      if (!this.cache.has(programId)) {
        this.cache.set(programId, []);
      }
      this.cache.get(programId)!.push(comment);
    }
  
    public getCommentsForProgram(programId: string): CacheComment[] {
      return this.cache.get(programId) || [];
    }
  }
  
  export default CommentCacheService.getInstance();