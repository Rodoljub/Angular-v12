export class AccountsStateModel {

    state: string;
    title: string;
    cardHeight: string;


    constructor(
        state: string,
        title: string,
        cardHeight: string
    ) {
        this.state = state;
        this.title = title;
        this.cardHeight = cardHeight;
    }
}
