import { UserProfileEntityViewModel } from '../models/UserProfileEntityViewModel';

export class CommentViewModel {
    /**
     *
     */
    constructor(
        public ChildCount: number,
        public Content: string,
        public CreatedDate: string,
        public Id: string,
        public LikeCount: number,
        public UserLiked: boolean,
        public UserProfile: UserProfileEntityViewModel


        // public UserName: string,
        // public UrlSegment: string,
        // public UserImage: string,
        // // public CommentsCount: number,
        // public UserCommentOwner: boolean,
        // public Replies?: CommentViewModel[]
    ) {}
}
