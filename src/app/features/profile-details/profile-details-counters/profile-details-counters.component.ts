import { Component, OnInit, ViewEncapsulation, ChangeDetectionStrategy, Input } from '@angular/core';
import { config } from '../../../../config/config';
import { ProfileDetailsModel } from '../ProfileDetailsModel';

@Component({
    selector: 'app-profile-details-counters',
    templateUrl: './profile-details-counters.component.html',
    styleUrls: ['profile-details-counters.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class ProfileDetailsCountersComponent implements OnInit {

    @Input() profileDetails: ProfileDetailsModel;

    uploadsLabel = config.labels.profileCounters.uploads;
    commentsLabel = config.labels.profileCounters.comments;
    likesLabel = config.labels.profileCounters.likes;
    favouritesLabel = config.labels.profileCounters.favourites;

    constructor() { }

    ngOnInit() { }
}
