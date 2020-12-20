const TYPES = {
    UserService: Symbol.for('UserService'),
    PageService: Symbol.for('PageService'),
    NavItemService: Symbol.for('NavItemService'),
    PostService: Symbol.for('PostService'),
    PostTypeService: Symbol.for('PostTypeService'),

    UserRepository: Symbol.for('UserRepository'),
    PageRepository: Symbol.for('PageRepository'),
    NavItemRepository: Symbol.for('NavItemRepository'),
    PostRepository: Symbol.for('PostRepository'),
    PostTypeRepository: Symbol.for('PostTypeRepository')
};

export default TYPES;