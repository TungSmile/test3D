import { _decorator, CCInteger, Component, instantiate, Node, Prefab } from 'cc';
const { ccclass, property } = _decorator;
enum BlockType {
    BT_NONE,
    BT_STONE,
};

enum GameState {
    GS_INIT,
    GS_PLAYING,
    GS_END,
};
@ccclass('GameManager')
export class GameManager extends Component {

    @property({ type: Prefab })
    public cubePrfb: Prefab | null = null;
    @property({ type: CCInteger })
    public roadLength: number = 100;
    private _road: number[] = [];
    private _curState: GameState = GameState.GS_INIT;

    start() {

    }
    generateRoad() {

        this.node.removeAllChildren();

        this._road = [];
        // startPos
        this._road.push(BlockType.BT_STONE);

        for (let i = 1; i < this.roadLength; i++) {
            if (this._road[i - 1] === BlockType.BT_NONE) {
                this._road.push(BlockType.BT_STONE);
            } else {
                this._road.push(Math.floor(Math.random() * 2));
            }
        }

        for (let j = 0; j < this._road.length; j++) {
            let block: Node = this.spawnBlockByType(this._road[j]);
            if (block) {
                this.node.addChild(block);
                block.setPosition(0, -1.5, j);
            }
        }
    }

    spawnBlockByType(type: BlockType) {
        if (!this.cubePrfb) {
            return null;
        }

        let block: Node | null = null;
        switch (type) {
            case BlockType.BT_STONE:
                block = instantiate(this.cubePrfb);
                break;
        }

        return block;
    }

    update(deltaTime: number) {

    }
}

