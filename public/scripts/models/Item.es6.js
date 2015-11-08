export default class Item {
    sprite = null;

    constructor(game, options) {
        let sprite = this.sprite = game.add.tileSprite(options.x * 16, options.y * 16, 16, 16, 'gameboy-tileset', 2);
        game.physics.arcade.enable(sprite);

        sprite.id = options.id;
        sprite.name = 'item';
        sprite.body.allowGravity = false;
    }

    static create(game, itemJSON) {
        let item = new Item(game, itemJSON);
        console.log('[+] new item', itemJSON);
        return item.sprite;
    }
}
