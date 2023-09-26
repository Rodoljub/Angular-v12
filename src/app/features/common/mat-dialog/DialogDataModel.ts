import { CommentViewModel } from '../../comments/CommentViewModel';

export class DialogDataModel {
    constructor(
        public entityTypeName: string,
        public entityId: string,
        public entityOwner: boolean,
        public comment?: CommentViewModel
    ) {}
}
