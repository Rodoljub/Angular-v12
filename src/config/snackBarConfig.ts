export const snackBarConfig = {
    snackBarDuration: 10000,
    snackBarDurationUndo: 15000,
    snackBarMaxDuration: 0,
    snackBarCounter: 15,
    snackBarInterval: 1000,

    action: {
        undo: 'undo',
        message: 'message',
        search: 'search',
        close: 'close',
        clear: 'clear',
        setDelete: 'setDelete',
        save: 'save',
        open: 'open'
    },

    type: {
        delete: 'delete',
        search: 'search'
    },

    message: {
        undoAction: 'You can undo your action in ',
        imageNotDeleted:  'Image is not deleted.',
        imagesNotDeleted: 'Images is not deleted.',
        imageIsDeleted: 'Image is deleted.',
        cantDelete: 'You can\'t delete this Image'
    }
}
