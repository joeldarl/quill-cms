const TYPES = {
    UserService: Symbol.for('UserService'),
    PageService: Symbol.for('PageService'),
    NavItemService: Symbol.for('NavItemService'),
    PostService: Symbol.for('PostService'),
    TagService: Symbol.for('TagService'),
    UploadService: Symbol.for('UploadService'),

    UserRepository: Symbol.for('UserRepository'),
    PageRepository: Symbol.for('PageRepository'),
    NavItemRepository: Symbol.for('NavItemRepository'),
    PostRepository: Symbol.for('PostRepository'),
    TagRepository: Symbol.for('TagRepository')
};

export default TYPES;