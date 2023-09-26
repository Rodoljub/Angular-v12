import { CommentViewModel } from '../../comments/CommentViewModel';
import { FileDetailsModel } from '../../models/FileDetailsModel';
import { UserProfileEntityViewModel } from '../../models/UserProfileEntityViewModel';

export class ItemViewModel {
    public DisableComments = false;
    public Comment: CommentViewModel;
    public CommentsCount: number;
    public CreatedDate: string;
    public UserFavourite: boolean;
    public FavouritesCount: number;
    public ItemFilePath: string;
    public FileDetails: FileDetailsModel;
    public Id: string;
    public Tags: string[];
    public UserLiked: boolean;
    public LikesCount: number;
    public Title: string;
    public TotalCount: number;
    public UserProfile: UserProfileEntityViewModel;



    public Description: string;




    // public CommentView: CommentViewModel[];
    public AspectRatio: number;
    public Display = false;
    public TranslateX: number;
    public TranslateY: number;
    public Views = 0;
    public Index?: number;

    constructor(
        //  Id: string,
        //  Title: string,
        //  Description: string,
        //  Tags: string[],
        //  UserName: string,
        //  UrlSegment: string,
        //  UserImagePath: string,
        //  ItemFilePath: string,
        //  TotalCount: number,
        //  CreatedDate: string,
        //  CommentsCount: number,
        //  LikesCount: number,
        //  FavouritesCount: number,
        //  FileDetails: FileDetailsModel,
        //  UserItemOwner: boolean,
        //  UserLiked: boolean,
        //  UserFavourite: boolean,
        //  CommentView: CommentViewModel[],
        //  AspectRatio: number,
        //  Display = false,
        //  TranslateX: number,
        //  TranslateY: number,
        //  Views = 0,
        //  Index?: number
    ) {

    }


}
