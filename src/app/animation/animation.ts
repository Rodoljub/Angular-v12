import { trigger, state, style, transition, animate } from '@angular/animations';
import { config } from '../../config/config';


export const headerDivHeightAnimation = trigger('headerDivHeightAnimationTrigger', [
  state('in', style({ height: '44px' })),
  state('out', style({ height: '0px' })),
  transition('in => out', [
    animate(200, style({ height: '0px' }))
  ]),
  transition('out => in', [
    animate(200, style({ height: '44px' }))
  ])
]);

export const menuFloatingAnimation = trigger('menuFloatingAnimationTrigger', [
  state('in', style({ transform: 'translateX(0)' })),
  state('out', style({ transform: 'translateX(88%)'})),
  transition('in => out', [
    animate(100, style({ transform: 'translateX(88%)'}))
  ]),
  transition('out => in', [
    animate(100, style({ transform: 'translateX(0)'}))
  ])
]);

export const itemTranslateAnimation = trigger('itemTranslateAnimationTrigger', [
  state('up', style({ transform: 'translateY(-110%)' })),
  state('in', style({ transform: 'translateY(0%)' })),
  state('down', style({ transform: 'translateY(+110%)' })),
  transition('void => in', [
    animate(0, style({ transform: 'translateY(0%)'}))
  ]),
  transition('in => void', [
    animate(0, style({ transform: 'translateY(-110%)'}))
  ]),
  transition('in => out', [
    animate(0, style({ transform: 'translateY(+110%)'}))
  ]),
  transition('out => in', [
    animate(0, style({ transform: 'translateY(0%)'}))
  ])
])

export const accountsCardOpacityAnimation = trigger('accountsCardOpacityAnimationTrigger', [
  state('in', style({ opacity: 1 })),
  state('out', style({ opacity: 0 })),
  transition('in => out', [
    animate(600, style({ opacity: 0}))
  ]),
  transition('out => in', [
    animate(600, style({ opacity: 1 }))
  ])
])

export const detailCardArrowIconAnimation = trigger('detailCardArrowIconAnimationTrigger', [
  state('up', style({ transform: 'rotate(180deg)'})),
  state('down', style({ transform: 'rotate(0deg)'})),
  transition('up => down', [
    animate(200, style({ transform: 'rotate(0deg)'}))
  ]),
  transition('down => up', [
    animate(200, style({ transform: 'rotate(-180deg)'}))
  ])
])

export const detailCardDescriptionBoxAnimation = trigger('detailCardDescriptionBoxAnimationTrigger', [
  state('up', style({ height: 0 })),
  state('down', style({ height: '*' })),
  transition('up => down', [
    animate(0, style({ height: '*' }))
  ]),
  transition('down => up', [
    animate(0, style({ height: 0 }))
  ])
])

export const detailCardActionAnimation = trigger('detailCardActionAnimationTrigger', [
  state('up', style({ height: 0 })),
  state('down', style({ height: '*' })),
  transition('up => down', [
    animate(200, style({ height: '*' }))
  ]),
  transition('down => up', [
    animate(200, style({ height: 0 }))
  ])
])

export const detailCardTitleDescSeparatorAnimation = trigger('detailCardTitleDescSeparatorAnimationTrigger', [
  state('up', style({  width: 0 })),
  state('down', style({  width: '*' })),
  transition('up => down', [
    animate(100, style({  width: '*' }))
  ]),
  transition('down => up', [
    animate(100, style({  width: 0 }))
  ])
])

export const sidenavMenuAnimation = trigger('sidenavMenuAnimationTrigger', [
  state('in', style({ transform: 'translateX(0)' })),
  state('out', style({ transform: 'translateX(+120%)'})),
  state('uploadOut', style({ transform: 'translateX(-120%)'})),
  transition('in => out', [
    animate(600, style({ transform: 'translateX(+120%)'}))
  ]),
  transition('out => in', [
    animate(600, style({ transform: 'translateX(0)'}))
  ]),
  transition('in => uploadOut', [
    animate(600, style({ transform: 'translateX(-120%)'}))
  ]),
  transition('uploadOut => in', [
    animate(600, style({ transform: 'translateX(0)'}))
  ])
]);

export const sidenavTranslateYAnimation = trigger('sidenavTranslateYAnimationTrigger', [
  state('*', style({
    // transform: '{{translate}}'
    'padding-top': '{{translate}}'

   }),
  { params: {translate : '0'}}),
  // { params: {translate : '49px'}}),
  transition('* => *', [
    animate(200, style({
      // transform: '{{translate}}'
      'padding-top': '{{translate}}'
      })),
  ],
  { params: {translate : '0'}})
  // { params: {translate : '49px'}}),
]);


